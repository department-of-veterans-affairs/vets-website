import { connect } from 'react-redux';
import React from 'react';

import CarefulConsiderationStatement from '../components/CarefulConsiderationStatement';
import { branchOfService } from '../utils';

class GuidancePage extends React.Component {
  renderResultSummary() {
    const fiveB = this.props.formValues['10_prevApplicationType'];
    return `You need to complete Department of Defense (DoD) Form ${1111} and send it to the ${88888} for the ${branchOfService(this.props.formValues['7_branchOfService'])}${fiveB === '3' ? ' for reconsideration' : ''}`;
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
