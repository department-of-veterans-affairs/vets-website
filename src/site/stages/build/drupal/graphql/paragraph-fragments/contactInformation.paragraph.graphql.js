module.exports = `
  fragment contactInformation on ParagraphContactInformation {
    fieldBenefitHubContacts {
      entity {
        ... on NodeLandingPage {
          fieldHomePageHubLabel
          fieldTeaserText
          path {
            alias
          }
          fieldSupportServices {
            entity {
              ... supportService
            }
          }
        }
      }
    }
    fieldContactInfoSwitch
    fieldContactDefault {
      entity {
        ... supportService
      }
    }
    fieldAdditionalContact {
      entity {
        entityBundle
        ... emailContact
        ... phoneNumber
      }
    }
  }
`;
