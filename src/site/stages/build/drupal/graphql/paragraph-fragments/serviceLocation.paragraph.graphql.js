/*
*
* A service location for a facility service.
*
 */
module.exports = `
  fieldServiceLocation {
    entity {
      ... on ParagraphServiceLocation {
        fieldServiceLocationAddress {
          entity {
            ... on ParagraphServiceLocationAddress {
              fieldUseFacilityAddress
              fieldClinicName
              fieldBuildingNameNumber
              fieldWingFloorOrRoomNumber
              fieldAddress {
                addressLine1
                addressLine2
                additionalName
                administrativeArea
                postalCode
                locality
                organization
                dependentLocality
                countryCode
                sortingCode
              }
            }
          }
        }
        fieldEmailContacts {
          entity {
            ... on ParagraphEmailContact {
              fieldEmailAddress
              fieldEmailLabel
            }
          }
        }
        fieldFacilityServiceHours {
          value
          caption
          format
        }
        fieldHours
        fieldAdditionalHoursInfo
        fieldPhone {
          entity {
            ... on ParagraphPhoneNumber {
              fieldPhoneExtension
              fieldPhoneLabel
              fieldPhoneNumber
              fieldPhoneNumberType
            }
          }
        }
        fieldUseMainFacilityPhone
      }
    }
  }
`;
