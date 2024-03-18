# Claim Status Tool

This tool allows va users to check the status of thier VA claim, decision review or appeal online.

## How to run locally

### Run vets-api locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-api project.
2. Once in the vets-api project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```code block
    bundle install
    ```

   - Run vets-api locally
  
    ```code block
    foreman start -m all=1,clamd=0,freshclam=0
    ```

### Run vets-website locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-website project.
2. Take a look at [src/applications/claims-status/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/claims-status/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName
   - Localhost Url: rootUrl (EX: <http://localhost:3001/track-claims/your-claims/>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```code block
    yarn install
    ```

   - Run vets-website locally
  
    ```code block
    yarn watch --env entry=auth,claims-status,static-pages,login-page,terms-of-use,verify
    ```

### How to login into localhost and view the claim status tool

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: vets.gov.user+228@gmail.com) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/track-claims/your-claims/>  and you will be directed to the Claim Status Tool service.
