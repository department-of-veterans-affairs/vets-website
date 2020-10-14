# Authentication in your Development Env. 

In order to be able to log in to your local environment, you will need to do the following: 

## Prerequisites

- Have the [site](https://github.com/department-of-veterans-affairs/vets-website) building locally, and the drupal content updated. 
- Have the [API](https://github.com/department-of-veterans-affairs/vets-api) running locally, with [mock-api-data](https://github.com/department-of-veterans-affairs/vets-api-mockdata), either in docker or locally


## To log in:
0) Have both the website and API running. 
3) Go your local website, and select sign in and sign in with `ID.me`
4) Log in with a appropriate user, ask your team for what can be used. 
5) Click through the next few pages, it won't send a text, and it should allow you to pass right on through. 
6) You should be redirected back to the home page, signed in.
7) To see if it worked, you should be able to open your [redux dev tools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) and see the user object in the global state.

## Didn't work? 

- Reach out to your team, your onboarding buddy or in the appropriate slack channels to for help

## Needs to be updated? 

Fix it and send a pull request 🤓. 
