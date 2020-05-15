import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import {
  calculatorInputChange,
  beneficiaryZIPCodeChanged,
  showModal,
  hideModal,
  eligibilityChange,
  updateEstimatedBenefits,
} from '../actions';
import { scroller } from 'react-scroll';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import { getCalculatedBenefits } from '../selectors/calculator';
import EstimateYourBenefitsForm from '../components/profile/EstimateYourBenefitsForm';
import EstimatedBenefits from '../components/profile/EstimatedBenefits';
import EstimateYourBenefitsSummarySheet from '../components/EstimateYourBenefitsSummarySheet';

export class EstimateYourBenefits extends React.Component {
  constructor(props) {
    super(props);
    this.updateEstimatedBenefits();

    this.state = {
      showEybSheet: false,
      expandEybSheet: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.handleScroll(), true);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const topOffset =
      document
        .getElementById('estimate-your-benefits-accordion')
        .getBoundingClientRect().top -
        12 <
      0;
    const bottomOffset =
      document
        .getElementsByClassName('your-estimated-benefits')[0]
        .getBoundingClientRect().top -
        window.innerHeight >
      0;

    if (topOffset && bottomOffset) {
      if (this.state.showEybSheet === false) {
        this.setState({ showEybSheet: true });
      }
    } else if (this.state.showEybSheet === true) {
      this.setState({ showEybSheet: false });
    }
  }

  updateEstimatedBenefits = () => {
    this.props.updateEstimatedBenefits(this.props.calculated.outputs);
    scroller.scrollTo('estimated-benefits', getScrollOptions());
    focusElement('#estimated-benefits');
  };

  toggleEybExpansion() {
    if (this.state.expandEybSheet) {
      this.setState({ expandEybSheet: false });
    } else {
      this.setState({ expandEybSheet: true });
    }
  }

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
        <EstimatedBenefits outputs={outputs} calculator={inputs} />
        {
          <div
            className={classNames(
              'vads-u-display--block',
              'small-screen:vads-u-display--none',
              'eyb-sheet',
              {
                open: this.state.showEybSheet,
              },
            )}
          >
            <EstimateYourBenefitsSummarySheet
              outputs={outputs}
              expandEybSheet={this.state.expandEybSheet}
              toggleEybExpansion={() => this.toggleEybExpansion()}
              type={this.props.calculator.type}
              yellowRibbon={
                this.props.calculator.yellowRibbonRecipient === 'yes'
              }
            />
          </div>
        }
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
