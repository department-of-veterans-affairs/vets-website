/**
 * A Drupal paragraph containing location info.
 *
 */
module.exports = `
  fragment locationInfo on ParagraphLocationInfo {
    fieldPhoneNumbersParagraph {
      entity {
        ... on ParagraphPhoneNumbers {
          fieldPhoneNumber
          fieldPhoneExtension
          fieldFax
          fieldSmsNumber
          fieldTtyNumber
        }
      }
    }
    fieldAppointmentPhoneNumbers {
      entity {
        ... on ParagraphPhoneNumbers {
          fieldPhoneNumber
          fieldPhoneExtension
          fieldFax
          fieldSmsNumber
          fieldTtyNumber
        }
      }
    }
    fieldLink {
      title
      url {
        path
      }
    }
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
    fieldTitle
    fieldLocationHours {
      day
      starthours
      endhours
      comment
    }
    fieldFacilityDescription
    fieldOnlineSchedulingAvailabl
    fieldOperatingStatus
    fieldOperatingStatusInfo
    fieldReferralRequired
    fieldWalkInsAccepted
  }
`;
