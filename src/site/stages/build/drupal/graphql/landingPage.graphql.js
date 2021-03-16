const fragments = require('./fragments.graphql');

// String Helpers
const {
  updateQueryString,
  queryParamToBeChanged,
} = require('./../../../../utilities/stringHelpers');

const entityElementsFromPages = require('./entityElementsForPages.graphql');
const { FIELD_PROMO } = require('./block-fragments/promo.block.graphql');
const {
  FIELD_RELATED_LINKS,
} = require('./paragraph-fragments/listOfLinkTeasers.paragraph.graphql');
const { FIELD_ALERT } = require('./block-fragments/alert.block.graphql');

/**
 * The top-level page for a section of the website.
 * Examples include /health-care/, /disability/, etc.
 */
const ADMIN = '...administration';

const landingPageFragment = `
  fragment landingPage on NodeLandingPage {
    ${entityElementsFromPages}
    fieldIntroText
    ${FIELD_PROMO}
    ${FIELD_RELATED_LINKS}
    ${FIELD_ALERT}
    fieldTitleIcon
    fieldSpokes {
      entity {
        ...listOfLinkTeasers
      }
    }
    fieldLinks { title url { path } }
    fieldSupportServices {
      ...on FieldNodeFieldSupportServices {
        entity {
          entityId
          entityBundle
          ...on NodeSupportService {
            entityId
            entityBundle
            title
            fieldLink {
              url {
                path
              }
              title
              options
            }
            fieldPhoneNumber
          }
        }
      }
    }
    fieldPlainlanguageDate {
      value
      date
    }
    fieldPageLastBuilt {
      date
    }
    fieldTeaserText
    changed
    ${ADMIN}
  }
`;

let regString = '';
queryParamToBeChanged.forEach(param => {
  regString += `${param}|`;
});

const regex = new RegExp(`${regString}`, 'g');
const landingPageFragmentModified = landingPageFragment.replace(
  regex,
  updateQueryString,
);

const GetNodeLandingPages = `
  ${fragments.administration}
  ${fragments.alert}
  ${fragments.promo}
  ${fragments.listOfLinkTeasers}
  ${fragments.linkTeaser}

  ${landingPageFragmentModified}

  query GetNodeLandingPages($onlyPublishedContent: Boolean!) {
    nodeQuery(limit: 1000, filter: {
      conditions: [
        { field: "status", value: ["1"], enabled: $onlyPublishedContent },
        { field: "type", value: ["landing_page"] }
      ]
    }) {
      entities {
        ... landingPage
      }
    }
  }
`;

module.exports = {
  fragment: landingPageFragment,
  modifiedFragment: landingPageFragmentModified,
  GetNodeLandingPages,
};
