// Dependencies
import { connect } from 'react-redux';
import React, { Component } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import localStorage from 'platform/utilities/storage/localStorage';

// Relative imports
import AdditionalInstructions from '../components/gpMinorComponents/AdditionalInstructions';
import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import OptionalStep from '../components/gpMinorComponents/OptionalStep';
import ResultsSummary from '../components/gpMinorComponents/ResultsSummary';
import StepOne from '../components/gpSteps/StepOne';
import StepTwo from '../components/gpSteps/StepTwo';
import StepThree from '../components/gpSteps/StepThree';
import Warnings from '../components/gpMinorComponents/Warnings';

export class GuidancePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    localStorage.setItem('dw-viewed-guidance', true);
    localStorage.setItem(
      'dw-formValues',
      JSON.stringify(this.props.formValues),
    );

    if (sessionStorage.getItem('dw-session-started')) {
      sessionStorage.removeItem('dw-session-started');
    } else {
      this.props.router.push('/');
    }

    const el = document.getElementById('dw-home-link');
    if (el) {
      el.focus();
    }

    window.scrollTo(0, 0);
  }

  handleFAQToggle = e => {
    e.preventDefault();
    recordEvent({ event: 'discharge-upgrade-faq-toggle' });
    this.setState({
      [e.target.name]: !this.state[e.target.name],
    });
  };

  handlePrint(e) {
    e.preventDefault();
    recordEvent({ event: 'discharge-upgrade-print' });
    if (window.print) {
      window.print();
    }
  }

  render() {
    return (
      <article className="dw-guidance">
        <h1>Your Steps for Upgrading Your Discharge</h1>
        <div className="medium-8">
          <ResultsSummary formValues={this.props.formValues} />
          <CarefulConsiderationStatement formValues={this.props.formValues} />
          <Warnings formValues={this.props.formValues} />
          <OptionalStep formValues={this.props.formValues} />
          <ul className="steps-list vertical-list-group more-bottom-cushion numbered">
            <StepOne formValues={this.props.formValues} />
            <StepTwo formValues={this.props.formValues} />
            <StepThree
              formValues={this.props.formValues}
              handlePrint={this.handlePrint}
            />
          </ul>
          <AdditionalInstructions
            formValues={this.props.formValues}
            handleFAQToggle={this.handleFAQToggle}
            parentState={this.state}
          />
        </div>
      </article>
    );
  }
}

const mapStateToProps = state => ({
  formValues: state.dischargeWizard.form,
});
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuidancePage);
