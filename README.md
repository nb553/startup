# Allergen Audit  
 
 _Might change later, but so far I like this name_


[My Notes](notes.md)

Allergen Audit is a personalized allergen and dietary restrictions recipe manager. Majority of health apps have this feature in a mix of their rigid meal plans and weightloss focus, so it's ineffective when a person's allergies or diet doesn't match popular templates. This app lets users configure allergens and restrictions unique to a person and collaborate multi-person household profiles. The app will automatically flag allergens and suggest safe alternatives when adding a recipe, flag allergens of other household members, and break down unknown packaged foods by ingredients and nutritional facts.  
 
 _A bare bones description of the application when I decided I wanted to do this, not as neat as the elevator pitch_


> [!NOTE]
> This is a template for your startup application. You must modify this `README.md` file for each phase of your development. You only need to fill in the section for each deliverable when that deliverable is submitted in Canvas. Without completing the section for a deliverable, the TA will not know what to look for when grading your submission. Feel free to add additional information to each deliverable description, but make sure you at least have the list of rubric items and a description of what you did for each item.

> [!NOTE]
> If you are not familiar with Markdown then you should review the [documentation](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) before continuing.

### Elevator pitch

Most health acts are too rigid and focused on mainstream diet plans to properly accommodate real world medical restrictions and allergies. This platform gives users the freedom to configure it to their individual allergy and medical profiles, manage household dietary needs in a collaboratory setting, filter recipes with subsitutions, and break down fast food items' ingredients on the go. This helps minimize frequent label checking and safe eating for all household members.  
 
_Altered my description a bit to become a nicer elevator pitch_

### Design

![alt text](image.png)  
![alt text](image-1.png)  
![alt text](image-2.png)

The first image is just a rough sketch of what a household dashboard will look like. It deomonstrates how it will list out a recipe with their ingredients, and flag ingredients. If a food has a substitute, it will suggest an alternative that will be safe for the other household members. These are small simple recipes pulled from my actual family. For menudo my mom had to take out carrots and peas because of allergies. With the ice cream recipe she found substitutes that we still use today.  
 
 The second image is also just a bare bones profile to show a user's profile with there allergies and other households they are a part of.  
 
 The third image is the look up page if the user is out eating and needs to look up if a food is safe. If a packaged food is missing its label you can take a picture to search it, or manually search it and it will pull up the ingredients list. The bottom image is pulled from the Taco Bell allergen menu, so the application will quickly pull this up when searched. 

```mermaid
sequenceDiagram
    actor You
    actor Website
    actor Server
    You->>Website: Updates allergy profile and recipe
    Website->>Server: Sends WebSocket request with the new data updated
    Server->>Website: Syncs and updates
    Website->>You: Displays updated profile and recipe across profiles
```
_Drew this up in figma_  
 
### Key features

- **Personalized Allergy Profiles:** Custom configuration to meed vast medical needs and allergies rather than generic highlighters lumped into health apps.  
- **Sync Households:** Multi-profile sharing that allows families to share allergen needs and collaborate instantly when meal planning.  
- **Smart Ingredient and Search Engine:** Filters and flags ingregients and suggests substitutes safe across the household. Search third party public ingredient list for fast food or unknown packaged goods.  

_Added key features of the application_  

### Technologies

I am going to use the required technologies in the following ways:

- **HTML** - This is where the structure comes in and the basic layout for navigating allergy profiles and recipe manager pages. There will be 4 pages: login, a main dashboard displaying your allergies and household, recipe manager, and lookup tools.
- **CSS** - The actual look of the interface. Visual and contrasting indicators for various profile's allergens and substitutes, clean and simple style, and a responsive interace for mobile and desktop. 
- **React** - This manages the interactivity of the application. Easy user transition between main dashboard, household profiles, recipe editors, and fast food lookup. Will handle login, profile and household setup, displaying other household members and their profiles. React to each other's profiles and substitutes. 
- **Service** - Works in the background to look for third party ingredient lists, saving user preferences, authentications, updating profiles, filtering recipes with substitutes, managing household members. 
- **DB/Login** - What will store all this data, including a profile's restrictions, save household members and their profiles, and save substitutions.
- **WebSocket** - Real time connection when multiple household members adds a recipe, adds substitutes, or adds allergens to profile.   
 
 _Added these representations for the app. A lot of it is saving profiles, real time alerts and editing, and funneling public allergen menus for fast food and or brand products_


## 🚀 Specification Deliverable

> [!NOTE]
> Fill in this sections as the submission artifact for this deliverable. You can refer to this [example](https://github.com/webprogramming260/startup-example/blob/main/README.md) for inspiration.

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Git commit requirement)
- [X] Proper use of Markdown
- [X] A concise and compelling elevator pitch
- [X] Description of key features
- [X] Description of how you will use each technology including your 3rd party API and use of WebSocket
- [X] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Rented EC2 server** - I did not complete this part of the deliverable.
- [X] **Leased domain name** - I did not complete this part of the deliverable.
- [X] **Server accessible** from my domain: [hhttps://burkart260webprogramming.click](https://burkart260webprogramming.click) - **Very original name lol**.

_Finally got my domain and IP working after some time. I didn't realize how extensive it is to actually create a domain and all the components that go into it. But rn it works. If I do come across an issue I will reach out again_

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [X] **HTML pages** - I did not complete this part of the deliverable.
- [X] **Proper HTML element usage** - I did not complete this part of the deliverable.
- [X] **Links** - I did not complete this part of the deliverable.
- [X] **Text** - I did not complete this part of the deliverable.
- [X] **3rd party API placeholder** - I did not complete this part of the deliverable.
- [X] **Images** - I did not complete this part of the deliverable.
- [X] **Login placeholder** - I did not complete this part of the deliverable.
- [X] **DB data placeholder** - I did not complete this part of the deliverable.
- [X] **WebSocket placeholder** - I did not complete this part of the deliverable.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Visually appealing colors and layout. No overflowing elements.** - I did not complete this part of the deliverable.
- [ ] **Use of a CSS framework** - I did not complete this part of the deliverable.
- [ ] **All visual elements styled using CSS** - I did not complete this part of the deliverable.
- [ ] **Responsive to window resizing using flexbox and/or grid display** - I did not complete this part of the deliverable.
- [ ] **Use of a imported font** - I did not complete this part of the deliverable.
- [ ] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I did not complete this part of the deliverable.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Bundled using Vite** - I did not complete this part of the deliverable.
- [ ] **Components** - I did not complete this part of the deliverable.
- [ ] **Router** - I did not complete this part of the deliverable.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.
- [ ] **Uses BCrypt to hash passwords** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] I completed the prerequisites for this deliverable (Simon deployed, GitHub link, Git commits)
- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
