import React from 'react';
import {
  SAVE_MAILING_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  FETCH_VA_PROFILE_FAIL
} from '../actions';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
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
    this.props.modal.open(null);
  }

  render() {
    if (this.props.profile.loading) {
      return <LoadingIndicator message="Loading complete profile..."/>;
    }

    if (this.props.profile.errors.includes(FETCH_VA_PROFILE_FAIL)) {
      return (
        <div className="row">
          <AlertBox status="error" isVisible
            content={<h4 className="usa-alert-heading">Failed to load VA Profile</h4>}/>
        </div>
      );
    }

    const {
      modal: {
        currentlyOpen: currentlyOpenModal,
        pendingSaves,
        formFields
      },
      profile: {
        email,
        userFullName,
        profilePicture,
        mailingAddress,
        primaryTelephone,
        alternateTelephone,
        ssn,
        dob,
        gender,
        serviceHistory
      },
      updateFormFieldActions,
      updateActions
    } = this.props;

    return (
      <div className="row" style={{ marginBottom: 35 }}>
        <h1>Your Profile</h1>
        <Hero userFullName={userFullName} serviceHistoryResponseData={serviceHistory} profilePicture={profilePicture}/>
        <div className="usa-width-two-thirds medium-8 small-12 columns">

          <h2 style={{ marginBottom: 0 }}>Contact Information</h2>

          <AddressSection
            title="Mailing Address"
            addressResponseData={mailingAddress}
            field={formFields.mailingAddress}
            onChange={updateFormFieldActions.mailingAddress}
            isEditing={currentlyOpenModal === 'mailingAddress'}
            isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
            onEdit={this.openModalHandler('mailingAddress')}
            onSubmit={updateActions.updateMailingAddress}
            onCancel={this.closeModal}/>

          <PhoneSection
            title="Primary Phone"
            phoneResponseData={primaryTelephone}
            field={formFields.primaryTelephone}
            onChange={updateFormFieldActions.primaryTelephone}
            isEditing={currentlyOpenModal === 'primaryPhone'}
            isLoading={pendingSaves.includes(SAVE_PRIMARY_PHONE)}
            onEdit={this.openModalHandler('primaryPhone')}
            onSubmit={updateActions.updatePrimaryPhone}
            onCancel={this.closeModal}/>

          <PhoneSection
            title="Alternate Phone"
            phoneResponseData={alternateTelephone}
            field={formFields.alternateTelephone}
            onChange={updateFormFieldActions.alternateTelephone}
            isEditing={currentlyOpenModal === 'altPhone'}
            isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
            onEdit={this.openModalHandler('altPhone')}
            onSubmit={updateActions.updateAlternatePhone}
            onCancel={this.closeModal}/>

          <EmailSection
            title="Email Address"
            emailResponseData={email}
            field={formFields.email}
            onChange={updateFormFieldActions.email}
            isEditing={currentlyOpenModal === 'email'}
            isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
            onEdit={this.openModalHandler('email')}
            onSubmit={updateActions.updateEmailAddress}
            onCancel={this.closeModal}/>

          <h2>Personal Information</h2>
          <PersonalInformation gender={gender} dob={dob} ssn={ssn} serviceHistoryResponseData={serviceHistory}/>
        </div>
      </div>
    );
  }
}

export default ProfileView;
