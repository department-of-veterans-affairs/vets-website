///////////////////////////////////////////////////////////////////////////////
// Calculator
///////////////////////////////////////////////////////////////////////////////
function Calculator(institution_type, institution) {
  this.institution = institution;
  this.institution_type = institution_type.toLowerCase();

  // For Profit is the same as private (facility code starts with 2)
  if (this.institution_type === "for profit")
    this.institution_type = "private";

  if (!this.institution.bah)
    this.institution.bah = 0.0;

  if (!this.institution.tuition_in_state)
    this.institution.tuition_in_state = 0.0;

  if (!this.institution.tuition_out_of_state)
    this.institution.tuition_out_of_state = 0.0;

  if (!this.institution.books)
    this.institution.books = 0.0;

  if (!this.institution.country)
    this.institution.country = "";

  this.populateInputs();
  this.getValues();
  this.getDerivedValues();
  this.resetVisibility();
  this.writeOutputs();

  var othis = this;
  $(".filter-item").change(function() {
    othis.getValues();
    othis.getDerivedValues();
    othis.resetVisibility();
    othis.writeOutputs();
  });

  $(".filter-in-state").change(function() {
    othis.updateInState();
    othis.getValues();
    othis.getDerivedValues();
    othis.resetVisibility();
    othis.writeOutputs();
  });
}

///////////////////////////////////////////////////////////////////////////////
// Constants
///////////////////////////////////////////////////////////////////////////////

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

// Estimator Ids
Calculator.prototype.MILITARY_STATUS = "#military-status"
Calculator.prototype.SPOUSE_ACTIVE_DUTY = "#spouse-active-duty";
Calculator.prototype.GI_BILL_CHAPTER = "#gi-bill-chapter";
Calculator.prototype.ELIG_FOR_POST_GI_BILL = "#elig-for-post-gi-bill";
Calculator.prototype.CUMMULATIVE_SERVICE = "#cumulative-service";
Calculator.prototype.ENLISTMENT_SERVICE ="#enlistment-service";
Calculator.prototype.CONSECUTIVE_SERVICE ="#consecutive-service";
Calculator.prototype.ONLINE_CLASSES = "#online-classes";

// Calculator Tuition
Calculator.prototype.TUITION_FEES_SECTION = "#tuition-fees-section";
Calculator.prototype.IN_STATE = "#in-state";
Calculator.prototype.TUITION_FEES_FORM = "#tuition-fees-form";
Calculator.prototype.IN_STATE_TUITION_FEES_FORM = "#in-state-tuition-fees-form";
Calculator.prototype.BOOKS_INPUT_ROW = "#books-input-row";
Calculator.prototype.YELLOW_RIBBON_RECIPIENT_FORM = "#yellow-ribbon-recipient-form";
Calculator.prototype.YELLOW_RIBBON_AMOUNT_FORM = "#yellow-ribbon-amount-form";
Calculator.prototype.YELLOW_RIBBON_RATES_LINK = "#yellow-ribbon-rates-link"
Calculator.prototype.SCHOLARSHIP_AMOUNT_FORM = "#scholarship-amount-form";
Calculator.prototype.TUITION_ASSIST_FORM = "#tuition-assist-form";

// Calculator Enrollment
Calculator.prototype.ENROLLMENT_SECTION = "#enrollment-section";
Calculator.prototype.ENROLLED_FORM = "#enrolled-form";
Calculator.prototype.ENROLLED_FORM_OLD_GI_BILL = "#enrolled-form-old-gi-bill";
Calculator.prototype.CALENDAR_FORM = "#calendar-form";
Calculator.prototype.WORKING_FORM = "#working-form";
Calculator.prototype.NUMBER_NON_TRADITIONAL_TERMS_FORM = "#number-non-traditional-terms-form";
Calculator.prototype.LENGTH_NON_TRADITIONAL_TERMS_FORM = "#length-non-traditional-terms-form";
Calculator.prototype.KICKER_ELIG_FORM = "#kicker-elig-form";
Calculator.prototype.KICKER_FORM = "#kicker-form";
Calculator.prototype.BUY_UP_FORM = "#buy-up-form";
Calculator.prototype.BUY_UP_RATE_FORM = "#buy-up-rate-form";

// Calculator Output Forms
Calculator.prototype.CALC_HOUSING_ALLOW_RATE_ROW = "#calc-housing-allow-rate-row";
Calculator.prototype.CALC_TERM_TOTAL_ROW = "#calc-term-total-row";
Calculator.prototype.CALC_PAID_TO_SCHOOL_TOTAL_ROW = "#calc-paid-to-school-total-row";
Calculator.prototype.CALC_PAID_TO_YOU_TOTAL_ROW = "#calc-paid-to-you-total-row";
Calculator.prototype.CALC_OUT_OF_POCKET_ROW = "#calc-out-of-pocket-row";
Calculator.prototype.CALC_TUITION_FEES_CHARGED_ROW = "#calc-tuition-fees-charged-row";
Calculator.prototype.CALC_TUITION_FEES_SCHOLARSHIP_ROW = "#calc-tuition-fees-scholarship-row";
Calculator.prototype.CALC_SCHOOL_RECEIVED_ROW = "#calc-school-received-row";
Calculator.prototype.CALC_TUITION_FEES_ROW = "#calc-tuition-fees-row";
Calculator.prototype.CALC_YELLOW_RIBBON_ROW = "#calc-yellow-ribbon-row";
Calculator.prototype.CALC_YELLOW_RIBBON_VA_ROW = "#calc-yellow-ribbon-va-row";

// Calculator Output elements
Calculator.prototype.HOUSING_ALLOW_RATE = "#housing-allow-rate";
Calculator.prototype.TOTAL_YEAR = "#total-year";
Calculator.prototype.TOTAL_PAID_TO_SCHOOL = "#total-paid-to-school";
Calculator.prototype.TOTAL_PAID_TO_YOU = "#total-paid-to-you";
Calculator.prototype.TOTAL_LEFT_TO_PAY = "#total-left-to-pay";
Calculator.prototype.TOTAL_TUITION_FEES_CHARGED = "#total-tuition-fees-charged";
Calculator.prototype.TOTAL_TUITION_FEES_SCHOLARSHIPS = "#total-tuition-fees-scholarships";
Calculator.prototype.TOTAL_SCHOOL_RECEIVED = "#total-school-received";
Calculator.prototype.TUITION_FEES_TERM_1 = "#tuition-fees-term-1";
Calculator.prototype.TUITION_FEES_TERM_2 = "#tuition-fees-term-2";
Calculator.prototype.TUITION_FEES_TERM_3 = "#tuition-fees-term-3";
Calculator.prototype.TUITION_FEES_TOTAL = "#tuition-fees-total";
Calculator.prototype.YR_BEN_TERM_1 = "#yr-ben-term-1";
Calculator.prototype.YR_BEN_TERM_2 = "#yr-ben-term-2";
Calculator.prototype.YR_BEN_TERM_3 = "#yr-ben-term-3";
Calculator.prototype.YR_BEN_TOTAL = "#yr-ben-total";
Calculator.prototype.YR_BEN_TERM_VA_1 = "#yr-ben-term-va-1";
Calculator.prototype.YR_BEN_TERM_VA_2 = "#yr-ben-term-va-2";
Calculator.prototype.YR_BEN_TERM_VA_3 = "#yr-ben-term-va-3";
Calculator.prototype.YR_BEN_VA_TOTAL = "#yr-ben-va-total";
Calculator.prototype.HOUSING_ALLOW_TERM_1 = "#housing-allow-term-1";
Calculator.prototype.HOUSING_ALLOW_TERM_2 = "#housing-allow-term-2";
Calculator.prototype.HOUSING_ALLOW_TERM_3 = "#housing-allow-term-3";
Calculator.prototype.HOUSING_ALLOW_TOTAL = "#housing-allow-total";
Calculator.prototype.BOOK_STIPEND_TERM_1 = "#book-stipend-term-1";
Calculator.prototype.BOOK_STIPEND_TERM_2 = "#book-stipend-term-2";
Calculator.prototype.BOOK_STIPEND_TERM_3 = "#book-stipend-term-3";
Calculator.prototype.BOOK_STIPEND_TOTAL = "#book-stipend-total";

// Class and control selectors
Calculator.prototype.TERM1 = ".term1";
Calculator.prototype.TERM2 = ".term2";
Calculator.prototype.TERM3 = ".term3";
Calculator.prototype.TERM4 = ".term4";

Calculator.prototype.TUITION_FEES_INPUT = '#tuition-fees-input';
Calculator.prototype.IN_STATE_TUITION_FEES = '#in-state-tuition-fees';
Calculator.prototype.BOOKS_INPUT = '#books-input';
Calculator.prototype.CALENDAR = "#calendar";

///////////////////////////////////////////////////////////////////////////////
// updateInState
// Update the in/out of state values
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.updateInState = function() {
  if (!this.in_state)
    $(this.TUITION_FEES_INPUT).val(this.formatCurrency(this.institution.tuition_out_of_state));
  else
    $(this.TUITION_FEES_INPUT).val(this.formatCurrency(this.institution.tuition_in_state));
};

///////////////////////////////////////////////////////////////////////////////
// updateTextInputs
///////////////////////////////////////////////////////////////////////////////
// Calculator.prototype.updateTextInputs = function() {
//   $('#tuition-fees-input, #in-state-tuition-fees, #books-input,' +
//     '#yellow-ribbon-amount, #scholar, #kicker').on('keyup',
//     function(e) { $(this).change(); });
// };


///////////////////////////////////////////////////////////////////////////////
// populateInputs
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.populateInputs = function() {
  var tis = this.formatCurrency(this.institution.tuition_in_state);

  $(this.TUITION_FEES_INPUT).val(tis);
  $(this.IN_STATE_TUITION_FEES).val(tis);
  $(this.BOOKS_INPUT).val(this.formatCurrency(this.institution.books));

  if (this.institution.calendar) {
    $(this.CALENDAR).val(this.institution.calendar.toLowerCase());
  } else {
    $(this.CALENDAR).val('semesters');
  }
};

///////////////////////////////////////////////////////////////////////////////
// populateInputs
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.writeOutputs = function() {
  $(this.HOUSING_ALLOW_RATE).html(this.formatCurrency(this.calc_monthly_rate_display)+ ' / month');
  $(this.TOTAL_LEFT_TO_PAY).html(this.formatCurrency(this.calc_total_left_to_pay));

  $(this.TOTAL_PAID_TO_SCHOOL).html(this.formatCurrency(this.calc_total_to_school));
  $(this.TOTAL_PAID_TO_YOU).html(this.formatCurrency(this.calc_total_to_you));
  $(this.TOTAL_YEAR).html(this.formatCurrency(this.calc_total_year));

  $(this.TOTAL_TUITION_FEES_CHARGED).html(this.formatCurrency(this.tuition_fees));
  $(this.TOTAL_SCHOOL_RECEIVED).html(this.formatCurrency(this.calc_total_to_school));
  $(this.TOTAL_TUITION_FEES_SCHOLARSHIPS).html(this.formatCurrency(this.calc_total_scholarship_ta));

  $(this.TERM1).html(this.calc_term1);
  $(this.TERM2).html(this.calc_term2);
  $(this.TERM3).html(this.calc_term3);
  $(this.TERM4).html(this.calc_term4);

  $(this.TUITION_FEES_TERM_1).html(this.formatCurrency(this.calc_tuition_fees_term_1));
  $(this.TUITION_FEES_TERM_2).html(this.formatCurrency(this.calc_tuition_fees_term_2));
  $(this.TUITION_FEES_TERM_3).html(this.formatCurrency(this.calc_tuition_fees_term_3));
  $(this.TUITION_FEES_TOTAL).html(this.formatCurrency(this.calc_tuition_fees_total));

  $(this.YR_BEN_TERM_1).html(this.formatCurrency(this.calc_yr_ben_school_term_1));
  $(this.YR_BEN_TERM_2).html(this.formatCurrency(this.calc_yr_ben_school_term_2));
  $(this.YR_BEN_TERM_3).html(this.formatCurrency(this.calc_yr_ben_school_term_3));
  $(this.YR_BEN_TOTAL).html(this.formatCurrency(this.calc_yr_ben_school_total));

  $(this.YR_BEN_TERM_VA_1).html(this.formatCurrency(this.calc_yr_ben_va_term_1));
  $(this.YR_BEN_TERM_VA_2).html(this.formatCurrency(this.calc_yr_ben_va_term_2));
  $(this.YR_BEN_TERM_VA_3).html(this.formatCurrency(this.calc_yr_ben_va_term_3));
  $(this.YR_BEN_VA_TOTAL).html(this.formatCurrency(this.calc_yr_ben_va_total));

  $(this.HOUSING_ALLOW_TERM_1).html(this.formatCurrency(this.calc_housing_allow_term_1));
  $(this.HOUSING_ALLOW_TERM_2).html(this.formatCurrency(this.calc_housing_allow_term_2));
  $(this.HOUSING_ALLOW_TERM_3).html(this.formatCurrency(this.calc_housing_allow_term_3));
  $(this.HOUSING_ALLOW_TOTAL).html(this.formatCurrency(this.calc_housing_allow_total));

  $(this.BOOK_STIPEND_TERM_1).html(this.formatCurrency(this.calc_book_stipend_term_1));
  $(this.BOOK_STIPEND_TERM_2).html(this.formatCurrency(this.calc_book_stipend_term_2));
  $(this.BOOK_STIPEND_TERM_3).html(this.formatCurrency(this.calc_book_stipend_term_3));
  $(this.BOOK_STIPEND_TOTAL).html(this.formatCurrency(this.calc_book_stipend_total));

  if (this.institution_type == 'ojt') {
    $(this.HOUSING_ALLOW_TERM_1).append(' /month');
    $(this.HOUSING_ALLOW_TERM_2).append(' /month');
    $(this.HOUSING_ALLOW_TERM_3).append(' /month');
    $(this.HOUSING_ALLOW_TOTAL).append(' /month');
    $(this.BOOK_STIPEND_TERM_1).append(' /month');
    $(this.BOOK_STIPEND_TERM_2).append(' /month');
    $(this.BOOK_STIPEND_TERM_3).append(' /month');
    $(this.BOOK_STIPEND_TOTAL).append(' /month');
  }
};

///////////////////////////////////////////////////////////////////////////////
// setValues
// Sets all calculator values.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getValues = function() {
  this.getMilitaryStatus(this.MILITARY_STATUS);
  this.getGiBillChapter(this.GI_BILL_CHAPTER);
  this.getSpouseActiveDuty(this.SPOUSE_ACTIVE_DUTY);
  this.getEligForPostGiBill(this.ELIG_FOR_POST_GI_BILL);
  this.getCumulativeService(this.CUMMULATIVE_SERVICE);
  this.getEnlistmentService(this.ENLISTMENT_SERVICE);
  this.getConsecutiveService(this.CONSECUTIVE_SERVICE);
  this.getOnline(this.ONLINE_CLASSES);

  this.getInState(this.IN_STATE);
  this.getTuitionFees(this.TUITION_FEES_INPUT);
  this.getInStateTuitionFees(this.IN_STATE_TUITION_FEES);
  this.getBooks(this.BOOKS_INPUT);
  this.getYellowRibbon(this.YELLOW_RIBBON_RECIPIENT_FORM);
  this.getYellowBen(this.YELLOW_RIBBON_AMOUNT_FORM);
  this.getScholar(this.SCHOLARSHIP_AMOUNT_FORM);
  this.getTuitionAssist(this.TUITION_ASSIST_FORM);
  this.getRop(this.ENROLLED_FORM);
  this.getRopOld(this.ENROLLED_FORM_OLD_GI_BILL);
  this.getCalendar(this.CALENDAR);
  this.getOjtWorking(this.WORKING_FORM);
  this.getNumberNontradTerms(this.NUMBER_NON_TRADITIONAL_TERMS_FORM);
  this.getLengthNontradTerms(this.LENGTH_NON_TRADITIONAL_TERMS_FORM);
  this.getKickerElig(this.KICKER_ELIG_FORM);
  this.getKicker(this.KICKER_FORM);
  this.getBuyUpElig(this.BUY_UP_FORM);
  this.getBuyUp(this.BUY_UP_RATE_FORM);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getDerivedValues = function() {
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

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.resetVisibility = function() {
  // Tuition/Fees Input Results
  $(this.TUITION_FEES_SECTION).show();
  $(this.IN_STATE).hide();
  $(this.IN_STATE_TUITION_FEES_FORM).hide();
  $(this.BOOKS_INPUT_ROW).hide();
  $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
  $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
  $(this.YELLOW_RIBBON_RATES_LINK).hide();
  $(this.SCHOLARSHIP_AMOUNT_FORM).show();
  $(this.TUITION_ASSIST_FORM).hide();

  // Enrollment Inputs
  $(this.ENROLLMENT_SECTION).show();
  $(this.ENROLLED_FORM).show();
  $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
  $(this.WORKING_FORM).hide();
  $(this.CALENDAR_FORM).show();
  $(this.NUMBER_NON_TRADITIONAL_TERMS_FORM).hide();
  $(this.LENGTH_NON_TRADITIONAL_TERMS_FORM).hide();
  $(this.KICKER_ELIG_FORM).show();
  $(this.KICKER_FORM).hide();
  $(this.BUY_UP_FORM).hide();
  $(this.BUY_UP_RATE_FORM).hide();

  // Calculator Results
  $(this.CALC_HOUSING_ALLOW_RATE_ROW).show();
  $(this.CALC_TERM_TOTAL_ROW).show();
  $(this.CALC_PAID_TO_YOU_TOTAL_ROW).show();
  $(this.CALC_PAID_TO_SCHOOL_TOTAL_ROW).show();

  $(this.CALC_OUT_OF_POCKET_ROW).show();
  $(this.CALC_TUITION_FEES_CHARGED_ROW).show();
  $(this.CALC_SCHOOL_RECEIVED_ROW).show();
  $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).show();


  $(this.CALC_TUITION_FEES_ROW).show();
  $(this.CALC_YELLOW_RIBBON_ROW).show();
  $(this.CALC_YELLOW_RIBBON_VA_ROW).show();

  // Calculator Results - Particular classes and ids
  $(this.TERM1).show();
  $(this.TERM2).show();
  $(this.TERM3).show();
  $(this.TERM4).show();

  $(this.TUITION_FEES_TERM_2).show();
  $(this.TUITION_FEES_TERM_3).show();
  $(this.YR_BEN_TERM_2).show();
  $(this.YR_BEN_TERM_3).show();
  $(this.YR_BEN_TERM_VA_2).show();
  $(this.YR_BEN_TERM_VA_3).show();
  $(this.HOUSING_ALLOW_TERM_2).show();
  $(this.HOUSING_ALLOW_TERM_3).show();
  $(this.BOOK_STIPEND_TERM_2).show();
  $(this.BOOK_STIPEND_TERM_3).show();

  // Dependent Visibilities
  if (this.gi_bill_chapter == 31 && !this.calc_vre_only) {
    $(this.ENROLLED_FORM).show();
    $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
    $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
    $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
    $(this.YELLOW_RIBBON_RATES_LINK).hide();
    $(this.SCHOLARSHIP_AMOUNT_FORM).hide();
    $(this.TUITION_ASSIST_FORM).hide();
    $(this.CALC_YELLOW_RIBBON_ROW).hide();
  }

  if (this.institution_type === 'ojt') {
    $(this.TUITION_FEES_SECTION).hide();
    $(this.ENROLLED_FORM).hide();
    $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
    $(this.WORKING_FORM).show();
    $(this.CALENDAR_FORM).hide();
    $(this.TUITION_ASSIST_FORM).hide();
    $(this.CALC_TUITION_FEES_ROW).hide();
    $(this.CALC_YELLOW_RIBBON_ROW).hide();
    $(this.CALC_YELLOW_RIBBON_VA_ROW).hide();
    $(this.CALC_SCHOOL_RECEIVED_ROW).hide();
    $(this.CALC_PAID_TO_SCHOOL_TOTAL_ROW).hide();
    $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).hide();
    $(this.CALC_TUITION_FEES_CHARGED_ROW).hide();
    $(this.CALC_OUT_OF_POCKET_ROW).hide();
    $(this.CALC_PAID_TO_YOU_TOTAL_ROW).hide();
    $(this.CALC_TERM_TOTAL_ROW).hide();
  }

  if (this.gi_bill_chapter == 35) {
    $(this.KICKER_ELIG_FORM).hide();
    $(this.KICKER_FORM).hide();
  }

  if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    $(this.ENROLLED_FORM).hide();
    $(this.ENROLLED_FORM_OLD_GI_BILL).hide();
    $(this.KICKER_ELIG_FORM).hide();
    $(this.BUY_UP_FORM).hide();
  }

  if (this.institution_type === 'public') {
    $(this.IN_STATE).show();
    if (!this.in_state) {
      $(this.IN_STATE_TUITION_FEES_FORM).show();
    }
  }

  if (this.institution.yr && this.calc_tier == 1.0) {
    $(this.YELLOW_RIBBON_RECIPIENT_FORM).show();

    if (this.yellow_ribbon) {
      $(this.YELLOW_RIBBON_AMOUNT_FORM).show();
      $(this.YELLOW_RIBBON_RATES_LINK).show();
    }
  }

  if (this.institution_type !== 'ojt' && this.calendar === 'nontraditional') {
    $(this.NUMBER_NON_TRADITIONAL_TERMS_FORM).show();
    $(this.LENGTH_NON_TRADITIONAL_TERMS_FORM).show();
  }

  if (this.calc_old_gi_bill == true || this.calc_vre_only == true) {
    $(this.ENROLLED_FORM).hide();
    $(this.ENROLLED_FORM_OLD_GI_BILL).show();
    $(this.YELLOW_RIBBON_RECIPIENT_FORM).hide();
    $(this.YELLOW_RIBBON_AMOUNT_FORM).hide();
    $(this.YELLOW_RIBBON_RATES_LINK).hide();
    $(this.CALC_YELLOW_RIBBON_ROW).hide();
  }

  if (this.kicker_elig) {
    $(this.KICKER_FORM).show();
  }

  if (this.buy_up_elig) {
    $(this.BUY_UP_RATE_FORM).show();
  }

  if (this.gi_bill_chapter == 31) {
    $(this.BOOKS_INPUT_ROW).show();
  } else {
    $(this.BOOKS_INPUT_ROW).hide();
  }

  if (this.gi_bill_chapter == 30) {
    $(this.BUY_UP_FORM).show();
  } else {
    $(this.BUY_UP_FORM).hide();
    $(this.BUY_UP_RATE_FORM).hide();
  }

  if ((this.military_status === 'active duty' ||
      this.military_status === 'national guard / reserves') &&
      this.gi_bill_chapter == 33) {
    $(this.TUITION_ASSIST_FORM).show();
  } else {
    $(this.TUITION_ASSIST_FORM).hide();
  }

  if (!this.calc_yellow_ribbon_elig) {
    $(this.CALC_YELLOW_RIBBON_ROW).hide();
    $(this.CALC_YELLOW_RIBBON_VA_ROW).hide();
  }

   if (this.calc_total_scholarship_ta == 0) {
      $(this.CALC_TUITION_FEES_SCHOLARSHIP_ROW).hide();
    }

  if (this.calc_number_of_terms == 1) {
    $(this.TERM2).hide();
    $(this.TERM3).hide();
    $(this.TUITION_FEES_TERM_2).hide();
    $(this.TUITION_FEES_TERM_3).hide();
    $(this.YR_BEN_TERM_2).hide();
    $(this.YR_BEN_TERM_3).hide();
    $(this.YR_BEN_TERM_VA_2).hide();
    $(this.YR_BEN_TERM_VA_3).hide();
    $(this.HOUSING_ALLOW_TERM_2).hide();
    $(this.HOUSING_ALLOW_TERM_3).hide();
    $(this.BOOK_STIPEND_TERM_2).hide();
    $(this.BOOK_STIPEND_TERM_3).hide();
  }

  if (this.calc_number_of_terms < 3 && this.institution_type !== 'ojt') {
    $(this.TERM3).hide();
    $(this.TUITION_FEES_TERM_3).hide();
    $(this.YR_BEN_TERM_3).hide();
    $(this.YR_BEN_TERM_VA_3).hide();
    $(this.HOUSING_ALLOW_TERM_3).hide();
    $(this.BOOK_STIPEND_TERM_3).hide();
  }
};

///////////////////////////////////////////////////////////////////////////////
// formatCurrency
// Formats currency in USD
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.formatCurrency = function (num) {
  var str = Math.round(Number(num)).toString();

  // match a digit if it's followed by 3 other digits, appending a comma to each match
  return '$' + str.replace(/\d(?=(\d{3})+$)/g, '$&,');
};

///////////////////////////////////////////////////////////////////////////////
// getCurrency
// Converts a currency string to a number.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getCurrency = function (currency) {
  return Number(currency.replace(/[^0-9\.]+/g,''));
}

///////////////////////////////////////////////////////////////////////////////
// setMilitaryStatus
//
// Saves as number.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getMilitaryStatus = function(id) {
  this.military_status = $(id).val();

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getSpouseActiveDuty
// Sets the spouse active duty from the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getSpouseActiveDuty = function(id) {
  this.spouse_active_duty = $(id).val().toLowerCase() === "yes";

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getGiBillChapter
// Sets gi bill chapter value from the element with the id argument. Also sets
// the old_gi_bill boolean based on the value of the gi_bill_chapter.
//
// Saves as number.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getGiBillChapter = function(id) {
  this.gi_bill_chapter = Number($(id).val());

  this.calc_old_gi_bill = (this.gi_bill_chapter == 30 || this.gi_bill_chapter == 1607
    || this.gi_bill_chapter == 1606 || this.gi_bill_chapter == 35);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getEligForPostGiBill
// Sets gi bill chapter value from the element with the id argument.
//
// Saves as bool.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getEligForPostGiBill = function(id) {
  this.elig_for_post_gi_bill = $(id).val().toLowerCase() === 'yes';

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getCumulativeService
// Sets the cumulative service value from the element with the id argument.
//
// Saves as float.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getCumulativeService = function(id) {
  var val = $(id).val();

  this.service_discharge = val === "service discharge";
  this.cumulative_service = this.service_discharge ? 1.0 : parseFloat(val);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getConsecutiveService
// Sets consecutive service value from the element with the id argument.
//
// Saves as number.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getConsecutiveService = function(id) {
  this.consecutive_service = Number($(id).val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getEnlistmentService
// Sets enlistment service value from the element with the id argument.
//
// Saves as number.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getEnlistmentService = function(id) {
  this.enlistment_service = Number($(id).val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getOnline
// Sets online value from the element with the id argument.
//
// Saves as boolean.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getOnline = function(id) {
  this.online = $(id).val().toLowerCase() === 'yes';

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getInState
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getInState = function(id) {
  this.in_state = $(id + " :input:checked").val().toLowerCase() === "yes";

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFees
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFees = function(id) {
  this.tuition_fees = this.getCurrency($(id).val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getInStateTuitionFees
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getInStateTuitionFees = function(id) {
  this.in_state_tuition_fees = this.getCurrency($(id).val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBooks
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBooks = function(id) {
  this.books = this.getCurrency($(id).val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYellowRibbon
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYellowRibbon = function(id) {
  this.yellow_ribbon = $(id + " :input:checked").val().toLowerCase() === "yes";

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYellowBen
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYellowBen = function(id) {
  this.yellow_ben = this.getCurrency($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getScholar
// Sets the value and visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getScholar = function(id) {
  this.scholar = this.getCurrency($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionAssist
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionAssist = function(id) {
  this.tuition_assist = this.getCurrency($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getRop
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getRop = function(id) {
  this.rop = Number($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getRopOld
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getRopOld = function(id) {
  this.rop_old = $(id + " :input").val();
  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getCalendar
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getCalendar = function(id) {
  this.calendar = $(id).val();

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getOjtWorking
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getOjtWorking = function(id) {
  this.ojt_working = $(id + " :input").val();

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getNumberNontradTerms
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getNumberNontradTerms = function(id) {
  this.number_nontrad_terms = Number($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getLengthNontradTerms
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getLengthNontradTerms = function(id) {
  this.length_nontrad_terms = $(id + " :input").val();

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getKickerElig
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getKickerElig = function(id) {
  this.kicker_elig = $(id + " :input:checked").val().toLowerCase() === "yes";

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getKicker
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getKicker = function(id) {
  this.kicker = this.getCurrency($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBuyUpElig
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBuyUpElig = function(id) {
  this.buy_up_elig = $(id + " :input:checked").val().toLowerCase() === "yes";

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBuyUp
// Sets the visibility for the element with the id argument.
//
// Saves as boolean
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBuyUp = function(id) {
  this.buy_up = Number($(id + " :input").val());

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// setVreOnly
// Calculate if eligible for VR&E and Post-9/11 Benefits.
//
// Saves as boolean.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getVreOnly = function () {
  this.calc_vre_only = (this.gi_bill_chapter == 31 && !this.elig_for_post_gi_bill);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getOnlyTuitionFees
// Calculate if monthly benefit can only be spent on tuition/fees
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getOnlyTuitionFees = function () {
  if (this.military_status === 'active duty' &&
      (this.gi_bill_chapter == 30 || this.gi_bill_chapter == 1607)) {
    this.calc_only_tuition_fees = true;
  } else if ((this.institution_type === 'correspondence' ||
      this.institution_type === 'flight') && this.calc_old_gi_bill == true) {
    this.calc_only_tuition_fees = true;
  } else if ((this.rop_old === "less than half" || this.rop_old === "quarter") &&
      (this.gi_bill_chapter == 30 || this.gi_bill_chapter == 1607 || this.gi_bill_chapter == 35)) {
    this.calc_only_tuition_fees = true;
  } else {
      this.calc_only_tuition_fees = false;
  }
};

///////////////////////////////////////////////////////////////////////////////
// getMonthlyRate
// Calculate the monthly benefit rate for non-chapter 33 benefits
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getMonthlyRate = function ( ) {
  this.calc_monthlyrate = 0;

  if (this.gi_bill_chapter == 30 && this.enlistment_service == 3 && this.institution_type === 'ojt' ) {
      this.calc_monthlyrate = this.MGIB3YRRATE * 0.75;
  } else if (this.gi_bill_chapter == 30 && this.enlistment_service == 3 ) {
      this.calc_monthlyrate = this.MGIB3YRRATE;
  } else if (this.gi_bill_chapter == 30 && this.enlistment_service == 2 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.MGIB2YRRATE * 0.75;
  } else if (this.gi_bill_chapter == 30 && this.enlistment_service == 2 ) {
      this.calc_monthlyrate = this.MGIB2YRRATE;
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.MGIB3YRRATE * this.consecutive_service * 0.75;
  } else if (this.gi_bill_chapter == 1607 ) {
      this.calc_monthlyrate = this.MGIB3YRRATE* this.consecutive_service;
  } else if (this.gi_bill_chapter == 1606 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.SRRATE * 0.75;
  } else if (this.gi_bill_chapter == 1606 ) {
      this.calc_monthlyrate = this.SRRATE;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.DEARATEOJT;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'flight') {
      this.calc_monthlyrate = 0;
  } else if (this.gi_bill_chapter == 35) {
      this.calc_monthlyrate = this.DEARATE;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 0 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.VRE0DEPRATEOJT;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 0) {
      this.calc_monthlyrate = this.VRE0DEPRATE;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 1 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.VRE1DEPRATEOJT;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 1) {
      this.calc_monthlyrate = this.VRE1DEPRATE;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 2 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.VRE2DEPRATEOJT;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend == 2) {
      this.calc_monthlyrate = this.VRE2DEPRATE;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend > 2 && this.institution_type === 'ojt') {
      this.calc_monthlyrate = this.VRE2DEPRATEOJT + ((this.number_of_depend-2) * Vthis.REINCRATEOJT) ;
  } else if (this.gi_bill_chapter == 31 && this.number_of_depend > 2) {
      this.calc_monthlyrate = this.VRE2DEPRATE + ((this.number_of_depend-2) * this.VREINCRATE) ;
  }

  return this;
};


///////////////////////////////////////////////////////////////////////////////
// getTier
// Calculates the tier.
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTier = function () {
  if (this.gi_bill_chapter == 31 && this.post_911_elig == true)
    this.calc_tier = 1;
  else
    this.calc_tier = parseFloat(this.cumulative_service);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionOutOfState
// Calculate the prepopulated value out-of-state tuiton rates
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionOutOfState = function () {
  this.calc_tuition_out_of_state = this.institution.tuition_out_of_state;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getNumberOfTerms
// Calculate the total number of academic terms
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getNumberOfTerms = function () {
  if (this.institution_type === 'ojt')
    this.calc_number_of_terms = 3;
  else if (this.calendar === 'semesters')
    this.calc_number_of_terms = 2;
  else if (this.calendar == 'quarters')
    this.calc_number_of_terms = 3;
  else if (this.calendar == 'nontraditional') {
    this.calc_number_of_terms = this.number_nontrad_terms;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionNetPrice
// Set the net price (Payer of Last Resort)
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionNetPrice = function () {
  this.calc_tuition_net_price = Math.max(0, Math.min(
    this.tuition_fees - this.scholar - this.tuition_assist
  ));

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesCap
// Set the proper tuition/fees cap
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesCap = function () {
  if (this.institution_type === 'flight') {
    this.calc_tuition_fees_cap = this.FLTTFCAP;
  } else if (this.institution_type === 'correspondence') {
    this.calc_tuition_fees_cap = this.CORRESPONDTFCAP;
  } else if (this.institution_type === 'public' &&
        this.institution.country.toLowerCase() === 'usa' && this.in_state) {
    this.calc_tuition_fees_cap = this.tuition_fees;
  } else if (this.institution_type === 'public' &&
        this.institution.country.toLowerCase() === 'usa' && !this.in_state) {
    this.calc_tuition_fees_cap = this.in_state_tuition_fees;
  } else if (this.institution_type === 'private' || this.institution_type === 'foreign') {
    this.calc_tuition_fees_cap = this.TFCAP;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesPerTerm
// Calculate the tuition/fees per term
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesPerTerm = function () {
  this.calc_tuition_fees_per_term = this.tuition_fees / this.calc_number_of_terms;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTermLength
// Calculate the length of each term
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTermLength = function () {
  if (this.calendar == 'semesters') {
    this.calc_term_length = 4.5;
  } else if (this.calendar === 'quarters')  {
    this.calc_term_length = 3;
  } else if (this.calendar === 'nontraditional') {
    this.calc_term_length = this.length_nontrad_terms;
  } else if (this.institution_type === 'ojt') {
    this.calc_term_length = 6;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getAcadYearLength
// Calculate the length of the academic year
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getAcadYearLength = function () {
  if (this.calendar === 'nontraditional') {
    this.calc_acad_year_length = this.number_nontrad_terms * this.length_nontrad_terms;
  } else {
    this.calc_acad_year_length = 9;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getRopOld
// Calculate the rate of pursuit for Old GI Bill
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getCalcRopOld = function () {
  if (this.institution_type === 'ojt') {
    this.calc_rop_old = this.ojt_working / 30;
  } else if (this.rop_old === "full") {
    this.calc_rop_old = 1;
  } else if (this.rop_old === "three quarter") {
    this.calc_rop_old = 0.75;
  } else if (this.rop_old === "half") {
    this.calc_rop_old = 0.50;
  } else if (this.rop_old === "less than half") {
    this.calc_rop_old = 0.50;
  } else if (this.rop_old === "quarter") {
    this.calc_rop_old = 0.25;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getRopBook
// Calculate the rate of pursuit for Book Stipend
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getRopBook = function () {
  if (this.rop == 1) {
    this.calc_rop_book = 1;
  } else if (this.rop == 0.8) {
    this.calc_rop_book = 0.75;
  } else if (this.rop == 0.6) {
    this.calc_rop_book = 0.50;
  } else if (this.rop == 0) {
    this.calc_rop_book = 0.25;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getRopOjt
// Calculate the rate of pursuit for OJT
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getRopOjt = function () {
  this.calc_rop_ojt = this.ojt_working / 30;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// setYellowRibbonEligibility
// Determine yellow ribbon eligibility
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYellowRibbonEligibility = function () {
  if (this.calc_tier < 1 || !this.institution.yr || !this.yellow_ribbon
      || this.military_status === 'active duty') {
    this.calc_yellow_ribbon_elig = false;
  }
  else if (this.institution_type === 'ojt' || this.institution_type === 'flight' ||
      this.institution_type === 'correspondence') {
    this.calc_yellow_ribbon_elig = false;
  } else {
    this.calc_yellow_ribbon_elig = true;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getKickerBenefit
// Determine kicker benefit level
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getKickerBenefit = function () {
  if (!this.kicker_elig) {
    this.calc_kicker_benefit = 0;
  } else if (this.institution_type === 'ojt') {
    this.calc_kicker_benefit = this.kicker * this.calc_rop_ojt;
  } else if (this.calc_old_gi_bill == true || this.calc_vre_only == true) {
    this.calc_kicker_benefit = this.kicker * this.calc_rop_old;
  } else {
    this.calc_kicker_benefit = this.kicker * this.rop;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBuyUpRate
// Determine buy up rates
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBuyUpRate = function () {
  if (!this.buy_up_elig) {
    this.calc_buy_up_rate = 0;
  } else if (this.gi_bill_chapter != 30) {
    this.calc_buy_up_rate = 0;
  } else {
    this.calc_buy_up_rate = (this.buy_up / 4);
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// Calculate Housing Allowance Rate Final
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getMonthlyRateFinal = function () {
  this.calc_monthly_rate_final = this.calc_rop_old *
    ((this.calc_monthlyrate + this.calc_buy_up_rate)  + this.calc_kicker_benefit);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTerm1
// Calculate the name of Term #1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTerm1 = function () {
  if (this.institution_type == 'ojt') {
    this.calc_term1 = 'Months 1-6';
  } else if (this.calendar == 'semesters') {
    this.calc_term1 = 'Fall';
  } else if (this.calendar == 'quarters') {
    this.calc_term1 = 'Fall';
  } else if (this.calendar == 'nontraditional') {
    this.calc_term1 = 'Term 1';
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTerm2
// Calculate the name of Term #2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTerm2 = function () {
  if (this.institution_type == 'ojt') {
    this.calc_term2 = 'Months 7-12';
  } else if (this.calendar == 'semesters') {
    this.calc_term2 = 'Spring';
  } else if (this.calendar == 'quarters')  {
    this.calc_term2 = 'Winter';
  } else if (this.calendar == 'nontraditional') {
    this.calc_termterm2 = 'Term 2';
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTerm3
// Calculate the name of Term #3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTerm3 = function () {
  if (this.institution_type == 'ojt') {
    this.calc_term3 = 'Months 13-18';
  } else if (this.calendar == 'semesters') {
    this.calc_term3 = '';
  } else if (this.calendar == 'quarters')  {
    this.calc_term3 = 'Spring';
  } else if (this.calendar == 'nontraditional') {
    this.calc_term3 = 'Term 3';
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTerm4
// Calculate the name of Term #4
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTerm4 = function () {
  if (this.institution_type == 'ojt') {
    this.calc_term4 = 'Months 19-24';
  } else {
    this.calc_term4 = 'Total (/Yr)';
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesTerm1
// Calculate Tuition Fees for Term #1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesTerm1 = function () {
  if (this.institution_type === 'ojt') {
    this.calc_tuition_fees_term_1 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_tuition_fees_term_1 = 0;
  } else if (this.gi_bill_chapter == 31 &&
      (this.institution_type === 'flight' || this.institution_type === 'correspondence')) {
    this.calc_tuition_fees_term_1 = 0;
  } else if (this.gi_bill_chapter == 31) {
    this.calc_tuition_fees_term_1 = this.calc_tuition_fees_per_term;
  } else {
    this.calc_tuition_fees_term_1 =
    Math.max(0, Math.min(
      this.calc_tier * this.calc_tuition_fees_per_term,
      this.calc_tier * this.calc_tuition_fees_cap,
      this.calc_tier * this.calc_tuition_net_price
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesTerm2
// Calculate Tuition Fees for Term #2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesTerm2 = function () {
  if (this.institution_type == 'ojt') {
    this.calc_tuition_fees_term_2 = 0;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms == 1) {
    this.calc_tuition_fees_term_2 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_tuition_fees_term_2 = 0;
  } else if (this.gi_bill_chapter == 31 &&
      (this.institution_type === 'flight' || this.institution_type === 'correspondence')) {
    this.calc_tuition_fees_term_2 = 0;
  } else if (this.gi_bill_chapter == 31) {
    this.calc_tuition_fees_term_2 = this.calc_tuition_fees_per_term;
  } else {
    this.calc_tuition_fees_term_2 =
    Math.max(0, Math.min(
      this.calc_tier * this.calc_tuition_fees_per_term,
      this.calc_tier * this.calc_tuition_fees_cap - this.calc_tuition_fees_term_1,
      this.calc_tier * this.calc_tuition_net_price - this.calc_tuition_fees_term_1
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesTerm3
// Calculate Tuition Fees for Term #3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesTerm3 = function () {
  if (this.institution_type === 'ojt') {
    this.calc_tuition_fees_term_3 = 0;
  } else if (this.calendar === 'semesters' ||
      (this.calendar === 'nontraditional' && this.calc_number_of_terms < 3)) {
    this.calc_tuition_fees_term_3 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_tuition_fees_term_3 = 0;
  } else if (this.gi_bill_chapter == 31 &&
      (this.institution_type === 'flight' || this.institution_type == 'correspondence')) {
    this.calc_tuition_fees_term_3 = 0;
  } else if (this.gi_bill_chapter == 31) {
    this.calc_tuition_fees_term_3 = this.calc_tuition_fees_per_term;
  } else {
    this.calc_tuition_fees_term_3 =
    Math.max(0, Math.min(
      this.calc_tier * this.calc_tuition_fees_per_term,
      this.calc_tier * this.calc_tuition_fees_cap - this.calc_tuition_fees_term_1 - this.calc_tuition_fees_term_2,
      this.calc_tier * this.calc_tuition_net_price - this.calc_tuition_fees_term_1 - this.calc_tuition_fees_term_2
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTuitionFeesTotal
// Calculate the name of Tuition Fees Total
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTuitionFeesTotal = function () {
  this.calc_tuition_fees_total = this.calc_tuition_fees_term_1 +
      this.calc_tuition_fees_term_2 + this.calc_tuition_fees_term_3;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYrBenTerm1
// Calculate Yellow Ribbon for Term #1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYrBenTerm1 = function () {
  if (!this.calc_yellow_ribbon_elig || this.yellow_ben == 0) {
    this.calc_yr_ben_term_1 = 0;
  } else if (this.calc_old_gi_bill == true || this.gi_bill_chapter == 31) {
    this.calc_yr_ben_term_1 = 0;
  } else if (this.calc_tuition_fees_per_term === this.calc_tuition_fees_term_1) {
    this.calc_yr_ben_term_1 = 0;
  } else {
    this.calc_yr_ben_term_1 = Math.max(0, Math.min(
      this.calc_tuition_fees_per_term - this.calc_tuition_fees_term_1,
      this.calc_tuition_net_price - this.calc_tuition_fees_term_1,
      this.yellow_ben * 2
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYrBenTerm2
// Calculate Yellow Ribbon for Term #2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYrBenTerm2 = function () {
  if (!this.calc_yellow_ribbon_elig || this.yellow_ben == 0) {
    this.calc_yr_ben_term_2 = 0;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms == 1) {
    this.calc_yr_ben_term_2 = 0;
  } else if (this.calc_old_gi_bill == true || this.gi_bill_chapter == 31) {
    this.calc_yr_ben_term_2 = 0;
  } else if (this.calc_tuition_fees_per_term == this.calc_tuition_fees_term_2) {
    this.calc_yr_ben_term_2 = 0;
  } else {
    this.calc_yr_ben_term_2 = Math.max(0, Math.min(
      this.calc_tuition_fees_per_term - this.calc_tuition_fees_term_2,
      this.calc_tuition_net_price - this.calc_tuition_fees_term_1 -
      this.calc_tuition_fees_term_2 - this.calc_yr_ben_term_1,
      this.yellow_ben * 2 - this.calc_yr_ben_term_1
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYrBenTerm3
// Calculate Yellow Ribbon for Term #3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYrBenTerm3 = function () {
  if (!this.calc_yellow_ribbon_elig || this.yellow_ben == 0) {
    this.calc_yr_ben_term_3 = 0;
  } else if (this.calendar === 'semesters' ||
      (this.calendar === 'nontraditional' && this.calc_number_of_terms < 3)) {
    this.calc_yr_ben_term_3 = 0;
  } else if (this.calc_old_gi_bill == true || this.gi_bill_chapter == 31) {
    this.calc_yr_ben_term_3 = 0;
  } else if (this.calc_tuition_fees_per_term === this.calc_tuition_fees_term_3) {
    this.calc_yr_ben_term_3 = 0;
  } else {
    this.calc_yr_ben_term_3 = Math.max(0, Math.min(
      this.calc_tuition_fees_per_term - this.calc_tuition_fees_term_3,
      this.calc_tuition_net_price - this.calc_tuition_fees_term_1 -
      this.calc_tuition_fees_term_2 - this.calc_tuition_fees_term_3 -
      this.calc_yr_ben_term_1 - this.calc_yr_ben_term_2,
      this.yellow_ben * 2 - this.calc_yr_ben_term_1 - this.calc_yr_ben_term_2
    ));
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYrBenTotal
// Calculate Yellow Ribbon for the Year
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYrBenTotal = function () {
  if (!this.calc_yellow_ribbon_elig || this.yellow_ben == 0) {
    this.calc_yr_ben_total = 0;
  } else {
    this.calc_yr_ben_total = this.calc_yr_ben_term_1 + this.calc_yr_ben_term_2 +
      this.calc_yr_ben_term_3;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getYrBreakdown
// Calculate Yellow Ribbon by school / VA contributions
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getYrBreakdown = function () {
  this.calc_yr_ben_school_term_1   =       this.calc_yr_ben_term_1 / 2;
  this.calc_yr_ben_va_term_1       =       this.calc_yr_ben_term_1 / 2;
  this.calc_yr_ben_school_term_2   =       this.calc_yr_ben_term_2 / 2;
  this.calc_yr_ben_va_term_2       =       this.calc_yr_ben_term_2 / 2;
  this.calc_yr_ben_school_term_3   =       this.calc_yr_ben_term_3 / 2;
  this.calc_yr_ben_va_term_3       =       this.calc_yr_ben_term_3 / 2;
  this.calc_yr_ben_school_total    =       this.calc_yr_ben_total / 2;
  this.calc_yr_ben_va_total        =       this.calc_yr_ben_total / 2;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalPaidToSchool
// Calculate Total Paid to School
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalPaidToSchool = function () {
  this.calc_total_to_school = this.calc_tuition_fees_total + this.calc_yr_ben_total;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// Calculate Total Scholarships and Tuition Assistance
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalScholarships = function () {
  this.calc_total_scholarship_ta = this.scholar + this.tuition_assist;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// Calculate Total Left to Pay
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalLeftToPay = function () {
  this.calc_total_left_to_pay = Math.max(0, this.tuition_fees -
    this.calc_total_to_school - this.scholar - this.tuition_assist);

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getHousingAllowTerm1
// Calculate Housing Allowance for Term #1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getHousingAllowTerm1 = function () {
  if (this.military_status === 'active duty' && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 = 0;
  } else if (this.gi_bill_chapter == 33 & this.military_status == 'spouse' &&
      this.spouse_active_duty && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 = 0;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 = this.calc_monthly_rate_final;
  } else if (this.calc_old_gi_bill == true && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 =  this.calc_monthly_rate_final;
  } else if (this.calc_vre_only == true  && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 = this.calc_monthly_rate_final;
  } else if (this.gi_bill_chapter == 31  && (this.institution_type == 'flight' ||
      this.institution_type === 'correspondence')) {
    this.calc_tuition_allow_term_1 = 0;
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'flight') {
    this.calc_housing_allow_term_1 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .55)
      ));
  } else if (this.gi_bill_chapter == 1606 && this.institution_type === 'flight') {
    this.calc_housing_allow_term_1 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * .55
      ));
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_1 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
 } else if (this.gi_bill_chapter == 1606 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_1 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
  } else if (this.calc_only_tuition_fees) {
    this.calc_housing_allow_term_1 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term
      ));
  } else if (this.calc_old_gi_bill == true || this.calc_vre_only == true) {
    this.calc_housing_allow_term_1 = this.calc_monthly_rate_final * this.calc_term_length;
  } else if (this.military_status === 'active duty') {
    this.calc_housing_allow_term_1 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.military_status === 'spouse' && this.spouse_active_duty) {
    this.calc_housing_allow_term_1 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_1 = 0;
  } else if (this.institution_type === 'ojt') {
    this.calc_housing_allow_term_1 = this.calc_rop_ojt *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  } else if (this.online) {
    this.calc_housing_allow_term_1 = this.calc_term_length * this.rop *
      (this.calc_tier * this.AVGBAH / 2 + this.calc_kicker_benefit);
  } else if (this.institution.country.toLowerCase() != 'usa') {
    this.calc_housing_allow_term_1 = this.calc_term_length * this.rop *
      ((this.calc_tier * this.AVGBAH) + this.calc_kicker_benefit);
  } else {
    this.calc_housing_allow_term_1 = this.calc_term_length * this.rop *
      ((this.calc_tier * this.institution.bah) + this.calc_kicker_benefit);
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getHousingAllowTerm2
// Calculate Housing Allowance for Term #2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getHousingAllowTerm2 = function () {
  if (this.military_status === 'active duty' && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 = 0;
  } else if (this.gi_bill_chapter == 33 &&
      this.military_status === 'spouse' && this.spouse_active_duty &&
      this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 = 0;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 =  0.75 * this.calc_monthly_rate_final;
  } else if (this.calc_old_gi_bill == true && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 =  (6.6/9) * this.calc_monthly_rate_final;
  } else if (this.calc_vre_only == true && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 = this.calc_monthly_rate_final;
  } else if (this.institution_type === 'ojt') {
    this.calc_housing_allow_term_2 = 0.8 * this.calc_rop_ojt *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms == 1) {
    this.calc_housing_allow_term_2 = 0;
  } else if (this.gi_bill_chapter == 31 &&
      (this.institution_type === 'flight' || this.institution_type === 'correspondence')) {
    this.calc_tuition_allow_term_2 = 0;
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'flight') {
    this.calc_housing_allow_term_2 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .55)
      ));
  } else if (this.gi_bill_chapter == 1606 && this.institution_type === 'flight') {
    this.calc_housing_allow_term_2 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * .55
      ));
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_2 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
  } else if (this.gi_bill_chapter == 1606 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_2 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
  } else if (this.calc_only_tuition_fees) {
    this.calc_housing_allow_term_2 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term
      ));
  } else if (this.calc_old_gi_bill == true || this.calc_vre_only == true) {
    this.calc_housing_allow_term_2 = this.calc_monthly_rate_final * this.calc_term_length;
  } else if (this.military_status === 'active duty') {
    this.calc_housing_allow_term_2 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.military_status === 'spouse' && this.spouse_active_duty) {
    this.calc_housing_allow_term_2 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_2 = 0;
  } else if (this.online) {
    this.calc_housing_allow_term_2 = this.calc_term_length * this.rop *
      (this.calc_tier * this.AVGBAH / 2 + this.calc_kicker_benefit);
  } else if (this.institution.country.toLowerCase() !== 'usa') {
    this.calc_housing_allow_term_2 = this.calc_term_length * this.rop *
      (this.calc_tier * this.AVGBAH + this.calc_kicker_benefit);
 } else {
    this.calc_housing_allow_term_2 = this.calc_term_length * this.rop *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getHousingAllowTerm3
// Calculate Housing Allowance for Term #3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getHousingAllowTerm3 = function () {
  if (this.military_status === 'active duty' && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.gi_bill_chapter == 33 && this.military_status === 'spouse' &&
      this.spouse_active_duty && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 =  0.494 * this.calc_monthly_rate_final;
  } else if (this.calc_old_gi_bill == true && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 =  (7/15) * this.calc_monthly_rate_final;
  } else if (this.calc_vre_only == true  && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 = this.calc_monthly_rate_final;
  } else if (this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 = 0.6 * this.calc_rop_ojt *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  } else if (this.calendar === 'semesters') {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms < 3) {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.gi_bill_chapter == 31 &&
      (this.institution_type === 'flight' || this.institution_type === 'correspondence')) {
    this.calc_tuition_allow_term_3 = 0;
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'flight') {
    this.calc_housing_allow_term_3 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .55)
      ));
  } else if (this.gi_bill_chapter == 1606 && this.institution_type == 'flight') {
    this.calc_housing_allow_term_3 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * .55
      ));
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_3 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
  } else if (this.gi_bill_chapter == 1607 && this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_3 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term * (this.consecutive_service * .6)
      ));
  } else if (this.calc_only_tuition_fees) {
    this.calc_housing_allow_term_3 = Math.max(0,
      Math.min(this.calc_monthly_rate_final * this.calc_term_length,
        this.calc_tuition_fees_per_term
      ));
  } else if (this.calc_old_gi_bill == true || this.calc_vre_only == true) {
    this.calc_housing_allow_term_3 = this.calc_monthly_rate_final * this.calc_term_length;
  } else if (this.military_status === 'spouse' && this.spouse_active_duty) {
    this.calc_housing_allow_term_3 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.military_status === 'active duty') {
    this.calc_housing_allow_term_3 = (0 + this.calc_kicker_benefit) * this.calc_term_length;
  } else if (this.online) {
    this.calc_housing_allow_term_3 = this.calc_term_length * this.rop *
      (this.calc_tier * this.AVGBAH / 2 + this.calc_kicker_benefit);
  } else if (this.institution.country.toLowerCase() != 'usa') {
    this.calc_housing_allow_term_3 = this.calc_term_length * this.rop *
      (this.calc_tier * this.AVGBAH + this.calc_kicker_benefit);
  } else {
    this.calc_housing_allow_term_3 = this.calc_term_length * this.rop *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  }

  return this;
};


///////////////////////////////////////////////////////////////////////////////
// getHousingAllowTotal
// Calculate Housing Allowance Total for year
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getHousingAllowTotal = function () {
  if (this.military_status === 'active duty' && this.institution_type === 'ojt') {
    this.calc_housing_allow_term_3 = 0;
  } else if (this.gi_bill_chapter == 35 && this.institution_type === 'ojt') {
    this.calc_housing_allow_total =  0.25 * this.calc_monthly_rate_final;
  } else if (this.calc_old_gi_bill == true && this.institution_type === 'ojt') {
    this.calc_housing_allow_total =  (7/15) * this.calc_monthly_rate_final;
  } else if (this.calc_vre_only == true  && this.institution_type === 'ojt') {
    this.calc_housing_allow_total = this.calc_monthly_rate_final;
  } else if (this.institution_type === 'ojt') {
    this.calc_housing_allow_total = 0.4 * this.calc_rop_ojt *
      (this.calc_tier * this.institution.bah + this.calc_kicker_benefit);
  } else if (this.calc_only_tuition_fees) {
    this.calc_housing_allow_total = Math.max(0,
        Math.min(this.calc_monthly_rate_final * this.calc_acad_year_length, this.tuition_fees)
      );
  } else {
    this.calc_housing_allow_total = this.calc_housing_allow_term_1 +
      this.calc_housing_allow_term_2 + this.calc_housing_allow_term_3;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBookStipendTerm1
// Calculate Book Stipend for Term #1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBookStipendTerm1 = function () {
  if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_book_stipend_term_1 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_book_stipend_term_1 = 0;
  } else if (this.calc_gi_bill_chapter == 31) {
    this.calc_book_stipend_term_1 = this.books / this.calc_number_of_terms;
  } else if (this.institution_type === 'ojt' && this.gi_bill_chapter == 33) {
    this.calc_book_stipend_term_1 = this.BSOJTMONTH;
  } else {
    this.calc_book_stipend_term_1 = this.calc_rop_book *
      this.BSCAP / this.calc_number_of_terms * this.calc_tier;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBookStipendTerm2
// Calculate Book Stipend for Term #2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBookStipendTerm2 = function () {
  if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_book_stipend_term_2 = 0;
  } else if (this.institution_type === 'ojt' && this.gi_bill_chapter == 33) {
    this.calc_book_stipend_term_2 = this.BSOJTMONTH;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms == 1) {
    this.calc_book_stipend_term_2 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_book_stipend_term_2 = 0;
  } else if (this.gi_bill_chapter == 31) {
    this.calc_book_stipend_term_2 = this.books / this.calc_number_of_terms;
  } else {
    this.calc_book_stipend_term_2 = this.calc_rop_book *
      this.BSCAP / this.calc_number_of_terms * this.calc_tier;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBookStipendTerm3
// Calculate Book Stipend for Term #3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBookStipendTerm3 = function () {
  if (this.institution_type === 'flight' || this.institution_type === 'correspondence') {
    this.calc_book_stipend_term_3 = 0;
  } else if  (this.institution_type === 'ojt' && this.gi_bill_chapter == 33) {
    this.calc_book_stipend_term_3 = this.BSOJTMONTH;
  } else if (this.calendar === 'semesters') {
    this.calc_book_stipend_term_3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms < 3) {
    this.calc_book_stipend_term_3 = 0;
  } else if (this.calc_old_gi_bill == true) {
    this.calc_book_stipend_term_3 = 0;
  } else if (this.gi_bill_chapter == 31) {
    this.calc_book_stipend_term_3 = this.books / this.calc_number_of_terms;
  } else {
    this.calc_book_stipend_term_3 = this.calc_rop_book *
      this.BSCAP / this.calc_number_of_terms * this.calc_tier;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getBookStipendYear
// Calculate Book Stipend for Year
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getBookStipendYear = function () {
  if (this.institution_type === 'ojt' && this.gi_bill_chapter == 33) {
    this.calc_book_stipend_total = this.BSOJTMONTH;
  } else {
    this.calc_book_stipend_total = this.calc_book_stipend_term_1 +
      this.calc_book_stipend_term_2 + this.calc_book_stipend_term_3;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalPaidToYou
// Calculate Total Payments to You
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalPaidToYou = function () {
  this.calc_total_to_you = this.calc_housing_allow_total + this.calc_book_stipend_total;

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalTerm1
// Calculate Total Benefits for Term 1
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalTerm1 = function () {
  if (this.institution_type === 'ojt') {
    this.calc_total_term_1 = 0;
  } else {
    this.calc_total_term_1 = this.calc_tuition_fees_term_1 +
      this.calc_yr_ben_term_1 + this.calc_housing_allow_term_1 +
        this.calc_book_stipend_term_1;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalTerm2
// Calculate Total Benefits for Term 2
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalTerm2 = function () {
  if (this.calendar === 'nontraditional' && this.calc_number_of_terms == 1) {
    this.calc_book_stipend_term_2 = 0;
  } else if (this.institution_type === 'ojt') {
    this.calc_total_term_2 = 0;
  } else {
    this.calc_total_term_2 = this.calc_tuition_fees_term_2 +
      this.calc_yr_ben_term_2 + this.calc_housing_allow_term_2  +
        this.calc_book_stipend_term_2;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalTerm3
// Calculate Total Benefits for Term 3
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalTerm3 = function () {
  if (this.calendar == 'semesters') {
    this.calc_total_term_3 = 0;
  } else if (this.calendar === 'nontraditional' && this.calc_number_of_terms < 3) {
    this.calc_total_term_3 = 0;
  } else if (this.institution_type === 'ojt') {
    this.calc_total_term_3 = 0;
  } else {
    this.calc_total_term_3 = this.calc_tuition_fees_term_3 +
      this.calc_yr_ben_term_3 + this.calc_housing_allow_term_3 +
        this.calc_book_stipend_term_3;
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// Calculate Text for Total Benefits Row
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalText = function () {
  if (this.gi_bill_chapter == 33) {
    this.calc_gi_bill_total_text = 'Total Post-9/11 GI Bill Benefits';
  } else if (this.gi_bill_chapter == 30) {
    this.calc_gi_bill_total_text = 'Total Montgomery GI Bill Benefits';
  } else if (this.gi_bill_chapter == 1606) {
    this.calc_gi_bill_total_text = 'Total Select Reserve GI Bill Benefits';
  } else if (this.gi_bill_chapter == 1607) {
    this.calc_gi_bill_total_text = 'Total REAP GI Bill Benefits';
  } else if (this.gi_bill_chapter == 35) {
    this.calc_gi_bill_total_text = 'Total DEA GI Bill Benefits';
  } else if (this.gi_bill_chapter == 31) {
    this.calc_gi_bill_total_text = 'Total Voc Rehab Benefits';
  }

  return this;
};

///////////////////////////////////////////////////////////////////////////////
// getTotalYear
// Calculate Total Benefits for Year
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getTotalYear = function () {
  if (this.institution_type === 'ojt') {
    this.calc_total_year = 0;
  } else {
    this.calc_total_year = this.calc_tuition_fees_total +
      this.calc_yr_ben_total + this.calc_housing_allow_total +
        this.calc_book_stipend_total;
  }

  return this;
};


///////////////////////////////////////////////////////////////////////////////
// getMonthlyRateDisplay
// Calculate Monthly Rate for Display
///////////////////////////////////////////////////////////////////////////////
Calculator.prototype.getMonthlyRateDisplay = function () {
  if (this.institution_type === 'ojt') {
    this.calc_monthly_rate_display = this.calc_housing_allow_term_1;
  } else {
    this.calc_monthly_rate_display = this.calc_housing_allow_term_1 / this.calc_term_length;
  }

  return this;
};
