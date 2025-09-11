# Appoint a Representative

This tool allows va users to pre-fill their VA Form 21-22 to appoint a Veteran Service Organization (VSO).
They can also user this online tool to pre-fill their VA Form 21-22a to appoint a VA accredited attorney or claims agent.

You can learn more about this service by going to <https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/accredited-representation-management/product-documentation/appoint-a-representative/product-outline-appoint-a-representative.md>.

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
2. Take a look at [src/applications/representative-appoint/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/representative-appoint/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName: `appoint-a-representative`
   - Localhost Url: rootUrl (EX: <http://localhost:3001/get-help-from-accredited-representative/appoint-rep>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   yarn install
   ```

   - Run vets-website locally

   ```code block
   yarn watch --env entry=auth,static-pages,login-page,terms-of-use,verify,appoint-a-representative
   ```

### How to login into localhost with mocked-auth and view Appoint a Representative

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/get-help-from-accredited-representative/appoint-rep> and you will be directed to the Appoint a Rep service.

### How to login into localhost with mocked-auth and view Appoint a Representative with a staging user

1. In `vets-api` go to `lib/lighthouse/benefits_claims/service.rb` and change the line that says `@icn = icn` to an icn from a user in staging (EX: `@icn = 'STAGING_USER_ICN'`)
   > User `vets.gov.user+211@gmail.com` has a participant id
   > User `vets.gov.user+275@gmail.com` does not have a participant id
2. In your `config/settings.local.yml` you can change your use_mocks to be false for benefits_claims
3. Run `vets-api`
4. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
5. Select a profile from the drop down (EX: `vets.gov.user+228@gmail.com`) and click the ‘Continue signing in’ button.
6. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/get-help-from-accredited-representative/appoint-rep> and you will be directed to the Appoint a Representative service.
7. You should now see the Appoint a Representative page for that staging user. A widget will be displayed either saying you dont have a representative or showing you your representative/VSO.

### How to add representatives and organizations to your local db so that you can appoint a representaive

1. Go to `vets-api`
2. Open a rails console `bundle exec rails c`
3. Run the following commands to add claims agents, attorneys, and organizations with representatives:


```ruby
# Create 5 attorneys with locations
FactoryBot.create_list(:accredited_individual, 5, :attorney, :with_location)

# Create 5 claims agents with locations
FactoryBot.create_list(:accredited_individual, 5, :claims_agent, :with_location)

# Create 5 organizations with locations and a representative
organizations = FactoryBot.create_list(:accredited_organization, 5, :with_location, :with_representatives)
```
