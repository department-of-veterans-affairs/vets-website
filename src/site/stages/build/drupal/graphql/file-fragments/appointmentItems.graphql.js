/*
*
* Appointments info for a facility service.
*
 */
module.exports = `
  fieldHserviceApptLeadin
  fieldHserviceApptIntroSelect
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
