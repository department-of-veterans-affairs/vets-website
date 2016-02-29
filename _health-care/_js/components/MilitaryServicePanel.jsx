import React from 'react';

import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';

class MilitaryServicePanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Military Service</h3>
        <ServiceInformationSection/>
        <AdditionalMilitaryInformationSection/>
      </div>
    );
  }
}

export default MilitaryServicePanel;
