import React from 'react';
import {
  SAVE_MAILING_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  FETCH_VA_PROFILE_FAIL
} from '../actions';

import AlertBox from '../../../common/components/AlertBox';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import Hero from '../components/Hero';
import PhoneSection from '../components/PhoneSection';
import AddressSection from '../components/AddressSection';
import EmailSection from '../components/EmailSection';
import PersonalInformation from '../components/PersonalInformation';


class ProfileView extends React.Component {

  componentWillMount() {
    this.props.fetchVaProfile();
  }

  openModalHandler(modalName) {
    return () => this.props.modal.open(modalName);
  }

  closeModal = () => {
    this.openModalHandler(null)();
  }

  render() {
    if (this.props.profile.loading) {
      return <LoadingIndicator message="Loading complete profile..."/>;
    }

    if (this.props.profile.errors.includes(FETCH_VA_PROFILE_FAIL)) {
      return (
        <AlertBox status="error" isVisible
          content={<h4 className="usa-alert-heading">Failed to load extended profile</h4>}/>
      );
    }

    const {
      currentlyOpen: currentlyOpenModal,
      pendingSaves
    } = this.props.modal;

    const {
      email,
      userFullName,
      profilePicture,
      mailingAddress,
      primaryTelephone,
      alternateTelephone,
      ssn,
      dob,
      gender,
      toursOfDuty
    } = this.props.profile;

    return (
      <div className="row">
        <h1>Your Profile</h1>
        <Hero userFullName={userFullName} tour={toursOfDuty[0]} profilePicture={profilePicture}/>
        <div className="usa-width-two-thirds medium-8 small-12 columns">

          <h2 style={{ marginBottom: 0 }}>Contact Information</h2>

          <AddressSection
            title="Mailing Address"
            addressResponseData={mailingAddress}
            isEditing={currentlyOpenModal === 'mailingAddress'}
            isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
            onEdit={this.openModalHandler('mailingAddress')}
            onSubmit={this.props.updateActions.updateMailingAddress}
            onCancel={this.closeModal}/>

          <PhoneSection
            title="Primary Phone"
            phoneResponseData={primaryTelephone}
            isEditing={currentlyOpenModal === 'primaryPhone'}
            isLoading={pendingSaves.includes(SAVE_PRIMARY_PHONE)}
            onEdit={this.openModalHandler('primaryPhone')}
            onSubmit={this.props.updateActions.updatePrimaryPhone}
            onCancel={this.closeModal}/>

          <PhoneSection
            title="Alternate Phone"
            phoneResponseData={alternateTelephone}
            isEditing={currentlyOpenModal === 'altPhone'}
            isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
            onEdit={this.openModalHandler('altPhone')}
            onSubmit={this.props.updateActions.updateAlternatePhone}
            onCancel={this.closeModal}/>

          <EmailSection
            title="Email Address"
            emailResponseData={email}
            isEditing={currentlyOpenModal === 'email'}
            isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
            onEdit={this.openModalHandler('email')}
            onSubmit={this.props.updateActions.updateEmailAddress}
            onCancel={this.closeModal}/>

          <h2>Personal Information</h2>
          <PersonalInformation gender={gender} dob={dob} ssn={ssn} toursOfDuty={toursOfDuty}/>
        </div>
      </div>
    );
  }
}

export default ProfileView;
