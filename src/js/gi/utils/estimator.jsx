import React from 'react';

class Estimator {
  constructor() {
    // Values from forms
    this.military_status = null;
    this.spouse_active_duty = null;
    this.gi_bill_chap = null;
    this.number_of_depend = null;
    this.post_911_elig = null;
    this.cumulative_service = null;
    this.enlistment_service = null;
    this.consecutive_service = null;
    this.institution_type = null;
    this.country = null;
    this.online = null;
    this.bah = null;

    // Dependent Values
    this.old_gi_bill = null;
    this.service_discharge = null;
    this.tier = null;
    this.vre_only = null;
    this.monthly_rate = null;
    this.only_tuition_fees = null;

    // Bind functions
    this.updateDependentValues = this.updateDependentValues.bind(this);
    this.setTier = this.setTier.bind(this);
    this.setVreOnly = this.setVreOnly.bind(this);
    this.setOnlyTuitionFees = this.setOnlyTuitionFees.bind(this);
    this.setMonthlyRate = this.setMonthlyRate.bind(this);
    this.isFlight = this.isFlight.bind(this);
    this.isCorrespondence = this.isCorrespondence.bind(this);
    this.isFlightOrCorrespondence = this.isFlightOrCorrespondence.bind(this);
    this.isPublic = this.isPublic.bind(this);
    this.isOjt = this.isOjt.bind(this);
    this.per_qualifier_html = this.per_qualifier_html.bind(this);
    this.renderTuitionFees = this.renderTuitionFees.bind(this);
    this.renderHousingAllowance = this.renderHousingAllowance.bind(this);
    this.renderBookStipend = this.renderBookStipend.bind(this);
  }

  set set_military_status(str) {
    this.military_status = str; // e.g. 'active duty'
  }

  set set_spouse_active_duty(str) {
    this.spouse_active_duty = (str.toLowerCase() === 'yes');
  }

  set set_gi_bill_chap(n) {
    const chapter = this.gi_bill_chap = Number(n);
    this.old_gi_bill = (
      chapter === 30
      || chapter === 1607
      || chapter === 1606
      || chapter === 35
    );
  }

  set set_number_of_depend(n) {
    this.number_of_depend = Number(n);
  }

  set set_post_911_elig(str) {
    this.post_911_elig = (str === 'yes');
  }

  set set_cumulative_service(str) {
    this.service_discharge = (str === 'service discharge');
    this.cumulative_service = this.service_discharge ? 1.0 : parseFloat(str);
  }

  set set_enlistment_service(n) {
    this.enlistment_service = Number(n);
  }

  set set_consecutive_service(n) {
    this.consecutive_service = Number(n);
  }

  set set_online(str) {
    this.online = (str === 'yes');
  }

  set set_institution_type(str) {
    this.institution_type = str.toLowerCase();

    if (this.institution_type === 'for profit')
      this.institution_type = 'private'; // hacky fix
  }

  set set_country(str) {
    this.country = str.toLowerCase();
  }

  set set_bah(n) {
    this.bah = parseFloat(n);
  }

  updateDependentValues() {
    this.setTier();
    this.setVreOnly();
    this.setOnlyTuitionFees();
    this.setMonthlyRate();
  }

  // Determines benefits tier
  setTier() {
    const vre_911_eligible = (this.gi_bill_chap === 31 && this.post_911_elig === true);
    if (vre_911_eligible || this.service_discharge) {
      this.tier = 1;
    } else {
      this.tier = this.cumulative_service;
    }
  }

  // Determines VRE-without-post-911 eligibility
  setVreOnly() {
    this.vre_only = (this.gi_bill_chap === 31 && !this.post_911_elig);
  }

  // Determines whether monthly benefit can only be spent on tuition/fees
  setOnlyTuitionFees() {
    const active_duty_30_or_1607 = (
      this.military_status === 'active duty' &&
      (this.gi_bill_chap === 30 || this.gi_bill_chap === 1607)
    );
    const correspondence_or_flight_under_old_gi_bill = (
      (this.isCorrespondence() || this.isFlight()) &&
      this.old_gi_bill === true
    );
    if (active_duty_30_or_1607 || correspondence_or_flight_under_old_gi_bill) {
      this.only_tuition_fees = true;
    } else {
      this.only_tuition_fees = false;
    }
  }

  // Calculates the monthly benefit rate for non-chapter 33 benefits
  setMonthlyRate() {
    if (this.gi_bill_chap === 30 && this.enlistment_service === 3 && this.institution_type === 'ojt')
      this.monthly_rate = this.MGIB3YRRATE * 0.75;
    else if (this.gi_bill_chap === 30 && this.enlistment_service === 3)
      this.monthly_rate = this.MGIB3YRRATE;
    else if (this.gi_bill_chap === 30 && this.enlistment_service === 2 && this.institution_type === 'ojt')
      this.monthly_rate = this.MGIB2YRRATE * 0.75;
    else if (this.gi_bill_chap === 30 && this.enlistment_service === 2)
      this.monthly_rate = this.MGIB2YRRATE;
    else if (this.gi_bill_chap === 1607 && this.institution_type === 'ojt')
      this.monthly_rate = this.MGIB3YRRATE * this.consecutive_service * 0.75;
    else if (this.gi_bill_chap === 1607)
      this.monthly_rate = this.MGIB3YRRATE * this.consecutive_service;
    else if (this.gi_bill_chap === 1606 && this.institution_type === 'ojt')
      this.monthly_rate = this.SRRATE * 0.75;
    else if (this.gi_bill_chap === 1606)
      this.monthly_rate = this.SRRATE;
    else if (this.gi_bill_chap === 35 && this.institution_type === 'ojt')
      this.monthly_rate = this.DEARATEOJT;
    else if (this.gi_bill_chap === 35 && this.institution_type === 'flight')
      this.monthly_rate = 0;
    else if (this.gi_bill_chap === 35)
      this.monthly_rate = this.DEARATE;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 0 && this.institution_type === 'ojt')
      this.monthly_rate = this.VRE0DEPRATEOJT;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 0)
      this.monthly_rate = this.VRE0DEPRATE;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 1 && this.institution_type === 'ojt')
      this.monthly_rate = this.VRE1DEPRATEOJT;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 1)
      this.monthly_rate = this.VRE1DEPRATE;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 2 && this.institution_type === 'ojt')
      this.monthly_rate = this.VRE2DEPRATEOJT;
    else if (this.gi_bill_chap === 31 && this.number_of_depend === 2)
      this.monthly_rate = this.VRE2DEPRATE;
    else if (this.gi_bill_chap === 31 && this.number_of_depend > 2 && this.institution_type === 'ojt')
      this.monthly_rate = this.VRE2DEPRATEOJT + ((this.number_of_depend - 2) * this.VREINCRATEOJT);
    else if (this.gi_bill_chap === 31 && this.number_of_depend > 2)
      this.monthly_rate = this.VRE2DEPRATE + ((this.number_of_depend - 2) * this.VREINCRATE);
  }

  // Returns true when school is a flight school
  isFlight() {
    return this.institution_type === 'flight';
  }

  // Returns true when school is a correspondence school
  isCorrespondence() {
    return this.institution_type === 'correspondence';
  }

  isFlightOrCorrespondence() {
    return this.isFlight() || this.isCorrespondence();
  }

  // Returns true when school is public
  isPublic() {
    return this.institution_type === 'public';
  }

  // Returns true for on-the-job training institutions
  isOjt() {
    return this.institution_type === 'ojt';
  }

  // humanizes currency values by by adding commas
  formatCurrency(n) {
    let str = Math.round(Number(n)).toString();
    return str.replace(/\d(?=(\d{3})+$)/g, '$&,');
  }

  // renders formatted currency per period elements
  per_qualifier_html(v, q) {
    return (
      <span>
        <span className="estimator-dollar-sign">$</span>
        {this.formatCurrency(v)}<br/>
        <span className="estimate-qualifier">{q}</span>
      </span>
    );
  }

  // Computes and renders estimated tuition fees
  renderTuitionFees() {
    this.updateDependentValues();

    if (this.old_gi_bill === true)
      return this.per_qualifier_html(0, 'per year');

    if (this.institution_type === 'ojt')
      return 'N/A';

    if (this.gi_bill_chap === 31 && this.isFlightOrCorrespondence())
      return this.per_qualifier_html(0, 'per year');

    if (this.gi_bill_chap === 31 && !this.isFlightOrCorrespondence())
      return <span className="search-text-values">Full Cost of Attendance</span>;

    if (this.isFlight())
      return this.per_qualifier_html(this.FLTTFCAP * this.tier, 'per year');

    if (this.isCorrespondence())
      return this.per_qualifier_html(this.CORRESPONDTFCAP * this.tier, 'per year');

    if (this.isPublic()) {
      const percent = Math.round(this.tier * 100);
      return (
        <span>
          {percent}<span className="estimator-dollar-sign">%</span><br/>
          <span className="estimate-qualifier">of instate tuition</span>
        </span>
      );
    }

    return this.per_qualifier_html(this.TFCAP * this.tier, 'per year');
  }

  // Computes and renders the estimated housing allowance
  renderHousingAllowance() {
    this.updateDependentValues();

    if (this.gi_bill_chap === 31 && this.isFlightOrCorrespondence())
      return this.per_qualifier_html(0, 'per month');

    if (this.old_gi_bill && this.only_tuition_fees)
      return this.per_qualifier_html(this.monthly_rate, 'per month');

    if (this.old_gi_bill || this.vre_only)
      return this.per_qualifier_html(this.monthly_rate, 'per month');

    if (this.military_status === 'active duty')
      return this.per_qualifier_html(0, 'per month');

    if (this.military_status === 'spouse' && this.spouse_active_duty)
      return this.per_qualifier_html(0, 'per month');

    if (this.isFlightOrCorrespondence())
      return this.per_qualifier_html(0, 'per month');

    if (this.isOjt())
      return this.per_qualifier_html(this.tier * this.bah, 'per month');

    if (this.online)
      return this.per_qualifier_html(this.tier * this.AVGBAH / 2, 'per month');

    if (this.country !== 'usa')
      return this.per_qualifier_html(this.tier * this.AVGBAH, 'per month');

    return this.per_qualifier_html(this.tier * this.bah, 'per month');
  }

  // Computes and renders the estimated book stipend
  renderBookStipend() {
    this.updateDependentValues();

    if (this.old_gi_bill || this.isFlightOrCorrespondence())
      return this.per_qualifier_html(0, 'per year');

    if (this.gi_bill_chap === 31)
      return <span className="search-text-values">Full Cost of Books & Supplies</span>;

    return this.per_qualifier_html(this.tier * this.BSCAP, 'per year');
  }

}

// Constants
Estimator.prototype.TFCAP = 21970.46;
Estimator.prototype.AVGBAH = 1611;
Estimator.prototype.BSCAP = 1000,
Estimator.prototype.FLTTFCAP = 12554.54;
Estimator.prototype.CORRESPONDTFCAP = 10671.35;

Estimator.prototype.MGIB3YRRATE = 1789;
Estimator.prototype.MGIB2YRRATE = 1454;
Estimator.prototype.SRRATE = 368;

Estimator.prototype.DEARATE = 1021;
Estimator.prototype.DEARATEOJT = 745;

Estimator.prototype.VRE0DEPRATE = 605.44;
Estimator.prototype.VRE1DEPRATE = 751.00;
Estimator.prototype.VRE2DEPRATE = 885.00;
Estimator.prototype.VREINCRATE = 64.50;
Estimator.prototype.VRE0DEPRATEOJT = 529.36;
Estimator.prototype.VRE1DEPRATEOJT = 640.15;
Estimator.prototype.VRE2DEPRATEOJT = 737.77;
Estimator.prototype.VREINCRATEOJT = 47.99;

export default Estimator;
