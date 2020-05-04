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
import { getCalculatedBenefits } from '../selectors/calculator';
import EstimateYourBenefitsForm from '../components/profile/EstimateYourBenefitsForm';
import EstimatedBenefits from '../components/profile/EstimatedBenefits';

export class EstimateYourBenefits extends React.Component {
  constructor(props) {
    super(props);
    this.updateEstimatedBenefits();
  }

  updateEstimatedBenefits = () => {
    this.props.updateEstimatedBenefits(this.props.calculated.outputs);
    focusElement('#estimated-benefits');
  };

  render() {
    if (isEmpty(this.props.estimatedBenefits)) {
      return <LoadingIndicator message="Loading your estimated benefits..." />;
    }

    const outputs = this.props.estimatedBenefits;
    const {
      profile,
      calculator: inputs,
      calculated: { inputs: displayed },
    } = this.props;

    return (
      <div className="row calculate-your-benefits">
        <EstimateYourBenefitsForm
          profile={profile}
          eligibility={this.props.eligibility}
          eligibilityChange={this.props.eligibilityChange}
          inputs={inputs}
          displayedInputs={displayed}
          showModal={this.props.showModal}
          calculatorInputChange={this.props.calculatorInputChange}
          onBeneficiaryZIPCodeChanged={this.props.beneficiaryZIPCodeChanged}
          estimatedBenefits={this.props.estimatedBenefits}
          updateEstimatedBenefits={this.updateEstimatedBenefits}
        />
        <div className="medium-1 columns">&nbsp;</div>
        <EstimatedBenefits outputs={outputs} calculator={inputs} />
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
