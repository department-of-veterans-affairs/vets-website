import React from 'react';

import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';
import { formatCurrency } from '../../utils/helpers';

class CalculatorForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderLearnMoreLabel = this.renderLearnMoreLabel.bind(this);
    this.renderInState = this.renderInState.bind(this);
    this.renderTuition = this.renderTuition.bind(this);
    this.renderBooks = this.renderBooks.bind(this);
    this.renderYellowRibbon = this.renderYellowRibbon.bind(this);
    this.renderScholarships = this.renderScholarships.bind(this);
    this.renderTuitionAssist = this.renderTuitionAssist.bind(this);
    this.renderEnrolled = this.renderEnrolled.bind(this);
    this.renderEnrolledOld = this.renderEnrolledOld.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
    this.renderKicker = this.renderKicker.bind(this);
    this.renderWorking = this.renderWorking.bind(this);
  }

  renderLearnMoreLabel({ text, modal }) {
    return (
      <span>
        {text} (<a onClick={this.props.onShowModal.bind(this, modal)}>Learn more</a>)
      </span>
    );
  }

  renderInState() {
    if (!this.props.displayedInputs.inState) return null;
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label="Are you an in-state student?"
                name="inState"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.inputs.inState}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
      </div>
    );
  }

  renderTuition() {
    if (!this.props.displayedInputs.tuition) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="tuitionFees">
            Tuition and fees per year (
            <a onClick={this.props.onShowModal.bind(this, 'calcTuition')}>
            Learn more</a>)
          </label>
          <input
              type="text"
              name="tuitionFees"
              value={formatCurrency(this.props.inputs.tuitionFees)}
              onChange={this.props.onInputChange}/>
        </div>
      </div>
    );
  }

  renderBooks() {
    if (!this.props.displayedInputs.books) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="books">Books and supplies per year</label>
          <input
              type="text"
              name="books"
              value={formatCurrency(this.props.inputs.books)}
              onChange={this.props.onInputChange}/>
        </div>
      </div>
    );
  }

  renderYellowRibbon() {
    if (!this.props.displayedInputs.yellowRibbon) return null;

    let amountInput;

    if (this.props.inputs.yellowRibbonRecipient === 'yes') {
      amountInput = (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="yellowRibbonAmount">
              Yellow Ribbon Amount From School per year
            </label>
            <input
                type="text"
                name="yellowRibbonAmount"
                value={formatCurrency(this.props.inputs.yellowRibbonAmount)}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label={this.renderLearnMoreLabel({ text: 'Are you a current Yellow Ribbon recipient?', modal: 'calcYr' })}
                name="yellowRibbonRecipient"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.inputs.yellowRibbonRecipient}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
        {amountInput}
      </div>
    );
  }

  renderScholarships() {
    if (!this.props.displayedInputs.scholarships) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="scholarships">
            Scholarships (excluding Pell) (
            <a onClick={this.props.onShowModal.bind(this, 'calcScholarships')}>
            Learn more</a>)
          </label>
          <input
              type="text"
              name="scholarships"
              value={formatCurrency(this.props.inputs.scholarships)}
              onChange={this.props.onInputChange}/>
        </div>
      </div>
    );
  }

  renderTuitionAssist() {
    if (!this.props.displayedInputs.tuitionAssist) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="tuitionAssist">
            How much are you receiving in military tuition assistance (
            <a onClick={this.props.onShowModal.bind(this, 'calcTuitionAssist')}>
            Learn more</a>)
          </label>
          <input
              type="text"
              name="tuitionAssist"
              value={formatCurrency(this.props.inputs.tuitionAssist)}
              onChange={this.props.onInputChange}/>
        </div>
      </div>
    );
  }

  renderEnrolled() {
    if (!this.props.displayedInputs.enrolled) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <Dropdown
              name="enrolled"
              alt="Enrolled"
              options={[
                { value: '1.0', label: 'Full Time' },
                { value: '0.8', label: '¾ Time' },
                { value: '0.6', label: 'More than ½ time' },
                { value: '0', label: '½ Time or less' },
              ]}
              visible
              value={this.props.inputs.enrolled}
              onChange={this.props.onInputChange}>
            {this.renderLearnMoreLabel({ text: 'Enrolled', modal: 'calcEnrolled' })}
          </Dropdown>
        </div>
      </div>
    );
  }

  renderEnrolledOld() {
    if (!this.props.displayedInputs.enrolledOld) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <Dropdown
              name="enrolled"
              alt="Enrolled"
              options={[
                { value: 'full', label: 'Full Time' },
                { value: 'three quarters', label: '¾ Time' },
                { value: 'half', label: '½ Time' },
                { value: 'less than half', label: 'Less than ½ time more than ¼ time' },
                { value: 'quarter', label: '½ Time or less' },
              ]}
              visible
              value={this.props.inputs.enrolled}
              onChange={this.props.onInputChange}>
            {this.renderLearnMoreLabel({ text: 'Enrolled', modal: 'calcEnrolled' })}
          </Dropdown>
        </div>
      </div>
    );
  }

  renderCalendar() {
    if (!this.props.displayedInputs.calendar) return null;

    let dependentDropdowns;

    if (this.props.inputs.calendar === 'nontraditional') {
      dependentDropdowns = (
        <div>
          <div className="row">
            <div className="small-12 columns">
              <Dropdown
                  name="numberNontradTerms"
                  alt="How many terms per year?"
                  options={[
                    { value: '3', label: 'Three' },
                    { value: '2', label: 'Two' },
                    { value: '1', label: 'One' }
                  ]}
                  visible
                  value={this.props.inputs.numberNontradTerms}
                  onChange={this.props.onInputChange}>
                <label htmlFor="numberNontradTerms">
                  How many terms per year?
                </label>
              </Dropdown>
            </div>
          </div>
          <div className="row">
            <div className="small-12 columns">
              <Dropdown
                  name="lengthNontradTerms"
                  alt="How long is each term?"
                  options={[
                    { value: '1', label: '1 month' },
                    { value: '2', label: '2 months' },
                    { value: '3', label: '3 months' },
                    { value: '4', label: '4 months' },
                    { value: '5', label: '5 months' },
                    { value: '6', label: '6 months' },
                    { value: '7', label: '7 months' },
                    { value: '8', label: '8 months' },
                    { value: '9', label: '9 months' },
                    { value: '10', label: '10 months' },
                    { value: '11', label: '11 months' },
                    { value: '12', label: '12 months' }
                  ]}
                  visible
                  value={this.props.inputs.lengthNontradTerms}
                  onChange={this.props.onInputChange}>
                <label htmlFor="lengthNontradTerms">
                  How long is each term?
                </label>
              </Dropdown>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <Dropdown
                name="calendar"
                alt="School calendar"
                options={[
                  { value: 'semesters', label: 'Semesters' },
                  { value: 'quarters', label: 'Quarters' },
                  { value: 'nontraditional', label: 'Non-Traditional' }
                ]}
                visible
                value={this.props.inputs.calendar}
                onChange={this.props.onInputChange}>
              {this.renderLearnMoreLabel({ text: 'School Calendar', modal: 'calcSchoolCalendar' })}
            </Dropdown>
          </div>
        </div>
        {dependentDropdowns}
      </div>
    );
  }

  renderKicker() {
    if (!this.props.displayedInputs.kicker) return null;

    let amountInput;

    if (this.props.inputs.kickerEligible === 'yes') {
      amountInput = (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="kickerAmount">How much is your kicker?</label>
            <input
                type="text"
                name="kickerAmount"
                value={formatCurrency(this.props.inputs.kickerAmount)}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label={this.renderLearnMoreLabel({ text: 'Eligible for kicker bonus?', modal: 'calcKicker' })}
                name="kickerEligible"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.inputs.kickerEligible}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
        {amountInput}
      </div>
    );
  }

  renderBuyUp() {
    if (!this.props.displayedInputs.buyUp) return null;

    let amountInput;

    if (this.props.inputs.buyUp === 'yes') {
      amountInput = (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="buyUpAmount">How much did you pay toward buy-up?</label>
            <input
                type="text"
                name="buyUpAmount"
                value={formatCurrency(this.props.inputs.buyUpAmount)}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label="Participate in buy-up program?"
                name="buyUp"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.inputs.buyUp}
                onChange={this.props.onInputChange}/>
          </div>
        </div>
        {amountInput}
      </div>
    );
  }

  renderWorking() {
    if (!this.props.displayedInputs.working) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <Dropdown
              name="working"
              alt="Will be working"
              options={[
                { value: '30', label: '30+ hrs / week' },
                { value: '28', label: '28 hrs / week' },
                { value: '26', label: '26 hrs / week' },
                { value: '24', label: '24 hrs / week' },
                { value: '22', label: '22 hrs / week' },
                { value: '20', label: '20 hrs / week' },
                { value: '18', label: '18 hrs / week' },
                { value: '16', label: '16 hrs / week' },
                { value: '14', label: '14 hrs / week' },
                { value: '12', label: '12 hrs / week' },
                { value: '10', label: '10 hrs / week' },
                { value: '8', label: '8 hrs / week' },
                { value: '6', label: '6 hrs / week' },
                { value: '4', label: '4 hrs / week' },
                { value: '2', label: '2 hrs / week' }
              ]}
              visible
              value={this.props.inputs.working}
              onChange={this.props.onInputChange}>
            <label htmlFor="working">
              {/* TODO: identify correct modal <LearnMoreLabel text="Will be working" modal="calcSchoolCalendar"/> */}
              Will be working
            </label>
          </Dropdown>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.displayedInputs) return null;
    return (
      <div className="calculator-form">
        {this.renderInState()}
        {this.renderTuition()}
        {this.renderBooks()}
        {this.renderYellowRibbon()}
        {this.renderScholarships()}
        {this.renderTuitionAssist()}
        {this.renderEnrolled()}
        {this.renderEnrolledOld()}
        {this.renderCalendar()}
        {this.renderKicker()}
        {this.renderBuyUp()}
        {this.renderWorking()}
      </div>
    );
  }
}

CalculatorForm.propTypes = {
  inputs: React.PropTypes.object,
  displayedInputs: React.PropTypes.object,
  onShowModal: React.PropTypes.func,
  onInputChange: React.PropTypes.func
};

export default CalculatorForm;
