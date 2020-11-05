/*
*
* Appointments info for a facility service.
*
 */
module.exports = `
  fieldOnlineSchedulingAvailabl
  fieldReferralRequired
  fieldWalkInsAccepted
  fieldPhoneNumbersParagraph {
    entity {
      ... on ParagraphPhoneNumber {
        fieldPhoneExtension
        fieldPhoneLabel
        fieldPhoneNumber
        fieldPhoneNumberType
      }
    }
  }
`;
