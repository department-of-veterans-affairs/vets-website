import React from 'react';
import { connect } from 'react-redux';
import { showModal, calculatorInputChange } from '../../actions';
import { calculatedBenefits } from '../../selectors/calculator';
import Dropdown from '../Dropdown';
import RadioButtons from '../RadioButtons';

export class CalculatorForm extends React.Component {

  constructor(props) {
    super(props);
    this.renderLearnMoreLabel = this.renderLearnMoreLabel.bind(this);
    this.renderTuition = this.renderTuition.bind(this);
    this.renderBooks = this.renderBooks.bind(this);
    this.renderYellowRibbon = this.renderYellowRibbon.bind(this);
    this.renderScholarships = this.renderScholarships.bind(this);
    this.renderEnrolled = this.renderEnrolled.bind(this);
    this.renderCalendar = this.renderCalendar.bind(this);
    this.renderKicker = this.renderKicker.bind(this);
    this.renderWorking = this.renderWorking.bind(this);
  }

  renderLearnMoreLabel({ text, modal }) {
    return (
      <span>
        {text} (<a onClick={this.props.showModal.bind(this, modal)}>Learn more</a>)
      </span>
    );
  }

  renderTuition() {
    if (!this.props.calculated.displayed.tuition) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="tuitionFees">Tuition and fees per year (<a onClick={this.props.showModal.bind(this, 'calcTuition')}>Learn more</a>)</label>
          <input type="text" name="tuitionFees" value={this.props.calculator.tuitionFees} onChange={this.props.calculatorInputChange}/>
        </div>
      </div>
    );
  }

  renderBooks() {
    if (!this.props.calculated.displayed.books) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="books">Books and supplies per year</label>
          <input type="text" name="books" value={this.props.calculator.books} onChange={this.props.calculatorInputChange}/>
        </div>
      </div>
    );
  }

  renderYellowRibbon() {
    if (!this.props.calculated.displayed.yellowRibbon) return null;
    const Amount = ({ condition }) => {
      if (!condition) return null;
      return (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="yellowRibbonAmount">Yellow Ribbon Amount From School per year</label>
            <input type="text" name="yellowRibbonAmount" value={this.props.calculator.yellowRibbonAmount} onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
      )
    };
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
                value={this.props.calculator.yellowRibbonRecipient}
                onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
        <Amount condition={this.props.calculator.yellowRibbonRecipient === 'yes'}/>
      </div>
    );
  }

  renderScholarships() {
    if (!this.props.calculated.displayed.scholarships) return null;
    return (
      <div className="row">
        <div className="small-12 columns">
          <label htmlFor="scholarships">Scholarships (excluding Pell) (<a onClick={this.props.showModal.bind(this, 'calcScholarships')}>Learn more</a>)</label>
          <input type="text" name="scholarships" value={this.props.calculator.scholarships} onChange={this.props.calculatorInputChange}/>
        </div>
      </div>
    );
  }

  renderEnrolled() {
    if (!this.props.calculated.displayed.enrolled) return null;
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
              value={this.props.calculator.enrolled}
              onChange={this.props.calculatorInputChange}>
            {this.renderLearnMoreLabel({ text: 'Enrolled', modal: 'calcEnrolled' })}
          </Dropdown>
        </div>
      </div>
    );
  }

  renderCalendar() {
    if (!this.props.calculated.displayed.calendar) return null;
    const dependentDropdowns = (
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
                value={this.props.calculator.numberNontradTerms}
                onChange={this.props.calculatorInputChange}>
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
                value={this.props.calculator.lengthNontradTerms}
                onChange={this.props.calculatorInputChange}>
              <label htmlFor="lengthNontradTerms">
                How long is each term?
              </label>
            </Dropdown>
          </div>
        </div>
      </div>
    );
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
                value={this.props.calculator.calendar}
                onChange={this.props.calculatorInputChange}>
              {this.renderLearnMoreLabel({ text: 'School Calendar', modal: 'calcSchoolCalendar'})}
            </Dropdown>
          </div>
        </div>
        { this.props.calculator.calendar === 'nontraditional' ? dependentDropdowns : null }
      </div>
    );
  }

  renderKicker() {
    if (!this.props.calculated.displayed.kicker) return null;
    const KickerAmount = ({ condition }) => {
      if (!condition) return null;
      return (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="kicker">How much is your kicker?</label>
            <input type="text" name="kicker" value={this.props.calculator.kicker} onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
      );
    };
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
                value={this.props.calculator.kickerEligible}
                onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
        <KickerAmount condition={this.props.calculator.kickerEligible === 'yes'}/>
      </div>
    );
  }

  renderBuyUp() {
    if (!this.props.calculated.displayed.buyUp) return null;
    const BuyUpAmount = ({ condition }) => {
      if (!condition) return null;
      return (
        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="buyUpAmount">How much did you pay toward buy-up?</label>
            <input type="text" name="buyUpAmount" value={this.props.calculator.buyUpAmount} onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
      );
    };
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
                value={this.props.calculator.buyUp}
                onChange={this.props.calculatorInputChange}/>
          </div>
        </div>
        <KickerAmount condition={this.props.calculator.buyUp === 'yes'}/>
      </div>
    );
  }

  renderWorking() {
    if (!this.props.calculated.displayed.working) return null;
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
              value={this.props.calculator.working}
              onChange={this.props.calculatorInputChange}>
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
    if (!this.props.calculated) return null;
    return (
      <div className="calculator-form">
        { this.renderTuition() }
        { this.renderBooks() }
        { this.renderYellowRibbon() }
        { this.renderScholarships() }
        { this.renderEnrolled() }
        { this.renderCalendar() }
        { this.renderKicker() }
        { this.renderBuyUp() }
        { this.renderWorking() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { calculator } = state;

  return {
    calculator,
    calculated: calculatedBenefits(state)
  };
};

const mapDispatchToProps = {
  showModal,
  calculatorInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorForm);
