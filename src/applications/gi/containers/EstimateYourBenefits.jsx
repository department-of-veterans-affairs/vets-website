import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  eligibilityChange,
} from '../actions';
import { getCalculatedBenefits } from '../selectors/calculator';
import EligibilityForm from '../components/search/EligibilityForm';
import CalculatorForm from '../components/profile/CalculatorForm';
import SectionItem from '../components/SectionItem';
import EstimatedBenefits from '../components/profile/EstimatedBenefits';
import { createId } from '../utils/helpers';

export class EstimateYourBenefits extends React.Component {
  renderYourBenefits = () => (
    <SectionItem
      title={'Your benefits'}
      id={`eyb-${createId('Your benefits')}`}
      expanded
    >
      <form>
        <EligibilityForm
          eligibilityChange={this.props.eligibilityChange}
          showHeader={false}
        />
      </form>
    </SectionItem>
  );

  renderAboutYourSchool = () => {
    const {
      profile,
      calculator: inputs,
      calculated: { inputs: displayed },
    } = this.props;
    return (
      <SectionItem
        title={'About your school'}
        id={`eyb-${createId('About your school')}`}
        className={'calculator-inputs'}
      >
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
      </SectionItem>
    );
  };

  renderLearningFormatAndSchedule = () => (
    <SectionItem
      title={'Learning format and schedule'}
      id={`eyb-${createId('Learning format and schedule')}`}
    />
  );

  renderScholarshipsAndOtherFunding = () => (
    <SectionItem
      title={'Scholarships and other funding'}
      id={`eyb-${createId('Scholarships and other funding')}`}
    />
  );

  render() {
    if (isEmpty(this.props.calculated)) {
      return <LoadingIndicator message="Loading your estimated benefits..." />;
    }

    const fraction = 'usa-width-one-eigth medium-5 columns';
    const { outputs } = this.props.calculated;
    const { calculator } = this.props;

    return (
      <div className="row calculate-your-benefits">
        <div className={fraction}>
          <p>Use the fields below to calculate your benefits:</p>
          {this.renderYourBenefits()}
          {this.renderAboutYourSchool()}
          {this.renderLearningFormatAndSchedule()}
          {this.renderScholarshipsAndOtherFunding()}
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
)(EstimateYourBenefits);
