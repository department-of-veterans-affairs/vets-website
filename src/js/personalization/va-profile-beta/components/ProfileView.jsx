import React from 'react';
import {
  SAVE_MAILING_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,

  SAVE_ALTERNATE_PHONE_FAIL,
  SAVE_PRIMARY_PHONE_FAIL,
  SAVE_MAILING_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS_FAIL,

  FETCH_VA_PROFILE_FAIL
} from '../actions';

import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/jean-pants/LoadingIndicator';
import Hero from './Hero';
import PhoneSection from './PhoneSection';
import AddressSection from './AddressSection';
import EmailSection from './EmailSection';
import AccountMessage from './AccountMessage';
import PersonalInformation from './PersonalInformation';
import MilitaryInformation from './MilitaryInformation';
import LoadFail from './LoadFail';

class ProfileView extends React.Component {

  componentWillMount() {
    this.props.startup();
  }

  componentWillUpdate(oldProps) {
    if (this.props.profile !== oldProps.profile && this.props.profile.userFullName) {
      const { first, last } = this.props.profile.userFullName;
      document.title = `Profile: ${first} ${last}`;
    }
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
        formFields,
        errors,
        clearErrors
      },
      profile: {
        email,
        userFullName,
        profilePicture,
        mailingAddress,
        primaryTelephone,
        alternateTelephone,
        personalInformation,
        serviceHistory,
        addressConstants
      },
      updateFormFieldActions,
      updateActions
    } = this.props;

    const contactInformationFailed = !email && !mailingAddress && !primaryTelephone && !alternateTelephone;
    const personalInformationFailed = !personalInformation;
    const militaryInformationFailed = !serviceHistory;

    return (
      <div className="va-profile-wrapper row" style={{ marginBottom: 35 }}>
        <div className="usa-width-two-thirds medium-8 small-12 columns">

          <Hero userFullName={userFullName} serviceHistoryResponseData={serviceHistory} profilePicture={profilePicture}/>

          <h2 className="va-profile-heading">Contact Information</h2>
          <AlertBox
            isVisible
            status="info"
            content={<p>We’ll use this information to communicate with you about your VA <strong>Compensation &amp; Pension benefits.</strong></p>}/>
          {contactInformationFailed ? <LoadFail information="contact"/> : (
            <div>
              <AddressSection
                title="Mailing Address"
                addressResponseData={mailingAddress}
                field={formFields.mailingAddress}
                error={errors.includes(SAVE_MAILING_ADDRESS_FAIL)}
                clearErrors={clearErrors}
                onChange={updateFormFieldActions.mailingAddress}
                isEditing={currentlyOpenModal === 'mailingAddress'}
                isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
                onEdit={this.openModalHandler('mailingAddress')}
                onSubmit={updateActions.updateMailingAddress}
                onCancel={this.closeModal}
                addressConstants={addressConstants}/>

              <PhoneSection
                title="Primary Phone"
                phoneResponseData={primaryTelephone}
                field={formFields.primaryTelephone}
                error={errors.includes(SAVE_PRIMARY_PHONE_FAIL)}
                clearErrors={clearErrors}
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
                error={errors.includes(SAVE_ALTERNATE_PHONE_FAIL)}
                clearErrors={clearErrors}
                onChange={updateFormFieldActions.alternateTelephone}
                isEditing={currentlyOpenModal === 'altPhone'}
                isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
                onEdit={this.openModalHandler('altPhone')}
                onSubmit={updateActions.updateAlternatePhone}
                onCancel={this.closeModal}/>

              <EmailSection
                emailResponseData={email}
                field={formFields.email}
                error={errors.includes(SAVE_EMAIL_ADDRESS_FAIL)}
                clearErrors={clearErrors}
                onChange={updateFormFieldActions.email}
                isEditing={currentlyOpenModal === 'email'}
                isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
                onEdit={this.openModalHandler('email')}
                onSubmit={updateActions.updateEmailAddress}
                onCancel={this.closeModal}/>
            </div>
          )}

          <AccountMessage/>

          <h2 className="va-profile-heading">Personal Information</h2>
          <p>If you need to make any updates or corrections, call the Vets.gov Help Desk at  <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>). We're here Monday-Friday, 8 a.m. - 8 p.m. (ET).</p>
          {personalInformationFailed ? <LoadFail information="personal"/> : (
            <PersonalInformation personalInformation={personalInformation}/>
          )}

          <h2 className="va-profile-heading">Military Service</h2>
          <p>If you need to make any updates or corrections, call the Vets.gov Help Desk at  <a href="tel:+18555747286">1-855-574-7286</a> (TTY: <a href="tel:+18008778339">1-800-877-8339</a>). We're here Monday-Friday, 8 a.m. - 8 p.m. (ET).</p>
          {militaryInformationFailed ? <LoadFail information="military"/> : (
            <MilitaryInformation serviceHistoryResponseData={serviceHistory}/>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileView;
