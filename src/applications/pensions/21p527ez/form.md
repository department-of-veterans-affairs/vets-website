# Applicant information
## Applicant information
Path: applicant/information

## Mailing address
Path: applicant/mail-address

## Contact information
Path: applicant/contact

# Military history
## Service period
Path: military/history

## General history
Path: military/general

## Previous names
Path: military/general/add

Depends: doesHavePreviousNames

## POW status
Path: military/pow

# Health and employment information
## Age
Path: medical/history/age

## Social Security disability
Path: medical/history/social-security-disability

Depends: depends

## Medical condition
Path: medical/history/condition

Depends: hasNoSocialSecurityDisability

## Nursing home information
Path: medical/history/nursing-home

## Medicaid coverage
Path: medical/history/nursing/medicaid

Depends: isInNursingHome

## Medicaid application status
Path: medical/history/nursing/medicaid/status

Depends: medicaidDoesNotCoverNursingHome

## Special monthly pension
Path: medical/history/monthly-pension

## Treatment from a VA medical center
Path: medical/history/va-treatment

## VA medical centers
Path: medical/history/va-treatment/medical-centers

Depends: hasVaTreatmentHistory

## Treatment from federal medical facilities
Path: medical/history/federal-treatment

## Federal medical facilities
Path: medical/history/federal-treatment/medical-centers

Depends: hasFederalTreatmentHistory

## Current employment
Path: employment/current

Depends: isUnder65

## Current employment
Path: employment/current/history

Depends: isEmployedUnder65

## Previous employment
Path: employment/previous/history

Depends: isUnemployedUnder65

# Household information
## Marital status
Path: household/marital-status

## Marriage history
Path: household/marriage-info

Depends: isMarried

## First marriage
Path: household/marriages/:index

Depends: isMarried

## Spouse information
Path: household/spouse-info

Depends: isMarried

## Reason for separation
Path: household/marital-status/separated

Depends: isSeparated

## Spouse address
Path: household/marital-status/separated/spouse-address

Depends: showSpouseAddress

## Financial support for your spouse
Path: household/marital-status/separated/spouse-monthly-support

Depends: isSeparated

## Current spouse marital history
Path: household/marital-status/spouse-marital-history

Depends: isMarried

## Spouse’s former marriages
Path: household/marital-status/spouse-marriages

Depends: currentSpouseHasFormerMarriages

## Dependents
Path: household/dependents

## Dependent children
Path: household/dependents/add

Depends: doesHaveDependents

## Firstname Lastname information
Path: household/dependents/children/information/:index

Depends: doesHaveDependents

## Firstname Lastname household
Path: household/dependents/children/inhousehold/:index

Depends: doesHaveDependents

## Firstname Lastname address
Path: household/dependents/children/address/:index

Depends: dependentIsOutsideHousehold

# Financial information
## Total net worth
Path: financial/total-net-worth

## Net worth estimation
Path: financial/net-worth-estimation

Depends: depends

## Transferred assets
Path: financial/transferred-assets

## Home ownership
Path: financial/home-ownership

## Home acreage size
Path: financial/home-ownership/acres

Depends: ownsHome

## Home acreage value
Path: financial/home-ownership/acres/value

Depends: isHomeAcreageMoreThanTwo

## Land marketable
Path: financial/land-marketable

Depends: isHomeAcreageMoreThanTwo

## Receives income
Path: financial/receives-income

## Gross monthly income
Path: financial/income-sources

Depends: doesReceiveIncome

## Care expenses
Path: financial/care-expenses

## Unreimbursed care expenses
Path: financial/care-expenses/add

Depends: doesHaveCareExpenses

## Medical expenses and other unreimbursed expenses
Path: financial/medical-expenses

## Medical expenses and other unreimbursed expenses
Path: financial/medical-expenses/add

Depends: doesHaveMedicalExpenses

# Additional information
## Direct deposit for Veterans Pension benefits
Path: additional-information/direct-deposit

## Account information for direct deposit
Path: additional-information/account-information

Depends: usingDirectDeposit

## Other payment options
Path: additional-information/other-payment-options

Depends: depends

## Supporting documents
Path: additional-information/supporting-documents

## Document upload
Path: additional-information/document-upload

## Faster claim processing
Path: additional-information/faster-claim-processing

