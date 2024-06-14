# Rated Disabilities

The VA assigns a Veteran a disability rating based on the severity of their service connected condition. They rate disabilities from 0% to 100% in 10% increments (e.g. 10%, 20%, 30% etc.). The VA uses a Veterans disability rating to determine how much disability compensation they’ll receive each month, as well as their eligibility for other VA benefits. This service allows veterans the ability to view their combined and individual disability ratings.

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
2. Take a look at [src/applications/rated-disabilities/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/rated-disabilities/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName
   - Localhost Url: rootUrl (EX: <http://localhost:3001/disability/view-disability-rating/rating/>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

    ```code block
    yarn install
    ```

   - Run vets-website locally
  
    ```code block
    yarn watch --env entry=auth,rated-disabilities,static-pages,login-page,terms-of-use,verify
    ```

### How to login into localhost and view the rated disabilities service

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: <vets.gov.user+228@gmail.com>) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/disability/view-disability-rating/rating/>  and you will be directed to the Rated Disability service.
