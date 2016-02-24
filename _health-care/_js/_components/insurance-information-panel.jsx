import React from 'react';

import InsuranceInformationSection from './insurance-information-section';
import MedicareMedicaidSection from './medicare-medicaid-section';

class InsuranceInformationPanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Insurance Information</h3>
        <InsuranceInformationSection />
        <MedicareMedicaidSection />
      </div>
    )
  }
}

export default InsuranceInformationPanel;
