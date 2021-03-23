/**
 * The sidebar navigation menu from Drupal for display on health care facility pages
 *
 */

// String Helpers
const { camelize } = require('./../../../../../utilities/stringHelpers');

const FACILITY_MENU_NAMES = [
  // VISN 1
  'va-bedford-health-care',
  'va-boston-health-care',
  'va-central-western-massachusetts-health-care',
  'va-connecticut-health-care',
  'va-maine-health-care',
  'va-manchester-health-care',
  'va-providence-health-care',
  'va-white-river-junction-health-c',
  // VISN-2
  'va-albany-health-care',
  'va-bronx-health-care',
  'va-finger-lakes-health-care',
  'va-hudson-valley-health-care',
  'va-new-jersey-health-care',
  'va-new-york-harbor-health-care',
  'va-northport-health-care',
  'va-syracuse-health-care',
  'va-western-new-york-health-care',
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
  // VISN 6
  'va-asheville-health-care',
  'va-durham-health-care',
  'va-fayetteville-coastal-health-c',
  'va-hampton-health-care',
  'va-richmond-health-care',
  'va-salem-health-care',
  'va-salisbury-health-care',
  // VISN 7
  'va-atlanta-health-care',
  'va-augusta-health-care',
  'va-birmingham-health-care',
  'va-central-alabama-health-care',
  'va-charleston-health-care',
  'va-columbia-south-carolina-healt',
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
  // VISN 16
  'va-alexandria-health-care',
  'va-central-arkansas-health-care',
  'va-fayetteville-arkansas-health-',
  'va-gulf-coast-health-care',
  'va-houston-health-care',
  'va-jackson-health-care',
  'va-shreveport-health-care',
  'va-southeast-louisiana-health-ca',
  // VISN 19
  'va-cheyenne-health-care',
  'va-eastern-colorado-health-care',
  'va-eastern-oklahoma-health-care',
  'va-montana-health-care',
  'va-oklahoma-health-care',
  'va-salt-lake-city-health-care',
  'va-sheridan-health-care',
  'va-western-colorado-health-care',
  // VISN 20
  'va-alaska-health-care',
  'va-boise-health-care',
  'va-portland-health-care',
  'va-puget-sound-health-care',
  'va-roseburg-health-care',
  'va-southern-oregon-health-care',
  'va-spokane-health-care',
  'va-wallawalla-health-care',
  // VISN 21
  'va-central-california-health-car',
  'va-northern-california-health-ca',
  'va-pacific-islands-health-care',
  'va-palo-alto-health-care',
  'va-san-francisco-health-care',
  'va-sierra-nevada-health-care',
  'va-southern-nevada-health-care',
  // VISN 22
  'va-greater-los-angeles-health-ca',
  'va-loma-linda-health-care',
  'va-long-beach-health-care',
  'va-new-mexico-health-care',
  'va-northern-arizona health-care',
  'va-phoenix-health-care',
  'va-san-diego-health-care',
  'va-southern-arizona-health-care',
  // VISN 23
  'va-black-hills-health-care',
  'va-central-iowa-health-care',
  'va-fargo-health-care',
  'va-iowa-city-health-care',
  'va-minneapolis-health-care',
  'va-nebraska-western-iowa-health-',
  'va-sioux-falls-health-care',
  'va-st-cloud-health-care',
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

const VaFacilitySidebars = {};
let compiledQuery = '';

FACILITY_MENU_NAMES.forEach(facilityMenuName => {
  const facilityMenuNameCamel = camelize(facilityMenuName);
  const operationName = `${facilityMenuNameCamel}FacilitySidebarQuery`;
  const nextSidebar = `
      ${operationName}: menuByName(name: "${facilityMenuName}") {
        ${FACILITY_SIDEBAR_QUERY}
      }
    `;

  compiledQuery += nextSidebar;

  VaFacilitySidebars[`GetFacilitySidebar__${operationName}`] = `
      query {
        ${nextSidebar}
      }
  `;
});

module.exports = {
  partialQuery: compiledQuery,
  VaFacilitySidebars,
};
