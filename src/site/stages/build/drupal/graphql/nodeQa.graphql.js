const entityElementsFromPages = require('./entityElementsForPages.graphql');

const fragment = `
fragment nodeQa on NodeQA {
  ${entityElementsFromPages}
  entityBundle

  changed
  fieldAnswer {
    entity {
      entityType
      entityBundle
      ... richTextCharLimit1000
      ... reactWidget
    }
  }
  fieldAlertSingle {
    entity {
      ... alertSingle
    }
  }
  fieldButtons {
    entity {
      ... button
    }
  }
  fieldRelatedBenefitHubs {
    entity {
      ... on NodeLandingPage {
        fieldSupportServices {
          entity {
            ... supportService
          }
        }
      }
    }
  }
  fieldRelatedInformation {
    entity {
      ... linkTeaser
    }
  }
}
`;

module.exports = fragment;
