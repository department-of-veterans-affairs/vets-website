import { createSelector } from 'reselect';

const getConstants = state => state.constants.constants;

const getEligibilityDetails = state => state.eligibility;

const getRequiredAttributes = (state, props) => {
  const { type, bah, dodBah, country } = props.institution;
  return {
    type: type && type.toLowerCase(),
    bah,
    dodBah,
    country: country && country.toLowerCase(),
  };
};

export function getDerivedAttributes(constant, eligibility, institution) {
  const your = eligibility;
  const its = institution;
  const chapter = Number(your.giBillChapter);
  let monthlyRate;

  const serviceDischarge = your.cumulativeService === 'service discharge';
  const purpleHeart = your.cumulativeService === 'purple heart';

  // VRE and post-9/11 eligibility
  const vre911Eligible = chapter === 31 && your.eligForPostGiBill === 'yes';

  // VRE-without-post-911 eligibility
  const onlyVRE = chapter === 31 && your.eligForPostGiBill === 'no';

  // Determines benefits tier
  const tier =
    vre911Eligible || serviceDischarge || purpleHeart
      ? 1
      : Number(your.cumulativeService);

  const isFlightOrCorrespondence =
    its.type === 'flight' || its.type === 'correspondence';

  const oldGiBill = chapter === 30 || chapter === 1606 || chapter === 35;

  // Determines whether monthly benefit can only be spent on tuition/fees
  const activeDutyThirty =
    your.militaryStatus === 'active duty' && chapter === 30;
  const correspondenceOrFlightUnderOldGiBill =
    (its.type === 'correspondence' || its.type === 'flight') &&
    oldGiBill === true;
  const onlyTuitionFees =
    activeDutyThirty || correspondenceOrFlightUnderOldGiBill;

  // The monthly benefit rate for non-chapter 33 benefits
  const isOJT = its.type === 'ojt';
  const isFlight = its.type === 'flight';
  const n = Number(your.numberOfDependents);
  const OJT = isOJT ? 'OJT' : '';
  switch (chapter) {
    case 30:
      if (your.enlistmentService === '3') {
        monthlyRate = isOJT
          ? constant.MGIB3YRRATE * 0.75
          : constant.MGIB3YRRATE;
      } else if (your.enlistmentService === '2') {
        monthlyRate = isOJT
          ? constant.MGIB2YRRATE * 0.75
          : constant.MGIB2YRRATE;
      }
      break;
    case 1606:
      monthlyRate = constant.SRRATE;
      if (isOJT) {
        monthlyRate *= 0.75;
      }
      break;
    case 35:
      if (isOJT) {
        monthlyRate = constant.DEARATEOJT;
      } else if (isFlight) {
        monthlyRate = 0;
      } else {
        monthlyRate = constant.DEARATEFULLTIME;
      }

      if (
        (your.militaryStatus === 'child' || your.militaryStatus === 'spouse') &&
        its.country === 'philippines'
      ) {
        monthlyRate /= 2;
      }
      break;
    case 31:
      if (n <= 2) {
        monthlyRate = constant[`VRE${n}DEPRATE${OJT}`];
      } else {
        monthlyRate =
          constant[`VRE2DEPRATE${OJT}`] +
          (n - 2) * constant[`VREINCRATE${OJT}`];
      }
      break;
    default:
      monthlyRate = null;
  }

  const bah = its.dodBah && its.dodBah < its.bah ? its.dodBah : its.bah;

  const averageBah =
    constant.AVGDODBAH && constant.AVGDODBAH < constant.AVGVABAH
      ? constant.AVGDODBAH
      : constant.AVGVABAH;

  return {
    serviceDischarge,
    vre911Eligible,
    tier,
    onlyVRE,
    oldGiBill,
    onlyTuitionFees,
    monthlyRate,
    isFlightOrCorrespondence,
    bah,
    averageBah,
    chapter,
  };
}

function calculateTuition(constant, eligibility, institution, derived) {
  if (derived.oldGiBill) {
    return { qualifier: 'per year', value: 0, ratedQualifier: '/ year' };
  }
  if (institution.type === 'ojt') {
    return { qualifier: null, value: 'N/A' };
  }
  if (derived.chapter === 31) {
    if (derived.isFlightOrCorrespondence) {
      return {
        qualifier: 'per year',
        value: 0,
        ratedQualifier: ' / year',
      };
    }
    return { qualifier: null, value: 'Full Cost' };
  }
  if (institution.type === 'flight') {
    return {
      qualifier: 'per year',
      ratedQualifier: ' / year',
      value: Math.round(constant.FLTTFCAP * derived.tier),
    };
  }
  if (institution.type === 'correspondence') {
    return {
      qualifier: 'per year',
      ratedQualifier: ' / year',
      value: Math.round(constant.CORRESPONDTFCAP * derived.tier),
    };
  }
  if (institution.type === 'public') {
    return {
      qualifier: '% of instate tuition',
      ratedQualifier: '% in-state',
      value: Math.round(100 * derived.tier),
    };
  }
  return {
    qualifier: 'per year',
    ratedQualifier: ' / year',
    value: Math.round(constant.TFCAP * derived.tier),
  };
}

function calculateHousing(constant, eligibility, institution, derived) {
  if (derived.chapter === 31 && derived.isFlightOrCorrespondence) {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: 0,
    };
  }
  if (derived.oldGiBill || derived.onlyVRE) {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: Math.round(derived.monthlyRate),
    };
  }
  if (eligibility.militaryStatus === 'active duty') {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: 0,
    };
  }
  if (
    eligibility.militaryStatus === 'spouse' &&
    eligibility.spouseActiveDuty === 'yes'
  ) {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: 0,
    };
  }
  if (derived.isFlightOrCorrespondence) {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: 0,
    };
  }
  if (eligibility.onlineClasses === 'yes') {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: Math.round((derived.tier * derived.averageBah) / 2),
    };
  }
  if (institution.country !== 'usa') {
    return {
      qualifier: 'per month',
      ratedQualifier: ' / month',
      value: Math.round(derived.tier * derived.averageBah),
    };
  }
  return {
    qualifier: 'per month',
    ratedQualifier: ' / month',
    value: Math.round(derived.tier * derived.bah),
  };
}

function calculateBooks(constant, eligibility, institution, derived) {
  if (derived.oldGiBill || derived.isFlightOrCorrespondence) {
    return {
      qualifier: 'per year',
      ratedQualifier: ' / year',
      value: 0,
    };
  }
  if (derived.chapter === 31) {
    return { qualifier: null, ratedQualifier: null, value: 'Full Cost' };
  }
  return {
    qualifier: 'per year',
    ratedQualifier: ' / year',
    value: derived.tier * constant.BSCAP,
  };
}

export const estimatedBenefits = createSelector(
  [getConstants, getEligibilityDetails, getRequiredAttributes],
  (constant, eligibility, attribute) => {
    if (constant === undefined) return {};

    const derived = getDerivedAttributes(constant, eligibility, attribute);
    const tuition = calculateTuition(constant, eligibility, attribute, derived);
    const housing = calculateHousing(constant, eligibility, attribute, derived);
    const books = calculateBooks(constant, eligibility, attribute, derived);

    return {
      tuition,
      housing,
      books,
    };
  },
);
