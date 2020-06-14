/**
 * A Drupal paragraph containing location info.
 *
 */
module.exports = `
  fragment locationInfo on ParagraphLocationInfo {
    fieldPhoneNumbersParagraph {
      entity {
        ... on ParagraphPhoneNumbers {
          fieldNumberType
          fieldOptionalPhoneLabel
          fieldPhoneNumber
          fieldPhoneExtension
        }
      }
    }
    fieldAppointmentPhoneNumbers {
      entity {
        ... on ParagraphPhoneNumbers {
          fieldNumberType
          fieldOptionalPhoneLabel
          fieldPhoneNumber
          fieldPhoneExtension
        }
      }
    }
    fieldLink {
      title
      url {
        path
      }
    }
    fieldUseFacilityAddress
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
