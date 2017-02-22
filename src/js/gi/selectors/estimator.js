import { createSelector } from 'reselect';

const getConstants = (state) => state.constants.constants;

const getEligibilityDetails = (state) => {
  const details = Object.assign({}, state.eligibility);
  delete details.dropdowns;
  return details;
};

const getRequiredAttributes = (_state, props) => {
  const { type, bah } = props;
  return { type, bah };
};

function getDerivedAttributes(constant, eligibility, institution) {
  const your = eligibility;
  const its = institution;
  let serviceDischarge, vre911Eligible, tier, oldGiBill, onlyVRE, onlyTuitionFees, monthlyRate;

  serviceDischarge = (your.cumulative_service === 'service discharge');

  // VRE and post-9/11 eligibility
  vre911Eligible = (your.gi_bill_chapter === '31' && your.elig_for_post_gi_bill === 'yes');

  // VRE-without-post-911 eligibility
  onlyVRE = (your.gi_bill_chapter === '31' && your.elig_for_post_gi_bill === 'no');

  // Determines benefits tier
  tier = (vre911Eligible || serviceDischarge) ? 1 : Number(your.cumulative_service);

  oldGiBill = (
    your.gi_bill_chapter === '30'
    || your.gi_bill_chapter === '1607'
    || your.gi_bill_chapter === '1606'
    || your.gi_bill_chapter === '35'
  );

  // Determines whether monthly benefit can only be spent on tuition/fees
  const activeDutyThirtyOr1607 = (
    your.military_status === 'active duty' &&
    (your.gi_bill_chapter === '30' || your.gi_bill_chapter === '1607')
  );
  const correspondenceOrFlightUnderOldGiBill = (
    (its.type === 'correspondence' || its.type === 'flight') && oldGiBill === true
  );
  if (activeDutyThirtyOr1607 || correspondenceOrFlightUnderOldGiBill) {
    onlyTuitionFees = true;
  } else {
    onlyTuitionFees = false;
  }

  // The monthly benefit rate for non-chapter 33 benefits
  const isOJT = its.type === 'ojt';
  const isFlight = its.type === 'flight';
  const n = Number(your.number_of_dependents);
  const OJT = isOJT ? 'OJT' : '';
  switch (Number(your.gi_bill_chapter)) {
    case 30:
      if (your.enlistment_service === '3') {
        monthlyRate = isOJT ? constant.MGIB3YRRATE * 0.75 : constant.MGIB3YRRATE;
      } else if (your.enlistment_service === '2') {
        monthlyRate = isOJT ? constant.MGIB2YRRATE * 0.75 : constant.MGIB2YRRATE;
      }
      break;
    case 1607:
      monthlyRate = constant.MGIB3YRRATE * Number(your.consecutive_service);
      if (isOJT) {
        monthlyRate = monthlyRate * 0.75;
      }
      break;
    case 1606:
      monthlyRate = constant.SRRATE;
      if (isOJT) {
        monthlyRate = monthlyRate * 0.75;
      }
      break;
    case 35:
      if (isOJT) {
        monthlyRate = constant.DEARATEOJT;
      } else if (isFlight) {
        monthlyRate = 0;
      } else {
        monthlyRate = constant.DEARATE;
      }
      break;
    case 31:
      if (n <= 2) {
        monthlyRate = constant[`VRE${n}DEPRATE${OJT}`];
      } else {
        monthlyRate = constant[`VRE2DEPRATE${OJT}`] + ((n - 2) * constant[`VREINCRATE${OJT}`]);
      }
      break;
    default:
      monthlyRate = null;
  }

  return {
    serviceDischarge,
    vre911Eligible,
    tier,
    onlyVRE,
    oldGiBill,
    onlyTuitionFees,
    monthlyRate
  };
}

function calculateTuition(constant, eligibility, institution, derived) {
  const your = eligibility;
  const its = institution;
  const chapter = Number(your.gi_bill_chapter);
  const isFlightOrCorrespondence = () => its.type === 'flight' || its.type === 'correspondence';

  if (derived.oldGiBill) {
    return { qualifier: 'per year', value: 0 };
  }
  if (its.type === 'ojt') {
    return { qualifier: null, value: 'N/A' };
  }
  if (chapter === 31) {
    if (isFlightOrCorrespondence()) {
      return { qualifier: 'per year', value: 0 };
    } else {
      return { qualifier: null, value: 'Full Cost' };
    }
  }
  if (its.type === 'flight') {
    return { qualifier: 'per year', value: Math.round(constant.FLTTFCAP * derived.tier) };
  }
  if (its.type === 'correspondence') {
    return { qualifier: 'per year', value: Math.round(constant.CORRESPONDTFCAP * derived.tier) };
  }
  if (its.type === 'public') {
    return { qualifier: '% of instate tuition', value: Math.round(100 * derived.tier) };
  }
  return { qualifier: 'per year', value: Math.round(constant.TFCAP * derived.tier) };
}

function calculateHousing(constant, eligibility, institution, derived) {
  const your = eligibility;
  const its = institution;
  const isFlightOrCorrespondence = () => its.type === 'flight' || its.type === 'correspondence';

  if (your.gi_bill_chapter === '31' && isFlightOrCorrespondence()) {
    return { qualifier: 'per month', value: 0 };
  }
  if (derived.oldGiBill && derived.onlyTuitionFees) {
    return { qualifier: 'per month', value: Math.round(derived.monthlyRate) };
  }
  if (derived.oldGiBill || derived.onlyVRE) {
    return { qualifier: 'per month', value: Math.round(derived.monthlyRate) };
  }
  if (your.military_status === 'active duty') {
    return { qualifier: 'per month', value: 0 };
  }
  if (your.military_status === 'spouse' && your.spouse_active_duty === 'yes') {
    return { qualifier: 'per month', value: 0 };
  }
  if (isFlightOrCorrespondence()) {
    return { qualifier: 'per month', value: 0 };
  }
  if (its.type === 'ojt') {
    return { qualifier: 'per month', value: Math.round(derived.tier * its.bah) };
  }
  if (your.online_classes === 'yes') {
    return { qualifier: 'per month', value: Math.round(derived.tier * constant.AVGBAH / 2) };
  }
  if (its.country !== 'usa') {
    return { qualifier: 'per month', value: Math.round(derived.tier * constant.AVGBAH) };
  }
  return { qualifier: 'per month', value: Math.round(derived.tier * its.bah) };
}

function calculateBooks(constant, eligibility, institution, derived) {
  const your = eligibility;
  const its = institution;
  const isFlightOrCorrespondence = () => its.type === 'flight' || its.type === 'correspondence';

  if (derived.oldGiBill || isFlightOrCorrespondence()) {
    return { qualifier: 'per year', value: 0 };
  }
  if (your.gi_bill_chapter === '31') {
    return { qualifier: null, value: 'Full Cost' };
  }
  return { qualifier: 'per year', value: derived.tier * constant.BSCAP };
}

export const estimatedBenefits = createSelector(
  [getConstants, getEligibilityDetails, getRequiredAttributes],
  (constant, eligibility, attribute) => {
    const derived = getDerivedAttributes(constant, eligibility, attribute);
    const tuition = calculateTuition(constant, eligibility, attribute, derived);
    const housing = calculateHousing(constant, eligibility, attribute, derived);
    const books = calculateBooks(constant, eligibility, attribute, derived);

    return {
      tuition,
      housing,
      books
    };
  }
);
