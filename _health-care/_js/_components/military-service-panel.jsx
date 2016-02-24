import React from 'react';

import AdditionalMilitaryInformationSection from './additional-military-information-section';
import ServiceInformationSection from './service-information-section';

class MilitaryServicePanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Military Service</h3>
        <ServiceInformationSection/>
        <AdditionalMilitaryInformationSection/>
      </div>
    )
  }
}

export default MilitaryServicePanel;
