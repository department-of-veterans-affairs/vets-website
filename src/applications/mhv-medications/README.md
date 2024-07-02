# Prescription Object Documentation


## Overview

The "Prescription" object encapsulates prescription data as it flows through our system, from the API to `vets-api`, and then to `vets-website`. This documentation clarifies each field's name, purpose, intended use, and how data is transformed across layers.

## Purpose
The purpose of this document is to help the front-end developers understand which fields to use for new features and which are currently in use. By mapping this out, it may also help when communicating about certain fields across layers of the stack where a different name may be used.

## Field Descriptions and Transformations

| FE field name | BE field name | API field name | Type |Example | Context | When to use |
|--|--|--|--|--|--|--|
| `prescriptionId` | `prescription_id` | `prescription_id` | number | `22625964` | Auto-generated unique ID for database rows. **NOTE:** This is not the prescription number, which identifies specific medications and are not auto-generated.|Identifying a specific prescription. Use this field when searching in most cases.|
| `prescriptionNumber` | `prescription_number` | `prescription_number` | string| `"2720466B"` | Prescription number specific to medications |Identifying a specific prescription. Used to show the prescription number in the UI in most cases.|
|<span id="prescription-name">`prescriptionName`</span> | `prescription_name` | `drug_name` | string | `"ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB"` | Medication Name | Used to show the prescription name in the UI. For example, the cards on the list page and H1 on details page. For Non-VA prescriptions, see the [orderableItem](#orderable-item) field for a valid fallback option. (Some Non-VA prescriptions don't have a valid `prescriptionName` field.) |
| `prescriptionImage` (not in use)| `prescription_image` | none | string | `"BASE_64_STRING"` | Base 64 image of specific medication | Previously used to add images to PDF's and get around CORS error of including links to the images directly. It is no longer used after removing images from PDF's due to patient safety concern.|
| `refillStatus` | `refill_status` | `status` | string | `"active"` | Status of medication (Active, Inactive, etc) | This field should mostly be avoided and is currently not used in the UI. Instead, we use [dispStatus](#disp-status) in the UI, which represent the status in a more UI-friendly format.|
|<span id="refill-submit-date">`refillSubmitDate`</span>  | `refill_submit_date` | `status` | string/date | `"2024-02-29T14:47:25.000Z"` | TODO: CONFIRM THIS Represents the date a refill request was submitted | Use this field to show when a refill request was submitted. Initial type is a string but can easily be converted to a date object, if needed. Use dateFormat() to format for UI. |
| `refillDate` | `refill_date` | `status` | string/date | `"2024-01-28T05:00:00.000Z"` | Represents the date a refill request was submitted | TODO: FIX THIS **Note:** This is specific to refills, not the original fill. To show when the original fill was requested, use [orderedDate](#ordered-date). |
| `refillRemaining` | `refill_remaining` | `number_of_refills` | number | `3` | Represents the number of refills remaining | Use when showing the number of refills remaining for a specific prescription |
| `facilityName` | `facility_api_name` | `facility_api_name` | string | `"Dayton Medical Center"` | Represents the facility name where prescription was prescribed from | The user-friendly facility name used in the UI. **NOTE:** Avoid using `facility_name` because it is used as a fallback on the back end with this field already.|
| <span id="ordered-date"> `orderedDate`</span>  | `ordered_date` |`issue_date_time` | string/date | `"2023-10-31T04:00:00.000Z"` | Represents the date the original fill was prescribed | Use this field to show when the original fill was prescribed. Initial type is a string but can easily be converted to a date object, if needed. Use dateFormat() to format for UI. **Note:** This is specific to the original fille, not refills. To show when a refill was requested, use [refillSubmitDate](#refill-submit-date). |
| `quantity` | `quantity` | `quantity` | number | `30` | Represents the number of pills, applications, etc. | Use this field to show the quantity of a prescription |
| `expirationDate` | `expiration_date` | `expiration_date` | string/date | `"2024-10-31T04:00:00.000Z"` | Represents the expiration date | Use this field to show the expiration date of a prescription |
| <span id="dispensed-date">`dispensedDate`</span> | `dispensed_date` | `dispensed_date` | string/date | `"2024-10-31T04:00:00.000Z"` | Represents the date a prescription was dispensed | Use this field as a fallback to show when the medication was last dispensed. Use the [sortedDispensedDate](#sorted-dispensed-date) field first, when available. |
| `stationNumber` (not in use) | `station_number` | `stationNumber` | string | `"998"` | Represents the unique identifier used to determine facilities | This field isn't currently used in the UI and most likely wouldn't be displayed. It could be useful for looking up certain facilities using the unique ID. |
| `isRefillable` | `is_refillable` | `refillable` | boolean | `true` | Represents whether a prescription can be refilled | This field would most likely not be used in the UI, but could be used to filter by or search by whether or not a prescription is refillable. |
| `isTrackable` | `is_trackable` | none | boolean | `true` | Represents whether a prescription can be tracked | This field would most likely not be used in the UI, but could be used to filter by or search by whether or not a prescription is trackable (has tracking data). |
| <span id="cmop-ndc-number">`cmopNdcNumber`</span> | `cmop_ndc_number` | `cmop_ndc_number` | string | `"00013264681"` | Represents the CMOP ndc number (unique identifier for??) | TODO: Check what this field is: This field has been used to get a prescription image or retrieve medication insert information for a specific medication. |
| `inCernerTransition` (not in use) | `in_cerner_transition` | none | boolean | `true` | Determines if the prescription belongs to a facility transitioning to Cerner | This field is not currently used but could be used to display Cerner-specific messaging for specific prescriptions |
| `notRefillableDisplayMessage` (not in use) | `not_refillable_display_message` | none | string | `"A refill request cannot be submitted at this time. Please review the prescription status and fill date. If you need more of this medication, please call the pharmacy phone number on your prescription label."` | Represents the message to be displayed when a prescription isn't refillable  | This field should not be used in the UI or on VA.gov. This was previously used on MHV classic to display the message in the UI. |
| `sig` | `sig` | `sig` | string | `"TAKE 1 DAILY FOR 30 DAYS"` | Represents instructions for a prescription | This should be used to display instructions for a prescription in the UI. |
| <span id="cmop-division-phone">`cmopDivisionPhone`</span> | `cmop_division_phone` | `cmop_division_phone` | string | `"(783)272-1072"` | Represents the phone number for a facility | This field should be used first to display a facility phone number in the UI, with [dialCmopDivisionPhone](#dial-cmop-division-phone) used as the fallback value.  |
| `userId` (not in use) | `user_id` | none | number | `17621060` | Represents the ID of the user associated with a prescription | This field is not currently used in the UI and will most likely not be used in the future. |
| `providerFirstName` | `provider_first_name` | `provider_first_name` | string | `"JOHN"` | Represents first name of the doctor who prescribed medication | This field can be used to show the first name of the doctor who prescribed the medication |
| `providerLastName` | `provider_last_name` | `provider_last_name` | string | `"SMITH"` | Represents last name of the doctor who prescribed medication | This field can be used to show the last name of the doctor who prescribed the medication |
| `remarks` | `remarks` | `remarks` | string | `"RENEWED FROM RX # 2720412A"` | Represents remarks made from a provider | Currently this field is used to show part of the "provider notes" for a prescription |
| `divisionName` (not in use) | `division_name` | `division_name` | string | `"DAYTON"` | TODO: CONFIRM THIS Represents a division name for facility | TODO: CONFIRM THIS | This field is currently not in use and there are no current plans to use this field in the future.
| `modifiedDate` (not in use) | `modified_date` | `modified_date` | string/date | `"2024-07-01T14:50:05.000Z"` | Represents the date for when this record was last updated | This field is currently not in use and there are no current plans to use this field in the future. |
| `institutionId` (not in use) | `instution_id` | `instution_id` | number | `10` | Represents the auto-generated ID to the facility where the prescription came from  | This field is currently not in use and there are no current plans to use this field in the future. |
| <span id="dial-cmop-division-phone">`dialCmopDivisionPhone`</span> | `dial_cmop_division_phone` | none | string | `"00172-4266-70"` | Represents the facility phone number | This field should only be used as a fallback if [cmopDivisionPhone](#cmop-division-phone) doesn't exist. |
| <span id="disp-status"> `dispStatus`</span> | `disp_status_status` | `status` | string | `"Active"` | Status of medication (Active, Inactive, etc.) for UI | This field is used to show the status of a medication in the UI.|
| `ndc` (not in use) | `ndc` | `ndc` | string | `"00172-4266-70"` | Represents the NDC number associated with a prescription | This field is currently not in use and there are no current plans to use this field in the future. Currently, we use [cmopNdcNumber](#cmop-ndc-number) for NDC-related lookups. |
| `reason` | `reason` | `reason` | string | `"Rash and other nonspecific skin irritation"` | Represents the reason for prescription | TODO: CONFIRM THIS This field is currently not in use and there are no current plans to use this field in the future. It could be used to represent the reason for a prescription. |
| `prescriptionNumberIndex` | `prescription_number_index` | none | string | unknown | TODO: CONFIRM THIS Represents a value that helps determine the order for a specific refill | This field is currently not in use and there are no current plans to use this field in the future. |
| `prescriptionSource` | `prescription_source` | `prescription_source` | string | `"RX"` | Represents if the prescription is a refill, original fill or "Non-VA" prescription. | Currently, we are just using this field to determine where or not a prescription is "Non-VA" by checking if the value is `NV`. |
| `disclaimer` | `disclaimer` | `disclaimer` | string | `"Non-VA medication recommended by VA provider."` | Represents a disclaimer note made by a provider | Currently this field is used to show part of the "provider notes" for a prescription  |
| `indicationForUse` | `indiciation_for_use` | `indiciation_for_use` | string | `"relieves coughs"` | Represents a valid reason to use a certain prescription (not to be confused with a diagnosis) | This field is currently used to show the reason for use noted by a provider |
| `indicationForUseFlag` (not in use) | `indication_for_use_flag` | `indication_for_use_flag` | string/boolean | `"1"` | Represents if an `indicationForUse` field exists  | This field is currently not in use and there are no current plans to use this field in the future. |
| `category` | `category` | `category` | string | `"Documented By VA"` | Represents the "category" of a medication | This field is currently not in use and there are no current plans to use this field in the future. It appears the options are `"Documented By VA"` if the prescription is Non-VA, otherwise `"Rx Medication"`. This was a field used by MHV classic and will most likely not be used. |
| <span id="orderable-item">`orderableItem`</span> | `orderable_item` | `orderable_item` | string | `"HALCINONIDE"` | Represents a fallback prescription name for Non-VA prescriptions | This field is currently used only as a fallback option if the [prescriptionName](#prescription-name) field does not exist. It should continue to be used only as a fallback for Non-VA prescriptions. |
| <span id="sorted-dispensed-date">`sortedDispensedDate`</span> | `sorted_dispensed_date` | none | string/date | `"2024-06-17"` | Represents the [dispensedDate](#dispensed-date) field using the current sort order | This field is currently used in the UI to represent the date a prescription was dispensed. The [dispensedDate](#dispensed-date) field is used as a fallback. |
|<span id="shape">`shape`</span> | `shape` | `shape` | string | `"OVAL"` | Represents the shape of a prescription when applicable | This field is commonly used along with [color](#color), [frontImprint](#front-imprint) and [backImprint](#back-imprint) to describe a prescription. |
| <span id="color">`color`</span> | `color` | `color` | string | `"WHITE"` | Represents the color of a prescription | This field is commonly used along with [shape](#shape), [frontImprint](#front-imprint) and [backImprint](#back-imprint) to describe a prescription. |
| <span id="front-imprint">`frontImprint`</span> | `front_imprint` | `front_imprint` | string | `"TEVA;3147"` | Represents the information printed on the front of a prescription | This field is commonly used along with [shape](#shape), [color](#color) and [backImprint](#back-imprint) to describe a prescription. |
| <span id="back-imprint">`backImprint`</span> | `back_imprint` | `back_imprint` | string | `"12"` | Represents the information printed on the back of a prescription | This field is commonly used along with [shape](#shape), [frontImprint](#front-imprint) and [color](#color) to describe a prescription. |
| `trackingList` | `tracking_list` | `tracking_list` | array | See [Tracking List Object Example](#tracking-list-object-example) | Represents an array of tracking data for a prescription | This field is used to display tracking information for a prescription |
| `rxRfRecords` | `rx_rf_records` | `rx_rf_records` | array | See [Refill History Object Example](#refill-history-object-example) | Represents an array of refill history data | This field is used to display refill history data for a prescription. **NOTE:** The object at index `0` is the most recent refill.|
| `tracking` (not in use) | `tracking` | `tracking` | boolean | `true` | TODO: CONFIRM THIS Unknown | This field is currently not in use and there are no current plans to use this field in the future. |

### Tracking List Object Example

```
{ 
 "carrier": "USPS", 
 "completeDateTime": 
 "2024-05-28T04:39:11-04:00", 
 "dateLoaded": "2024-04-21T16:55:19-04:00", 
 "divisionPhone": "(401)271-9804", "id": 9878, 
 "isLocalTracking": false, 
 "ndc": "00113002240", 
 "othersInSamePackage": false, 
 "rxNumber": 2719780, 
 "stationNumber": 995, 
 "trackingNumber": "332980271979930000002300", 
 "viewImageDisplayed": false 
}
```

### Refill History Object Example

```
{
  "refillStatus": "suspended",
  "refillSubmitDate": null,
  "refillDate": "Sat, 15 Jul 2023 00:00:00 EDT",
  "refillRemaining": 4,
  "facilityName": "DAYT29",
  "isRefillable": false,
  "isTrackable": false,
  "prescriptionId": 22332828,
  "sig": null,
  "orderedDate": "Fri, 04 Aug 2023 00:00:00 EDT",
  "quantity": null,
  "expirationDate": null,
  "prescriptionNumber": "2720542",
  "prescriptionName": "ONDANSETRON 8 MG TAB",
  "dispensedDate": null,
  "stationNumber": "989",
  "inCernerTransition": false,
  "notRefillableDisplayMessage": null,
  "cmopDivisionPhone": null,
  "cmopNdcNumber": null,
  "id": 22332828,
  "userId": 16955936,
  "providerFirstName": null,
  "providerLastName": null,
  "remarks": null,
  "divisionName": null,
  "modifiedDate": null,
  "institutionId": null,
  "dialCmopDivisionPhone": "",
  "dispStatus": "Suspended",
  "ndc": null,
  "reason": null,
  "prescriptionNumberIndex": "RF1",
  "prescriptionSource": "RF",
  "disclaimer": null,
  "indicationForUse": null,
  "indicationForUseFlag": null,
  "category": "Rx Medication",
  "trackingList": null,
  "rxRfRecords": null,
  "tracking": false
}
```

