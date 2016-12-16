import React from 'react';

class Estimator extends React.Component {
  constructor(props) {
    super(props);
    // Values from forms
    this.militaryStatus = null;
    this.spouseActiveDuty = null;
    this.giBillChap = null;
    this.numberOfDepend = null;
    this.post911Elig = null;
    this.cumulativeService = null;
    this.enlistmentService = null;
    this.consecutiveService = null;
    this.institutionType = null;
    this.country = null;
    this.online = null;

    // Values from institution model
    this.bah = null;

    // Dependent Values
    this.oldGiBill = null;
    this.serviceDischarge = null;
    this.tier = null;
    this.vreOnly = null;
    this.monthlyRate = null;
    this.onlyTuitionFees = null;

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
    this.perQualifierHtml = this.perQualifierHtml.bind(this);
    this.renderTuitionFees = this.renderTuitionFees.bind(this);
    this.renderHousingAllowance = this.renderHousingAllowance.bind(this);
    this.renderBookStipend = this.renderBookStipend.bind(this);

    // Results (for tests)
    this.results = {
      tuition: {},
      housing: {},
      books: {}
    };
  }

  set setMilitaryStatus(str) {
    this.militaryStatus = str; // e.g. 'active duty'
  }

  set setSpouseActiveDuty(str) {
    if (str) {
      this.spouseActiveDuty = (str.toLowerCase() === 'yes');
    } else {
      this.spouseActiveDuty = null;
    }
  }

  set setGiBillChap(n) {
    const chapter = this.giBillChap = Number(n);
    this.oldGiBill = (
      chapter === 30
      || chapter === 1607
      || chapter === 1606
      || chapter === 35
    );
  }

  set setNumberOfDepend(n) {
    this.numberOfDepend = Number(n);
  }

  set setPost911Elig(str) {
    this.post911Elig = (str === 'yes');
  }

  set setCumulativeService(str) {
    this.serviceDischarge = (str === 'service discharge');
    this.cumulativeService = this.serviceDischarge ? 1.0 : parseFloat(str);
  }

  set setEnlistmentService(n) {
    this.enlistmentService = Number(n);
  }

  set setConsecutiveService(n) {
    this.consecutiveService = Number(n);
  }

  set setOnline(str) {
    this.online = (str === 'yes');
  }

  set setInstitutionType(str) {
    this.institutionType = str.toLowerCase();

    if (this.institutionType === 'for profit') {
      this.institutionType = 'private'; // hacky fix
    }
  }

  set setCountry(str) {
    this.country = str.toLowerCase();
  }

  set setBah(n) {
    this.bah = parseFloat(n);
  }

  // Determines benefits tier
  setTier() {
    const vre911Eligible = (this.giBillChap === 31 && this.post911Elig === true);
    if (vre911Eligible || this.serviceDischarge) {
      this.tier = 1;
    } else {
      this.tier = this.cumulativeService;
    }
  }

  // Determines VRE-without-post-911 eligibility
  setVreOnly() {
    this.vreOnly = (this.giBillChap === 31 && !this.post911Elig);
  }

  // Determines whether monthly benefit can only be spent on tuition/fees
  setOnlyTuitionFees() {
    const activeDutyThirtyOr1607 = (
      this.militaryStatus === 'active duty' &&
      (this.giBillChap === 30 || this.giBillChap === 1607)
    );
    const correspondenceOrFlightUnderOldGiBill = (
      (this.isCorrespondence() || this.isFlight()) &&
      this.oldGiBill === true
    );
    if (activeDutyThirtyOr1607 || correspondenceOrFlightUnderOldGiBill) {
      this.onlyTuitionFees = true;
    } else {
      this.onlyTuitionFees = false;
    }
  }

  // Calculates the monthly benefit rate for non-chapter 33 benefits
  setMonthlyRate() {
    if (this.giBillChap === 30 && this.enlistmentService === 3 && this.institutionType === 'ojt') {
      this.monthlyRate = this.MGIB3YRRATE * 0.75;
    } else if (this.giBillChap === 30 && this.enlistmentService === 3) {
      this.monthlyRate = this.MGIB3YRRATE;
    } else if (this.giBillChap === 30 && this.enlistmentService === 2 && this.institutionType === 'ojt') {
      this.monthlyRate = this.MGIB2YRRATE * 0.75;
    } else if (this.giBillChap === 30 && this.enlistmentService === 2) {
      this.monthlyRate = this.MGIB2YRRATE;
    } else if (this.giBillChap === 1607 && this.institutionType === 'ojt') {
      this.monthlyRate = this.MGIB3YRRATE * this.consecutiveService * 0.75;
    } else if (this.giBillChap === 1607) {
      this.monthlyRate = this.MGIB3YRRATE * this.consecutiveService;
    } else if (this.giBillChap === 1606 && this.institutionType === 'ojt') {
      this.monthlyRate = this.SRRATE * 0.75;
    } else if (this.giBillChap === 1606) {
      this.monthlyRate = this.SRRATE;
    } else if (this.giBillChap === 35 && this.institutionType === 'ojt') {
      this.monthlyRate = this.DEARATEOJT;
    } else if (this.giBillChap === 35 && this.institutionType === 'flight') {
      this.monthlyRate = 0;
    } else if (this.giBillChap === 35) {
      this.monthlyRate = this.DEARATE;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 0 && this.institutionType === 'ojt') {
      this.monthlyRate = this.VRE0DEPRATEOJT;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 0) {
      this.monthlyRate = this.VRE0DEPRATE;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 1 && this.institutionType === 'ojt') {
      this.monthlyRate = this.VRE1DEPRATEOJT;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 1) {
      this.monthlyRate = this.VRE1DEPRATE;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 2 && this.institutionType === 'ojt') {
      this.monthlyRate = this.VRE2DEPRATEOJT;
    } else if (this.giBillChap === 31 && this.numberOfDepend === 2) {
      this.monthlyRate = this.VRE2DEPRATE;
    } else if (this.giBillChap === 31 && this.numberOfDepend > 2 && this.institutionType === 'ojt') {
      this.monthlyRate = this.VRE2DEPRATEOJT + ((this.numberOfDepend - 2) * this.VREINCRATEOJT);
    } else if (this.giBillChap === 31 && this.numberOfDepend > 2) {
      this.monthlyRate = this.VRE2DEPRATE + ((this.numberOfDepend - 2) * this.VREINCRATE);
    }
  }

  updateDependentValues() {
    this.setTier();
    this.setVreOnly();
    this.setOnlyTuitionFees();
    this.setMonthlyRate();
  }

  // Returns true when school is a flight school
  isFlight() {
    return this.institutionType === 'flight';
  }

  // Returns true when school is a correspondence school
  isCorrespondence() {
    return this.institutionType === 'correspondence';
  }

  isFlightOrCorrespondence() {
    return this.isFlight() || this.isCorrespondence();
  }

  // Returns true when school is public
  isPublic() {
    return this.institutionType === 'public';
  }

  // Returns true for on-the-job training institutions
  isOjt() {
    return this.institutionType === 'ojt';
  }

  // Humanizes currency values by adding commas
  // and rounding to whole values
  formatCurrency(n) {
    const str = Math.round(Number(n)).toString();
    return str.replace(/\d(?=(\d{3})+$)/g, '$&,');
  }

  // renders formatted currency per period elements
  perQualifierHtml(v, q) {
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

    if (this.oldGiBill === true) {
      this.results.tuition.value = 0;
      this.results.tuition.qualifier = 'per year';
      return this.perQualifierHtml(this.results.value, this.results.qualifier);
    }

    if (this.institutionType === 'ojt') {
      this.results.tuition.value = 'N/A';
      this.results.tuition.qualifier = null;
      return 'N/A';
    }

    if (this.giBillChap === 31 && this.isFlightOrCorrespondence()) {
      this.results.tuition.value = 0;
      this.results.tuition.qualifier = 'per year';
      return this.perQualifierHtml(this.results.value, this.results.qualifier);
    }

    if (this.giBillChap === 31 && !this.isFlightOrCorrespondence()) {
      this.results.tuition.value = 'Full Cost of Attendance';
      this.results.tuition.qualifier = null;
      return <span className="search-text-values">{this.results.value}</span>;
    }

    if (this.isFlight()) {
      this.results.tuition.value = Math.round(this.FLTTFCAP * this.tier);
      this.results.tuition.qualifier = 'per year';
      return this.perQualifierHtml(this.results.value, this.results.qualifier);
    }

    if (this.isCorrespondence()) {
      this.results.tuition.value = Math.round(this.CORRESPONDTFCAP * this.tier);
      this.results.tuition.qualifier = 'per year';
      return this.perQualifierHtml(this.results.value, this.results.qualifier);
    }

    if (this.isPublic()) {
      const percent = Math.round(this.tier * 100);
      this.results.tuition.value = percent;
      this.results.tuition.qualifier = '% of instate tuition';
      return (
        <span>
          {percent}<span className="estimator-dollar-sign">%</span><br/>
          <span className="estimate-qualifier">of instate tuition</span>
        </span>
      );
    }

    this.results.tuition.value = Math.round(this.TFCAP * this.tier);
    this.results.tuition.qualifier = 'per year';
    return this.perQualifierHtml(this.results.tuition.value, this.results.tuition.qualifier);
  }

  // Computes and renders the estimated housing allowance
  renderHousingAllowance() {
    this.updateDependentValues();

    if (this.giBillChap === 31 && this.isFlightOrCorrespondence()) {
      this.results.housing.value = 0;
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.oldGiBill && this.onlyTuitionFees) {
      this.results.housing.value = Math.round(this.monthlyRate);
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.oldGiBill || this.vreOnly) {
      this.results.housing.value = Math.round(this.monthlyRate);
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.militaryStatus === 'active duty') {
      this.results.housing.value = 0;
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.militaryStatus === 'spouse' && this.spouseActiveDuty) {
      this.results.housing.value = 0;
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.isFlightOrCorrespondence()) {
      this.results.housing.value = 0;
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.isOjt()) {
      this.results.housing.value = Math.round(this.tier * this.bah);
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.online) {
      this.results.housing.value = Math.round(this.tier * this.AVGBAH / 2);
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    if (this.country !== 'usa') {
      this.results.housing.value = Math.round(this.tier * this.AVGBAH);
      this.results.housing.qualifier = 'per month';
      return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
    }

    this.results.housing.value = Math.round(this.tier * this.bah);
    this.results.housing.qualifier = 'per month';
    return this.perQualifierHtml(this.results.housing.value, this.results.housing.qualifier);
  }

  // Computes and renders the estimated book stipend
  renderBookStipend() {
    this.updateDependentValues();

    if (this.oldGiBill || this.isFlightOrCorrespondence()) {
      this.results.books.value = 0;
      this.results.books.qualifier = 'per year';
      return this.perQualifierHtml(this.results.books.value, this.results.books.qualifier);
    }

    if (this.giBillChap === 31) {
      this.results.books.value = 'Full Cost of Books & Supplies';
      this.results.books.qualifier = null;
      return <span className="search-text-values">Full Cost of Books & Supplies</span>;
    }

    this.results.books.value = Math.round(this.tier * this.BSCAP);
    this.results.books.qualifier = 'per year';
    return this.perQualifierHtml(this.results.books.value, this.results.books.qualifier);
  }

}

// Constants
Estimator.prototype.TFCAP = 21970.46;
Estimator.prototype.AVGBAH = 1611;
Estimator.prototype.BSCAP = 1000;
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
