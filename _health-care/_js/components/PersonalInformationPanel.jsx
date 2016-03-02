import React from 'react';

import AdditionalInformationSection from './personal-information/AdditionalInformationSection';
import DemographicInformationSection from './personal-information/DemographicInformationSection';
import NameAndGeneralInfoSection from './personal-information/NameAndGeneralInfoSection';
import VAInformationSection from './personal-information/VAInformationSection';
import VeteranAddressSection from './personal-information/VeteranAddressSection';

class PersonalInformationPanel extends React.Component {
  render() {
    return (
      <div>
        <NameAndGeneralInfoSection
            data={this.props.applicationData.personalInformation.nameAndGeneralInfo}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', subfield], update);
              }
            }/>
        <VAInformationSection
            data={this.props.applicationData.personalInformation.vaInformation}/>
        <AdditionalInformationSection
            data={this.props.applicationData.personalInformation.additionalInformation}/>
        <DemographicInformationSection
            data={this.props.applicationData.personalInformation.demographicInformation}/>
        <VeteranAddressSection
            data={this.props.applicationData.personalInformation.veteranAddress}/>
      </div>
    );
  }
}

export default PersonalInformationPanel;
