import React from 'react';

import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';

class InsuranceInformationPanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Insurance Information</h3>
        <InsuranceInformationSection
            data={this.props.applicationData.insuranceInformation.insuranceInfo}
            onStateChange={
            (subfield, update) => {
              this.props.publishStateChange(['insuranceInformation', 'insuranceInfo', subfield], update);
            }
          }/>
        <MedicareMedicaidSection
            data={this.props.applicationData.insuranceInformation.medicareMedicaidInfo}
            onStateChange={
            (subfield, update) => {
              this.props.publishStateChange(['insuranceInformation', 'medicareMedicaidInfo', subfield], update);
            }
        }/>
      </div>
    );
  }
}

export default InsuranceInformationPanel;
