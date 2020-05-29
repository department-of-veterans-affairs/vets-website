/**
 * A Drupal paragraph containing location info.
 *
 */
module.exports = `
  fragment locationInfo on ParagraphLocationInfo {
    fieldAdditionalPhoneNumbers
    fieldAdditionalPhNum1Title
    fieldAdditionalPhNum2Title
    fieldAdditionalPhoneNumber2
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
      dependentLocality
      countryCode
      sortingCode
    }
    fieldAppointmentPhone
    fieldTitle
    fieldExtension
    fieldWysiwyg {
      value
    }
    fieldLocationHours {
      day
      starthours
      endhours
      comment
    }
    fieldMainPhone
    fieldOnlineSchedulingAvailabl
    fieldOperatingStatus
    fieldOperatingStatusNotes {
      value
    }
    fieldReferralRequired
    fieldWalkInsAccepted
  }
`;
