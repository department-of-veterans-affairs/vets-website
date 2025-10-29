import { PICKLIST_DATA } from '../../config/constants';

import spouseReasonToRemove from './spouseReasonToRemove';
import spouseMarriageEnded from './spouseMarriageEnded';
import spouseDeath from './spouseDeath';

import childIsStepChild from './childIsStepchild';
import childReasonToRemove from './childReasonToRemove';
import childMarriage from './childMarriage';
import childDeath from './childDeath';

import parentReasonToRemove from './parentReasonToRemove';
import parentDeath from './parentDeath';
import parentOther from './parentOther';
import parentOtherExit from './parentOtherExit';

/**
 * Picklist routing object - routing to remove dependent followup pages based on
 * relationship
 * @typedef {object} Routing
 * @property {Array} Spouse The array of spouse followup pages
 * @property {Array} Child The array of child followup pages
 * @property {Array} Parent The array of parent followup pages
 */
export const routing = {
  Spouse: [
    { path: 'spouse-reason-to-remove', page: spouseReasonToRemove },
    { path: 'spouse-marriage-ended', page: spouseMarriageEnded },
    { path: 'spouse-death', page: spouseDeath },
  ],

  Child: [
    { path: 'is-stepchild', page: childIsStepChild },
    { path: 'child-reason-to-remove', page: childReasonToRemove },
    { path: 'child-marriage', page: childMarriage },
    { path: 'child-death', page: childDeath },
  ],

  Parent: [
    { path: 'parent-reason-to-remove', page: parentReasonToRemove },
    { path: 'parent-death', page: parentDeath },
    { path: 'parent-other', page: parentOther },
    { path: 'parent-exit', page: parentOtherExit },
  ],
};

/**
 * Picklist paths - the flat array of all possible followup pages
 * @typedef {Array} Paths
 * @property {string} type - The dependent relationship type
 * @property {string} path - The path of the followup page
 * @property {number} index - The index of the dependent in the picklist data
 */
/**
 * Get the full picklist paths based on form data choices; updated on page
 * submission
 * @param {Object} fullData - The full form data
 * @param {Object} routes - The routes object, added as a parameter for testing
 * @returns {Paths} - The full picklist paths
 */
export const getPicklistRoutes = (fullData, routes = routing) =>
  (fullData?.[PICKLIST_DATA] || [])
    .flatMap((itemData, index) => {
      const result = [];
      if (itemData.selected) {
        const dependentType = itemData.relationshipToVeteran;
        const dependentRoutes = routes[dependentType] || [];

        const getDependentRoute = nextPage =>
          dependentRoutes.find(page => page.path === nextPage) ||
          dependentRoutes[0];
        let nextPage = dependentRoutes[0].path || '';
        result.push({ type: dependentType, path: nextPage, index });

        do {
          const dependentRoute = getDependentRoute(nextPage);
          nextPage =
            dependentRoute?.page.handlers.goForward({
              itemData,
              index,
              fullData,
            }) || '';
          if (nextPage && nextPage !== 'DONE') {
            result.push({ type: dependentType, path: nextPage, index });
          }
        } while (nextPage && nextPage !== 'DONE');
      }

      return result;
    })
    .filter(Boolean);
