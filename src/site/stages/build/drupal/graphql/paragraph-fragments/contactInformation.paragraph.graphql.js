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
