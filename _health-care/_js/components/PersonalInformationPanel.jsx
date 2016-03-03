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
                this.props.publishStateChange(['personalInformation', 'nameAndGeneralInfo', subfield], update);
              }
            }/>
        <VAInformationSection
            data={this.props.applicationData.personalInformation.vaInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', 'vaInformation', subfield], update);
              }
            }/>
        <AdditionalInformationSection
            data={this.props.applicationData.personalInformation.additionalInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', 'additionalInformation', subfield], update);
              }
            }/>
        <DemographicInformationSection
            data={this.props.applicationData.personalInformation.demographicInformation}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', 'demographicInformation', subfield], update);
              }
            }/>
        <VeteranAddressSection
            data={this.props.applicationData.personalInformation.veteranAddress}
            onStateChange={
              (subfield, update) => {
                this.props.publishStateChange(['personalInformation', 'veteranAddress', subfield], update);
              }
            }/>
      </div>
    );
  }
}

export default PersonalInformationPanel;
