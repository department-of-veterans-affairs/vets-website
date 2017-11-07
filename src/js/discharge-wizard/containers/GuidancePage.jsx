import { connect } from 'react-redux';
import React from 'react';

import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import { branchOfService, board, formNumber } from '../utils';

class GuidancePage extends React.Component {
  renderResultSummary() {
    const forReconsideration = this.props.formValues['10_prevApplicationType'] === '3';
    return `You need to complete Department of Defense (DoD) Form ${formNumber(formNumber)} and send it to the ${board(this.props.formValues).name} for the ${branchOfService(this.props.formValues['7_branchOfService'])}${forReconsideration ? ' for reconsideration' : ''}`;
  }

  render() {
    return (
      <div>
        <h1>Guidance on Upgrading Your Discharge</h1>
        <div className="medium-8">
          <div className="va-introtext">
            <p>
              <strong>Result</strong>: {this.renderResultSummary()}.
            </p>
          </div>
          <CarefulConsiderationStatement reason={this.props.formValues['1_reason']} dischargeType={this.props.formValues['2_dischargeType']}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.dischargeWizard.form,
  };
};
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuidancePage);
