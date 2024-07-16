import maritalStatus from './maritalStatus';
import marriageInfo from './marriageInfo';
import marriageHistory from './marriageHistory';
import spouseInfo from './spouseInfo';
import reasonForCurrentSeparation from './reasonForCurrentSeparation';
import currentSpouseAddress from './currentSpouseAddress';
import currentSpouseMonthlySupport from './currentSpouseMonthlySupport';
import currentSpouseMaritalHistory from './currentSpouseMaritalHistory';
import currentSpouseFormerMarriages from './currentSpouseFormerMarriages';
import hasDependents from './hasDependents';
import dependentChildren from './dependentChildren';
import dependentChildInformation from './dependentChildInformation';
import dependentChildInHousehold from './dependentChildInHousehold';
import dependentChildAddress from './dependentChildAddress';
import { dependentChildrenPages } from './dependentChildrenPages';

export default {
  title: 'Household information',
  pages: {
    maritalStatus,
    marriageInfo,
    marriageHistory,
    spouseInfo,
    reasonForCurrentSeparation,
    currentSpouseAddress,
    currentSpouseMonthlySupport,
    currentSpouseMaritalHistory,
    currentSpouseFormerMarriages,
    ...dependentChildrenPages,
    hasDependents,
    dependentChildren,
    dependentChildInformation,
    dependentChildInHousehold,
    dependentChildAddress,
  },
};
