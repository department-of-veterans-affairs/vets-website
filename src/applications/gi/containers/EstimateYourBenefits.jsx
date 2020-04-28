import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  hideModal,
  eligibilityChange,
  updateEstimatedBenefits,
} from '../actions';
import { focusElement } from 'platform/utilities/ui';
import { isLoggedIn } from 'platform/user/selectors';
import { getCalculatedBenefits } from '../selectors/calculator';
import BenefitsForm from '../components/profile/BenefitsForm';
import EybCalculatorForm from '../components/profile/EybCalculatorForm';
import EstimatedBenefits from '../components/profile/EstimatedBenefits';
import { createId } from '../utils/helpers';
import AccordionItem from '../components/AccordionItem';

export class EstimateYourBenefits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yourBenefitsExpanded: true,
      aboutYourSchoolExpanded: false,
      learningFormatAndScheduleExpanded: false,
      scholarshipsAndOtherFundingExpanded: false,
    };

    this.updateEstimatedBenefits();
  }

  toggleYourBenefits = expanded => {
    this.setState({
      yourBenefitsExpanded: expanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
  };

  toggleAboutYourSchool = expanded => {
    this.setState({
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
  };

  toggleLearningFormatAndSchedule = expanded => {
    this.setState({
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded,
      scholarshipsAndOtherFundingExpanded: expanded
        ? false
        : this.state.scholarshipsAndOtherFundingExpanded,
    });
  };

  toggleScholarshipsAndOtherFunding = expanded => {
    this.setState({
      yourBenefitsExpanded: expanded ? false : this.state.yourBenefitsExpanded,
      aboutYourSchoolExpanded: expanded
        ? false
        : this.state.aboutYourSchoolExpanded,
      learningFormatAndScheduleExpanded: expanded
        ? false
        : this.state.learningFormatAndScheduleExpanded,
      scholarshipsAndOtherFundingExpanded: expanded,
    });
  };

  updateEstimatedBenefits = () => {
    this.props.updateEstimatedBenefits(this.props.calculated.outputs);
    focusElement('#estimated-benefits');
  };

  renderYourBenefits = () => (
    <AccordionItem
      button={'Your benefits'}
      id={`eyb-${createId('Your benefits')}`}
      section
      expanded={this.state.yourBenefitsExpanded}
      onClick={this.toggleYourBenefits}
    >
      <form>
        <BenefitsForm
          eligibilityChange={this.props.eligibilityChange}
          eligibility={this.props.eligibility}
          isLoggedIn={this.props.isLoggedIn}
          hideModal={this.props.hideModal}
          showModal={this.props.showModal}
        />
      </form>
    </AccordionItem>
  );

  renderAboutYourSchool = () => {
    const {
      profile,
      calculator: inputs,
      calculated: { inputs: displayed },
    } = this.props;
    return (
      <AccordionItem
        button={'About your school'}
        id={`eyb-${createId('About your school')}`}
        expanded={this.state.aboutYourSchoolExpanded}
        section
        onClick={this.toggleAboutYourSchool}
      >
        <EybCalculatorForm
          profile={profile}
          eligibility={this.props.eligibility}
          eligibilityChange={this.props.eligibilityChange}
          inputs={inputs}
          displayedInputs={displayed}
          onShowModal={this.props.showModal}
          onInputChange={this.props.calculatorInputChange}
          onBeneficiaryZIPCodeChanged={this.props.beneficiaryZIPCodeChanged}
          estimatedBenefits={this.props.estimatedBenefits}
        />
      </AccordionItem>
    );
  };

  renderLearningFormatAndSchedule = () => (
    <AccordionItem
      button={'Learning format and schedule'}
      id={`eyb-${createId('Learning format and schedule')}`}
      expanded={this.state.learningFormatAndScheduleExpanded}
      section
      onClick={this.toggleLearningFormatAndSchedule}
    />
  );

  renderScholarshipsAndOtherFunding = () => (
    <AccordionItem
      button={'Scholarships and other funding'}
      id={`eyb-${createId('Scholarships and other funding')}`}
      expanded={this.state.scholarshipsAndOtherFundingExpanded}
      section
      onClick={this.toggleScholarshipsAndOtherFunding}
    />
  );

  render() {
    if (isEmpty(this.props.estimatedBenefits)) {
      return <LoadingIndicator message="Loading your estimated benefits..." />;
    }

    const fraction = 'usa-width-one-eigth medium-5 columns';
    const outputs = this.props.estimatedBenefits;
    const { calculator } = this.props;

    return (
      <div className="row calculate-your-benefits">
        <div className={fraction}>
          <p>Use the fields below to calculate your benefits:</p>
          <ul className="eyb-inputs-ul vads-u-padding--0">
            {this.renderYourBenefits()}
            {this.renderAboutYourSchool()}
            {this.renderLearningFormatAndSchedule()}
            {this.renderScholarshipsAndOtherFunding()}
          </ul>
          <button
            className="usa-primary-button"
            onClick={this.updateEstimatedBenefits}
          >
            Calculate Your Benefits
          </button>
        </div>
        <div className="medium-1 columns">&nbsp;</div>
        <EstimatedBenefits outputs={outputs} calculator={calculator} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  calculator: state.calculator,
  profile: state.profile,
  calculated: getCalculatedBenefits(state, props),
  eligibility: state.eligibility,
  estimatedBenefits: state.calculator.estimatedBenefits,
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  hideModal,
  eligibilityChange,
  updateEstimatedBenefits,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EstimateYourBenefits);
