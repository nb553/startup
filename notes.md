# CS 260 Notes

This file represents what I have learned about web programming.

- [My startup](https://github.com/nb553/startup)

I LOVE WEB PROGRAMMING

- [My simon](https://simon.burkart260webprogramming.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

Setting up my production environment on AWS has honestly been one of the more useful parts of this class so far. Having a real EC2 instance and domain to deploy to, instead of just running things locally, makes the whole workflow feel a lot more like actual software development. It's also taught me some practical troubleshooting skills I didn't expect — like realizing my instance needs to actually be running before SSH will connect, or that a `.pem` key needs the right file permissions before it'll be accepted. Those are small things, but they're the kind of real-world debugging that doesn't come up in a purely local dev environment.

## HTML

Built out the core pages for Allergen Audit: `index.html` (login/landing), `dashboard.html` (household recipes with flagged ingredients and substitutes, plus a household activity feed), `profile.html` (user allergy list and household memberships for Burkart Family and Provo Apt), and `lookup.html` (manual food search and photo-scan placeholder). Used semantic tags throughout (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) modeled after the Simon HTML example.

## React

React turns multi-page HTML into a single-page app: one index.html loads everything through index.jsx into a root div. Pages become function components in src/ folders that return JSX — I had to change class to className and for to htmlFor. React Router (BrowserRouter, Routes, Route, NavLink) swaps components without page reloads; to="dashboard" replaces href="dashboard.html". Vite bundles it with npm run dev for hot reloading. I learned to debug by checking the DOM in Inspect when elements render but aren't visible, which caught a Bootstrap class conflict hiding my nav links.

## Simon Service

I cloned the Simon Service example and worked through how a Node/Express backend is put together. The service lives in its own service/ directory with its own package.json, listens on port 3000, and serves the bundled React frontend from its public/ directory. Endpoints are grouped under /api using an Express router. Authentication uses the same pattern I will use for my startup: register and login endpoints hash passwords with bcryptjs, generate a UUID token, and return it in an httpOnly, secure, sameSite strict cookie. A verifyAuth middleware checks the token cookie before protected endpoints like getting or submitting scores, and returns 401 if there is no matching user. Users and scores are stored in arrays in memory, so they are lost when the service restarts. When debugging, the frontend runs on Vite (port 5173) and vite.config.js proxies /api requests to the backend on port 3000; in production the service itself serves everything. Deployment uses deployService.sh, which builds the frontend, copies the service and frontend to the server, installs the backend packages there, and restarts the service with PM2.

Startup Service: Built the Express backend in service/ (port 4000) with bcrypt-hashed register/login/logout, a token cookie, and an auth-required /api/user/me endpoint. Profile allergens and nutrition goals moved from localStorage to per-account endpoints; households and recipes have endpoints with invite codes and membership checks. Simon Service was deployed first as the warm-up. For the third-party API, Lookup uses Open Food Facts: the search host sends no CORS headers, so name search is proxied through my service while product details come straight from Open Food Facts by barcode. The service also loads the Open Food Facts ingredients taxonomy at startup so Lookup can explain unfamiliar ingredients by their family (whey -> dairy) and warn about broad categories (spices) instead of relying on exact-name matching. Deployed with deployService.sh to the startup subdomain and verified live.

Simon DB: Replaced Simon's in-memory storage with MongoDB Atlas. I created an Atlas cluster and keep the connection credentials in a dbConfig.json file in the service folder, which is gitignored so the password never reaches GitHub; the deploy script carries it to the production server. The service's database.js connects with MongoClient, pings the database at startup and exits if it cannot connect, and exposes small functions (getUser, getUserByToken, addUser, updateUser, addScore, getHighScores) that index.js calls instead of touching in-memory arrays. Passwords are still bcrypt-hashed, and the auth token is stored on the user document, so getUserByToken is a database query. Accounts and scores now survive service restarts and redeploys. I verified this by watching user and score documents appear in the Atlas console from both my local app and the production site.

### Startup Database

I replaced the startup service's in-memory arrays with MongoDB Atlas, following the same pattern as Simon DB. All database access lives in service/database.js: it builds the connection URL from dbConfig.json (hostname, userName, password — gitignored, and carried to the server by deployService.sh because it copies service/*.json), pings the database on startup, and exports one function per operation. Users are documents with their allergens and goals on them; households are documents with their recipes embedded. The two update styles that mattered: $set to save a changed document back (a login token, an edited allergen list, a household after a recipe is added) and $unset to remove the token field entirely on logout. The endpoint code barely changed shape — handlers went async and array operations became awaited database calls — but the behavior change is total: I registered, added an allergen, and let the dashboard seed a household, then restarted the service and everything was still there, including my login session.

