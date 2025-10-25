This directory contains the React components and state management for interfacing with VA Profile Service (AKA vap, vap-svc, vapService, VAPService in the application), a VA service that processes updates by updating the field in multiple data sources. The work here has been extracted from the Profile application to be easily imported into other applications, and is warranted because the VA Profile Service data flow operates via "transactions", which is more complex than the more common model of an API responding directly to a request with the updated record or errors.

Currently, VA Profile Service's scope is limited to veteran contact information, which consists of the following fields:

- Email
- Home Phone
- Mobile Phone
- Work Phone
- Fax Number
- Mailing Address
- Residential Address

## Getting started
The [Profile](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/personalization/profile) application serves as an example for how to use this work.

Follow these steps to get started in your own application:

1. Import and initialize the VA Profile Service reducer into the Redux store as `vapService`.
    - In the Profile, this looks like - `export default { vaProfile, vapService };`
2. Import and render the components or containers useful for your application.
    - The `vap-svc/components` directory contains components that internally wrap containers so that they can be freely rendered standalone without any props or setup involved.

This should hopefully be all you need to know to work with VA Profile Service, but there's more information below in case you would like to become familiar with how the components work.

At the moment of writing, `letters` is the only application that is already using vap-svc components. An example can be found here, were we use `MailingAddress`: `src/applications/letters/containers/AddressSection.jsx`.

## VA Profile Service Reducer (vapService)
The VA Profile Service reducer is necessary in order to manage transactions (more on that below), as well as certain interactions with the UI (opening an edit-modal or edit view after a user clicks "edit", for example.) It contains the following properties-

1. `modal`
    - A string value indicating which field is being edited.
1. `initialFormFields`
    - The value of initialFormFields is set to an empty object if the user has not yet filled out any contact information and otherwise includes any already saved contact information. The value is set when `UPDATE_PROFILE_FORM_FIELD` is triggered upon initial opening of the edit modal / rendering of the edit view.
1. `formFields`
    - Information for the modals to manage their state in the UI, including the edited form value and validation errors.
1. `transactions`
    - An array of transactions, all of which will pertain to updates that are either pending (status of `RECEIVED`) or rejected. Successful transactions are automatically removed from state after the user profile is refreshed.
    - The `fetchTransactions` action will populate this property with all transactions for a particular user.
1. `fieldTransactionMap`
    - An object, where each field-name (`mailingAddress`, `emailAddress`, etc) is used to look up whether there is an update request for a field. If there is pending request, then `fieldTransactionMap[FIELD_NAME].isPending` will be `true`. If there is direct error, then `isFailed` will be true and `error` will contain information from the API. If we there is an active transaction for that field, then `fieldTransactionMap[FIELD_NAME].transactionId` can be used to look up that transaction in the `transactions` property. This is necessary because a transaction only contains enough information to determine the update category (address, email address, or phone number) via its `type` rather then the specific field that it corresponds.
    - A transaction may exist in the `transactions` array but without a field-mapping in the `fieldTransactionMap` if transactions are found via the `fetchTransactions` action.
    - If there is no active transaction for a field or the specific field can't be determined because of the reason described above, then the value for a field will be `undefined`.
1. `transactionsAwaitingUpdate`
    - An array of transaction IDs, each one corresponding to a request at `/v0/profile/status/{transaction_id}`. This is effectively used to prevent the API from being hit quicker than it can respond while we are polling for transaction updates.
1. `metadata`
    - Anything else about the transactions data. Currently, it contains only a `mostRecentErroredTransactionId` property, which is used to render error messaging for the most recent rejected transaction. It is necessary because transactions aren't timestamped.
1. `hasUnsavedEdits`
    - A boolean used to indicate whether the user has any form field updates that have not yet been successfully saved.
1. `addressValidation`
    - When the `validateAddress` thunk is triggered, it will set `addressValidation` equal to `initialAddressValidationState`.
    - The logic whether to show the address validation modal can be found in `src/platform/user/profile/vap-svc/util/index.js`.
    - When the address validation modal is opened, the values on `addressValidation` are set to their respective values based on whether we get confirmed suggested addresses back or whether there was an error.

## Transactions
When a request to update a field is sent to VA Profile Service (via `PUT`, or `POST` if the field is empty), VA Profile Service does not respond with the updated record from a database as you would expect from a typical API. Instead, it responds with data on how to look up the progress of the update, information referred to as a "transaction." For example, a request to update an email would return a transaction that looks like:

```json
{
  "data": {
    "attributes": {
      "transaction_status": "RECEIVED",
      "transaction_id": "786efe0e-fd20-4da2-9019-0c00540dba4d",
      "type": "AsyncTransaction::Vet360::EmailTransaction"
    }
  }
}
```

The `transaction_status` property set to `RECEIVED` indicates that VA Profile Service has enqueued the update, but it has not finished processing. The `transaction_id` can then be used to look up that update at a later time via `/v0/profile/person/status/{transaction_id}`. At some point, the `transaction_status` will indicate whether the update was successful or rejected. If it is rejected, there will be a `metadata` property containing a list of errors. The Swagger docs contain [more info](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile/postVet360EmailAddress) on this.

A note here about the `type` property - that field indicates whether the transaction pertains to an email, address, or telephone number. In the case of an address, you are not provided with an identifier to determine whether the transaction is for a residential or mailing address. This information must be managed by the Front-End in memory.

Note that we're still getting vet360 data back from the API, as it has not yet been renamed to reference VA Profile Service.

### Errors
Most errors are returned by VA Profile Service during a transaction lookup along with a `transaction_status` indicating that the update was rejected. However, some errors are returned directly, similar to a traditional API response. These errors are -

1. An address was said to be invalid
2. The veteran is deceased
