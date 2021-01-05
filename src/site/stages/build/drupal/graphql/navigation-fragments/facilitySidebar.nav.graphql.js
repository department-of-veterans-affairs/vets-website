/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

const FACILITY_MENU_NAMES = [
  // VISN 4
  'pittsburgh-health-care',
  'va-altoona-health-care',
  'va-butler-health-care',
  'va-coatesville-health-care',
  'va-erie-health-care',
  'va-lebanon',
  'va-philadelphia-health-care',
  'va-wilkes-barre-health-care',
  'va-wilmington-health-care',
  // VISN 19
  'va-cheyenne-health-care',
  'va-eastern-colorado-health-care',
  'va-eastern-oklahoma-health-care',
  'va-montana-health-care',
  'va-oklahoma-health-care',
  'va-salt-lake-city-health-care',
  'va-sheridan-health-care',
  'va-western-colorado-health-care',
  // VISN 1
  'va-bedford-health-care',
  'va-boston-health-care',
  'va-central-western-massachusetts-health-care',
  'va-connecticut-health-care',
  'va-maine-health-care',
  'va-manchester-health-care',
  'va-providence-health-care',
  'va-white-river-junction-health-care',
  // VISN 7
  'va-atlanta-health-care',
  'va-augusta-health-care',
  'va-birmingham-health-care',
  'va-central-alabama-health-care',
  'va-charleston-health-care',
  'va-columbia-south-carolina-health-care',
  'va-dublin-health-care',
  'va-tuscaloosa-health-care',
  // VISN 8
  'va-bay-pines-health-care',
  'va-caribbean-health-care',
  'va-miami-health-care',
  'va-north-florida-health-care',
  'va-orlando-health-care',
  'va-tampa-health-care',
  'va-west-palm-beach-health-care',
  // VISN 20
  'va-alaska-health-care',
  'va-boise-health-care',
  'va-portland-health-care',
  'va-puget-sound-health-care',
  'va-roseburg-health-care',
  'va-southern-oregon-health-care',
  'va-spokane-health-care',
  'va-wallawalla-health-care',
];

const FACILITY_SIDEBAR_QUERY = `
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

let compiledQuery = '';

FACILITY_MENU_NAMES.forEach(facilityMenuName => {
  compiledQuery += `
         ${camelize(
           facilityMenuName,
         )}FacilitySidebarQuery: menuByName(name: "${facilityMenuName}") {
            ${FACILITY_SIDEBAR_QUERY}
         }
        `;
});

module.exports = compiledQuery;
