App Name: `Form 21-686c`
Active engineers: Micah Chiang (front end), Jesse Cohn (front end), Kathleen Crawford (back end), Kevin Musiorski (back end)
Form ID (if different from app name): `21-686c with 21P-527EZ and 21-674`

# Background

From time to time Veterans need to make updates to the dependents they get benefits for. These updates can be when a divorce happens, or a death, or a new child is born, etc. The 686c form is how these changes to dependents are made.

## How the form works for the user

Since the Veteran may be making any one of various changes to dependents, there are multiple paths, or workflows, they can take through the form. When the veteran starts the form they are shown an introduction page with some information about what is in the form. Then they are taken to a "wizard" page where they can choose what workflow they want to take though the form. The paths the Veteran can take through the form can be any of the following -

- `Add your spouse`
- `Add a spouse`
- `Remove a divorced spouse`
- `Remove a spouse, child or dependent parent who has died`
- `Remove a stepchild who has left your household`
- `Remove a child 18 to 23 years old who has stopped attending school`
- `Add a child 18 to 23 years old</strong> who'll be attending school` (VA Form 21-674)

> You will notice that the last workflow is technically a totally separate form (the form 21-674). The stakeholders wanted this form added as a workflow to this form since it deals with making changes to a dependent. That workflow actually submits using a separate job than the 686c does. This is detailed further in the back end section.

The Veteran can choose as many or as few of these workflows at a time. This means the Veteran could potentially come into the form and select multiple workflows and we show them only the parts they need to see. For instance, if you choose to `Add your spouse` AND choose `Remove a divorced spouse` we would show you the pages dealing with those two workflows but ONLY those two workflows. This is done using [depends](https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/common-patterns-for-building-forms/#conditionally-including-a-page) in the code and is detailed below.

Once the user chooses the workflows they want, they move through the form filling out the fields and are then shown a review page of what they are about to submit. They can then submit and see a confirmation screen that they submitted the form.

## The Front End code

Since the 686c is a rather large form we decided to split the form chapters up into smaller files instead of putting them all in one huge file. We broke these files up into individual folders for each respective chapter. You can find each individual chapter folder inside `/config`. You will also see a few files inside the `/config` folder that are not inside the chapter folders, these files are -

- `address-schema.js` - Holds a reusable address schema we use throughout the chapters
- `constants.js`- Holds a few constants specific to our form
- `form.js` - Uses all of the individual chapters to build a form schema which is then used to build the form
- `helpers.js` - Holds a few helpers used for the UI and one used in loops where the Veteran can add multiple items, like adding multiple past spouses for example
- `location-schema.js` - Holds a more basic location schema we use in the chapters but is not as comprehensive as the full address schema noted above
- `utilities.js` - Holds a few utility functions we use like validations as well as holding all of the imports of the individual chapters for use inside form.js

The form system uses Redux and thus we also use Redux in our form so we have a `/actions` and a `/reducers` folder to hold the respective Redux code.

> It is worth noting that we make an API call when the user lands on the introduction page of the form to check that they have a valid VA file number. We check for this VA file number because we submit this form to BGS and we cannot submit the form without that VA file number. The code to check if the user has a valid VA file number is inside the `/actions/index.js` and `/reducers/index.js` files respectively.

As mentioned we broke each individual chapter of the form into it's own folder and put each page from each of the form into it's own folder inside the chapter folder as well. We then have an `index.js` file inside the chapter folder that imports all of the pages and then exports them deconstructed so that they are easier to import and use inside `/config/form.js`. Inside each of the page folders there is a jsx file named for the page as well as any helper files we used to accomplish that page. Inside the JSX file we export a `schema` object as well as a `uiSchema` object, these are what is used inside `/config/form.js` to build the form.

## Callouts on how the front end works

We used the original form system to build this application and we followed a pretty standard implementation with just a few areas worth noting.

### Valid VA file number check (front end)

The form is built using `/config/form.js` which is imported and used inside `/containers/App.jsx` with the `<RoutedSavableApp />` component from the platform. In `/containers/App.jsx` we dynamically render a loading indicator if the app is in an `isLoading` state from Redux. This allows us to show a loading indicator while we make the call to check if the Veteran has a valid VA file number as noted in the block quote above. The back end of that valid VA file number is detailed below in the back end section. Once the call is made and the form renders we either show the user an alert if they do not have a valid VA file number, or a `<SaveInProgressIntro />` component from the platform to start the form.

### The wizard

The first page a Veteran sees when they enter the form from the introduction page is a "wizard" where they can choose what task they want to path they want to take through the form. The original design for our form intended for us only to show the chapters that the Veteran needed to see; the idea would be that we would show the Veteran a list of tasks they could accomplish using the form and they could pick whatever ones they wanted to perform, then we would only show the Veteran the chapters they needed to see to accomplish those tasks.

The way we do this in the code is by using the `depends` attribute for the optional chapters inside `/config/form.js` along with a helper method called [isChapterFieldRequired](https://github.com/department-of-veterans-affairs/vets-website/blob/a4babda01dac9cbb30feded94e92ea8f557b69be/src/applications/disability-benefits/686c-674/config/helpers.js#L7) and passing in the `formData` object and the name of that respective chapter. The `isChapterFieldRequired` function then checks if the Veteran selected the task in the wizard associated with that chapter, which we hold in the `formData["view:selectable686Options"]` array in the form data and returns `true` and shows that chapter if it corresponds to a task the Veteran selected.

## The back end code

There are really two separate API endpoints that we use in the 686c form, one of them dealing with the check for a valid VA file number noted in the front end sections, and one that receives the form payload on submission. The endpoint for the VA file number check is located at [vets-api/app/controllers/v0/profile/valid_va_file_numbers_controller.rb](https://github.com/department-of-veterans-affairs/vets-api/blob/d6a57d2046248013e52a38fc490c1cd6e5cb955c/app/controllers/v0/profile/valid_va_file_numbers_controller.rb#L1) and the endpoint for the submission payload is at [vets-api/app/controllers/v0/dependents_applications_controller.rb](https://github.com/department-of-veterans-affairs/vets-api/blob/d6a57d2046248013e52a38fc490c1cd6e5cb955c/app/controllers/v0/dependents_applications_controller.rb#L1).

### Valid VA file number check (back end)

When the Veteran first lands on the Introduction page of the form a call is made to `vets-api/app/controllers/v0/profile/valid_va_file_numbers_controller.rb` where we use BGS as a data source to see if the current user has valid VA file number. We do this with the `valid_va_file_number_data` method call which simply takes the data returned by BGS for the current user and sees if the user has a `file_nbr` which is where BGS holds the file number. If the user has a valid VA file number we return `true`, otherwise we return `false`, to the front end.

### Form submission

After the Veteran fills out the form and submits the payload it is sent to `vets-api/app/controllers/v0/dependents_applications_controller.rb` on the back end. The main method we use in that controller is the `create` method, this method starts out by creating a `claim` object. The `claim` object is created with the `new` method of the `DependencyClaim`. We then check if for some reason the `claim` did not get created, meaning that the form payload has not passed our validation (more on this in a moment), we then log the error and raise an exception.

After we create the claim we then process any attached documents, which are needed for some of the workflows in the form, and then using the dependents service we send the data to BGS. In addition to sending the data to BGS we also use `PDFtk` to create a PDF that we then send to VBMS. VBMS then uploads the PDF to the Veteran's eFolder (like a "my documents" folder at the VA for each Veteran). Once the claim has been submitted successfully, at this point we clear out the current saved claim data so that this claim doesn't stay in the Veteran's `save in progress` function on the form. We then render JSON to the front end.

### After submission

When we submit the claim using the `dependent_service` call inside `vets-api/app/controllers/v0/dependents_applications_controller.rb`, that service can kick off three separate jobs based on the payload of the form. Previously we talked about how the user can select different workflows through the form, some of them specific to the 21-686c and one of them specific to the 21-674 form. Based on which workflow the Veteran filled out we use the `dependent_service` to kick off a job specific to the 686c, and/ or a job specific to the 674, and a job specific to creating the PDF using `PDFtk` and sending it to VBMS (this third job will always be run).

### Async and Error Handling

- [686c](documentation/686c.md)
- [674](documentation/674.md)
