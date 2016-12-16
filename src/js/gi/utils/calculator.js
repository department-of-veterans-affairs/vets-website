class Calculator {

  constructor() {
    this.values = {};
    this.outputs = {};
    this.recalculate = this.recalculate.bind(this);
  }

  init(school, profileCalculatorComponent) {
    this.institution = school;
    this.institutionType = school.institutionType.name.toLowerCase();
    this.component = profileCalculatorComponent;

    // For Profit is the same as private (facility code starts with 2)
    if (this.institutionType === 'for profit') {
      this.institutionType = 'private';
    }

    if (!this.institution.bah) {
      this.institution.bah = 0.0;
    }

    if (!this.institution.tuitionInState) {
      this.institution.tuitionInState = 0.0;
    }

    if (!this.institution.tuitionOutOfState) {
      this.institution.tuitionOutOfState = 0.0;
    }

    if (!this.institution.books) {
      this.institution.books = 0.0;
    }

    if (!this.institution.country) {
      this.institution.country = '';
    }

    this.populateInputs();
    this.getValues();
    this.getDerivedValues();
    this.writeOutputs();

    // var othis = this;
    // $('.filter-item').change(function () {
    //   othis.getValues();
    //   othis.getDerivedValues();
    //   // othis.resetVisibility();
    //   othis.writeOutputs();
    // });
    //
    // $('.filter-in-state').change(function () {
    //   othis.updateInState();
    //   othis.getValues();
    //   othis.getDerivedValues();
    //   // othis.resetVisibility();
    //   othis.writeOutputs();
    // });
  }

  recalculate() {
    this.getValues();
    this.getDerivedValues();
    // this.resetVisibility();
    this.writeOutputs();
  }

  getMilitaryStatus() {
    this.militaryStatus = this.component.state.militaryStatus;
    return this;
  }

  // Sets the spouse active duty from the element with the id argument.
  getSpouseActiveDuty() {
    // this.spouseActiveDuty = $(id).val().toLowerCase() === "yes";
    this.spouseActiveDuty = this.component.state.spouseActiveDuty.toLowerCase() === 'yes';
    return this;
  }

  // Sets gi bill chapter value from the element with the id argument. Also sets
  // the oldGiBill boolean based on the value of the giBillChapter.
  getGiBillChapter() {
    this.giBillChapter = Number(this.component.state.giBillChapter);

    this.calcOldGiBill = (this.giBillChapter === 30 || this.giBillChapter === 1607
      || this.giBillChapter === 1606 || this.giBillChapter === 35);

    return this;
  }

  // Sets gi bill chapter value from the element with the id argument.
  getEligForPostGiBill() {
    this.eligForPostGiBill = this.component.state.eligForPostGiBill.toLowerCase() === 'yes';
    return this;
  }

  // Sets the cumulative service value from the element with the id argument.
  getCumulativeService() {
    const val = this.component.state.serviceDischarge;
    this.serviceDischarge = val === 'service discharge';
    this.cumulativeService = this.serviceDischarge ? 1.0 : parseFloat(val);
    return this;
  }

  // Sets consecutive service value from the element with the id argument.
  getConsecutiveService() {
    this.consecutiveService = Number(this.component.state.consecutiveService);
    return this;
  }

  // Sets enlistment service value from the element with the id argument.
  getEnlistmentService() {
    this.enlistmentService = Number(this.component.state.enlistmentService);
    return this;
  }

  // Sets online value from the element with the id argument.
  getOnline() {
    this.online = this.component.state.online.toLowerCase() === 'yes';
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getInState() {
    this.inState = this.component.state.inState.toLowerCase() === 'yes';
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getTuitionFees() {
    this.tuitionFees = this.getCurrency(this.component.state.tuitionFees);
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getInStateTuitionFees() {
    this.inStateTuitionFees = this.getCurrency(this.component.state.inStateTuitionFees);
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getBooks() {
    this.books = this.getCurrency(this.component.state.books);
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getYellowRibbon() {
    this.yellowRibbon = this.component.state.yellowRibbon.toLowerCase() === 'yes';

    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getYellowBen() {
    this.yellowBen = this.getCurrency(this.component.state.yellowBen);
    return this;
  }

  // Sets the value and visibility for the element with the id argument.
  getScholar() {
    this.scholar = this.getCurrency(this.component.state.scholar);
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getTuitionAssist() {
    this.tuitionAssist = this.getCurrency(this.component.state.tuitionAssist);
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getRop() {
    this.rop = this.component.state.rop;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getRopOld() {
    this.ropOld = this.component.state.ropOld;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getCalendar() {
    this.calendar = this.component.state.calendar;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getOjtWorking() {
    this.ojtWorking = this.component.state.ojtWorking;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getNumberNontradTerms() {
    this.numberNontradTerms = Number(this.component.state.numberNontradTerms);
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getLengthNontradTerms() {
    this.lengthNontradTerms = this.component.state.lengthNontradTerms;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getKickerElig() {
    this.kickerElig = this.component.state.kickerElig.toLowerCase() === 'yes';
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getKicker() {
    this.kicker = this.component.state.kicker;
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getBuyUpElig() {
    this.buyUpElig = this.component.state.buyUpElig.toLowerCase() === 'yes';
    return this;
  }

  // Sets the visibility for the element with the id argument.
  getBuyUp() {
    this.buyUp = Number(this.component.state.buyUp);
    return this;
  }

}

// Constants
Calculator.prototype.TFCAP = 21970.46;
Calculator.prototype.AVGBAH = 1611;
Calculator.prototype.BSCAP = 1000;
Calculator.prototype.BSOJTMONTH = 83;
Calculator.prototype.FLTTFCAP = 12554.54;
Calculator.prototype.CORRESPONDTFCAP = 10671.35;

Calculator.prototype.MGIB3YRRATE = 1789;
Calculator.prototype.MGIB2YRRATE = 1454;
Calculator.prototype.SRRATE = 368;

Calculator.prototype.DEARATE = 1021;
Calculator.prototype.DEARATEOJT = 745;

Calculator.prototype.VRE0DEPRATE = 605.44;
Calculator.prototype.VRE1DEPRATE = 751.00;
Calculator.prototype.VRE2DEPRATE = 885.00;
Calculator.prototype.VREINCRATE = 64.50;
Calculator.prototype.VRE0DEPRATEOJT = 529.36;
Calculator.prototype.VRE1DEPRATEOJT = 640.15;
Calculator.prototype.VRE2DEPRATEOJT = 737.77;
Calculator.prototype.VREINCRATEOJT = 47.99;

// Update the in/out of state values
Calculator.prototype.updateInState = function updateInState() {
  if (!this.inState) {
    this.values.tuitionFeesInput = this.formatCurrency(this.institution.tuitionOutOfState);
  } else {
    this.values.tuitionFeesInput = this.formatCurrency(this.institution.tuitionInState);
  }
};

// populateInputs
Calculator.prototype.populateInputs = function populateInputs() {
  const t = this.formatCurrency(this.institution.tuitionInState);
  this.values.inStateTuitionFees = this.values.tuitionFeesInput = t;
  this.values.booksInput = this.formatCurrency(this.institution.books);
  if (this.institution.calendar) {
    this.values.calendar = this.institution.calendar.toLowerCase();
  } else {
    this.values.calendar = 'semesters';
  }
};

// writeOutputs
Calculator.prototype.writeOutputs = function writeOutputs() {
  // examples of how these lines were transformed:
  // $(this.HOUSING_ALLOW_RATE).html(this.formatCurrency(this.calcMonthlyRateDisplay)+ ' / month');
  // $(this.TOTAL_LEFT_TO_PAY).html(this.formatCurrency(this.calcTotalLeftToPay));
  this.outputs.housingAllowRate = [this.formatCurrency(this.calcMonthlyRateDisplay), 'month'].join(' / ');
  this.outputs.totalLeftToPay = this.formatCurrency(this.calcTotalLeftToPay);

  this.outputs.totalPaidToSchool = this.formatCurrency(this.calcTotalToSchool);
  this.outputs.totalPaidToYou = this.formatCurrency(this.calcTotalToYou);
  this.outputs.totalYear = this.formatCurrency(this.calcTotalYear);

  this.outputs.totalTuitionFeesCharged = this.formatCurrency(this.tuitionFees);
  this.outputs.totalSchoolReceived = this.formatCurrency(this.calcTotalToSchool);
  this.outputs.totalTuitionFeesScholarships = this.formatCurrency(this.calcTotalScholarshipTa);

  this.outputs.term1 = this.calcTerm1;
  this.outputs.term2 = this.calcTerm2;
  this.outputs.term3 = this.calcTerm3;
  this.outputs.term4 = this.calcTerm4;

  this.outputs.tuitionFeesTerm1 = this.formatCurrency(this.calcTuitionFeesTerm1);
  this.outputs.tuitionFeesTerm2 = this.formatCurrency(this.calcTuitionFeesTerm2);
  this.outputs.tuitionFeesTerm3 = this.formatCurrency(this.calcTuitionFeesTerm3);
  this.outputs.tuitionFeesTotal = this.formatCurrency(this.calcTuitionFeesTotal);

  this.outputs.yrBenTerm1 = this.formatCurrency(this.calcYrBenSchoolTerm1);
  this.outputs.yrBenTerm2 = this.formatCurrency(this.calcYrBenSchoolTerm2);
  this.outputs.yrBenTerm3 = this.formatCurrency(this.calcYrBenSchoolTerm3);
  this.outputs.yrBenTotal = this.formatCurrency(this.calcYrBenSchoolTotal);

  this.outputs.yrBenTermVa1 = this.formatCurrency(this.calcYrBenVaTerm1);
  this.outputs.yrBenTermVa2 = this.formatCurrency(this.calcYrBenVaTerm2);
  this.outputs.yrBenTermVa3 = this.formatCurrency(this.calcYrBenVaTerm3);
  this.outputs.yrBenVaTotal = this.formatCurrency(this.calcYrBenVaTotal);

  this.outputs.housingAllowTerm1 = this.formatCurrency(this.calcHousingAllowTerm1);
  this.outputs.housingAllowTerm2 = this.formatCurrency(this.calcHousingAllowTerm2);
  this.outputs.housingAllowTerm3 = this.formatCurrency(this.calcHousingAllowTerm3);
  this.outputs.housingAllowTotal = this.formatCurrency(this.calcHousingAllowTotal);

  this.outputs.bookStipendTerm1 = this.formatCurrency(this.calcBookStipendTerm1);
  this.outputs.bookStipendTerm2 = this.formatCurrency(this.calcBookStipendTerm2);
  this.outputs.bookStipendTerm3 = this.formatCurrency(this.calcBookStipendTerm3);
  this.outputs.bookStipendTotal = this.formatCurrency(this.calcBookStipendTotal);

  if (this.institutionType === 'ojt') {
    this.outputs.housingAllowTerm1 += ' /month';
    this.outputs.housingAllowTerm2 += ' /month';
    this.outputs.housingAllowTerm3 += ' /month';
    this.outputs.housingAllowTotal += ' /month';
    this.outputs.bookStipendTerm1 += ' /month';
    this.outputs.bookStipendTerm2 += ' /month';
    this.outputs.bookStipendTerm3 += ' /month';
    this.outputs.bookStipendTotal += ' /month';
  }

  Object.keys(this.outputs).forEach((key) => {
    this.component.state[key] = this.outputs[key];
  });
};

// Gets all calculator values.
Calculator.prototype.getValues = function getValues() {
  this.getMilitaryStatus();
  this.getGiBillChapter();
  this.getSpouseActiveDuty();
  this.getEligForPostGiBill();
  this.getCumulativeService();
  this.getEnlistmentService();
  this.getConsecutiveService();
  this.getOnline();

  this.getInState();
  this.getTuitionFees();
  this.getInStateTuitionFees();
  this.getBooks();
  this.getYellowRibbon();
  this.getYellowBen();
  this.getScholar();
  this.getTuitionAssist();
  this.getRop();
  this.getRopOld();
  this.getCalendar();
  this.getOjtWorking();
  this.getNumberNontradTerms();
  this.getLengthNontradTerms();
  this.getKickerElig();
  this.getKicker();
  this.getBuyUpElig();
  this.getBuyUp();
};

Calculator.prototype.getDerivedValues = function getDerivedValues() {
  this.getVreOnly();
  this.getOnlyTuitionFees();
  this.getMonthlyRate();
  this.getTier();
  this.getTuitionOutOfState();
  this.getNumberOfTerms();
  this.getTuitionNetPrice();
  this.getTuitionFeesCap();
  this.getTuitionFeesPerTerm();
  this.getTermLength();
  this.getAcadYearLength();
  this.getRopBook();
  this.getCalcRopOld();
  this.getRopOjt();
  this.getYellowRibbonEligibility();
  this.getKickerBenefit();
  this.getBuyUpRate();
  this.getMonthlyRateFinal();
  this.getTerm1();
  this.getTerm2();
  this.getTerm3();
  this.getTerm4();
  this.getTuitionFeesTerm1();
  this.getTuitionFeesTerm2();
  this.getTuitionFeesTerm3();
  this.getTuitionFeesTotal();
  this.getYrBenTerm1();
  this.getYrBenTerm2();
  this.getYrBenTerm3();
  this.getYrBenTotal();
  this.getYrBreakdown();
  this.getTotalPaidToSchool();
  this.getTotalScholarships();
  this.getTotalLeftToPay();
  this.getHousingAllowTerm1();
  this.getHousingAllowTerm2();
  this.getHousingAllowTerm3();
  this.getHousingAllowTotal();
  this.getBookStipendTerm1();
  this.getBookStipendTerm2();
  this.getBookStipendTerm3();
  this.getBookStipendYear();
  this.getTotalPaidToYou();
  this.getTotalTerm1();
  this.getTotalTerm2();
  this.getTotalTerm3();
  this.getTotalTerm2();
  this.getTotalTerm3();
  this.getTotalText();
  this.getTotalYear();
  this.getMonthlyRateDisplay();
};

// Formats currency in USD
Calculator.prototype.formatCurrency = function formatCurrency(num) {
  const str = Math.round(Number(num)).toString();
  // match a digit if it's followed by 3 other digits, appending a comma to each match
  const regex = /\d(?=(\d{3})+$)/g;
  return ['$', str.replace(regex, '$&,')].join();
};

// Converts a currency string to a number
Calculator.prototype.getCurrency = function getCurrency(currency) {
  const regex = /[^0-9\.]+/g;
  return Number(currency.replace(regex, ''));
};


// Calculate if eligible for VR&E and Post-9/11 Benefits
Calculator.prototype.getVreOnly = function getVreOnly() {
  this.calcVreOnly = (this.giBillChapter === 31 && !this.eligForPostGiBill);
  return this;
};

// Calculate if monthly benefit can only be spent on tuition/fees
Calculator.prototype.getOnlyTuitionFees = function getOnlyTuitionFees() {
  if (this.militaryStatus === 'active duty' &&
      (this.giBillChapter === 30 || this.giBillChapter === 1607)) {
    this.calcOnlyTuitionFees = true;
  } else if ((this.institutionType === 'correspondence' ||
      this.institutionType === 'flight') && this.calcOldGiBill === true) {
    this.calcOnlyTuitionFees = true;
  } else if ((this.ropOld === 'less than half' || this.ropOld === 'quarter') &&
      (this.giBillChapter === 30 || this.giBillChapter === 1607 || this.giBillChapter === 35)) {
    this.calcOnlyTuitionFees = true;
  } else {
    this.calcOnlyTuitionFees = false;
  }
};

// Calculate the monthly benefit rate for non-chapter 33 benefits
Calculator.prototype.getMonthlyRate = function getMonthlyRate() {
  this.calcMonthlyRate = 0;
  if (this.giBillChapter === 30 && this.enlistmentService === 3 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.MGIB3YRRATE * 0.75;
  } else if (this.giBillChapter === 30 && this.enlistmentService === 3) {
    this.calcMonthlyRate = this.MGIB3YRRATE;
  } else if (this.giBillChapter === 30 && this.enlistmentService === 2 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.MGIB2YRRATE * 0.75;
  } else if (this.giBillChapter === 30 && this.enlistmentService === 2) {
    this.calcMonthlyRate = this.MGIB2YRRATE;
  } else if (this.giBillChapter === 1607 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.MGIB3YRRATE * this.consecutiveService * 0.75;
  } else if (this.giBillChapter === 1607) {
    this.calcMonthlyRate = this.MGIB3YRRATE * this.consecutiveService;
  } else if (this.giBillChapter === 1606 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.SRRATE * 0.75;
  } else if (this.giBillChapter === 1606) {
    this.calcMonthlyRate = this.SRRATE;
  } else if (this.giBillChapter === 35 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.DEARATEOJT;
  } else if (this.giBillChapter === 35 && this.institutionType === 'flight') {
    this.calcMonthlyRate = 0;
  } else if (this.giBillChapter === 35) {
    this.calcMonthlyRate = this.DEARATE;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 0 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.VRE0DEPRATEOJT;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 0) {
    this.calcMonthlyRate = this.VRE0DEPRATE;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 1 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.VRE1DEPRATEOJT;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 1) {
    this.calcMonthlyRate = this.VRE1DEPRATE;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 2 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.VRE2DEPRATEOJT;
  } else if (this.giBillChapter === 31 && this.numberOfDepend === 2) {
    this.calcMonthlyRate = this.VRE2DEPRATE;
  } else if (this.giBillChapter === 31 && this.numberOfDepend > 2 && this.institutionType === 'ojt') {
    this.calcMonthlyRate = this.VRE2DEPRATEOJT + ((this.numberOfDepend - 2) * this.REINCRATEOJT);
  } else if (this.giBillChapter === 31 && this.numberOfDepend > 2) {
    this.calcMonthlyRate = this.VRE2DEPRATE + ((this.numberOfDepend - 2) * this.VREINCRATE);
  }
  return this;
};

// Calculates the tier.
Calculator.prototype.getTier = function getTier() {
  if (this.giBillChapter === 31 && this.post911Elig === true) {
    this.calcTier = 1;
  } else {
    this.calcTier = parseFloat(this.cumulativeService);
  }
  return this;
};

// Calculate the prepopulated value out-of-state tuiton rates
Calculator.prototype.getTuitionOutOfState = function getTuitionOutOfState() {
  this.calcTuitionOutOfState = this.institution.tuitionOutOfState;
  return this;
};

// Calculate the total number of academic terms
Calculator.prototype.getNumberOfTerms = function getNumberOfTerms() {
  if (this.institutionType === 'ojt') {
    this.calcNumberOfTerms = 3;
  } else if (this.calendar === 'semesters') {
    this.calcNumberOfTerms = 2;
  } else if (this.calendar === 'quarters') {
    this.calcNumberOfTerms = 3;
  } else if (this.calendar === 'nontraditional') {
    this.calcNumberOfTerms = this.numberNontradTerms;
  }
  return this;
};

// Set the net price (Payer of Last Resort)
Calculator.prototype.getTuitionNetPrice = function getTuitionNetPrice() {
  this.calcTuitionFeesPerTerm = Math.max(0, Math.min(
    this.tuitionFees - this.scholar - this.tuitionAssist
  ));
  return this;
};

// Set the proper tuition/fees cap
Calculator.prototype.getTuitionFeesCap = function getTuitionFeesCap() {
  if (this.institutionType === 'flight') {
    this.calcTuitionFeesCap = this.FLTTFCAP;
  } else if (this.institutionType === 'correspondence') {
    this.calcTuitionFeesCap = this.CORRESPONDTFCAP;
  } else if (this.institutionType === 'public' &&
        this.institution.country.toLowerCase() === 'usa' && this.inState) {
    this.calcTuitionFeesCap = this.tuitionFees;
  } else if (this.institutionType === 'public' &&
        this.institution.country.toLowerCase() === 'usa' && !this.inState) {
    this.calcTuitionFeesCap = this.inStateTuitionFees;
  } else if (this.institutionType === 'private' || this.institutionType === 'foreign') {
    this.calcTuitionFeesCap = this.TFCAP;
  }
  return this;
};

// Calculate the tuition/fees per term
Calculator.prototype.getTuitionFeesPerTerm = function getTuitionFeesPerTerm() {
  this.calcTuitionFeesPerTerm = this.tuitionFees / this.calcNumberOfTerms;

  return this;
};

// Calculate the length of each term
Calculator.prototype.getTermLength = function getTermLength() {
  if (this.calendar === 'semesters') {
    this.CalcTermLength = 4.5;
  } else if (this.calendar === 'quarters') {
    this.CalcTermLength = 3;
  } else if (this.calendar === 'nontraditional') {
    this.CalcTermLength = this.lengthNontradTerms;
  } else if (this.institutionType === 'ojt') {
    this.CalcTermLength = 6;
  }
  return this;
};

// Calculate the length of the academic year
Calculator.prototype.getAcadYearLength = function getAcadYearLength() {
  if (this.calendar === 'nontraditional') {
    this.calcAcadYearLength = this.numberNontradTerms * this.lengthNontradTerms;
  } else {
    this.calcAcadYearLength = 9;
  }
  return this;
};

// Calculate the rate of pursuit for Old GI Bill
Calculator.prototype.getCalcRopOld = function getCalcRopOld() {
  if (this.institutionType === 'ojt') {
    this.calcRopOld = this.ojtWorking / 30;
  } else if (this.ropOld === 'full') {
    this.calcRopOld = 1;
  } else if (this.ropOld === 'three quarter') {
    this.calcRopOld = 0.75;
  } else if (this.ropOld === 'half') {
    this.calcRopOld = 0.50;
  } else if (this.ropOld === 'less than half') {
    this.calcRopOld = 0.50;
  } else if (this.ropOld === 'quarter') {
    this.calcRopOld = 0.25;
  }
  return this;
};

// Calculate the rate of pursuit for Book Stipend
Calculator.prototype.getRopBook = function getRopBook() {
  if (this.rop === 1) {
    this.calcRopBook = 1;
  } else if (this.rop === 0.8) {
    this.calcRopBook = 0.75;
  } else if (this.rop === 0.6) {
    this.calcRopBook = 0.50;
  } else if (this.rop === 0) {
    this.calcRopBook = 0.25;
  }
  return this;
};

// Calculate the rate of pursuit for OJT
Calculator.prototype.getRopOjt = function getRopOjt() {
  this.calcRopOjt = this.ojtWorking / 30;

  return this;
};

// Determine yellow ribbon eligibility
Calculator.prototype.getYellowRibbonEligibility = function getYellowRibbonEligibility() {
  if (this.calcTier < 1 || !this.institution.yr || !this.yellowRibbon || this.militaryStatus === 'active duty') {
    this.calcYellowRibbonElig = false;
  } else if (this.institutionType === 'ojt' || this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcYellowRibbonElig = false;
  } else {
    this.calcYellowRibbonElig = true;
  }
  return this;
};

// Determine kicker benefit level
Calculator.prototype.getKickerBenefit = function getKickerBenefit() {
  if (!this.kickerElig) {
    this.calcKickerBenefit = 0;
  } else if (this.institutionType === 'ojt') {
    this.calcKickerBenefit = this.kicker * this.calcRopOjt;
  } else if (this.calcOldGiBill === true || this.calcVreOnly === true) {
    this.calcKickerBenefit = this.kicker * this.calcRopOld;
  } else {
    this.calcKickerBenefit = this.kicker * this.rop;
  }
  return this;
};

// Determine buy up rates
Calculator.prototype.getBuyUpRate = function getBuyUpRate() {
  if (!this.buyUpElig) {
    this.calcBuyUpRate = 0;
  } else if (this.giBillChapter !== 30) {
    this.calcBuyUpRate = 0;
  } else {
    this.calcBuyUpRate = (this.buyUp / 4);
  }
  return this;
};

// Calculate Housing Allowance Rate Final
Calculator.prototype.getMonthlyRateFinal = function getMonthlyRateFinal() {
  this.calcMonthlyRateFinal = this.calcRopOld *
    ((this.calcMonthlyRate + this.calcBuyUpRate) + this.calcKickerBenefit);
  return this;
};

// Calculate the name of Term #1
Calculator.prototype.getTerm1 = function getTerm1() {
  if (this.institutionType === 'ojt') {
    this.calcTerm1 = 'Months 1-6';
  } else if (this.calendar === 'semesters') {
    this.calcTerm1 = 'Fall';
  } else if (this.calendar === 'quarters') {
    this.calcTerm1 = 'Fall';
  } else if (this.calendar === 'nontraditional') {
    this.calcTerm1 = 'Term 1';
  }
  return this;
};

Calculator.prototype.getTerm2 = function getTerm2() {
  if (this.institutionType === 'ojt') {
    this.calcTerm2 = 'Months 7-12';
  } else if (this.calendar === 'semesters') {
    this.calcTerm2 = 'Spring';
  } else if (this.calendar === 'quarters') {
    this.calcTerm2 = 'Winter';
  } else if (this.calendar === 'nontraditional') {
    this.calcTerm2 = 'Term 2';
  }
  return this;
};

Calculator.prototype.getTerm3 = function getTerm3() {
  if (this.institutionType === 'ojt') {
    this.calcTerm3 = 'Months 13-18';
  } else if (this.calendar === 'semesters') {
    this.calcTerm3 = '';
  } else if (this.calendar === 'quarters') {
    this.calcTerm3 = 'Spring';
  } else if (this.calendar === 'nontraditional') {
    this.calcTerm3 = 'Term 3';
  }
  return this;
};

Calculator.prototype.getTerm4 = function getTerm4() {
  if (this.institutionType === 'ojt') {
    this.calcTerm4 = 'Months 19-24';
  } else {
    this.calcTerm4 = 'Total (/Yr)';
  }
  return this;
};

// Calculate Tuition Fees for Term #1
Calculator.prototype.getTuitionFeesTerm1 = function getTuitionFeesTerm1() {
  if (this.institutionType === 'ojt') {
    this.calcTuitionFeesTerm1 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcTuitionFeesTerm1 = 0;
  } else if (this.giBillChapter === 31 &&
      (this.institutionType === 'flight' || this.institutionType === 'correspondence')) {
    this.calcTuitionFeesTerm1 = 0;
  } else if (this.giBillChapter === 31) {
    this.calcTuitionFeesTerm1 = this.calcTuitionFeesPerTerm;
  } else {
    this.calcTuitionFeesTerm1 =
    Math.max(0, Math.min(
      this.calcTier * this.calcTuitionFeesPerTerm,
      this.calcTier * this.calcTuitionFeesCap,
      this.calcTier * this.calcTuitionNetPrice
    ));
  }
  return this;
};

Calculator.prototype.getTuitionFeesTerm2 = function getTuitionFeesTerm2() {
  if (this.institutionType === 'ojt') {
    this.calcTuitionFeesTerm2 = 0;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms === 1) {
    this.calcTuitionFeesTerm2 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcTuitionFeesTerm2 = 0;
  } else if (this.giBillChapter === 31 &&
      (this.institutionType === 'flight' || this.institutionType === 'correspondence')) {
    this.calcTuitionFeesTerm2 = 0;
  } else if (this.giBillChapter === 31) {
    this.calcTuitionFeesTerm2 = this.calcTuitionFeesPerTerm;
  } else {
    this.calcTuitionFeesTerm2 =
    Math.max(0, Math.min(
      this.calcTier * this.calcTuitionFeesPerTerm,
      this.calcTier * this.calcTuitionFeesCap - this.calcTuitionFeesTerm1,
      this.calcTier * this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1
    ));
  }
  return this;
};

Calculator.prototype.getTuitionFeesTerm3 = function getTuitionFeesTerm3() {
  if (this.institutionType === 'ojt') {
    this.calcTuitionFeesTerm3 = 0;
  } else if (this.calendar === 'semesters' ||
      (this.calendar === 'nontraditional' && this.calcNumberOfTerms < 3)) {
    this.calcTuitionFeesTerm3 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcTuitionFeesTerm3 = 0;
  } else if (this.giBillChapter === 31 &&
      (this.institutionType === 'flight' || this.institutionType === 'correspondence')) {
    this.calcTuitionFeesTerm3 = 0;
  } else if (this.giBillChapter === 31) {
    this.calcTuitionFeesTerm3 = this.calcTuitionFeesPerTerm;
  } else {
    this.calcTuitionFeesTerm3 =
    Math.max(0, Math.min(
      this.calcTier * this.calcTuitionFeesPerTerm,
      this.calcTier * this.calcTuitionFeesCap - this.calcTuitionFeesTerm1 - this.calcTuitionFeesTerm2,
      this.calcTier * this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1 - this.calcTuitionFeesTerm2
    ));
  }
  return this;
};

// Calculate the name of Tuition Fees Total
Calculator.prototype.getTuitionFeesTotal = function getTuitionFeesTotal() {
  this.calcTuitionFeesTotal = this.calcTuitionFeesTerm1 +
      this.calcTuitionFeesTerm2 + this.calcTuitionFeesTerm3;

  return this;
};

// Calculate Yellow Ribbon for Term #1
Calculator.prototype.getYrBenTerm1 = function getYrBenTerm1() {
  if (!this.calcYellowRibbonElig || this.yellowBen === 0) {
    this.calcYrBenTerm1 = 0;
  } else if (this.calcOldGiBill === true || this.giBillChapter === 31) {
    this.calcYrBenTerm1 = 0;
  } else if (this.calcTuitionFeesPerTerm === this.calcTuitionFeesTerm1) {
    this.calcYrBenTerm1 = 0;
  } else {
    this.calcYrBenTerm1 = Math.max(0, Math.min(
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1,
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1,
      this.yellowBen * 2
    ));
  }
  return this;
};

Calculator.prototype.getYrBenTerm2 = function getYrBenTerm2() {
  if (!this.calcYellowRibbonElig || this.yellowBen === 0) {
    this.calcYrBenTerm2 = 0;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms === 1) {
    this.calcYrBenTerm2 = 0;
  } else if (this.calcOldGiBill === true || this.giBillChapter === 31) {
    this.calcYrBenTerm2 = 0;
  } else if (this.calcTuitionFeesPerTerm === this.calcTuitionFeesTerm2) {
    this.calcYrBenTerm2 = 0;
  } else {
    this.calcYrBenTerm2 = Math.max(0, Math.min(
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm2,
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1 -
      this.calcTuitionFeesTerm2 - this.calcYrBenTerm1,
      this.yellowBen * 2 - this.calcYrBenTerm1
    ));
  }
  return this;
};

Calculator.prototype.getYrBenTerm3 = function getYrBenTerm3() {
  if (!this.calcYellowRibbonElig || this.yellowBen === 0) {
    this.calcYrBenTerm3 = 0;
  } else if (this.calendar === 'semesters' ||
      (this.calendar === 'nontraditional' && this.calcNumberOfTerms < 3)) {
    this.calcYrBenTerm3 = 0;
  } else if (this.calcOldGiBill === true || this.giBillChapter === 31) {
    this.calcYrBenTerm3 = 0;
  } else if (this.calcTuitionFeesPerTerm === this.calcTuitionFeesTerm3) {
    this.calcYrBenTerm3 = 0;
  } else {
    this.calcYrBenTerm3 = Math.max(0, Math.min(
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm3,
      this.calcTuitionFeesPerTerm - this.calcTuitionFeesTerm1 -
      this.calcTuitionFeesTerm2 - this.calcTuitionFeesTerm3 -
      this.calcYrBenTerm1 - this.calcYrBenTerm2,
      this.yellowBen * 2 - this.calcYrBenTerm1 - this.calcYrBenTerm2
    ));
  }
  return this;
};

// Calculate Yellow Ribbon for the Year
Calculator.prototype.getYrBenTotal = function getYrBenTotal() {
  if (!this.calcYellowRibbonElig || this.yellowBen === 0) {
    this.calcYrBenTotal = 0;
  } else {
    this.calcYrBenTotal = this.calcYrBenTerm1 + this.calcYrBenTerm2 +
      this.calcYrBenTerm3;
  }
  return this;
};

// Calculate Yellow Ribbon by school / VA contributions
Calculator.prototype.getYrBreakdown = function getYrBreakdown() {
  this.calcYrBenSchoolTerm1 = this.calcYrBenTerm1 / 2;
  this.calcYrBenVaTerm1 = this.calcYrBenTerm1 / 2;
  this.calcYrBenSchoolTerm2 = this.calcYrBenTerm2 / 2;
  this.calcYrBenVaTerm2 = this.calcYrBenTerm2 / 2;
  this.calcYrBenSchoolTerm3 = this.calcYrBenTerm3 / 2;
  this.calcYrBenVaTerm3 = this.calcYrBenTerm3 / 2;
  this.calcYrBenSchoolTotal = this.calcYrBenTotal / 2;
  this.calcYrBenVaTotal = this.calcYrBenTotal / 2;
  return this;
};

// Calculate Total Paid to School
Calculator.prototype.getTotalPaidToSchool = function getTotalPaidToSchool() {
  this.calcTotalToSchool = this.calcTuitionFeesTotal + this.calcYrBenTotal;
  return this;
};

// Calculate Total Scholarships and Tuition Assistance
Calculator.prototype.getTotalScholarships = function getTotalScholarships() {
  this.calcTotalScholarshipTa = this.scholar + this.tuitionAssist;
  return this;
};

// Calculate Total Left to Pay
Calculator.prototype.getTotalLeftToPay = function getTotalLeftToPay() {
  this.calcTotalLeftToPay = Math.max(0, this.tuitionFees -
    this.calcTotalToSchool - this.scholar - this.tuitionAssist);
  return this;
};

// Calculate Housing Allowance for Term #1
Calculator.prototype.getHousingAllowTerm1 = function getHousingAllowTerm1() {
  if (this.militaryStatus === 'active duty' && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = 0;
  } else if (this.giBillChapter === 33 & this.militaryStatus === 'spouse' &&
      this.spouseActiveDuty && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = 0;
  } else if (this.giBillChapter === 35 && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = this.calcMonthlyRateFinal;
  } else if (this.calcOldGiBill === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = this.calcMonthlyRateFinal;
  } else if (this.calcVreOnly === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = this.calcMonthlyRateFinal;
  } else if (this.giBillChapter === 31 && (this.institutionType === 'flight' ||
      this.institutionType === 'correspondence')) {
    this.calcTuitionAllowTerm1 = 0;
  } else if (this.giBillChapter === 1607 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm1 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.55)
      ));
  } else if (this.giBillChapter === 1606 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm1 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * 0.55
      ));
  } else if (this.giBillChapter === 1607 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm1 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.giBillChapter === 1606 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm1 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.calcOnlyTuitionFees) {
    this.calcHousingAllowTerm1 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm
      ));
  } else if (this.calcOldGiBill === true || this.calcVreOnly === true) {
    this.calcHousingAllowTerm1 = this.calcMonthlyRateFinal * this.CalcTermLength;
  } else if (this.militaryStatus === 'active duty') {
    this.calcHousingAllowTerm1 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.militaryStatus === 'spouse' && this.spouseActiveDuty) {
    this.calcHousingAllowTerm1 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm1 = 0;
  } else if (this.institutionType === 'ojt') {
    this.calcHousingAllowTerm1 = this.calcRopOjt *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  } else if (this.online) {
    this.calcHousingAllowTerm1 = this.CalcTermLength * this.rop *
      (this.calcTier * this.AVGBAH / 2 + this.calcKickerBenefit);
  } else if (this.institution.country.toLowerCase() !== 'usa') {
    this.calcHousingAllowTerm1 = this.CalcTermLength * this.rop *
      ((this.calcTier * this.AVGBAH) + this.calcKickerBenefit);
  } else {
    this.calcHousingAllowTerm1 = this.CalcTermLength * this.rop *
      ((this.calcTier * this.institution.bah) + this.calcKickerBenefit);
  }
  return this;
};

Calculator.prototype.getHousingAllowTerm2 = function getHousingAllowTerm2() {
  if (this.militaryStatus === 'active duty' && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = 0;
  } else if (this.giBillChapter === 33 &&
      this.militaryStatus === 'spouse' && this.spouseActiveDuty &&
      this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = 0;
  } else if (this.giBillChapter === 35 && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = 0.75 * this.calcMonthlyRateFinal;
  } else if (this.calcOldGiBill === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = (6.6 / 9) * this.calcMonthlyRateFinal;
  } else if (this.calcVreOnly === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = this.calcMonthlyRateFinal;
  } else if (this.institutionType === 'ojt') {
    this.calcHousingAllowTerm2 = 0.8 * this.calcRopOjt *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms === 1) {
    this.calcHousingAllowTerm2 = 0;
  } else if (this.giBillChapter === 31 &&
      (this.institutionType === 'flight' || this.institutionType === 'correspondence')) {
    this.calcTuitionAllowTerm2 = 0;
  } else if (this.giBillChapter === 1607 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm2 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.55)
      ));
  } else if (this.giBillChapter === 1606 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm2 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * 0.55
      ));
  } else if (this.giBillChapter === 1607 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm2 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.giBillChapter === 1606 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm2 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.calcOnlyTuitionFees) {
    this.calcHousingAllowTerm2 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm
      ));
  } else if (this.calcOldGiBill === true || this.calcVreOnly === true) {
    this.calcHousingAllowTerm2 = this.calcMonthlyRateFinal * this.CalcTermLength;
  } else if (this.militaryStatus === 'active duty') {
    this.calcHousingAllowTerm2 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.militaryStatus === 'spouse' && this.spouseActiveDuty) {
    this.calcHousingAllowTerm2 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm2 = 0;
  } else if (this.online) {
    this.calcHousingAllowTerm2 = this.CalcTermLength * this.rop *
      (this.calcTier * this.AVGBAH / 2 + this.calcKickerBenefit);
  } else if (this.institution.country.toLowerCase() !== 'usa') {
    this.calcHousingAllowTerm2 = this.CalcTermLength * this.rop *
      (this.calcTier * this.AVGBAH + this.calcKickerBenefit);
  } else {
    this.calcHousingAllowTerm2 = this.CalcTermLength * this.rop *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  }
  return this;
};

Calculator.prototype.getHousingAllowTerm3 = function getHousingAllowTerm3() {
  if (this.militaryStatus === 'active duty' && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.giBillChapter === 33 && this.militaryStatus === 'spouse' &&
      this.spouseActiveDuty && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.giBillChapter === 35 && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = 0.494 * this.calcMonthlyRateFinal;
  } else if (this.calcOldGiBill === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = (7 / 15) * this.calcMonthlyRateFinal;
  } else if (this.calcVreOnly === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = this.calcMonthlyRateFinal;
  } else if (this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = 0.6 * this.calcRopOjt *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  } else if (this.calendar === 'semesters') {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms < 3) {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.giBillChapter === 31 &&
      (this.institutionType === 'flight' || this.institutionType === 'correspondence')) {
    this.calcTuitionAllowTerm3 = 0;
  } else if (this.giBillChapter === 1607 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm3 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.55)
      ));
  } else if (this.giBillChapter === 1606 && this.institutionType === 'flight') {
    this.calcHousingAllowTerm3 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * 0.55
      ));
  } else if (this.giBillChapter === 1607 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm3 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.giBillChapter === 1607 && this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm3 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm * (this.consecutiveService * 0.6)
      ));
  } else if (this.calcOnlyTuitionFees) {
    this.calcHousingAllowTerm3 = Math.max(0,
      Math.min(this.calcMonthlyRateFinal * this.CalcTermLength,
        this.calcTuitionFeesPerTerm
      ));
  } else if (this.calcOldGiBill === true || this.calcVreOnly === true) {
    this.calcHousingAllowTerm3 = this.calcMonthlyRateFinal * this.CalcTermLength;
  } else if (this.militaryStatus === 'spouse' && this.spouseActiveDuty) {
    this.calcHousingAllowTerm3 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.militaryStatus === 'active duty') {
    this.calcHousingAllowTerm3 = (0 + this.calcKickerBenefit) * this.CalcTermLength;
  } else if (this.online) {
    this.calcHousingAllowTerm3 = this.CalcTermLength * this.rop *
      (this.calcTier * this.AVGBAH / 2 + this.calcKickerBenefit);
  } else if (this.institution.country.toLowerCase() !== 'usa') {
    this.calcHousingAllowTerm3 = this.CalcTermLength * this.rop *
      (this.calcTier * this.AVGBAH + this.calcKickerBenefit);
  } else {
    this.calcHousingAllowTerm3 = this.CalcTermLength * this.rop *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  }
  return this;
};

// Calculate Housing Allowance Total for year
Calculator.prototype.getHousingAllowTotal = function getHousingAllowTotal() {
  if (this.militaryStatus === 'active duty' && this.institutionType === 'ojt') {
    this.calcHousingAllowTerm3 = 0;
  } else if (this.giBillChapter === 35 && this.institutionType === 'ojt') {
    this.calcHousingAllowTotal = 0.25 * this.calcMonthlyRateFinal;
  } else if (this.calcOldGiBill === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTotal = (7 / 15) * this.calcMonthlyRateFinal;
  } else if (this.calcVreOnly === true && this.institutionType === 'ojt') {
    this.calcHousingAllowTotal = this.calcMonthlyRateFinal;
  } else if (this.institutionType === 'ojt') {
    this.calcHousingAllowTotal = 0.4 * this.calcRopOjt *
      (this.calcTier * this.institution.bah + this.calcKickerBenefit);
  } else if (this.calcOnlyTuitionFees) {
    this.calcHousingAllowTotal = Math.max(0,
        Math.min(this.calcMonthlyRateFinal * this.calcAcadYearLength, this.tuitionFees)
      );
  } else {
    this.calcHousingAllowTotal = this.calcHousingAllowTerm1 +
      this.calcHousingAllowTerm2 + this.calcHousingAllowTerm3;
  }
  return this;
};

// Calculate Book Stipend for Term #1
Calculator.prototype.getBookStipendTerm1 = function getBookStipendTerm1() {
  if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcBookStipendTerm1 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcBookStipendTerm1 = 0;
  } else if (this.calcGiBillChapter === 31) {
    this.calcBookStipendTerm1 = this.books / this.calcNumberOfTerms;
  } else if (this.institutionType === 'ojt' && this.giBillChapter === 33) {
    this.calcBookStipendTerm1 = this.BSOJTMONTH;
  } else {
    this.calcBookStipendTerm1 = this.calcRopBook *
      this.BSCAP / this.calcNumberOfTerms * this.calcTier;
  }
  return this;
};

Calculator.prototype.getBookStipendTerm2 = function getBookStipendTerm2() {
  if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcBookStipendTerm2 = 0;
  } else if (this.institutionType === 'ojt' && this.giBillChapter === 33) {
    this.calcBookStipendTerm2 = this.BSOJTMONTH;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms === 1) {
    this.calcBookStipendTerm2 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcBookStipendTerm2 = 0;
  } else if (this.giBillChapter === 31) {
    this.calcBookStipendTerm2 = this.books / this.calcNumberOfTerms;
  } else {
    this.calcBookStipendTerm2 = this.calcRopBook *
      this.BSCAP / this.calcNumberOfTerms * this.calcTier;
  }
  return this;
};

Calculator.prototype.getBookStipendTerm3 = function getBookStipendTerm3() {
  if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
    this.calcBookStipendTerm3 = 0;
  } else if (this.institutionType === 'ojt' && this.giBillChapter === 33) {
    this.calcBookStipendTerm3 = this.BSOJTMONTH;
  } else if (this.calendar === 'semesters') {
    this.calcBookStipendTerm3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms < 3) {
    this.calcBookStipendTerm3 = 0;
  } else if (this.calcOldGiBill === true) {
    this.calcBookStipendTerm3 = 0;
  } else if (this.giBillChapter === 31) {
    this.calcBookStipendTerm3 = this.books / this.calcNumberOfTerms;
  } else {
    this.calcBookStipendTerm3 = this.calcRopBook *
      this.BSCAP / this.calcNumberOfTerms * this.calcTier;
  }
  return this;
};

// Calculate Book Stipend for Year
Calculator.prototype.getBookStipendYear = function getBookStipendYear() {
  if (this.institutionType === 'ojt' && this.giBillChapter === 33) {
    this.calcBookStipendTotal = this.BSOJTMONTH;
  } else {
    this.calcBookStipendTotal = this.calcBookStipendTerm1 +
      this.calcBookStipendTerm2 + this.calcBookStipendTerm3;
  }
  return this;
};

// getTotalPaidToYou
// Calculate Total Payments to You
Calculator.prototype.getTotalPaidToYou = function getTotalPaidToYou() {
  this.calcTotalToYou = this.calcHousingAllowTotal + this.calcBookStipendTotal;
  return this;
};

// Calculate Total Benefits for Term 1
Calculator.prototype.getTotalTerm1 = function getTotalTerm1() {
  if (this.institutionType === 'ojt') {
    this.calcTotalTerm1 = 0;
  } else {
    this.calcTotalTerm1 = this.calcTuitionFeesTerm1 +
      this.calcYrBenTerm1 + this.calcHousingAllowTerm1 +
      this.calcBookStipendTerm1;
  }
  return this;
};

Calculator.prototype.getTotalTerm2 = function getTotalTerm2() {
  if (this.calendar === 'nontraditional' && this.calcNumberOfTerms === 1) {
    this.calcBookStipendTerm2 = 0;
  } else if (this.institutionType === 'ojt') {
    this.calcTotalTerm2 = 0;
  } else {
    this.calcTotalTerm2 = this.calcTuitionFeesTerm2 +
      this.calcYrBenTerm2 + this.calcHousingAllowTerm2 +
      this.calcBookStipendTerm2;
  }
  return this;
};

Calculator.prototype.getTotalTerm3 = function getTotalTerm3() {
  if (this.calendar === 'semesters') {
    this.calcTotalTerm3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calcNumberOfTerms < 3) {
    this.calcTotalTerm3 = 0;
  } else if (this.institutionType === 'ojt') {
    this.calcTotalTerm3 = 0;
  } else {
    this.calcTotalTerm3 = this.calcTuitionFeesTerm3 +
      this.calcYrBenTerm3 + this.calcHousingAllowTerm3 +
      this.calcBookStipendTerm3;
  }
  return this;
};

// Calculate Text for Total Benefits Row
Calculator.prototype.getTotalText = function getTotalText() {
  if (this.giBillChapter === 33) {
    this.calcGiBillTotalText = 'Total Post-9/11 GI Bill Benefits';
  } else if (this.giBillChapter === 30) {
    this.calcGiBillTotalText = 'Total Montgomery GI Bill Benefits';
  } else if (this.giBillChapter === 1606) {
    this.calcGiBillTotalText = 'Total Select Reserve GI Bill Benefits';
  } else if (this.giBillChapter === 1607) {
    this.calcGiBillTotalText = 'Total REAP GI Bill Benefits';
  } else if (this.giBillChapter === 35) {
    this.calcGiBillTotalText = 'Total DEA GI Bill Benefits';
  } else if (this.giBillChapter === 31) {
    this.calcGiBillTotalText = 'Total Voc Rehab Benefits';
  }
  return this;
};

// Calculate Total Benefits for Year
Calculator.prototype.getTotalYear = function getTotalYear() {
  if (this.institutionType === 'ojt') {
    this.calcTotalYear = 0;
  } else {
    this.calcTotalYear = this.calcTuitionFeesTotal +
      this.calcYrBenTotal + this.calcHousingAllowTotal +
        this.calcBookStipendTotal;
  }
  return this;
};

// Calculate Monthly Rate for Display
Calculator.prototype.getMonthlyRateDisplay = function getMonthlyRateDisplay() {
  if (this.institutionType === 'ojt') {
    this.calcMonthlyRateDisplay = this.calcHousingAllowTerm1;
  } else {
    this.calcMonthlyRateDisplay = this.calcHousingAllowTerm1 / this.CalcTermLength;
  }
  return this;
};

export default Calculator;


// retaining during WIP:
//
// Calculator.prototype.resetVisibility = function resetVisibility() {
//   // Tuition/Fees Input Results
//   $(this.TUITION_FEES_SECTION).show();
//   $(this.IN_STATE).hide();
//   $(this.IN_STATE_TUITION_FEES_FORM).hide();
//   $(this.BOOKS_INPUT_ROW).hide();
//   $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
//   $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
//   $(this.YELLOW_RIBBON_RATES_LINK).hide();
//   $(this.SCHOLARSHIP_AMOUNT_FORM).show();
//   $(this.TUITION_ASSIST_FORM).hide();
//
//   // Enrollment Inputs
//   $(this.ENROLLMENT_SECTION).show();
//   $(this.ENROLLED_FORM).show();
//   $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
//   $(this.WORKING_FORM).hide();
//   $(this.CALENDAR_FORM).show();
//   $(this.NUMBER_NON_TRADITIONAL_TERMS_FORM).hide();
//   $(this.LENGTH_NON_TRADITIONAL_TERMS_FORM).hide();
//   $(this.KICKER_ELIG_FORM).show();
//   $(this.KICKER_FORM).hide();
//   $(this.BUY_UP_FORM).hide();
//   $(this.BUY_UP_RATE_FORM).hide();
//
//   // Calculator Results
//   $(this.CALC_HOUSING_ALLOW_RATE_ROW).show();
//   $(this.CALC_TERM_TOTAL_ROW).show();
//   $(this.CALC_PAID_TO_YOU_TOTAL_ROW).show();
//   $(this.CALC_PAID_TO_SCHOOL_TOTAL_ROW).show();
//
//   $(this.CALC_OUT_OF_POCKET_ROW).show();
//   $(this.CALC_TUITION_FEES_CHARGED_ROW).show();
//   $(this.CALC_SCHOOL_RECEIVED_ROW).show();
//   $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).show();
//
//
//   $(this.CALC_TUITION_FEES_ROW).show();
//   $(this.CALC_YELLOW_RIBBON_ROW).show();
//   $(this.CALC_YELLOW_RIBBON_VA_ROW).show();
//
//   // Calculator Results - Particular classes and ids
//   $(this.TERM1).show();
//   $(this.TERM2).show();
//   $(this.TERM3).show();
//   $(this.TERM4).show();
//
//   $(this.TUITION_FEES_TERM_2).show();
//   $(this.TUITION_FEES_TERM_3).show();
//   $(this.YR_BEN_TERM_2).show();
//   $(this.YR_BEN_TERM_3).show();
//   $(this.YR_BEN_TERM_VA_2).show();
//   $(this.YR_BEN_TERM_VA_3).show();
//   $(this.HOUSING_ALLOW_TERM_2).show();
//   $(this.HOUSING_ALLOW_TERM_3).show();
//   $(this.BOOK_STIPEND_TERM_2).show();
//   $(this.BOOK_STIPEND_TERM_3).show();
//
//   // Dependent Visibilities
//   if (this.giBillChapter === 31 && !this.calcVreOnly) {
//     $(this.ENROLLED_FORM).show();
//     $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
//     $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
//     $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
//     $(this.YELLOW_RIBBON_RATES_LINK).hide();
//     $(this.SCHOLARSHIP_AMOUNT_FORM).hide();
//     $(this.TUITION_ASSIST_FORM).hide();
//     $(this.CALC_YELLOW_RIBBON_ROW).hide();
//   }
//
//   if (this.institutionType === 'ojt') {
//     $(this.TUITION_FEES_SECTION).hide();
//     $(this.ENROLLED_FORM).hide();
//     $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
//     $(this.WORKING_FORM).show();
//     $(this.CALENDAR_FORM).hide();
//     $(this.TUITION_ASSIST_FORM).hide();
//     $(this.CALC_TUITION_FEES_ROW).hide();
//     $(this.CALC_YELLOW_RIBBON_ROW).hide();
//     $(this.CALC_YELLOW_RIBBON_VA_ROW).hide();
//     $(this.CALC_SCHOOL_RECEIVED_ROW).hide();
//     $(this.CALC_PAID_TO_SCHOOL_TOTAL_ROW).hide();
//     $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).hide();
//     $(this.CALC_TUITION_FEES_CHARGED_ROW).hide();
//     $(this.CALC_OUT_OF_POCKET_ROW).hide();
//     $(this.CALC_PAID_TO_YOU_TOTAL_ROW).hide();
//     $(this.CALC_TERM_TOTAL_ROW).hide();
//   }
//
//   if (this.giBillChapter === 35) {
//     $(this.KICKER_ELIG_FORM).hide();
//     $(this.KICKER_FORM).hide();
//   }
//
//   if (this.institutionType === 'flight' || this.institutionType === 'correspondence') {
//     $(this.ENROLLED_FORM).hide();
//     $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
//     $(this.KICKER_ELIG_FORM).hide();
//     $(this.BUY_UP_FORM).hide();
//   }
//
//   if (this.institutionType === 'public') {
//     $(this.IN_STATE).show();
//     if (!this.inState) {
//       $(this.IN_STATE_TUITION_FEES_FORM).show();
//     }
//   }
//
//   if (this.institution.yr && this.calcTier === 1.0) {
//     $(this.YELLOW_RIBBON_RECIPIENT_FORM).show();
//
//     if (this.yellowRibbon) {
//       $(this.YELLOW_RIBBON_AMOUNT_FORM).show();
//       $(this.YELLOW_RIBBON_RATES_LINK).show();
//     }
//   }
//
//   if (this.institutionType !== 'ojt' && this.calendar === 'nontraditional') {
//     $(this.NUMBER_NON_TRADITIONAL_TERMS_FORM).show();
//     $(this.LENGTH_NON_TRADITIONAL_TERMS_FORM).show();
//   }
//
//   if (this.calcOldGiBill === true || this.calcVreOnly === true) {
//     $(this.ENROLLED_FORM).hide();
//     $(this.ENROLLED_FORM_OLD_GI_BILL).show();
//     $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
//     $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
//     $(this.YELLOW_RIBBON_RATES_LINK).hide();
//     $(this.CALC_YELLOW_RIBBON_ROW).hide();
//   }
//
//   if (this.kicker_elig) {
//     $(this.KICKER_FORM).show();
//   }
//
//   if (this.buy_up_elig) {
//     $(this.BUY_UP_RATE_FORM).show();
//   }
//
//   if (this.giBillChapter === 31) {
//     $(this.BOOKS_INPUT_ROW).show();
//   } else {
//     $(this.BOOKS_INPUT_ROW).hide();
//   }
//
//   if (this.giBillChapter === 30) {
//     $(this.BUY_UP_FORM).show();
//   } else {
//     $(this.BUY_UP_FORM).hide();
//     $(this.BUY_UP_RATE_FORM).hide();
//   }
//
//   if ((this.militaryStatus === 'active duty' ||
//       this.militaryStatus === 'national guard / reserves') &&
//       this.giBillChapter === 33) {
//     $(this.TUITION_ASSIST_FORM).show();
//   } else {
//     $(this.TUITION_ASSIST_FORM).hide();
//   }
//
//   if (!this.calcYellowRibbonElig) {
//     $(this.CALC_YELLOW_RIBBON_ROW).hide();
//     $(this.CALC_YELLOW_RIBBON_VA_ROW).hide();
//   }
//
//   if (this.calcTotalScholarshipTa === 0) {
//     $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).hide();
//   }
//
//   if (this.calcNumberOfTerms === 1) {
//     $(this.TERM2).hide();
//     $(this.TERM3).hide();
//     $(this.TUITION_FEES_TERM_2).hide();
//     $(this.TUITION_FEES_TERM_3).hide();
//     $(this.YR_BEN_TERM_2).hide();
//     $(this.YR_BEN_TERM_3).hide();
//     $(this.YR_BEN_TERM_VA_2).hide();
//     $(this.YR_BEN_TERM_VA_3).hide();
//     $(this.HOUSING_ALLOW_TERM_2).hide();
//     $(this.HOUSING_ALLOW_TERM_3).hide();
//     $(this.BOOK_STIPEND_TERM_2).hide();
//     $(this.BOOK_STIPEND_TERM_3).hide();
//   }
//
//   if (this.calcNumberOfTerms < 3 && this.institutionType !== 'ojt') {
//     $(this.TERM3).hide();
//     $(this.TUITION_FEES_TERM_3).hide();
//     $(this.YR_BEN_TERM_3).hide();
//     $(this.YR_BEN_TERM_VA_3).hide();
//     $(this.HOUSING_ALLOW_TERM_3).hide();
//     $(this.BOOK_STIPEND_TERM_3).hide();
//   }
// };
//
// // Estimator Ids
// Calculator.prototype.MILITARY_STATUS = '#military-status';
// Calculator.prototype.SPOUSE_ACTIVE_DUTY = '#spouse-active-duty';
// Calculator.prototype.GI_BILL_CHAPTER = '#gi-bill-chapter';
// Calculator.prototype.ELIG_FOR_POST_GI_BILL = '#elig-for-post-gi-bill';
// Calculator.prototype.CUMMULATIVE_SERVICE = '#cumulative-service';
// Calculator.prototype.ENLISTMENT_SERVICE = '#enlistment-service';
// Calculator.prototype.CONSECUTIVE_SERVICE = '#consecutive-service';
// Calculator.prototype.ONLINE_CLASSES = '#online-classes';
//
// // Calculator Tuition
// Calculator.prototype.TUITION_FEES_SECTION = '#tuition-fees-section';
// Calculator.prototype.IN_STATE = '#in-state';
// Calculator.prototype.TUITION_FEES_FORM = '#tuition-fees-form';
// Calculator.prototype.IN_STATE_TUITION_FEES_FORM = '#in-state-tuition-fees-form';
// Calculator.prototype.BOOKS_INPUT_ROW = '#books-input-row';
// Calculator.prototype.YELLOW_RIBBON_RECIPIENT_FORM = '#yellow-ribbon-recipient-form';
// Calculator.prototype.YELLOW_RIBBON_AMOUNT_FORM = '#yellow-ribbon-amount-form';
// Calculator.prototype.YELLOW_RIBBON_RATES_LINK = '#yellow-ribbon-rates-link';
// Calculator.prototype.SCHOLARSHIP_AMOUNT_FORM = '#scholarship-amount-form';
// Calculator.prototype.TUITION_ASSIST_FORM = '#tuition-assist-form';
//
// // Calculator Enrollment
// Calculator.prototype.ENROLLMENT_SECTION = '#enrollment-section';
// Calculator.prototype.ENROLLED_FORM = '#enrolled-form';
// Calculator.prototype.ENROLLED_FORM_OLD_GI_BILL = '#enrolled-form-old-gi-bill';
// Calculator.prototype.CALENDAR_FORM = '#calendar-form';
// Calculator.prototype.WORKING_FORM = '#working-form';
// Calculator.prototype.NUMBER_NON_TRADITIONAL_TERMS_FORM = '#number-non-traditional-terms-form';
// Calculator.prototype.LENGTH_NON_TRADITIONAL_TERMS_FORM = '#length-non-traditional-terms-form';
// Calculator.prototype.KICKER_ELIG_FORM = '#kicker-elig-form';
// Calculator.prototype.KICKER_FORM = '#kicker-form';
// Calculator.prototype.BUY_UP_FORM = '#buy-up-form';
// Calculator.prototype.BUY_UP_RATE_FORM = '#buy-up-rate-form';
//
// // Calculator Output Forms
// Calculator.prototype.CALC_HOUSING_ALLOW_RATE_ROW = '#calc-housing-allow-rate-row';
// Calculator.prototype.CALC_TERM_TOTAL_ROW = '#calc-term-total-row';
// Calculator.prototype.CALC_PAID_TO_SCHOOL_TOTAL_ROW = '#calc-paid-to-school-total-row';
// Calculator.prototype.CALC_PAID_TO_YOU_TOTAL_ROW = '#calc-paid-to-you-total-row';
// Calculator.prototype.CALC_OUT_OF_POCKET_ROW = '#calc-out-of-pocket-row';
// Calculator.prototype.CALC_TUITION_FEES_CHARGED_ROW = '#calc-tuition-fees-charged-row';
// Calculator.prototype.CALC_TUITION_FEES_SCHOLARSHIP_ROW = '#calc-tuition-fees-scholarship-row';
// Calculator.prototype.CALC_SCHOOL_RECEIVED_ROW = '#calc-school-received-row';
// Calculator.prototype.CALC_TUITION_FEES_ROW = '#calc-tuition-fees-row';
// Calculator.prototype.CALC_YELLOW_RIBBON_ROW = '#calc-yellow-ribbon-row';
// Calculator.prototype.CALC_YELLOW_RIBBON_VA_ROW = '#calc-yellow-ribbon-va-row';
//
// // Calculator Output elements
// Calculator.prototype.HOUSING_ALLOW_RATE = '#housing-allow-rate';
// Calculator.prototype.TOTAL_YEAR = '#total-year';
// Calculator.prototype.TOTAL_PAID_TO_SCHOOL = '#total-paid-to-school';
// Calculator.prototype.TOTAL_PAID_TO_YOU = '#total-paid-to-you';
// Calculator.prototype.TOTAL_LEFT_TO_PAY = '#total-left-to-pay';
// Calculator.prototype.TOTAL_TUITION_FEES_CHARGED = '#total-tuition-fees-charged';
// Calculator.prototype.TOTAL_TUITION_FEES_SCHOLARSHIPS = '#total-tuition-fees-scholarships';
// Calculator.prototype.TOTAL_SCHOOL_RECEIVED = '#total-school-received';
// Calculator.prototype.TUITION_FEES_TERM_1 = '#tuition-fees-term-1';
// Calculator.prototype.TUITION_FEES_TERM_2 = '#tuition-fees-term-2';
// Calculator.prototype.TUITION_FEES_TERM_3 = '#tuition-fees-term-3';
// Calculator.prototype.TUITION_FEES_TOTAL = '#tuition-fees-total';
// Calculator.prototype.YR_BEN_TERM_1 = '#yr-ben-term-1';
// Calculator.prototype.YR_BEN_TERM_2 = '#yr-ben-term-2';
// Calculator.prototype.YR_BEN_TERM_3 = '#yr-ben-term-3';
// Calculator.prototype.YR_BEN_TOTAL = '#yr-ben-total';
// Calculator.prototype.YR_BEN_TERM_VA_1 = '#yr-ben-term-va-1';
// Calculator.prototype.YR_BEN_TERM_VA_2 = '#yr-ben-term-va-2';
// Calculator.prototype.YR_BEN_TERM_VA_3 = '#yr-ben-term-va-3';
// Calculator.prototype.YR_BEN_VA_TOTAL = '#yr-ben-va-total';
// Calculator.prototype.HOUSING_ALLOW_TERM_1 = '#housing-allow-term-1';
// Calculator.prototype.HOUSING_ALLOW_TERM_2 = '#housing-allow-term-2';
// Calculator.prototype.HOUSING_ALLOW_TERM_3 = '#housing-allow-term-3';
// Calculator.prototype.HOUSING_ALLOW_TOTAL = '#housing-allow-total';
// Calculator.prototype.BOOK_STIPEND_TERM_1 = '#book-stipend-term-1';
// Calculator.prototype.BOOK_STIPEND_TERM_2 = '#book-stipend-term-2';
// Calculator.prototype.BOOK_STIPEND_TERM_3 = '#book-stipend-term-3';
// Calculator.prototype.BOOK_STIPEND_TOTAL = '#book-stipend-total';
//
// // Class and control selectors
// Calculator.prototype.TERM1 = '.term1';
// Calculator.prototype.TERM2 = '.term2';
// Calculator.prototype.TERM3 = '.term3';
// Calculator.prototype.TERM4 = '.term4';
//
// Calculator.prototype.TUITION_FEES_INPUT = '#tuition-fees-input';
// Calculator.prototype.IN_STATE_TUITION_FEES = '#in-state-tuition-fees';
// Calculator.prototype.BOOKS_INPUT = '#books-input';
// Calculator.prototype.CALENDAR = '#calendar';
//
