# 21P-534EZ Survivors Benefits

## Commands:

| Option | Command |
| ------ | ----------- |
| Site   | http://localhost:3001/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez |
| Watch  | yarn watch --env entry=survivors-benefits |
| Mock API | yarn mock-api --responses src/applications/survivors-benefits/tests/fixtures/mocks/local-mock-responses.js | 
| Unit tests | yarn test:unit --app-folder survivors-benefits --log-level all |

## Authentication
To see the form as either an authenticated/unauthenticated user, paste one of the following in your browser's console.

| Status | Cookie |
| ------ | ------ |
| Authenticated | `localStorage.setItem('hasSession', true)` |
| Unauthenticated | `localStorage.setItem('hasSession', false)` |

## Routes
A list of routes created by the config in form.js

<details>
<summary>Click to expand all routes</summary>

```
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/intro
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran-identification
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran-additional-information
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-relationship
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-other
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-information
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-identification
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-service-history
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-mailing-address
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-contact-information
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claimant-benefit-type
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/va-benefits
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/service-period
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/national-guard-service
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/national-guard-service-period
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/national-guard-unit-address
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran/other-service-names-intro
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran/other-service-names
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/veteran/other-service-names/:index
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/prisoner-of-war
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/prisoner-of-war-period
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-to-veteran
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-to-veteran-location
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-to-veteran-info
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-to-veteran-end
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-to-veteran-end-info
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/legal-status-of-marriage
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/marriage-status
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/reason-for-separation
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/separation-details
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/remarriage
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/remarriage-details
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/additional-marriages
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/spouse-marriage-question
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage-intro
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage/:index/name
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage/:index/date-and-location
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage/:index/end
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/previous-marriage/:index/end-date-and-location
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages/add
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages/:index/spouse-name
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages/:index/marriage-date-place
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages/:index/marriage-ended
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/veteran-previous-marriages/:index/marriage-end-date-location
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/children-of-veteran
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents-count
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/add
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/name-and-information
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/date-and-place-of-birth
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/relationship-to-dependent
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/information
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/household
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents/:index/child-support
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents-residence
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents-address
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/household/dependents-custodian
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/dic
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/dic/treatment
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/dic/add
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/dic/:index/name-location
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/dic/:index/dates
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/claim-information/nursing-home
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/income-and-assets
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/submit-supporting-documents
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/total-assets
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/transferred-assets
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/homeownership
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/land-lot-size
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/additional-land-value
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/marketable-land
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/income-sources
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/gross-monthly-income
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/add-income-source
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/:index/monthly-income-details
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses/add
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses/:index/type-of-care
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses/:index/recipient-provider
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses/:index/dates
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/care-expenses/:index/cost
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/medical-expenses
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/medical-expenses/add
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/medical-expenses/:index/recipient-provider
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/medical-expenses/:index/purpose-date
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/financial-information/medical-expenses/:index/frequency-cost
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/additional-information/direct-deposit
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/additional-information/direct-deposit/account
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/additional-information/other-payment-options
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/additional-information/supporting-documents
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/additional-information/upload-documents
/family-and-caregiver-benefits/survivor-compensation/apply-for-dic-survivors-pension-accrued-benefits-form-21p-534ez/review-and-submit
```

</details>