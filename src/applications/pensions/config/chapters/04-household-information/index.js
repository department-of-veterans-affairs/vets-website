import maritalStatus from './maritalStatus';
import marriageInfo from './marriageInfo';
import marriageHistory from './marriageHistory';
import spouseInfo from './spouseInfo';
import reasonForCurrentSeparation from './reasonForCurrentSeparation';
import currentMarriageInformation from './currentMarriageInformation';
import currentSpouseInformation from './currentSpouseInformation';
import currentSpouseVeteranInformation from './currentSpouseVeteranInformation';
import currentSpouseAddress from './currentSpouseAddress';
import currentSpouseName from './currentSpouseName';
import livesWithCurrentSpouse from './livesWithCurrentSpouse';
import currentSpouseAddressV2 from './currentSpouseAddressV2';
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
    // -------------------------------------------------------------------------
    // Marriages
    // Legacy and simplified marriage flows toggled by showMultiplePageResponse
    // Note: Order matters: later pages assume earlier formData exists.
    // -------------------------------------------------------------------------
    maritalStatus, // Shared entry point (always included)

    // -------------------------------------------------------------------------
    // Legacy marriage flow (showMultiplePageResponse = false)
    // -------------------------------------------------------------------------
    marriageInfo, // legacy-only
    marriageHistory, // legacy-only
    spouseInfo, // legacy-only

    // -------------------------------------------------------------------------
    // New simplified marriage flow (showMultiplePageResponse = true)
    // These pages replace the legacy marriageInfo/marriageHistory/spouseInfo set.
    // -------------------------------------------------------------------------
    currentMarriageInformation,
    currentSpouseName,
    currentSpouseInformation,
    currentSpouseVeteranInformation,
    livesWithCurrentSpouse,
    currentSpouseAddressV2,

    // -------------------------------------------------------------------------
    // Shared pages that apply after either marriage flow completes
    // -------------------------------------------------------------------------
    reasonForCurrentSeparation, // shared (both flows): only relevant when separated
    currentSpouseAddress, // legacy-only: spouse address page used by the legacy flow
    currentSpouseMonthlySupport, // shared (both flows): only relevant when not living together

    // -------------------------------------------------------------------------
    // Downstream marriage history (currently legacy-aligned)
    // Consider later: whether these become shared/new once the simplified flow expands.
    // -------------------------------------------------------------------------
    currentSpouseMaritalHistory, // legacy-aligned for now
    currentSpouseFormerMarriages, // legacy-aligned for now

    // -------------------------------------------------------------------------
    // Dependents
    // Legacy and simplified dependents flows toggled by showMultiplePageResponse
    // -------------------------------------------------------------------------
    ...dependentChildrenPages, // New simplified dependents flow (showMultiplePageResponse = true)

    // -------------------------------------------------------------------------
    // Legacy dependents flow (showMultiplePageResponse = false)
    // Order matters: later pages assume earlier formData exists.
    // -------------------------------------------------------------------------
    hasDependents, // legacy-only
    dependentChildren, // legacy-only
    dependentChildInformation, // legacy-only
    dependentChildInHousehold, // legacy-only
    dependentChildAddress, // legacy-only
  },
};
