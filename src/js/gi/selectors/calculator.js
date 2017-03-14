import { createSelector } from 'reselect';

import { getCurrency } from '../utils/helpers';

const getConstants = (state) => state.constants.constants;

const getEligibilityDetails = (state) => {
  const details = Object.assign({}, state.eligibility);
  delete details.dropdowns;
  return details;
};

const getInstitution = (state) => state.profile.attributes;

const getFormInputs = (state) => state.calculator;

const getDerivedValues = createSelector(
  getConstants,
  getEligibilityDetails,
  getInstitution,
  getFormInputs,
  (constant, eligibility, institution, inputs) => {
    if (constant === undefined) return {};
    let monthlyRate;
    let numberOfTerms;
    let ropOld;
    let tuitionFeesCap;
    let acadYearLength;
    let termLength;
    let ropOjt;
    let kickerBenefit;
    let buyUpRate;
    let tuitionFeesTerm1;
    let tuitionFeesTerm2;
    let tuitionFeesTerm3;
    let yrBenTerm1;
    let yrBenTerm2;
    let yrBenTerm3;
    let yrBenTotal;
    let housingAllowTerm1;
    let housingAllowTerm2;
    let housingAllowTerm3;
    let housingAllowTotal;
    let housingStipdendTerm1;
    let housingStipdendTerm2;
    let housingStipdendTerm3;
    let housingStipdendTotal;
    let tuitionAllowTerm1;
    let tuitionAllowTerm2;
    let tuitionAllowTerm3;
    let tuitionAllowTotal;
    let giBillTotalText;
    let totalTerm1;
    let totalTerm2;
    let totalTerm3;
    let totalYear;
    let monthlyRateDisplay;
    let nameOfTerm1;
    let nameOfTerm2;
    let nameOfTerm3;
    let bookStipendTerm1;
    let bookStipendTerm2;
    let bookStipendTerm3;
    let bookStipendTotal;

    const {
      cumulativeService,
      eligForPostGiBill,
      enlistmentService,
      militaryStatus,
      onlineClasses,
    } = eligibility;

    const consecutiveService = +eligibility.consecutiveService;
    const giBillChapter = +eligibility.giBillChapter;
    const numberOfDependents = +eligibility.numberOfDependents;
    const spouseActiveDuty = eligibility.spouseActiveDuty === 'yes';
    const serviceDischarge = cumulativeService === 'service discharge';

    const isOJT = institution.type === 'ojt';
    const isFlight = institution.type === 'flight';
    const isCorrespondence = institution.type === 'correspondence';
    const isFlightOrCorrespondence = isFlight || isCorrespondence;
    const isPublic = institution.type === 'public';
    const isPrivate = institution.type === 'private';
    const isForeign = institution.type === 'foreign';

    // VRE and post-9/11 eligibility
    const vre911Eligible = (giBillChapter === 31 && eligForPostGiBill === 'yes');

    // VRE-without-post-911 eligibility
    const onlyVRE = (giBillChapter === 31 && eligForPostGiBill === 'no');

    // Determines benefits tier
    const tier = (vre911Eligible || serviceDischarge) ? 1 : +cumulativeService;

    const oldGiBill = (
      giBillChapter === 30
      || giBillChapter === 1607
      || giBillChapter === 1606
      || giBillChapter === 35
    );

    // Determines whether monthly benefit can only be spent on tuition/fees
    const activeDutyThirtyOr1607 = (
      militaryStatus === 'active duty' &&
      (giBillChapter === 30 || giBillChapter === 1607)
    );
    const correspondenceOrFlightUnderOldGiBill =
      isFlightOrCorrespondence && oldGiBill;
    const ropOldAndChapter = (
      ['less than half', 'quarter'].includes(inputs.enrolledOld) &&
      [30, 35, 1607].includes(giBillChapter)
    );
    const onlyTuitionFees =
      activeDutyThirtyOr1607 ||
      correspondenceOrFlightUnderOldGiBill ||
      ropOldAndChapter;

    // The monthly benefit rate for non-chapter 33 benefits
    switch (giBillChapter) {
      case 30:
        if (enlistmentService === '3' || enlistmentService === '2') {
          monthlyRate = isOJT ? constant.MGIB3YRRATE * 0.75 : constant.MGIB3YRRATE;
        }
        break;
      case 1607:
        monthlyRate = constant.MGIB3YRRATE * consecutiveService;
        monthlyRate = isOJT ? monthlyRate * 0.75 : monthlyRate;
        break;
      case 1606:
        monthlyRate = isOJT ? constant.SRRATE * 0.75 : constant.SRRATE;
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
        if (numberOfDependents <= 2) {
          monthlyRate =
            constant[`VRE${numberOfDependents}DEPRATE${isOJT ? 'OJT' : ''}`];
        } else {
          monthlyRate =
            constant[`VRE2DEPRATE${isOJT ? 'OJT' : ''}`] +
            ((numberOfDependents - 2) *
            constant[`VREINCRATE${isOJT ? 'OJT' : ''}`]);
        }
        break;
      default:
        monthlyRate = 0;
    }

    // Calculate the total number of academic terms - getNumberOfTerms
    if (isOJT || inputs.calendar === 'quarters') {
      numberOfTerms = 3;
    } else if (inputs.calendar === 'semesters') {
      numberOfTerms = 2;
    } else if (inputs.calendar === 'nontraditional') {
      numberOfTerms = +inputs.numberNontradTerms;
    }

    // Set the net price (Payer of Last Resort) - getTuitionNetPrice
    const tuitionNetPrice = Math.max(0, Math.min(
      inputs.tuitionFees -
      inputs.scholarships -
      inputs.tuitionAssist
    ));

    // Set the proper tuition/fees cap - getTuitionFeesCap
    if (isFlight) {
      tuitionFeesCap = constant.FLTTFCAP;
    } else if (isCorrespondence) {
      tuitionFeesCap = constant.CORRESPONDTFCAP;
    } else if (isPublic && institution.country === 'usa') {
      tuitionFeesCap = inputs.inState
                     ? institution.tuitionInState
                     : institution.tuitionOutOfState;
    } else if (isPrivate || isForeign) {
      tuitionFeesCap = constant.TFCAP;
    }

    // Calculate the tuition/fees per term - getTuitionFeesPerTerm
    const tuitionFeesPerTerm = getCurrency(inputs.tuitionFees) / numberOfTerms;

    // Calculate the length of each term - getTermLength
    // and Calculate the length of the academic year - getAcadYearLength
    acadYearLength = 9;

    if (isOJT) {
      termLength = 6;
    } else {
      switch (inputs.calendar) {
        case 'semesters':
          termLength = 4.5;
          break;
        case 'quarters':
          termLength = 3;
          break;
        case 'nontraditional':
          termLength = +inputs.lengthNontradTerms;
          acadYearLength = (+inputs.numberNontradTerms) * (+inputs.lengthNontradTerms);
          break;
        default:
          // noop
      }
    }

    // Calculate the rate of pursuit for Book Stipend - getRopBook
    const ropBook = ({ 1: 1, 0.8: 0.75, 0.6: 0.5, 0: 0.25 })[+inputs.enrolled];

    // Calculate the rate of pursuit for Old GI Bill - getCalcRopOld
    // and Calculate the rate of pursuit for OJT - getRopOjt
    if (isOJT) {
      ropOjt = ropOld = +inputs.working / 30;
    } else {
      ropOld = ({
        full: 1,
        'three quarter': 0.75,
        half: 0.50,
        'less than half': 0.50,
        quarter: 0.25,
      })[+inputs.enrolledOld];
    }

    // Determine yellow ribbon eligibility - getYellowRibbonEligibility
    const yellowRibbonElig = !(
      tier < 1
      || !institution.yr
      || !inputs.yellowRibbonRecipient
      || militaryStatus === 'active duty'
      || isOJT
      || isFlightOrCorrespondence
    );

    // Determine kicker benefit level - getKickerBenefit
    if (!(inputs.kickerEligible === 'yes')) {
      kickerBenefit = 0;
    } else if (isOJT) {
      kickerBenefit = +inputs.kickerAmount * ropOjt;
    } else if (oldGiBill || onlyVRE) {
      kickerBenefit = +inputs.kickerAmount * ropOld;
    } else {
      kickerBenefit = +inputs.kickerAmount * (+inputs.enrolled);
    }

    // Determine buy up rates - getBuyUpRate
    if (!inputs.buyUpElig || giBillChapter !== 30) {
      buyUpRate = 0;
    } else {
      buyUpRate = inputs.buyUp / 4;
    }

    // Calculate Housing Allowance Rate Final - getMonthlyRateFinal
    const monthlyRateFinal = ropOld * (monthlyRate + buyUpRate + kickerBenefit); // TODO: double check order of operations

    // Calculate the names of Terms 1-4
    if (isOJT) {
      nameOfTerm1 = 'Months 1-6';
      nameOfTerm2 = 'Months 7-12';
      nameOfTerm3 = 'Months 13-18';
    } else {
      switch (inputs.calendar) {
        case 'semesters':
          nameOfTerm1 = 'Fall';
          nameOfTerm2 = 'Spring';
          nameOfTerm3 = '';
          break;
        case 'quarters':
          nameOfTerm1 = 'Fall';
          nameOfTerm2 = 'Winter';
          nameOfTerm3 = 'Spring';
          break;
        case 'nontraditional':
          nameOfTerm1 = 'Term 1';
          nameOfTerm2 = 'Term 2';
          nameOfTerm3 = 'Term 3';
          break;
        default:
          // noop
      }
    }
    const nameOfTerm4 = isOJT ? 'Months 19-24' : 'Total (/Yr)';

    // Calculate Tuition Fees for Term #1 - getTuitionFeesTerm1
    if (isOJT || oldGiBill || (giBillChapter === 31 && isFlightOrCorrespondence)) {
      tuitionFeesTerm1 = 0;
    } else if (giBillChapter === 31) {
      tuitionFeesTerm1 = tuitionFeesPerTerm;
    } else {
      tuitionFeesTerm1 = Math.max(0, Math.min(
        tier * tuitionFeesPerTerm,
        tier * tuitionFeesCap,
        tier * tuitionNetPrice
      ));
    }

    // getTuitionFeesTerm2
    if (isOJT || oldGiBill || (giBillChapter === 31 && isFlightOrCorrespondence)) {
      tuitionFeesTerm2 = 0;
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
      tuitionFeesTerm2 = 0;
    } else if (giBillChapter === 31) {
      tuitionFeesTerm2 = tuitionFeesPerTerm;
    } else {
      tuitionFeesTerm2 = Math.max(0, Math.min(
        tier * tuitionFeesPerTerm,
        tier * tuitionFeesCap - tuitionFeesTerm1,
        tier * tuitionNetPrice - tuitionFeesTerm1
      ));
    }

    // getTuitionFeesTerm3
    if (isOJT || oldGiBill || (giBillChapter === 31 && isFlightOrCorrespondence)) {
      tuitionFeesTerm3 = 0;
    } else if (inputs.calendar === 'semesters' || inputs.calendar === 'nontraditional' && numberOfTerms < 3) {
      tuitionFeesTerm3 = 0;
    } else if (giBillChapter === 31) {
      tuitionFeesTerm3 = tuitionFeesPerTerm;
    } else {
      tuitionFeesTerm3 = Math.max(0, Math.min(
        tier * tuitionFeesPerTerm,
        tier * tuitionFeesCap - tuitionFeesTerm1 - tuitionFeesTerm2,
        tier * tuitionNetPrice - tuitionFeesTerm1 - tuitionFeesTerm2
      ));
    }

    // Calculate the name of Tuition Fees Total - getTuitionFeesTotal
    const tuitionFeesTotal = tuitionFeesTerm1 + tuitionFeesTerm2 + tuitionFeesTerm3;

    // Calculate Yellow Ribbon for Term #1 - getYrBenTerm1
    if (!yellowRibbonElig || inputs.yellowBen === 0 || oldGiBill || giBillChapter === 31) {
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
    } else if (oldGiBill || giBillChapter === 31) {
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
    } else if (oldGiBill || giBillChapter === 31) {
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
    const yrBenSchoolTerm1 = yrBenTerm1 / 2;
    const yrBenVaTerm1 = yrBenTerm1 / 2;
    const yrBenSchoolTerm2 = yrBenTerm2 / 2;
    const yrBenVaTerm2 = yrBenTerm2 / 2;
    const yrBenSchoolTerm3 = yrBenTerm3 / 2;
    const yrBenVaTerm3 = yrBenTerm3 / 2;
    const yrBenSchoolTotal = yrBenTotal / 2;
    const yrBenVaTotal = yrBenTotal / 2;

    // Calculate Total Paid to School - getTotalPaidToSchool
    const totalToSchool = tuitionFeesTotal + yrBenTotal;

    // Calculate Total Scholarships and Tuition Assistance - getTotalScholarships
    const totalScholarshipTa = inputs.scholar - inputs.tuitionAssist;

    // Calculate Total Left to Pay - getTotalLeftToPay
    const totalLeftToPay = Math.max(
      0,
      inputs.tuitionFees - totalToSchool - inputs.scholar - inputs.tuitionAssist
    );

    // Calculate Housing Allowance for Term #1 - getHousingAllowTerm1
    if (militaryStatus === 'active duty' && isOJT) {
      housingAllowTerm1 = 0;
    } else if (giBillChapter === 33 & militaryStatus === 'spouse' &&
        spouseActiveDuty && isOJT) {
      housingAllowTerm1 = 0;
    } else if (giBillChapter === 35 && isOJT) {
      housingAllowTerm1 = monthlyRateFinal;
    } else if (oldGiBill && isOJT) {
      housingAllowTerm1 = monthlyRateFinal;
    } else if (onlyVRE && isOJT) {
      housingAllowTerm1 = monthlyRateFinal;
    } else if (giBillChapter === 31 && (isFlight ||
        isCorrespondence)) {
      tuitionAllowTerm1 = 0;
    } else if (giBillChapter === 1607 && isFlight) {
      housingAllowTerm1 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.55)
        ));
    } else if (giBillChapter === 1606 && isFlight) {
      housingAllowTerm1 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * 0.55
        ));
    } else if (giBillChapter === 1607 && isCorrespondence) {
      housingAllowTerm1 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (giBillChapter === 1606 && isCorrespondence) {
      housingAllowTerm1 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (onlyTuitionFees) {
      housingAllowTerm1 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm
        ));
    } else if (oldGiBill || onlyVRE) {
      housingAllowTerm1 = monthlyRateFinal * termLength;
    } else if (militaryStatus === 'active duty') {
      housingAllowTerm1 = (0 + kickerBenefit) * termLength;
    } else if (militaryStatus === 'spouse' && spouseActiveDuty) {
      housingAllowTerm1 = (0 + kickerBenefit) * termLength;
    } else if (isFlight || isCorrespondence) {
      housingAllowTerm1 = 0;
    } else if (isOJT) {
      housingAllowTerm1 = ropOjt *
        (tier * institution.bah + kickerBenefit);
    } else if (onlineClasses === 'yes') {
      housingAllowTerm1 = termLength * inputs.rop *
        (tier * constant.AVGBAH / 2 + kickerBenefit);
    } else if (institution.country !== 'usa') {
      housingAllowTerm1 = termLength * inputs.rop *
        ((tier * constant.AVGBAH) + kickerBenefit);
    } else {
      housingAllowTerm1 = termLength * inputs.rop *
        ((tier * institution.bah) + kickerBenefit);
    }

    // getHousingAllowTerm2
    if (militaryStatus === 'active duty' && isOJT) {
      housingAllowTerm2 = 0;
    } else if (giBillChapter === 33 &&
        militaryStatus === 'spouse' && spouseActiveDuty &&
        isOJT) {
      housingAllowTerm2 = 0;
    } else if (giBillChapter === 35 && isOJT) {
      housingAllowTerm2 = 0.75 * monthlyRateFinal;
    } else if (oldGiBill && isOJT) {
      housingAllowTerm2 = (6.6 / 9) * monthlyRateFinal;
    } else if (onlyVRE && isOJT) {
      housingAllowTerm2 = monthlyRateFinal;
    } else if (isOJT) {
      housingAllowTerm2 = 0.8 * ropOjt *
        (tier * institution.bah + kickerBenefit);
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
      housingAllowTerm2 = 0;
    } else if (giBillChapter === 31 &&
        (isFlight || isCorrespondence)) {
      tuitionAllowTerm2 = 0;
    } else if (giBillChapter === 1607 && isFlight) {
      housingAllowTerm2 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.55)
        ));
    } else if (giBillChapter === 1606 && isFlight) {
      housingAllowTerm2 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * 0.55
        ));
    } else if (giBillChapter === 1607 && isCorrespondence) {
      housingAllowTerm2 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (giBillChapter === 1606 && isCorrespondence) {
      housingAllowTerm2 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (onlyTuitionFees) {
      housingAllowTerm2 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm
        ));
    } else if (oldGiBill || onlyVRE) {
      housingAllowTerm2 = monthlyRateFinal * termLength;
    } else if (militaryStatus === 'active duty') {
      housingAllowTerm2 = (0 + kickerBenefit) * termLength;
    } else if (militaryStatus === 'spouse' && spouseActiveDuty) {
      housingAllowTerm2 = (0 + kickerBenefit) * termLength;
    } else if (isFlight || isCorrespondence) {
      housingAllowTerm2 = 0;
    } else if (onlineClasses === 'yes') {
      housingAllowTerm2 = termLength * inputs.rop *
        (tier * constant.AVGBAH / 2 + kickerBenefit);
    } else if (institution.country !== 'usa') {
      housingAllowTerm2 = termLength * inputs.rop *
        (tier * constant.AVGBAH + kickerBenefit);
    } else {
      housingAllowTerm2 = termLength * inputs.rop *
        (tier * institution.bah + kickerBenefit);
    }

    // getHousingAllowTerm3
    if (militaryStatus === 'active duty' && isOJT) {
      housingAllowTerm3 = 0;
    } else if (giBillChapter === 33 && militaryStatus === 'spouse' &&
        spouseActiveDuty && isOJT) {
      housingAllowTerm3 = 0;
    } else if (giBillChapter === 35 && isOJT) {
      housingAllowTerm3 = 0.494 * monthlyRateFinal;
    } else if (oldGiBill && isOJT) {
      housingAllowTerm3 = (7 / 15) * monthlyRateFinal;
    } else if (onlyVRE && isOJT) {
      housingAllowTerm3 = monthlyRateFinal;
    } else if (isOJT) {
      housingAllowTerm3 = 0.6 * ropOjt *
        (tier * institution.bah + kickerBenefit);
    } else if (inputs.calendar === 'semesters') {
      housingAllowTerm3 = 0;
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms < 3) {
      housingAllowTerm3 = 0;
    } else if (giBillChapter === 31 &&
        (isFlight || isCorrespondence)) {
      tuitionAllowTerm3 = 0;
    } else if (giBillChapter === 1607 && isFlight) {
      housingAllowTerm3 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.55)
        ));
    } else if (giBillChapter === 1606 && isFlight) {
      housingAllowTerm3 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * 0.55
        ));
    } else if (giBillChapter === 1607 && isCorrespondence) {
      housingAllowTerm3 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (giBillChapter === 1607 && isCorrespondence) {
      housingAllowTerm3 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm * (consecutiveService * 0.6)
        ));
    } else if (onlyTuitionFees) {
      housingAllowTerm3 = Math.max(0,
        Math.min(monthlyRateFinal * termLength,
          tuitionFeesPerTerm
        ));
    } else if (oldGiBill || onlyVRE) {
      housingAllowTerm3 = monthlyRateFinal * termLength;
    } else if (militaryStatus === 'spouse' && spouseActiveDuty) {
      housingAllowTerm3 = (0 + kickerBenefit) * termLength;
    } else if (isFlight || isCorrespondence) {
      housingAllowTerm3 = 0;
    } else if (militaryStatus === 'active duty') {
      housingAllowTerm3 = (0 + kickerBenefit) * termLength;
    } else if (onlineClasses === 'yes') {
      housingAllowTerm3 = termLength * inputs.rop *
        (tier * constant.AVGBAH / 2 + kickerBenefit);
    } else if (institution.country !== 'usa') {
      housingAllowTerm3 = termLength * inputs.rop *
        (tier * constant.AVGBAH + kickerBenefit);
    } else {
      housingAllowTerm3 = termLength * inputs.rop *
        (tier * institution.bah + kickerBenefit);
    }

    // Calculate Housing Allowance Total for year - getHousingAllowTotal
    if (militaryStatus === 'active duty' && isOJT) {
      housingAllowTerm3 = 0;
    } else if (giBillChapter === 35 && isOJT) {
      housingAllowTotal = 0.25 * monthlyRateFinal;
    } else if (oldGiBill && isOJT) {
      housingAllowTotal = (7 / 15) * monthlyRateFinal;
    } else if (onlyVRE && isOJT) {
      housingAllowTotal = monthlyRateFinal;
    } else if (isOJT) {
      housingAllowTotal = 0.4 * ropOjt *
        (tier * institution.bah + kickerBenefit);
    } else if (onlyTuitionFees) {
      housingAllowTotal = Math.max(0,
          Math.min(monthlyRateFinal * acadYearLength, inputs.tuitionFees)
        );
    } else {
      housingAllowTotal = housingAllowTerm1 + housingAllowTerm2 + housingAllowTerm3;
    }

    // Calculate Book Stipend for Term #1 - getBookStipendTerm1
    if (isFlight || isCorrespondence) {
      bookStipendTerm1 = 0;
    } else if (oldGiBill) {
      bookStipendTerm1 = 0;
    } else if (giBillChapter === 31) {
      bookStipendTerm1 = inputs.books / numberOfTerms;
    } else if (isOJT && giBillChapter === 33) {
      bookStipendTerm1 = constant.BSOJTMONTH;
    } else {
      bookStipendTerm1 = ropBook * constant.BSCAP / numberOfTerms * tier;
    }

    // getBookStipendTerm2
    if (isFlight || isCorrespondence) {
      bookStipendTerm2 = 0;
    } else if (isOJT && giBillChapter === 33) {
      bookStipendTerm2 = constant.BSOJTMONTH;
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
      bookStipendTerm2 = 0;
    } else if (oldGiBill) {
      bookStipendTerm2 = 0;
    } else if (giBillChapter === 31) {
      bookStipendTerm2 = inputs.books / numberOfTerms;
    } else {
      bookStipendTerm2 = ropBook * constant.BSCAP / numberOfTerms * tier;
    }

    // getBookStipendTerm3
    if (isFlight || isCorrespondence) {
      bookStipendTerm3 = 0;
    } else if (isOJT && giBillChapter === 33) {
      bookStipendTerm3 = constant.BSOJTMONTH;
    } else if (inputs.calendar === 'semesters') {
      bookStipendTerm3 = 0;
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms < 3) {
      bookStipendTerm3 = 0;
    } else if (oldGiBill) {
      bookStipendTerm3 = 0;
    } else if (giBillChapter === 31) {
      bookStipendTerm3 = inputs.books / numberOfTerms;
    } else {
      bookStipendTerm3 = ropBook *
        constant.BSCAP / numberOfTerms * tier;
    }

    // Calculate Book Stipend for Year - getBookStipendYear
    if (isOJT && giBillChapter === 33) {
      bookStipendTotal = constant.BSOJTMONTH;
    } else {
      bookStipendTotal = bookStipendTerm1 + bookStipendTerm2 + bookStipendTerm3;
    }

    // Calculate Total Payments to You - getTotalPaidToYou
    const totalToYou = housingAllowTotal + bookStipendTotal;

    // Calculate Total Benefits for Term 1 - getTotalTerm1
    if (isOJT) {
      totalTerm1 = 0;
    } else {
      totalTerm1 = tuitionFeesTerm1 + yrBenTerm1 + housingAllowTerm1 + bookStipendTerm1;
    }

    // getTotalTerm2
    if (inputs.calendar === 'nontraditional' && numberOfTerms === 1) {
      bookStipendTerm2 = 0;
    } else if (isOJT) {
      totalTerm2 = 0;
    } else {
      totalTerm2 = tuitionFeesTerm2 +
        yrBenTerm2 + housingAllowTerm2 +
        bookStipendTerm2;
    }

    // getTotalTerm3
    if (inputs.calendar === 'semesters') {
      totalTerm3 = 0;
    } else if (inputs.calendar === 'nontraditional' && numberOfTerms < 3) {
      totalTerm3 = 0;
    } else if (isOJT) {
      totalTerm3 = 0;
    } else {
      totalTerm3 = tuitionFeesTerm3 +
        yrBenTerm3 + housingAllowTerm3 +
        bookStipendTerm3;
    }

    // Calculate Text for Total Benefits Row - getTotalText
    if (giBillChapter === 33) {
      giBillTotalText = 'Total Post-9/11 GI Bill Benefits';
    } else if (giBillChapter === 30) {
      giBillTotalText = 'Total Montgomery GI Bill Benefits';
    } else if (giBillChapter === 1606) {
      giBillTotalText = 'Total Select Reserve GI Bill Benefits';
    } else if (giBillChapter === 1607) {
      giBillTotalText = 'Total REAP GI Bill Benefits';
    } else if (giBillChapter === 35) {
      giBillTotalText = 'Total DEA GI Bill Benefits';
    } else if (giBillChapter === 31) {
      giBillTotalText = 'Total Voc Rehab Benefits';
    }

    // Calculate Total Benefits for Year - getTotalYear
    if (isOJT) {
      totalYear = 0;
    } else {
      totalYear = tuitionFeesTotal + yrBenTotal + housingAllowTotal + bookStipendTotal;
    }

    // Calculate Monthly Rate for Display - getMonthlyRateDisplay
    if (isOJT) {
      monthlyRateDisplay = housingAllowTerm1;
    } else {
      monthlyRateDisplay = housingAllowTerm1 / termLength;
    }

    return {
      serviceDischarge,
      vre911Eligible,
      tier,
      onlyVRE,
      oldGiBill,
      onlyTuitionFees,
      monthlyRate,
      numberOfTerms,
      tuitionNetPrice,
      housingStipdendTerm1,
      housingStipdendTerm2,
      housingStipdendTerm3,
      housingStipdendTotal,
      tuitionAllowTerm1,
      tuitionAllowTerm2,
      tuitionAllowTerm3,
      tuitionAllowTotal,
      giBillTotalText,
      totalTerm1,
      totalTerm2,
      totalTerm3,
      totalYear,
      monthlyRateDisplay,
      nameOfTerm1,
      nameOfTerm2,
      nameOfTerm3,
      nameOfTerm4,
      yrBenSchoolTerm1,
      yrBenSchoolTerm2,
      yrBenSchoolTerm3,
      yrBenSchoolTotal,
      yrBenVaTerm1,
      yrBenVaTerm2,
      yrBenVaTerm3,
      yrBenVaTotal,
      totalScholarshipTa,
      totalLeftToPay,
      totalToYou
    };
  }
);

export const getDisplayedInputs = createSelector(
  getEligibilityDetails,
  getInstitution,
  getDerivedValues,
  (eligibility, institution, derived) => {
    let displayed = {
      tuition: true,
      books: false,
      yellowRibbon: false,
      scholarships: true,
      tuitionAssist: false,
      enrolled: true,
      enrolledOld: false,
      calendar: true,
      working: false,
      kicker: true,
      buyUp: false,
    };

    if ([eligibility, institution, derived].some(e => !e)) {
      return displayed;
    }

    const { militaryStatus } = eligibility;
    const giBillChapter = +eligibility.giBillChapter;


    // tuition, scholarship, enrolled, calendar, kicker

    if (giBillChapter === 31 && !derived.onlyVRE) {
      // displayed.enrolled = true;
      displayed = {
        ...displayed,
        enrolled: true,
        enrolledOld: false,
        yellowRibbon: false,
        scholarships: false,
        tuitionAssist: false,
        // hide estimator yellowRibbon row
      };
    }

    if (institution.type === 'ojt') {
      /*
      displayed.tuition = false;
      displayed.scholarships = false;
      displayed.enrolled = false;
      displayed.working = true;
      */
      displayed = {
        ...displayed,
        tuition: false,
        books: false,
        yellowRibbon: false,
        scholarships: false,
        tuitionAssist: false,
        enrolled: false,
        enrolledOld: false,
        working: true,
        calendar: false,
        /* hide bunch of esimator rows */
      };
    }

    if (giBillChapter === 35) {
      // displayed.kicker = false;
      displayed = {
        ...displayed,
        kicker: false,
      };
    }

    if (institution.type === 'flight' || institution.type === 'correspondence') {
      // displayed.kicker = false;
      displayed = {
        ...displayed,
        enrolled: false,
        enrolledOld: false,
        kicker: false,
        buyUp: false
      };
    }

    if (institution.yr && derived.tier === 1.0) {
      displayed = {
        ...displayed,
        yellowRibbon: true
      };
    }

    if (derived.oldGiBill || derived.onlyVRE) {
      displayed = {
        ...displayed,
        yellowRibbon: false,
        enrolled: false,
        enrolledOld: true
      };
    }

    if (giBillChapter === 31) {
      displayed = {
        ...displayed,
        books: true
      };
    }

    if (giBillChapter === 30) {
      displayed = {
        ...displayed,
        buyUp: true
      };
    }

    if (['active duty', 'national guard / reserves'].includes(militaryStatus) && giBillChapter === 33) {
      displayed = {
        ...displayed,
        tuitionAssist: true
      };
    }

    return displayed;
  }
);

export const calculatedBenefits = createSelector(
  getDisplayedInputs,
  inputs => inputs
);
