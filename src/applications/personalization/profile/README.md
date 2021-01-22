# Profile 2.0

## Test users

Users must be LOA3 to access most of the Profile features. Users must also have two-factor set up to access the Direct Deposit feature.

Staging test users for all sections are laid out in [this spreadsheet](https://docs.google.com/spreadsheets/d/1pirWRnmdJb5o_BxY8N4Qbq3_mB1PdZ-x-gwzgMZO66k/edit#gid=0). [This is another doc containing Direct Deposit test users](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/direct-deposit/test-users.md).

## Contact info and the VA Profile service

Contact info is powered by the VA Profile service (Slack Channel #va-profile) formerly known as Vet 360. You'll still see references to Vet 360 or just 360 in the code. It is not possible to connect to VA Profile through `vets-api` when running locally. All calls to update contact info are mocked entirely in the front end by short-circuiting API requests at the Redux action-creator level by making a call to the `isVAProfileServiceConfigured()` helper. `local-vapsvc.js` provides a lot of helper functions you can call from action creators to simulate different scenarios such as a failure.

VA Profile is an asynchronous, transaction-based service. Making updates is a two step process. First, you create a transaction ("Please update the phone number to 555-123-1234") and get back a transaction ID. Then you check on the status of that transaction ("Have you finished with transaction ID ABC-123?") until it has resolved or failed.

## Direct deposit

Users must be LOA3 and have 2FA set up to access Direct Deposit. Users must also be eligible for Direct Deposit (based on the response from the `GET ppiu/payment_information` endpoint) to see the feature (most user will not see the feature in their Profile). Some users who have direct deposit set up are blocked from accessing the feature because they are flagged as incompetent or having a fiduciary.

## Connected apps

There is a dedicated team that manages the connected app integrations. The slack channel is #connected-apps.

When running the app locally, all test users will have 2 connected apps available to them as they are mocked [here](src/applications/personalization/profile/util/connected-apps.js).

[How to connect apps in staging](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/profile/Combine%20Profile%20and%20Account/QA/how-to-turn-on-connected-apps.md)
