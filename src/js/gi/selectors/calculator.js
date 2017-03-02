import { createSelector } from 'reselect';

const getConstants = (state) => state.constants.constants;

const getEligibilityDetails = (state) => {
  const details = Object.assign({}, state.eligibility);
  delete details.dropdowns;
  return details;
};

const getRequiredAttributes = (_state, props) => {
  return props.attributes;
};

function getDerivedAttributes(constant, eligibility, institution, inputs) {
  const your = eligibility;
  const its = institution;
  let onlyTuitionFees;
  let monthlyRate;
  let numberOfTerms;
  let tuitionNetPrice;
  let ropBook;
  let ropOld;

  const serviceDischarge = (your.cumulativeService === 'service discharge');

  // VRE and post-9/11 eligibility
  const vre911Eligible = (your.giBillChapter === '31' && your.eligForPostGiBill === 'yes');

  // VRE-without-post-911 eligibility
  const onlyVRE = (your.giBillChapter === '31' && your.eligForPostGiBill === 'no');

  // Determines benefits tier
  const tier = (vre911Eligible || serviceDischarge) ? 1 : Number(your.cumulativeService);

  const oldGiBill = (
    your.giBillChapter === '30'
    || your.giBillChapter === '1607'
    || your.giBillChapter === '1606'
    || your.giBillChapter === '35'
  );

  // Determines whether monthly benefit can only be spent on tuition/fees
  const activeDutyThirtyOr1607 = (
    your.militaryStatus === 'active duty' &&
    (your.giBillChapter === '30' || your.giBillChapter === '1607')
  );
  const correspondenceOrFlightUnderOldGiBill = (
    (its.type === 'correspondence' || its.type === 'flight') && oldGiBill === true
  );
  const ropOldAndChapter = (
    ['less than half', 'quarter'].includes(inputs.ropOld) && [30, 35, 1607].includes(your.giBillChapter)
  );
  onlyTuitionFees = activeDutyThirtyOr1607 || correspondenceOrFlightUnderOldGiBill || ropOldAndChapter;

  // The monthly benefit rate for non-chapter 33 benefits
  const isOJT = its.type === 'ojt';
  const isFlight = its.type === 'flight';
  const isCorrespondence = its.type === 'correspondence';
  const isPublic = its.type === 'public';
  const isPrivate = its.type === 'private';
  const isForeign = its.type === 'foreign';
  const n = Number(your.numberOfDependents);
  const OJT = isOJT ? 'OJT' : '';
  switch (Number(your.giBillChapter)) {
    case 30:
      if (your.enlistmentService === '3') {
        monthlyRate = isOJT ? constant.MGIB3YRRATE * 0.75 : constant.MGIB3YRRATE;
      } else if (your.enlistmentService === '2') {
        monthlyRate = isOJT ? constant.MGIB2YRRATE * 0.75 : constant.MGIB2YRRATE;
      }
      break;
    case 1607:
      monthlyRate = constant.MGIB3YRRATE * Number(your.consecutiveService);
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

  // Calculate the total number of academic terms - getNumberOfTerms
  if (isOJT || inputs.calendar === 'quarters') {
    numberOfTerms = 3
  }
  if (inputs.calendar === 'semesters') {
    numberOfTerms = 2;
  }
  if (inputs.calendar === 'nontraditional') {
    numberOfTerms = inputs.numberNontradTerms;
  }

  // Set the net price (Payer of Last Resort) - getTuitionNetPrice
  tuitionNetPrice = Math.max(0, Math.min(
    inputs.tuitionFees - inputs.scholar - inputs.tuitionAssist
  ));

  // Set the proper tuition/fees cap - getTuitionFeesCap
  if (isFlight) {
    tuitionFeesCap = constant.FLTTFCAP;
  } else if (isCorrespondence) {
    tuitionFeesCap = constant.CORRESPONDTFCAP;
  } else if (isPublic && its.country == 'usa' && !inputs.inState) {
    tuitionFeesCap = its.inStateTuitionFees; // or inputs.inStateTuitionFees?
  } else if (isPrivate || isForeign) {
    tuitionFeesCap = constant.TFCAP;
  }

  // Calculate the tuition/fees per term - getTuitionFeesPerTerm
  const getCurrency = (x) => x;
  tuitionFeesPerTerm = getCurrency(inputs.tuitionFees) / numberOfTerms;

  // Calculate the length of each term - getTermLength
  // and Calculate the length of the academic year - getAcadYearLength
  acadYearLength = 9;
  switch (inputs.calendar) {
    case 'semesters':
      termLength = 4.5;
      break;
    case 'quarters':
      termLength = 3;
      break;
    case 'nontraditional':
      termLength = inputs.lengthNontradTerms;
      acadYearLength = inputs.numberNontradTerms / inputs.lengthNontradTerms;
      break;
  }

  // Calculate the rate of pursuit for Book Stipend - getRopBook
  ropBook = ({ 1: 1, 0.8: 0.75, 0.6: 0.5, 0: 0.25 })[+inputs.rop];

  // Calculate the rate of pursuit for Old GI Bill - getCalcRopOld
  // and Calculate the rate of pursuit for OJT - getRopOjt
  if (isOJT) {
    ropOjt = ropOld = inputs.ojtWorking / 30; // TODO: kill ropOjt
  } else {
    ropOld = ({
      'full': 1,
      'three quarter': 0.75,
      'half': 0.50,
      'less than half': 0.50,
      'quarter': 0.25,
    })[+inputs.ropOld];
  }

  // Determine yellow ribbon eligibility - getYellowRibbonEligibility
  yellowRibbonElig = (
    tier < 1
    || !its.yr
    || !eligibility.yellowRibbon
    || eligibility.militaryStatus === 'active duty'
    || isOJT
    || isFlightOrCorrespondence
  ) ? false : true;

  // Determine kicker benefit level - getKickerBenefit
  if (!inputs.kickerElig) {
    kickerBenefit = 0;
  } else if (isOJT) {
    kickerBenefit = inputs.kicker * ropOjt;
  } else if (oldGiBill || onlyVRE) {
    kickerBenefit = inputs.kicker * rop;
  }

  // Determine buy up rates - getBuyUpRate
  if (!inputs.buyUpElig || your.giBillChapter !== 30) {
    buyUpRate = 0;
  } else {
    buyUpRate = inputs.buyUp / 4;
  }

  // Calculate Housing Allowance Rate Final - getMonthlyRateFinal
  monthlyRateFinal = ropOld * (monthlyRate + buyUpRate + kickerBenefit); // TODO: double check order of operations

  // Calculate the names of Terms 1-4
  if (isOJT) {
    calcTerm1 = 'Months 1-6';
    calcTerm2 = 'Months 7-12';
    calcTerm3 = 'Months 13-18';
  } else {
    switch (inputs.calendar) {
      case 'semesters':
        calcTerm1 = 'Fall';
        calcTerm2 = 'Spring';
        calcTerm3 = '';
        break;
      case 'quarters':
        calcTerm1 = 'Fall';
        calcTerm2 = 'Winter';
        calcTerm3 = 'Spring';
        break;
      case 'nontraditional':
        calcTerm1 = 'Term 1';
        calcTerm2 = 'Term 2';
        calcTerm3 = 'Term 3';
        break;
    }
  }
  calcTerm4 = isOJT ? 'Months 19-24' : 'Total (/Yr)';

  // Calculate Tuition Fees for Term #1 - getTuitionFeesTerm1
  if (isOJT || oldGiBill || (your.giBillChapter === 31 && isFlightOrCorrespondence)) {
    tuitionFeesTerm1 = 0;
  } else if (your.giBillChapter === 31) {
    tuitionFeesTerm1 = tuitionFeesPerTerm;
  } else {
    tuitionFeesTerm1 = Math.max(0, Math.min(
      tier * tuitionFeesPerTerm,
      tier * tuitionFeesCap,
      tier * tuitionNetPrice
    ));
  }

  // getTuitionFeesTerm2
  if (isOJT || oldGiBill || (your.giBillChapter === 31 && isFlightOrCorrespondence)) {
    tuitionFeesTerm2 = 0;
  } else if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
    tuitionFeesTerm2 = 0;
  } else if (your.giBillChapter === 31) {
    tuitionFeesTerm2 = tuitionFeesPerTerm;
  } else {
    tuitionFeesTerm2 = Math.max(0, Math.min(
      tier * tuitionFeesPerTerm,
      tier * tuitionFeesCap - tuitionFeesTerm1,
      tier * tuitionNetPrice - tuitionFeesTerm1
    ));
  }

  // getTuitionFeesTerm3
  if (isOJT || oldGiBill || (your.giBillChapter === 31 && isFlightOrCorrespondence)) {
    tuitionFeesTerm3 = 0;
  } else if (inputs.calendar === 'semesters' || inputs.calendar === 'nontraditional' && numberOfTerms < 3) {
    tuitionFeesTerm3 = 0;
  } else if (your.giBillChapter === 31) {
    tuitionFeesTerm3 = tuitionFeesPerTerm;
  } else {
    tuitionFeesTerm3 = Math.max(0, Math.min(
      tier * tuitionFeesPerTerm,
      tier * tuitionFeesCap - tuitionFeesTerm1 - tuitionFeesTerm2,
      tier * tuitionNetPrice - tuitionFeesTerm1 - tuitionFeesTerm2
    ));
  }

  // Calculate the name of Tuition Fees Total - getTuitionFeesTotal
  tuitionFeesTotal = tuitionFeesTerm1 + tuitionFeesTerm2 + tuitionFeesTerm3;

  // Calculate Yellow Ribbon for Term #1 - getYrBenTerm1
  if (!yellowRibbonElig || inputs.yellowBen === 0 || oldGiBill || your.giBillChapter === 31) {
    yrBenTerm1 = 0;
  } else if (tuitionFeesPerTerm === tuitionFeesTerm1) {
    yrBenTerm1 = 0;
  } else {
    yrBenTerm1 = Math.max(0, Math.min(
      tuitionFeesPerTerm - tuitionFeesTerm1,
      inputs.yellowBen * 2
    ));
  }

  // getYrBenTerm2
  if (!yellowRibbonElig || inputs.yellowBen === 0) {
    yrBenTerm2 = 0;
  } else if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
    yrBenTerm2 = 0;
  } else if (oldGiBill || your.giBillChapter === 31) {
    yrBenTerm2 = 0;
  } else if (tuitionFeesPerTerm === tuitionFeesTerm2) {
    yrBenTerm2 = 0;
  } else {
    yrBenTerm2 = Math.max(0, Math.min(
      tuitionFeesPerTerm - tuitionFeesTerm2,
      tuitionFeesPerTerm - tuitionFeesTerm1 - tuitionFeesTerm2 - yrBenTerm1,
      inputs.yellowBen * 2 - yrBenTerm1
    ));
  }

  // getYrBenTerm3
  if (!yellowRibbonElig || inputs.yellowBen === 0) {
    yrBenTerm3 = 0;
  } else if (inputs.calendar === 'semesters' || (inputs.calendar === 'nontraditional' && numberOfTerms < 3)) {
    yrBenTerm3 = 0;
  } else if (oldGiBill || your.giBillChapter === 31) {
    yrBenTerm3 = 0;
  } else if (tuitionFeesPerTerm === tuitionFeesTerm3) {
    yrBenTerm3 = 0;
  } else {
    yrBenTerm3 = Math.max(0, Math.min(
      tuitionFeesPerTerm - tuitionFeesTerm3,
      tuitionFeesPerTerm - tuitionFeesTerm1 - tuitionFeesTerm2 - tuitionFeesTerm3 - yrBenTerm1 - yrBenTerm1,
      inputs.yellowBen * 2 - yrBenTerm1 - yrBenTerm1
    ));
  }

  // Calculate Yellow Ribbon for the Year - getYrBenTotal
  if (!yellowRibbonElig || inputs.yellowBen === 0) {
    yrBenTotal = 0;
  } else {
    yrBenTotal = yrBenTerm1 + yrBenTerm2 + yrBenTerm3;
  }

  // Calculate Yellow Ribbon by school / VA contributions - getYrBreakdown
  yrBenSchoolTerm1 = yrBenTerm1 / 2;
  yrBenVaTerm1 = yrBenTerm1 / 2;
  yrBenSchoolTerm2 = yrBenTerm2 / 2;
  yrBenVaTerm2 = yrBenTerm2 / 2;
  yrBenSchoolTerm3 = yrBenTerm3 / 2;
  yrBenVaTerm3 = yrBenTerm3 / 2;
  yrBenSchoolTotal = yrBenTotal / 2;
  yrBenVaTotal = yrBenTotal / 2;

  // Calculate Total Paid to School - getTotalPaidToSchool
  totalToSchool = tuitionFeesTotal + yrBenTotal;

  // Calculate Total Scholarships and Tuition Assistance - getTotalScholarships
  totalScholarshipTa = inputs.scholar - inputs.tuitionAssist;

  // Calculate Total Left to Pay - getTotalLeftToPay
  totalLeftToPay = Math.max(
    0,
    inputs.tuitionFees - totalToSchool - inputs.scholar - inputs.tuitionAssist
  );

  // Calculate Housing Allowance for Term #1 - getHousingAllowTerm1
  // TODO: gouge my eyes out with a spoon


  return {
    serviceDischarge,
    vre911Eligible,
    tier,
    onlyVRE,
    oldGiBill,
    onlyTuitionFees,
    monthlyRate,
    numberOfTerms,
    tuitionNetPrice
  };
}

export const calculatedBenefits = createSelector(
  [getConstants, getEligibilityDetails, getRequiredAttributes],
  (constant, eligibility, attribute) => {
    // const derived = getDerivedAttributes(constant, eligibility, attribute);

    return {};
  }
);
