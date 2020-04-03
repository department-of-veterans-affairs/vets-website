/**
 * The sidebar navigation menu from Drupal for display on basic pages
 */
const { cmsFeatureFlags } = global;

const hubNavNames = cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS
  ? require('../../../../../utilities/query-params/hubNavNames')
  : null;

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

const SIDEBAR_QUERY = `
        name
        description
        links {
          label
          expanded
          description
          url {
            path
          }
          links {
            label
            expanded
            description
            url {
              path
            }
            links {
              label
              expanded
              description
              url {
                path
              }
              links {
                label
                expanded
                description
                url {
                  path
                }
                links {
                  label
                  expanded
                  description
                  url {
                    path
                  }
                  links {
                    label
                    expanded
                    description
                    url {
                      path
                    }
                  }
                }
              }
            }
          }
    }
`;

function queryFilter(menuName) {
  return `
      menuByName(name: "${menuName}")
    `;
}

if (cmsFeatureFlags.FEATURE_ALL_HUB_SIDE_NAVS && hubNavNames !== null) {
  let compiledQuery = '';
  hubNavNames.forEach(navName => {
    compiledQuery += `
         ${camelize(navName)}Query: ${queryFilter(navName)} {
            ${SIDEBAR_QUERY}
         }
        `;
  });
  module.exports = compiledQuery;
} else {
  module.exports = `
    burialsAndMemorialsBenefQuery: ${queryFilter(
      'burials-and-memorials-benef',
    )} {
      ${SIDEBAR_QUERY}
    }
    careersEmploymentBenefitsQuery: ${queryFilter(
      'careers-employment-benefits',
    )} {
      ${SIDEBAR_QUERY}
    }
    decisionReviewsBenefitsHQuery: ${queryFilter(
      'decision-reviews-benefits-h',
    )} {
      ${SIDEBAR_QUERY}
    }
    disabilityBenefitsHubQuery: ${queryFilter('disability-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    educationBenefitsHubQuery: ${queryFilter('education-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    healthCareBenefitsHubQuery: ${queryFilter('health-care-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    housingAssistanceBenefitsQuery: ${queryFilter(
      'housing-assistance-benefits',
    )} {
      ${SIDEBAR_QUERY}
    }
    lifeInsuranceBenefitsHubQuery: ${queryFilter(
      'life-insurance-benefits-hub',
    )} {
      ${SIDEBAR_QUERY}
    }
    pensionBenefitsHubQuery: ${queryFilter('pension-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    recordsBenefitsHubQuery: ${queryFilter('records-benefits-hub')} {
      ${SIDEBAR_QUERY}
    }
    decisionReviewsHubQuery: ${queryFilter('decision-reviews-benefits-h')} {
      ${SIDEBAR_QUERY}
    }
`;
}
