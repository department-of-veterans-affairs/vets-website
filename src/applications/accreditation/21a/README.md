### 🚨WIP Form 21A🚨
This sub-application is incomplete and its development has been paused. It is dependency-free from the `representative` application that it might eventually live under.

This tool allows attorneys or claims agents to start the application (Fowm 21A) process to become a VA-accredited representative. 

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
2. The Form 21A currently lives on the Accredited Representative Portal so you'll need to run 2 different applications.
3. Take a look at [src/applications/accredited-representative-portal/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/accredited-representative-portal/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName (representative)
   - Localhost Url: rootUrl (EX: <http://localhost:3001/representative/>)

4. Take a look at [src/applications/accreditation/21a/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/accreditation/21a/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName (representative-21a)
   - Localhost Url: rootUrl (EX: <http://localhost:3001/representative/accreditation/attorney-claims-agent-form-21a>)
5. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   yarn install
   ```

   - Run vets-website locally

   ```code block
   yarn watch --env entry=auth,static-pages,login-page,terms-of-use,verify,representative,representative-21a
   ```

### How to login into localhost with mocked-auth and fill out an application

1. Go to <http://localhost:3001/sign-in/mocked-auth>
2. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
3. Select a profile from the drop down (EX: vets.gov.user+228@gmail.com) and click the ‘Continue signing in’ button.
4. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/representative/> and you will be directed to the Accredited Representative Portal home page.
   > If the page spins you might have a feature flag disabled. Make sure that the feature flag `accredited_representative_portal_frontend` is enabled.
5. Change the url to <http://localhost:3001/representative/accreditation/attorney-claims-agent-form-21a> and you will be directed to the Form 21A Introduction Page.
   > If the page spins you might have a feature flag disabled. Make sure that the feature flag `accredited_representative_portal_form_21a` is enabled.
   > Unfortunetly there is not yet a button that takes you to this page from the Accredited Representative Portal home page so you have to type in the url to get there.

### How to fill out a Form 21A application locally using test data

1. Run `vets-api` and `vets-website` following the above instrustions for the two necessary applications.
2. Sign in using mocked-auth.
3. Go to <http://localhost:3001/representative/accreditation/attorney-claims-agent-form-21a>
4. In another window open up the test user dashboard [here](https://tud.vfs.va.gov/)
   > Note: You must be logged into the VA network to access this
5. On the Form 21A page scroll down the page and select the button for `Sign in to start your application`
6. You'll be directed to a Sign in or create an account Page. Click the `Login.gov` button and enter a user and password from the test user dashboard and Submit. Then enter an oauth code from the test user dashboard.
7. Once youar esigned in you will unfortunetly not be directed back to the inital Form 21A page so you will need to re-enter the Form 21A url <http://localhost:3001/representative/accreditation/attorney-claims-agent-form-21a>
8. Once back on the page you'll noticed that you are signed into a user and if you scroll to the bottom of the page you will see the button `Start your Application`. Select this button.
9. Enter Dev Mode
   1. Open up Dev Tools on the page.
   2. Go to the console.
   3. Enter `localStorage.setItem('DEV_MODE',true)` and reload the page.
      > This will allow you to jumo to any page within the for and allow you o copy/paste raw data into the form so that you dont have to fill it all out.
   4. You'll now see a `Open save-in-progress menu` link.
10. Make a selection and then click the link `Finish this application later`.
11. Select the button `Continue your application`.
12. Select the `Open save-in-progress menu` link and it will open up a modal.
13. Go to `src/applications/accreditation/21a/tests/e2e/fixtures/mocks/test-data.json` and copy the json blob.
14. In the modal paste in json blob inot the `Form data` section and change the `Return url` to `/review-and-submit`. Then select the `Replace` button.
15. Select the button `Continue your application`. This will direct you back to the review and submit page, you'll notice all of the form fields are now fille dout and you can select the `Submit application` button.
16. The application will be submitted locally and the confirmation page will be displayed.