# Welcome to My VA Setup Review Information Form

The purpose of this application is to allow veterans a straightforward process to supply certain contact information.

## Running

To run just this application, watching for changes, use this command:
```
yarn watch --env entry=welcome-va-setup-review-information
```

The form runs at this location:

```
http://localhost:3001/my-va/welcome-va-setup/contact-information
```

## Testing

The Profile application contains a suite of mock responses useful for setting up testing scenarios. To run a mock API utilizing those responses use this command:

```
yarn mock-api --responses src/applications/personalization/profile/mocks/server.js
```

For example, to mock a user with no mobile phone in their contact information, in the above file, for the `GET /v0/user` endpoint, return the `loa3UserWithNoMobilePhone` user. Then run the API and the application.