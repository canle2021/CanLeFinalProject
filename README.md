# CanLeFinalProject

Concordia Bootcamps Final Project

Final Project Instructions

1. Overview and Goal
   For the final project, you need to come up with an idea that is your own. This idea has to come from you, it’s YOUR project. Obviously the likelihood of something being 100% original is nearly impossible. Everything already exists in the world. That’s not what we mean by “an idea that is your own”. We want you to create a website / web app about something you like, something that relates to you.

The goal is to build a full-stack application from scratch that will use the technologies covered in class. That means you’ll need a front-end (FE), a back-end (BE), and they’ll need to communicate properly.

The final project is your competitive edge in an interview. Make sure you build something you’re proud of! Recruiters can tell when someone is passionate and proud about the project they’ve built. A generic idea won’t cut it here!

You must submit a proposal that will outline the details of your project. The proposal doesn’t need to be too long, just half a page at most. Even bullet points will do. Tell us what features it will have, what it will do, what’s the purpose, etc. Think of it as an elevator pitch! We’ll review it and give you feedback on it.

Hello! The deadline for wd-16 is the 18th of August. For wd-15 still August 17! 😂 2. Requirements
In order to pass, your project must include the following:
A FE built with React.js
A BE built with Node.js
Your server must implement REST practices
A database using MongoDB
The use of an API

3. Do’s and Don’ts

   3.1 What you can do
   Use of packages / libraries found on NPM or other places to help you build a cool user interface (UI) for a good user experience.
   Use of external sources to help you use a resource you're not familiar with. These include:
   Articles
   Blog posts
   YouTube tutorials
   Online courses
   Ask your classmates for help
   Clean code (this is more for you than for us)
   Organize your FE and BE nicely!
   Add comments!
   Recruiters will definitely look at that. 👀

3.2 What is illegal
Twitter clones!

E-commerce websites!
I mean… duh? Our group project is an e-commerce website you can’t just use that for your final project 😂

React Native
We know some of you want to build mobile applications, but we don’t teach React Native so it’s not allowed.
Build it in React!

Mongoose
We don’t teach Mongoose.
Yes we know it’s cool.
Please stick to regular MongoDB structures.

Firebase (as a database)
We teach MongoDB.
No Firebase allowed! (╯°□°）╯︵ ┻━┻

Styling libraries. All your website’s styling has to come from you! You CANNOT use libraries for styling, such as:
Bootstrap
Canvas
Tailwind
Literally any other! The 3 listed above are the ones people usually go for. No styling libraries allowed.
NOTE: You can use them for building UI, but not for styling.

YouTube tutorials
You can refer to YouTube tutorials to understand certain technologies.
You CANNOT base your whole project on a tutorial video. That is plagiarism!
Ex: a YouTube tutorial for creating a website / application about crypto coins. Your whole website cannot be solely based on this tutorial! Use it to improve your project, not to build it.

Putting money on your project!
Don’t feel obligated to use a paid API / database for your project to run.
Paid API calls can be expensive, especially if you accidentally run an infinite loop!
If you can’t find a free API or database, it might be worth it to change ideas.

Hosting your project
This is NOT a requirement to pass. Don’t waste your time hosting it, you only have 2 weeks to do this! We won’t help you with this process either.
If you want to host it, do it once you’ve officially passed! There are tons of guides out there to refer to.

4. Tips
   4.1. Users

   4.1.1 Guidelines

   If your website requires users, make sure there’s:
   User only features / pages
   Only logged in users can access the full site.
   User authentication
   Make sure only registered users can use your site.
   User interaction
   Make sure the user can USE your website, not login for no reason.
   Ex: chat system, comment system, friend system, favorites, activity, etc.

   4.1.2 Recommendations

   4.1.2.1 User authentication:

   Creating your own sign up / sign in methods that will check your database.
   Encrypt sensitive information, like their password! Use a password hasher like Bycrypt.
   Using Auth0:
   You’ll need to sign up to view the full documentation (and to create the authenticator).
   Even if you use Auth0 to authenticate, you’ll need to save the user in your database.
   Using Firebase:
   The use of Firebase as a database is forbidden, but it can be used for authenticating your users.
   Even if you use Firebase to authenticate, you’ll need to save the user in your database.

4.1.2.2 User interaction:

Most user interactions will require saving information in your database
Ex: comments, friends, activity
For a chat system, try Socket.io
There are tons of tutorials on YouTube to help you set this up

4.2 APIs

4.2.1 Guidelines

Your website needs to make use of an API, however this is contextual; if your site does not require the use of a third party API, your BE will serve as your API.

4.2.2 Recommendations

Research. No really, research! There’s A TON of APIs out there, research on Google to see if you can find one that does what you need.

If there’s really nothing out there, and you can’t make your own because of your project’s requirements, you may need to think of another idea altogether.

4.3 Data

4.3.1 Guidelines

Your website will need data. Whether you will build up your database through user interaction, or you’ll need data to already exist for your site to be functional, your site will need data. Data makes the world go round!

4.3.2 Recommendations

Plan out your data structure!
It’s vital that your structure works well with the flow of your website.
Saving data through user interaction
It’s important to save anything relevant related to the user in your database.

Dummy data
If your site requires data to exist beforehand for it to work, load up some fake data in there. Nobody said it had to be real!
Real data
If your site requires real data, fetch it from an API or a database that provides it.

REMINDER: do not pay for your data / API calls.

5. Recommended Resources

Google Maps API - I think you all know what this is.

Cloudinary API - image and media uploading / hosting.

The Movie Database - database of movies (has an API).

Rapid API - mega hub of various APIs.

GitHub API List - categorized free APIs.

Auth0 - easy user authentication (can be integrated with MongoDB).

Faker - generate tons of fake (but realistic) data.

Rony's Super Amazing React Cheat Sheet - duh 😋.

Rony's Super Amazing JavaScript Cheat Sheet - duh 😋.
