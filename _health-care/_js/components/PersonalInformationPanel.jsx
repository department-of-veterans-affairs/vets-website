import React from 'react';

import AdditionalInformationSection from './personal-information/AdditionalInformationSection';
import DemographicInformationSection from './personal-information/DemographicInformationSection';
import NameAndGeneralInfoSection from './personal-information/NameAndGeneralInfoSection';
import VaInformationSection from './personal-information/VaInformationSection';
import VeteranAddressSection from './personal-information/VeteranAddressSection';

class PersonalInformationPanel extends React.Component {
  render() {
    return (
      <div>
        <NameAndGeneralInfoSection
            data={this.props.applicationData.personalInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', subfield], update);
              }
            }/>
        <VaInformationSection/>
        <AdditionalInformationSection/>
        <DemographicInformationSection/>
        <VeteranAddressSection/>
      </div>
    );
  }
}

export default PersonalInformationPanel;
