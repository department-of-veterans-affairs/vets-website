import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  eligibilityChange,
} from '../../actions';
import { getCalculatedBenefits } from '../../selectors/calculator';
import EligibilityForm from '../search/EligibilityForm';
import CalculatorForm from '../profile/CalculatorForm';

const CalculatorResultRow = ({ label, value, header, bold, visible }) =>
  visible ? (
    <div
      className={classNames('row', 'calculator-result', {
        'vads-u-font-weight--bold': bold,
      })}
    >
      <div className="small-6 columns">
        {header ? <h4>{label}:</h4> : <div>{label}:</div>}
      </div>
      <div className="small-6 columns vads-u-text-align--right">
        {header ? <h5>{value}</h5> : <div>{value}</div>}
      </div>
    </div>
  ) : null;
export class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.toggleEligibilityForm = this.toggleEligibilityForm.bind(this);
    this.toggleCalculatorForm = this.toggleCalculatorForm.bind(this);
    this.renderEligibilityForm = this.renderEligibilityForm.bind(this);
    this.renderCalculatorForm = this.renderCalculatorForm.bind(this);
    this.renderPerTermSections = this.renderPerTermSections.bind(this);

    this.state = {
      showEligibilityForm: false,
      showCalculatorForm: true,
    };
  }

  toggleEligibilityForm() {
    this.setState({ showEligibilityForm: !this.state.showEligibilityForm });
  }

  toggleCalculatorForm() {
    this.setState({ showCalculatorForm: !this.state.showCalculatorForm });
  }

  renderEligibilityForm() {
    const expanded = this.state.showEligibilityForm;

    return (
      <div aria-live="off" className="eligibility-details">
        <button
          aria-expanded={expanded}
          onClick={this.toggleEligibilityForm}
          className="usa-button-secondary"
        >
          {expanded ? 'Hide' : 'Edit'} eligibility details
        </button>
        <div>
          {expanded ? (
            <form>
              <EligibilityForm
                eligibilityChange={this.props.eligibilityChange}
              />
            </form>
          ) : null}
        </div>
      </div>
    );
  }

  renderCalculatorForm() {
    const {
      profile,
      calculator: inputs,
      calculated: { inputs: displayed },
    } = this.props;
    const expanded = this.state.showCalculatorForm;

    return (
      <div aria-live="off" className="calculator-inputs">
        <div aria-live="off">
          <button
            aria-expanded={expanded}
            onClick={this.toggleCalculatorForm}
            className="usa-button-secondary"
          >
            {expanded ? 'Hide' : 'Edit'} calculator fields
          </button>
        </div>
        <div>
          {expanded ? (
            <CalculatorForm
              profile={profile}
              eligibility={this.props.eligibility}
              eligibilityChange={this.props.eligibilityChange}
              inputs={inputs}
              displayedInputs={displayed}
              onShowModal={this.props.showModal}
              onInputChange={this.props.calculatorInputChange}
              onBeneficiaryZIPCodeChanged={this.props.beneficiaryZIPCodeChanged}
            />
          ) : null}
        </div>
      </div>
    );
  }

  renderPerTermSections() {
    const { perTerm } = this.props.calculated.outputs;

    const sections = Object.keys(perTerm).map(section => {
      const {
        visible,
        title,
        learnMoreAriaLabel,
        terms,
      } = this.props.calculated.outputs.perTerm[section];
      if (!visible) return null;

      const learnMoreLink = `http://www.benefits.va.gov/gibill/comparison_tool/about_this_tool.asp#${section.toLowerCase()}`;

      return (
        <div key={section} className="per-term-section">
          <div className="link-header">
            <h4>{title}</h4>
            &nbsp;(
            <a
              href={learnMoreLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={learnMoreAriaLabel || ''}
            >
              Learn more
            </a>
            )
          </div>
          {terms.map(term => (
            <CalculatorResultRow
              key={`${section}${term.label}`}
              label={term.label}
              value={term.value}
              bold={term.label === 'Total per year'}
              visible={term.visible}
            />
          ))}
        </div>
      );
    });

    return (
      <div>
        <h3>
          Estimated benefits per{' '}
          {this.props.calculator.type === 'OJT' ? 'month' : 'term'}
        </h3>
        {sections}
      </div>
    );
  }

  render() {
    if (isEmpty(this.props.calculated)) {
      return <LoadingIndicator message="Loading your estimated benefits..." />;
    }

    // const it = this.props.profile.attributes;
    const { outputs } = this.props.calculated;
    const fraction = 'usa-width-one-eigth medium-5 columns';
    return (
      <div className="row calculate-your-benefits">
        <div className={fraction}>
          {this.renderEligibilityForm()}
          {this.renderCalculatorForm()}
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <div className="usa-width-one-half medium-6 columns your-estimated-benefits">
          <h3>Your estimated benefits</h3>
          <div className="out-of-pocket-tuition">
            <CalculatorResultRow
              label="GI Bill pays to school"
              value={outputs.giBillPaysToSchool.value}
              visible={outputs.giBillPaysToSchool.visible}
              header
            />
            <CalculatorResultRow
              label="Tuition and fees charged"
              value={outputs.tuitionAndFeesCharged.value}
              visible={outputs.tuitionAndFeesCharged.visible}
            />
            <CalculatorResultRow
              label="Your scholarships"
              value={outputs.yourScholarships.value}
              visible={outputs.yourScholarships.visible}
            />
            <CalculatorResultRow
              label="Out of pocket tuition"
              value={outputs.outOfPocketTuition.value}
              bold
              visible={outputs.outOfPocketTuition.visible}
            />
          </div>
          <div className="total-paid-to-you">
            <CalculatorResultRow
              label="Housing allowance"
              value={outputs.housingAllowance.value}
              visible={outputs.housingAllowance.visible}
              header
            />
            <CalculatorResultRow
              label="Book stipend"
              value={outputs.bookStipend.value}
              visible={outputs.bookStipend.visible}
              header
            />
            <CalculatorResultRow
              label="Total paid to you"
              value={outputs.totalPaidToYou.value}
              bold
              visible={outputs.totalPaidToYou.visible}
            />
          </div>
          <hr />
          {this.renderPerTermSections()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  calculator: state.calculator,
  profile: state.profile,
  calculated: getCalculatedBenefits(state, props),
  eligibility: state.eligibility,
});

const mapDispatchToProps = {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  eligibilityChange,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Calculator);
