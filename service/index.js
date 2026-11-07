const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// Parse JSON bodies and cookies for every request
app.use(express.json());
app.use(cookieParser());

// In-memory data (lost when the service restarts)
let users = [];
let households = [];

// All service endpoints live under /api
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth: register a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth: login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth: logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

// GetMe: return the authenticated user (requires an auth token)
apiRouter.get('/user/me', verifyAuth, (req, res) => {
  res.send({ email: req.user.email });
});

// Get my allergen list
apiRouter.get('/my/allergens', verifyAuth, (req, res) => {
  res.send(req.user.allergens);
});

// Replace my allergen list
apiRouter.put('/my/allergens', verifyAuth, (req, res) => {
  req.user.allergens = req.body;
  res.send(req.user.allergens);
});

// Get my nutrition goals
apiRouter.get('/my/goals', verifyAuth, (req, res) => {
  res.send(req.user.goals);
});

// Replace my nutrition goals
apiRouter.put('/my/goals', verifyAuth, (req, res) => {
  req.user.goals = req.body;
  res.send(req.user.goals);
});

// Food search proxy: search.openfoodfacts.org sends no CORS header, so
// browsers can't read it directly — the server makes that one call.
apiRouter.get('/food/search', verifyAuth, async (req, res) => {
  try {
    const r = await fetch(
      `https://search.openfoodfacts.org/search?q=${encodeURIComponent(req.query.q || '')}&page_size=10&fields=code,product_name`
    );
    if (!r.ok) return res.status(502).send({ msg: 'Food search unavailable' });
    res.send(await r.json());
  } catch {
    res.status(502).send({ msg: 'Food search unavailable' });
  }
});

// Get the households I belong to
apiRouter.get('/households', verifyAuth, (req, res) => {
  res.send(households.filter((h) => h.members.includes(req.user.email)));
});

// Create a household
apiRouter.post('/households', verifyAuth, (req, res) => {
  const household = {
    id: uuid.v4(),
    name: req.body.name,
    code: uuid.v4().slice(0, 8),
    members: [req.user.email],
    recipes: [],
  };
  households.push(household);
  res.status(201).send(household);
});

// Join a household by invite code
apiRouter.post('/households/join', verifyAuth, (req, res) => {
  const household = households.find((h) => h.code === req.body.code);
  if (!household) {
    res.status(404).send({ msg: 'Household not found' });
    return;
  }
  if (!household.members.includes(req.user.email)) {
    household.members.push(req.user.email);
  }
  res.send(household);
});

// Find a household by id, but only if the user belongs to it
function findMyHousehold(req) {
  const household = households.find((h) => h.id === req.params.id);
  if (!household || !household.members.includes(req.user.email)) {
    return null;
  }
  return household;
}

// Get a household's recipes
apiRouter.get('/households/:id/recipes', verifyAuth, (req, res) => {
  const household = findMyHousehold(req);
  if (!household) {
    res.status(403).send({ msg: 'Not a member of this household' });
    return;
  }
  res.send(household.recipes);
});

// Add a recipe to a household
apiRouter.post('/households/:id/recipes', verifyAuth, (req, res) => {
  const household = findMyHousehold(req);
  if (!household) {
    res.status(403).send({ msg: 'Not a member of this household' });
    return;
  }
  const recipe = {
    id: uuid.v4(),
    name: req.body.name,
    ingredients: req.body.ingredients,
  };
  household.recipes.push(recipe);
  res.status(201).send(recipe);
});

// Delete a recipe from a household
apiRouter.delete('/households/:id/recipes/:recipeId', verifyAuth, (req, res) => {
  const household = findMyHousehold(req);
  if (!household) {
    res.status(403).send({ msg: 'Not a member of this household' });
    return;
  }
  household.recipes = household.recipes.filter((r) => r.id !== req.params.recipeId);
  res.status(204).end();
});

// Open Food Facts ingredients taxonomy: their maintained family tree
// of ingredients (whey -> dairy, spice -> paprika, ...). Loaded once
// at startup so Lookup can break down hard-to-read ingredient names
// without any hand-written synonym lists.
let taxonomy = null;
let taxonomyChildren = {};
fetch('https://static.openfoodfacts.org/data/taxonomies/ingredients.json')
  .then((r) => r.json())
  .then((data) => {
    taxonomy = data;
    for (const [id, node] of Object.entries(data)) {
      for (const parent of node.parents || []) {
        if (!taxonomyChildren[parent]) taxonomyChildren[parent] = [];
        taxonomyChildren[parent].push(id);
      }
    }
  })
  .catch(() => {
    taxonomy = null;
  });

function taxonomyName(id) {
  id = id.toLowerCase();
  const node = taxonomy && taxonomy[id];
  return node && node.name && node.name.en
    ? node.name.en
    : id.replace(/^en:/, '').replace(/-/g, ' ');
}

function taxonomyAncestors(id) {
  id = id.toLowerCase();
  const names = [];
  const seen = new Set([id]);
  let frontier = [id];
  while (frontier.length > 0) {
    const next = [];
    for (const current of frontier) {
      const node = taxonomy && taxonomy[current];
      for (const parent of (node && node.parents) || []) {
        if (!seen.has(parent)) {
          seen.add(parent);
          names.push(taxonomyName(parent));
          next.push(parent);
        }
      }
    }
    frontier = next;
  }
  return names;
}

function taxonomyHiddenTerms(id, terms) {
  if (!taxonomy) return [];
  id = id.toLowerCase();
  const found = [];
  const seen = new Set([id]);
  let frontier = [id];
  while (frontier.length > 0 && seen.size < 500) {
    const next = [];
    for (const current of frontier) {
      for (const child of taxonomyChildren[current] || []) {
        if (seen.has(child)) continue;
        seen.add(child);
        next.push(child);
        const childName = taxonomyName(child).toLowerCase();
        for (const term of terms) {
          if ((childName.includes(term) || term.includes(childName)) && !found.includes(term)) {
            found.push(term);
          }
        }
      }
    }
    frontier = next;
  }
  return found;
}


// Break down ingredients against the taxonomy: family chain for
// each, plus household terms hiding inside broad categories.
apiRouter.get('/food/explain', verifyAuth, (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  const terms = (req.query.terms || '')
    .split(',')
    .filter(Boolean)
    .map((t) => t.toLowerCase());
  const out = {};
  for (const id of ids) {
    out[id] = {
      name: taxonomyName(id),
      ancestors: taxonomyAncestors(id),
      hiddenTerms: taxonomyHiddenTerms(id, terms),
    };
  }
  res.send(out);
});


// Serve the frontend files once deployed
app.use(express.static('public'));

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
    allergens: [],
    goals: []
  };
  users.push(user);

  return user;
}

async function findUser(field, value) {
  if (!value) return null;

  return users.find((u) => u[field] === value);
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
