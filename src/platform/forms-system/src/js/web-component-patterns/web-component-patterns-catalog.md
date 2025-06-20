<!-- This file is auto-generated. Do not edit directly. -->
# Web component patterns catalog

All patterns are imported from 'platform/forms-system/src/js/web-component-patterns'.

## Address

- `addressUI` (function) — uiSchema for address - includes checkbox for military base, and fields for country, street, street2, street3, city, state, postal code. Fields may be omitted.
- `addressSchema` (function) — Schema for addressUI. Fields may be omitted.
- `addressNoMilitaryUI` (function) — uiSchema for address - Without checkbox for military base. Only fields for country, street, street2, street3, city, state, postal code. Fields may be omitted.
- `addressNoMilitarySchema` (function) — Schema for addressNoMilitaryUI. Fields may be omitted.

## Arn

- `arnUI` (function) — uiSchema for Alien registration number (ARN)
- `arnSchema` (object) — schema for arnUI
- `arnOrVaFileNumberUI` (function) — uiSchema for Alien registration number or VA File Number. Includes two fields.
- `arnOrVaFileNumberSchema` (object) — Schema for arnOrVaFileNumberUI

## ArrayBuilder

- `arrayBuilderItemFirstPageTitleUI` (function) — Title for the first page of an item in an array builder
- `arrayBuilderItemSubsequentPageTitleUI` (function) — Title for the top of a subsequent page (not the first) of an item in array builder pattern
- `arrayBuilderYesNoUI` (function) — uiSchema for the yes/no question in an array builder summary page. Includes array builder options, options when no cards are present, and options when cards are present.
- `arrayBuilderYesNoSchema` (object) — schema for arrayBuilderYesNoUI

## Bank

- `bankAccountUI` (function) — uiSchema for bank account information. Includes fields for account type, account number, routing number, and bank name. Bank name may be omitted.
- `bankAccountSchema` (function) — schema for bankAccountUI

## CheckboxGroup

- `checkboxGroupUI` (function) — uiSchema for checkbox group. Includes title and labels.
- `checkboxGroupSchema` (function) — schema for checkboxGroupUI

## Currency

- `currencyUI` (function) — uiSchema for currency based input which uses VaTextInputField
- `currencySchema` (object) — schema for currencyUI with type number
- `currencyStringSchema` (object) — schema for currencyUI with type string

## Date

- `currentOrPastDateUI` (function) — uiSchema for a generic current or past date
- `currentOrPastDateDigitsUI` (function) — uiSchema for current or past dates with digit select for month
- `currentOrPastDateRangeUI` (function) — uiSchema for a "from" and "to" date range with current or past dates. Includes two fields.
- `currentOrPastMonthYearDateUI` (function) — uiSchema for a current or past month and year
- `currentOrPastMonthYearDateRangeUI` (function) — uiSchema for month and year only date range. Includes two fields for "from" and "to" dates.
- `dateOfBirthUI` (function) — uiSchema for date of birth
- `dateOfDeathUI` (function) — uiSchema for date of death
- `currentOrPastDateRangeSchema` (object) — Schema for currentOrPastDateRangeUI
- `currentOrPastDateSchema` (object)
- `currentOrPastDateDigitsSchema` (object)
- `currentOrPastMonthYearDateSchema` (object)
- `currentOrPastMonthYearDateRangeSchema` (object) — Schema for currentOrPastMonthYearDateRangeUI
- `dateOfBirthSchema` (object)
- `dateOfDeathSchema` (object)

## Email

- `emailUI` (function) — uiSchema for email
- `emailToSendNotificationsUI` (function) — uiSchema for email which also has an additional hint explaining it will be used for notifications about form submission. Preferred if it is the only email field in the form. Generally required.
- `emailSchema` (object) — schema for emailUI
- `emailToSendNotificationsSchema` (object) — schema for emailToSendNotificationsUI

## FileInput

- `fileInputUI` (function) — uiSchema for file input field
- `fileInputSchema` (object) — Schema for fileInputUI

## FullName

- `fullNameNoSuffixUI` (function) — uiSchema for `first`, `middle`, and `last name`
- `firstNameLastNameNoSuffixUI` (function) — uiSchema for `first` and `last name` only
- `fullNameWithMaidenNameUI` (function) — uiSchema for `first`, `middle`, `last name`, `suffix`, and `maiden name`
- `fullNameUI` (function) — uiSchema for `first`, `middle`, `last name`, and `suffix`
- `firstNameLastNameUI` (function) — uiSchema for `first`, `last name`, and `suffix`
- `fullNameSchema` (object) — schema for `fullNameUI`
- `firstNameLastNameSchema` (object)
- `fullNameNoSuffixSchema` (object) — schema for `fullNameNoSuffixUI`
- `firstNameLastNameNoSuffixSchema` (object)
- `fullNameWithMaidenNameSchema` (object) — schema for `fullNameWithMaidenNameUI`

## Number

- `numberUI` (function) — uiSchema for a number based input which uses VaTextInputField
- `numberSchema` (object) — schema for numberUI

## Phone

- `phoneUI` (function) — uiSchema for a phone number - a single text input field
- `internationalPhoneUI` (function) — Web component v3 uiSchema for international phone number
- `phoneSchema` (object)
- `internationalPhoneSchema` (object) — It allows optional dashes in between

## Radio

- `radioUI` (function) — uiSchema for generic radio field
- `radioSchema` (function) — schema for radioUI

## RelationshipToVeteran

- `relationshipToVeteranUI` (function) — uiSchema for relationship to veteran. Includes spouse, child, parent, executor, and other fields
- `relationshipToVeteranSpouseOrChildUI` (function) — uiSchema for relationship to veteran, specifically for spouse or child
- `claimantRelationshipToVeteranSpouseOrChildUI` (function) — uiSchema for claimant relationship to veteran, specifically for spouse or child
- `relationshipToVeteranSchema` (object)
- `relationshipToVeteranSpouseOrChildSchema` (object)

## Select

- `selectUI` (function) — uiSchema for generic select field
- `selectSchema` (function) — schema for selectUI

## Ssn

- `ssnUI` (function) — uiSchema for Social Security number field
- `ssnSchema` (object) — Schema for ssnUI
- `vaFileNumberUI` (function) — uiSchema for VA File Number
- `vaFileNumberSchema` (object) — Schema for vaFileNumberUI
- `serviceNumberUI` (function) — uiSchema for Service Number
- `serviceNumberSchema` (object) — Schema for serviceNumberUI
- `ssnOrVaFileNumberUI` (function) — uiSchema for Social Security number or VA File Number. Includes two fields, and a hint about entering either or.
- `ssnOrVaFileNumberSchema` (object) — Schema for ssnOrVaFileNumberUI
- `ssnOrVaFileNumberNoHintUI` (function) — uiSchema for Social Security number or VA File Number. Should be used with a description above the fields such as: "You must enter a Social Security number or VA file number"
- `ssnOrVaFileNumberNoHintSchema` (object) — Schema for ssnOrVaFileNumberNoHintUI
- `ssnOrServiceNumberSchema` (object) — Schema ssnOrServiceNumberUI

## Text

- `textUI` (function) — uiSchema for generic text input field
- `textSchema` (object) — Schema textUI
- `textareaUI` (function) — uiSchema for generic textarea input field
- `textareaSchema` (object) — Schema for textareaUI

## Title

- `titleUI` (function) — uiSchema title for the form page, which appears at the top of the page, implemented with object spread into the uiSchema like such: ...titleUI('title')
- `descriptionUI` (function) — uiSchema for a description. Prefer to use second argument of titleUI instead.
- `inlineTitleUI` (function) — uiSchema for an inline title for (in the middle of) a form page. Try not to use this.
- `titleSchema` (object)
- `inlineTitleSchema` (object)
- `descriptionSchema` (object)

## YesNo

- `yesNoUI` (function) — uiSchema for yes or no questions. yesNoUI is an abstraction of radioUI tailored for binary yes/no questions.
- `yesNoSchema` (object)

