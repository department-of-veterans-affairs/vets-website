/**
 * A query to get all benefits hub sidebar machine names
 *
 */
const partialQuery = `
    allSideNavMachineNamesQuery: siteMenus
`;

const GetAllSideNavMachineNames = `
  query {
    ${partialQuery}
  }
`;

module.exports = {
  partialQuery,
  GetAllSideNavMachineNames,
};
