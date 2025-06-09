# Find a Representative

This tool allows va users to search for an accredited attorney, claims agent, or Veterans Service Organization (VSO) representative to appoint, that can help them file a claim or request a decision review.
They can use this search tool to find one of these types of accredited representatives to help them.

You can learn more about this service <https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/accredited-representation-management/product-documentation/find-a-representative/product-outline-find-a-representative.md>.

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
2. Take a look at [src/applications/representative-search/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/representative-search/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName: `find-a-representative`
   - Localhost Url: rootUrl (EX: <http://localhost:3001/get-help-from-accredited-representative/find-rep>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   yarn install
   ```

   - Run vets-website locally

   ```code block
   yarn watch --env entry=auth,static-pages,login-page,terms-of-use,verify,find-a-representative
   ```

### How to login into localhost with mocked-auth and view Find a Representative

1. If you dont already have a setting.local.yml file in `vets-api` then follow these instructions to add one and create a certificate for benefits-claims so that you can login with localhost
2. Go to <http://localhost:3001/sign-in/mocked-auth>
3. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
4. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
5. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/get-help-from-accredited-representative/find-rep> and you will be directed to the Find a Rep service.

### How to login into localhost with mocked-auth and view Find a Representative with a staging user

1. In `vets-api` go to `lib/lighthouse/benefits_claims/service.rb` and change the line that says `@icn = icn` to an icn from a user in staging (EX: `@icn = 'STAGING_USER_ICN'`)
   > User `vets.gov.user+211@gmail.com` has a participant id
   > User `vets.gov.user+275@gmail.com` does not have a participant id
2. In your `config/settings.local.yml` you can change your use_mocks to be false for benefits_claims
3. Run `vets-api`
4. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
5. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
6. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/get-help-from-accredited-representative/find-rep> and you will be directed to the Find a Representative service.
7. You should now see the Find a Representative page for that staging user. A widget will be displayed either saying you dont have a representative or showing you your representative/VSO.

### How to use the Find a Representative Search on localhost

1. Use the above steps from `How to login into localhost with mocked-auth and view Find a Representative with a staging user` or `How to login into localhost with mocked-auth and view Find a Representative` to log in
2. Create a map box account by going to this url: <https://www.mapbox.com/>. Use your work email as the email.
3. Within Mapbox, go to the `Tokens` tab
4. Copy the default public token.
5. Within `vets-website` go to `src/applications/representative-search/utils/mapboxToken.js` and paste in the the token
6. Refresh the page
7. Type in a City or State within the Find a Representative Search and select the `Search` button.
   > Note: This information is coming from Staging.
