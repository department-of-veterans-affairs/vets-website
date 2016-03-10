import React from 'react';

import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';

class MilitaryServicePanel extends React.Component {
  render() {
    return (
      <div>
        <h3>Military Service</h3>
        <ServiceInformationSection
          data={this.props.applicationData.militaryService.serviceInfo}
          onStateChange={
            (subfield, update) => {
              this.props.publishStateChange(['militaryService', 'serviceInfo', subfield], update);
            }
          }/>
        <AdditionalMilitaryInformationSection
          data={this.props.applicationData.militaryService.additionalInfo}
          onStateChange={
            (subfield, update) => {
              this.props.publishStateChange(['militaryService', 'additionalInfo', subfield], update);
            }
          }/>
      </div>
    );
  }
}

export default MilitaryServicePanel;
