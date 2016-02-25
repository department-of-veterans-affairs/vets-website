import React from 'react';

import AdditionalInformationSection from './additional-information-section';
import DemographicInformationSection from './demographic-information-section';
import NameAndGeneralInfoSection from './name-and-general-info-section';
import VaInformationSection from './va-information-section';
import VeteranAddressSection from './veteran-address-section';

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
