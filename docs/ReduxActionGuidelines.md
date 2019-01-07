# Redux Action Guidelines

Actions are an important part of Redux and in order to making usage of Redux consistent and maintainable across applications, here are some guidelines to follow.

Important note: actions are the objects that are returned by action creator functions and used by reducers to generate a new state object. Guidelines for reducers and action creators will be in other documentation.

1. Follow the documentation on the [Redux site](https://redux.js.org). The basics of actions are [here](https://redux.js.org/basics/actions) and some frequently asked questions can be found [here](https://redux.js.org/faq/actions).
2. Define constants for your action types. We typically do this in the same file as the actions, and import them in the reducer.
3. Actions should reflect something a user did or an external event. It's easy to get in the habit of naming actions after what's happening in a component or in the Redux state itself, but naming them after implementation details couples the action to that implementation and makes it confusing to change later. Actions are also meant to show the history of what has happened in your application, and a bunch of names like `SET_FETCH_FORM_STATUS` are not easy to understand just from the name.
   - For example:
      - Instead of `SET_MODAL_STATUS` try `MODAL_OPENED` or `MODAL_TOGGLED`
      - Instead of `FETCH_FORM` try `FORM_FETCH_STARTED`
4. Action names should be uppercase, separated by underscores.
4. Action names should be in past tense. The user or external event already happened, you're updating the application state to reflect that fact. Most of our code uses present tense currently, but the consensus is that this is the better convention.

## Async action objects

A common pattern in Redux is to have several action names related to one asynchronous action, like a server request. You might be updating an address and have actions like `UPDATE_ADDRESS`, `UPDATE_ADDRESS_SUCCESS`, and `UPDATE_ADDRESS_FAILURE`. To that end, we recommend that you use the suffixes `_STARTED`, `_SUCCEEDED`, and `_FAILED` for async actions. So if the user trigger an action to update an address, you would have `UPDATE_ADDRESS_STARTED`, `UPDATE_ADDRESS_SUCCEEDED`, and `UPDATE_ADDRESS_FAILED`.

We also suggest using the following properties for data in those action types:

- `response`: the response data in a successful action
- `error`: the error data in a failed action
