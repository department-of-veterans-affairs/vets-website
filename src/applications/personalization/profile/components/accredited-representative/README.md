# Profile - Representative Status

This tool allows a va user to go to home page, select `Profile` from the drop down under their name.
The Profile page then directs the user to various cards with information that pertains to them. By selecting the link in the card `Accredited representative or VSO` a veteran will learn if they have a representative or VSO.

You can learn more about this service <https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/accredited-representation-management/product-documentation/representative-status-widget/product-outline-representative-status.md>.

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
2. Representative Status is on the Profile so you will need to run 2 services.
3. Take a look at [src/applications/personalization/profile/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/profile/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName: `profile`
   - Localhost Url: rootUrl (EX: <http://localhost:3001/profile>)

4. Take a look at [src/applications/registry.scaffold.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/registry.scaffold.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: widgetType: `representative-status`
   - Localhost Url: rootUrl (EX: <http://localhost:3001/representative-status>)

5. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   yarn install
   ```

   - Run vets-website locally

   ```code block
   yarn watch --env entry=auth,static-pages,login-page,terms-of-use,verify,profile,representative-status
   ```

### How to login into localhost with mocked-auth and view Profile - Representative Status

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/profile/> and scroll down the page to the card `Accredited representative or VSO` and select the link `Check your accredited representative or VSO`.
5. This will direct you to the accredited Representative page that shows if you have a Representative/VSO or not.

### How to login into localhost with mocked-auth and view Find a Representative with a staging user

1. In `vets-api` go to `lib/lighthouse/benefits_claims/service.rb` and change the line that says `@icn = icn` to an icn from a user in staging (EX: `@icn = 'STAGING_USER_ICN'`)
   > User `vets.gov.user+211@gmail.com` has a participant id
   > User `vets.gov.user+275@gmail.com` does not have a participant id
2. In your `config/settings.local.yml` you can change your use_mocks to be false for benefits_claims
3. Run `vets-api`
4. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
5. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
6. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/profile/> and scroll down the page to the card `Accredited representative or VSO` and select the link `Check your accredited representative or VSO`.
7. This will direct you to the accredited Representative page that shows if you have a Representative/VSO or not.
