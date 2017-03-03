import React from 'react';
import { connect } from 'react-redux';
import { showModal, calculatorInputChange } from '../../actions';

import Dropdown from '../Dropdown';
import If from '../If';
import RadioButtons from '../RadioButtons';

export class CalculatorForm extends React.Component {

  render() {
    const LearnMoreLabel = ({ text, modal }) => (
      <span>
        {text} (<a onClick={this.props.showModal.bind(this, modal)}>Learn more</a>)
      </span>
    );
    return (
      <div className="calculator-form">

        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="tuitionFees">Tuition and fees per year (<a onClick={this.props.showModal.bind(this, 'calcTuition')}>Learn more</a>)</label>
            <input type="text" name="tuitionFees" value={this.props.calculator.tuitionFees} onChange={this.props.calculatorInputChange}/>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label={new LearnMoreLabel({ text: 'Are you a current Yellow Ribbon recipient?', modal: 'calcYr' })}
                name="yellowRibbonRecipient"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.calculator.yellowRibbonRecipient}
                onChange={this.props.calculatorInputChange}/>
          </div>
        </div>

        <If condition={this.props.calculator.yellowRibbonRecipient === 'yes'}>
          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="yellowRibbonAmount">Yellow Ribbon Amount From School per year</label>
              <input type="text" name="yellowRibbonAmount" value={this.props.calculator.yellowRibbonAmount} onChange={this.props.calculatorInputChange}/>
            </div>
          </div>
        </If>

        <div className="row">
          <div className="small-12 columns">
            <label htmlFor="scholarships">Scholarships (excluding Pell) (<a onClick={this.props.showModal.bind(this, 'calcScholarships')}>Learn more</a>)</label>
            <input type="text" name="scholarships" value={this.props.calculator.scholarships} onChange={this.props.calculatorInputChange}/>
          </div>
        </div>

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
              <LearnMoreLabel text="Enrolled" modal="calcEnrolled"/>
            </Dropdown>
          </div>
        </div>

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
              <LearnMoreLabel text="School Calendar" modal="calcSchoolCalendar"/>
            </Dropdown>
          </div>
        </div>

        <If condition={this.props.calculator.calendar === 'nontraditional'}>
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
        </If>

        <div className="row">
          <div className="small-12 columns">
            <RadioButtons
                label={new LearnMoreLabel({ text: 'Eligible for kicker bonus?', modal: 'calcKicker' })}
                name="kickerEligible"
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' }
                ]}
                value={this.props.calculator.kickerEligible}
                onChange={this.props.calculatorInputChange}/>
          </div>
        </div>

        <If condition={this.props.calculator.kickerEligible === 'yes'}>
          <div className="row">
            <div className="small-12 columns">
              <label htmlFor="kicker">How much is your kicker?</label>
              <input type="text" name="kicker" value={this.props.calculator.kicker} onChange={this.props.calculatorInputChange}/>
            </div>
          </div>
        </If>

      </div>
    );
  }
}

const mapStateToProps = (state) => state;

const mapDispatchToProps = {
  showModal,
  calculatorInputChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorForm);
