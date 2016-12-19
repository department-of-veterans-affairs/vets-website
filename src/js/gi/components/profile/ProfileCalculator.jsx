import React from 'react';
import Calculator from '../../utils/calculator';

class ProfileCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.renderInputs = this.renderInputs.bind(this);
    this.renderOutputs = this.renderOutputs.bind(this);
    this.renderYellowRibbonLink = this.renderYellowRibbonLink.bind(this);

    this.state = {
      militaryStatus: 'veteran',
      spouseActiveDuty: 'yes',
      eligForPostGiBill: 'yes',
      online: 'yes',
      inState: 'yes',
      tuitionFees: '234234234',
      inStateTuitionFees: '234234234',
      books: '234234',
      yellowRibbon: 'yes',
      yellowBen: '234234234',
      scholar: '234234234',
      tuitionAssist: '234234234',
      kickerElig: 'yes',
      buyUpElig: 'yes',
    };

    const school = this.props.institution;
    this.props.calculator.init(school, this);
  }

  renderYellowRibbonLink() {
    const school = this.props.institution;
    const url = `http://www.benefits.va.gov/gibill/yellowRibbon/2015/states/${school.state}.asp`;
    if (school.state) {
      return (
        <a target="blank" href={url} className="see-yr-rates-summary">See YR Rates</a>
      );
    }
    return null;
  }

  renderInputs() {
    // const school = this.props.institution;
    return (
      <div className="calc-questions large-6 columns nopadding">
        <div id="tuition-fees-section">
          <div id="in-state" className="form-group">
            <label className="question">In-state student?</label>
            <input onChange={(e) => { this.setState({ inState: e.target.value }); }} id="in-state-yes" name="inState" type="radio" value="yes" className="filter-item filter-in-state"/>
            <label className="radio" htmlFor="in-state-yes">Yes</label>
            <input onChange={(e) => { this.setState({ inState: e.target.value }); }} id="in-state-no" name="inState" type="radio" value="no" defaultChecked className="filter-item filter-in-state"/>
            <label className="radio" htmlFor="in-state-no">No</label>
          </div>

          <div id="tuition-fees-form" className="form-group top-aligned">
            <label htmlFor="tuition-fees-input">Tuition / Fees (/year):&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcTuition');}} className="info-icons"><i id="tuition-fees-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ tuitionFees: e.target.value }); }} id="tuition-fees-input" type="text" defaultValue="$0" name="Tuition Fees" alt="Tuition Fees" className="filter-item"/>
          </div>

          <div id="in-state-tuition-fees-form" className="form-group top-aligned">
            <label htmlFor="in-state-tuition-fees">In-state Tuition / Fees (/year): &nbsp;<a onClick={() => {this.props.toggleModalDisplay('retention');}}><i id="in-state-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ inStateTuitionFees: e.target.value }); }} id="in-state-tuition-fees" type="text" defaultValue="$0" name="In-state Tuition Fees" alt="In-state Tuition Fees" className="filter-item"/>
          </div>

          <div id="books-input-row">
            <label htmlFor="books-input">Books / Supplies (/year):</label>
            <input onChange={(e) => { this.setState({ books: e.target.value }); }} id="books-input" type="text" defaultValue="$0" name="Books" alt="Books" className="filter-item"/>
          </div>

          <div id="yellow-ribbon-recipient-form">
            <label className="question">Receiving Yellow Ribbon?&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcYr');}} className="info-icons"><i id="yellow-ribbon-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ yellowRibbon: e.target.value }); }} id="yellow-ribbon-recipient-yes" name="receiving_yellowRibbon" type="radio" value="yes" className="filter-item"/>
            <label className="radio" htmlFor="yellow-ribbon-recipient-yes">Yes</label>
            <input onChange={(e) => { this.setState({ yellowRibbon: e.target.value }); }} id="yellow-ribbon-recipient-no" name="receiving_yellowRibbon" type="radio" value="no" defaultChecked className="filter-item"/>
            <label className="radio" htmlFor="yellow-ribbon-recipient-no">No</label>
          </div>

          <div id="yellow-ribbon-amount-form" className="form-group top-aligned">
            {/*  Yellow Ribbon Amount  */}
            <label htmlFor="yellow-ribbon-amount">Yellow Ribbon Amount From School (/year) :</label>
            <input onChange={(e) => { this.setState({ tuitionFeesBen: e.target.value }); }} id="yellow-ribbon-amount" type="text" defaultValue="$0" name="Yellow Ribbon Amount From School" alt="Yellow Ribbon Amount From School" className="filter-item"/>
            {this.renderYellowRibbonLink()}
          </div>

          <div id="yellow-ribbon-rates-link" className="form-group"></div>

          <div id="scholarship-amount-form" className="form-group top-aligned">
            <label htmlFor="scholar">Scholarships (not Pell):&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcScholarships');}} className="info-icons"><i id="scholarships-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ scholar: e.target.value }); }} id="scholar" type="text" defaultValue="$0" name="Scholarships (not Pell)" alt="How much are you receiving in scholarships and not Pell grants" className="filter-item"/>
          </div>
        </div>

        <div id="tuition-assist-form" className="form-group top-aligned">
          <label htmlFor="tuition-assist">Military Tuition Assistance:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('retention');}} className="info-icons"><i id="military-tuition-assistance-info" className="fa fa-info-circle info-icons"></i></a></label>
          <input onChange={(e) => { this.setState({ tuitionAssist: e.target.value }); }} id="tuition-assist" type="text" defaultValue="$0" name="Military Tuition Assistance" alt="How much are you receiving in military tuition assistance" className="filter-item"/>
        </div>

        <div id="enrollment-section">
          <div id="enrolled-form">
            <label htmlFor="enrolled">Enrolled:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcEnrolled');}} className="info-icons"><i id="enrolled-info" className="fa fa-info-circle info-icons"></i></a></label>
            <div>
              <select onChange={(e) => { this.setState({ rop: e.target.value }); }} id="enrolled" name="Enrolled" alt="Select your enrollment level" className="filter-item">
                <option value="1.0">Full Time</option>
                <option value="0.8">¾ Time</option>
                <option value="0.6">More than ½ time</option>
                <option value="0">½ Time or less</option>
              </select>
            </div>
          </div>

          {/*  Rate of Pursuit Old  */}
          <div id="enrolled-form-old-gi-bill">
            <label htmlFor="enrolled-old">Enrolled:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcEnrolled');}} className="info-icons"><i id="enrolled-old-info" className="fa fa-info-circle info-icons"></i></a></label>
            <div>
              <select onChange={(e) => { this.setState({ oldRop: e.target.value }); }} id="enrolled-old" name="Enrolled" alt="Select your enrollment level" className="filter-item">
                <option value="full">Full Time</option>
                <option value="three quarter">¾ Time</option>
                <option value="half">1/2 Time </option>
                <option value="less than half">Less than ½ time more than ¼ time</option>
                <option value="quarter">1/4 time or less</option>
              </select>
            </div>
          </div>

          <div id="calendar-form">
            <label htmlFor="calendar">School Calendar:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcSchoolCalendar');}} className="info-icons"><i id="school-calendar-info" className="fa fa-info-circle info-icons"></i></a></label>
            <div>
              <select onChange={(e) => { this.setState({ calendar: e.target.value }); }} id="calendar" name="School Calendar" alt="Select type of school calendar" className="filter-item">
                <option value="semesters">Semesters</option>
                <option value="quarters">Quarters</option>
                <option value="nontraditional">Non-Traditional</option>
              </select>
            </div>
          </div>

          <div id="working-form" className="form-group top-aligned">
            <label htmlFor="working">Will be working:&nbsp;<a onClick={() => {this.props.toggleModalDisplay('retention');}} className="info-icons"><i id="will-be-working-info" className="fa fa-info-circle info-icons"></i></a></label>
            <select onChange={(e) => { this.setState({ ojtWorking: e.target.value }); }} id="working" name="Will be working" alt="Select how much you will be working" className="filter-item">
              <option value="30">30+ hrs / week</option>
              <option value="28">28 hrs / week</option>
              <option value="26">26 hrs / week</option>
              <option value="24">24 hrs / week</option>
              <option value="22">22 hrs / week</option>
              <option value="20">20 hrs / week</option>
              <option value="18">18 hrs / week</option>
              <option value="16">16 hrs / week</option>
              <option value="14">14 hrs / week</option>
              <option value="12">12 hrs / week</option>
              <option value="10">10 hrs / week</option>
              <option value="8">8 hrs / week</option>
              <option value="6">6 hrs / week</option>
              <option value="4">4 hrs / week</option>
              <option value="2">2 hrs / week</option>
            </select>
          </div>

          <div id="number-non-traditional-terms-form" className="form-group top-aligned">
            <label htmlFor="number-non-traditional-terms">How many terms / year?</label>
            <select defaultValue="2" onChange={(e) => { this.setState({ numberNontradTerms: e.target.value }); }} id="number-non-traditional-terms" name="How many terms / year?" alt="Select how many terms / year?" className="filter-item">
              <option value="3">Three</option>
              <option value="2">Two</option>
              <option value="1">One</option>
            </select>
          </div>

          <div id="length-non-traditional-terms-form" className="form-group top-aligned">
            <label htmlFor="length-non-traditional-terms">How long is each term?</label>
            <select defaultValue="3" onChange={(e) => { this.setState({ lengthNontradTerms: e.target.value }); }} id="length-non-traditional-terms" name="How long is each term?" alt="Select how long is each term?" className="filter-item">
              <option value="1">1 month</option>
              <option value="2">2 months</option>
              <option value="3">3 months</option>
              <option value="4">4 months</option>
              <option value="5">5 months</option>
              <option value="6">6 months</option>
              <option value="7">7 months</option>
              <option value="8">8 months</option>
              <option value="9">9 months</option>
              <option value="10">10 months</option>
              <option value="11">11 months</option>
              <option value="12">12 months</option>
            </select>
          </div>

          <div id="kicker-elig-form">
            <label className="question">Eligible for Kicker:&nbsp;<a onClick={() => { this.props.toggleModalDisplay('calcKicker'); }} className="info-icons"><i id="eligible-for-kicker-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ kickerElig: e.target.value }); }} id="kicker-elig-yes" name="kickerEligible" type="radio" value="yes" className="filter-item"/>
            <label className="radio" htmlFor="kicker-elig-yes">Yes</label>
            <input onChange={(e) => { this.setState({ kickerElig: e.target.value }); }} id="kicker-elig-no" name="kickerEligible" type="radio" value="no" defaultChecked className="filter-item"/>
            <label className="radio" htmlFor="kicker-elig-no">No</label>
          </div>

          <div id="kicker-form" className="form-group top-aligned">
            <label htmlFor="kicker">How much is your kicker?&nbsp;<a onClick={() => {this.props.toggleModalDisplay('calcKicker');}} className="info-icons"><i id="how-much-kicker-info" className="fa fa-info-circle info-icons"></i></a></label>
            <input onChange={(e) => { this.setState({ kicker: e.target.value }); }} id="kicker" type="text" defaultValue="$200" name="How much is your kicker?" alt="Tell us how much is your kicker was for?" className="filter-item"/>
          </div>

          {/*  Eligible for Buy-up  */}
          <div id="buy-up-form">
            <label className="question">Participate in buy-up program?</label>
            <input onChange={(e) => { this.setState({ buyUpElig: e.target.value }); }} id="buy-up-yes" name="buy-up" type="radio" value="yes" className="filter-item"/>
            <label className="radio" htmlFor="buy-up-yes">Yes</label>
            <input onChange={(e) => { this.setState({ buyUpElig: e.target.value }); }} id="buy-up-no" name="buy-up" type="radio" value="no" defaultChecked className="filter-item"/>
            <label className="radio" htmlFor="buy-up-no">No</label>
          </div>

          <div id="buy-up-rate-form" className="form-group top-aligned">
            <label htmlFor="buy-up-rate">How much did you pay toward buy-up?</label>
            <select onChange={(e) => { this.setState({ buyUp: e.target.value }); }} id="buy-up-rate" name="How much did you pay?" alt="Select how much you paid" className="filter-item">
              <option value="600">$600</option>
              <option value="580">$580</option>
              <option value="540">$540</option>
              <option value="520">$520</option>
              <option value="500">$500</option>
              <option value="480">$480</option>
              <option value="460">$460</option>
              <option value="440">$440</option>
              <option value="420">$420</option>
              <option value="400">$400</option>
              <option value="380">$380</option>
              <option value="340">$340</option>
              <option value="320">$320</option>
              <option value="300">$300</option>
              <option value="280">$280</option>
              <option value="260">$260</option>
              <option value="240">$240</option>
              <option value="220">$220</option>
              <option value="200">$200</option>
              <option value="180">$180</option>
              <option value="140">$140</option>
              <option value="120">$120</option>
              <option value="100">$100</option>
              <option value="80">$80</option>
              <option value="60">$60</option>
              <option value="40">$40</option>
              <option value="20">$20</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderOutputs() {
    this.props.calculator.recalculate();

    // TODO: deal with antiquated oldOnClick attributes
    return (
      <div>
        <div className="calc-outputs  large-5 large-offset-1 columns">
          {/*  Contains Calcualtor Outputs   */}
          <div id="calculated-benefits" className="align-center">
            <h3>Calculator Results</h3>
            <table className="calc-results-1 borderless">
              <tbody>
                <tr id="calc-housing-allow-rate-row">
                  <th className="noborder align-right">Housing Allowance:</th>
                  <td colSpan="2" id="housing-allow-rate" className="noborder align-left">{this.state.housingAllowRate}</td>
                </tr>
                <tr></tr>
                <tr id="calc-term-total-row">
                  <th colSpan="2" className="noborder align-right data-row border-bottom">Total GI Bill Benefits:</th>
                  <td id="total-year" className="noborder align-left data-row"><b>{this.state.totalYear}</b></td>
                </tr>
                <tr id="calc-paid-to-school-total-row">
                  <td colSpan="2" className="noborder align-right data-row">Paid to school:</td>
                  <td id="total-paid-to-school" className="noborder align-left data-row">{this.state.totalPaidToSchool}</td>
                </tr>
                <tr id="calc-paid-to-you-total-row">
                  <td colSpan="2" className="noborder align-right data-row">Paid to You:</td>
                  <td id="total-paid-to-you" className="noborder align-left data-row">{this.state.totalPaidToYou}</td>
                </tr>
                <tr></tr>
                <tr id="calc-out-of-pocket-row">
                  <th colSpan="2" className="noborder align-right data-row">Out of Pocket Tuition:</th>
                  <td id="total-left-to-pay" className="noborder align-left data-row">{this.state.totalLeftToPay}</td>
                </tr>
                <tr id="calc-tuition-fees-charged-row">
                  <td colSpan="2" className="noborder align-right data-row">Tuition &amp; Fees Charged:</td>
                  <td id="total-tuition-fees-charged" className="noborder align-left data-row">{this.state.totalTuitionFeesCharged}</td>
                </tr>
                <tr id="calc-tuition-fees-scholarship-row">
                  <td colSpan="2" className="noborder align-right data-row">Your Scholarships:</td>
                  <td id="total-tuition-fees-scholarships" className="noborder align-left data-row">{this.state.totalTuitionFeesScholarships}</td>
                </tr>
                <tr id="calc-school-received-row">
                  <td colSpan="2" className="noborder align-right data-row">GI Bill Pays:</td>
                  <td id="total-school-received" className="noborder align-left data-row">{this.state.totalSchoolReceived}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="usa-width-one-whole newrow term-calc-results">
          <table className="calc-results-2">
            <thead>
              <tr id="payments-to-you-terms">
                <th aria-hidden="false"></th>
                <th className="term1">Fall</th>
                <th className="term2">Spring</th>
                <th className="term3"></th>
                <th className="term4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr id="calc-tuition-fees-row">
                <th>
                  <a id="tuition-fees-benefit-calc-info-link-out" href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#tuitionfees"> {/* TODO: oldOnClick="track('Tool Tips', 'Benefit Calculator / Tuition Fees');" target="_blank" alt="Click here for more information about the tuition/fees benefit." */}
                    Tuition / Fees Benefit:
                  </a>
                </th>
                <td id="tuition-fees-term-1">{this.state.tuitionFeesTerm1}</td>
                <td id="tuition-fees-term-2">{this.state.tuitionFeesTerm2}</td>
                <td id="tuition-fees-term-3">{this.state.tuitionFeesTerm3}</td>
                <td id="tuition-fees-total" style={{ fontWeight: 'bold' }}>{this.state.tuitionFeesTotal}</td>
              </tr>
              <tr id="calc-yellow-ribbon-row">
                <th>
                  <a id="yellow-ribbon-school-calc-info-link-out" href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#yellowribbon"> {/* TODO: oldOnClick="track('Tool Tips', 'Benefit Calculator / Yellow Ribbon (School)');" target="_blank" alt="Click here for more information." */}
                    Yellow Ribbon (School):
                  </a>
                </th>
                <td id="yr-ben-term-1">{this.state.yrBenTerm1}</td>
                <td id="yr-ben-term-2">{this.state.yrBenTerm2}</td>
                <td id="yr-ben-term-3">{this.state.yrBenTerm3}</td>
                <td id="yr-ben-total" style={{ fontWeight: 'bold' }}>{this.state.yrBenTotal}</td>
              </tr>
              <tr id="calc-yellow-ribbon-va-row">
                <th>
                  <a id="yellow-ribbon-va-calc-info-link-out" href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#yellowribbon"> {/* TODO: oldOnClick="track('Tool Tips', 'Benefit Calculator / Yellow Ribbon (VA)');" target="_blank" alt="Click here for more information." */}
                    Yellow Ribbon (VA):
                  </a>
                </th>
                <td id="yr-ben-term-va-1">{this.state.yrBenTermVa1}</td>
                <td id="yr-ben-term-va-2">{this.state.yrBenTermVa2}</td>
                <td id="yr-ben-term-va-3">{this.state.yrBenTermVa3}</td>
                <td id="yr-ben-va-total" style={{ fontWeight: 'bold' }}>{this.state.yrBenVaTotal}</td>
              </tr>
              <tr>
                <th>
                  <a id="housing allowance-calc-info-link-out" href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#housingallowance"> {/* TODO: oldOnClick="track('Tool Tips', 'Benefit Calculator / Housing Allowance');" target="_blank" alt="Click here for more information about the housing allowance." */}
                    Housing Allowance:
                  </a>
                </th>
                <td id="housing-allow-term-1">{this.state.housingAllowTerm1}</td>
                <td id="housing-allow-term-2">{this.state.housingAllowTerm2}</td>
                <td id="housing-allow-term-3">{this.state.housingAllowTerm3}</td>
                <td id="housing-allow-total" style={{ fontWeight: 'bold' }}>{this.state.housingAllowTotal}</td>
              </tr>
              <tr>
                <th>
                  <a id="book-stipend-calc-info-link-out"href="http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#bookstipend"> {/* TODO: oldOnClick="track('Tool Tips', 'Benefit Calculator / Book Stipend');" target="_blank" alt="Click here for more information about the book stipend." */}
                    Book Stipend:
                  </a>
                </th>
                <td id="book-stipend-term-1">{this.state.bookStipendTerm1}</td>
                <td id="book-stipend-term-2">{this.state.bookStipendTerm2}</td>
                <td id="book-stipend-term-3">{this.state.bookStipendTerm3}</td>
                <td id="book-stipend-total" style={{ fontWeight: 'bold' }}>{this.state.bookStipendTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div id="calculator">
        <div className="benefits">
          <div id="benefit-calculator">
            <h4>Calculate Your Detailed Benefits</h4>
          </div>
          {this.renderInputs()}
          {this.renderOutputs()}
        </div>
      </div>
    );
  }

}

ProfileCalculator.propTypes = {
  institution: React.PropTypes.object.isRequired,
  toggleModalDisplay: React.PropTypes.func.isRequired,
  expanded: React.PropTypes.bool.isRequired
};

ProfileCalculator.defaultProps = {
  expanded: true,
  calculator: new Calculator()
};

export default ProfileCalculator;
