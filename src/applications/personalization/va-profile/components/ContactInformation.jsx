import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';

import {
  SAVE_MAILING_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  SAVE_ALTERNATE_PHONE_FAIL,
  SAVE_PRIMARY_PHONE_FAIL,
  SAVE_MAILING_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS_FAIL
} from '../actions';

import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import accountManifest from '../../account/manifest.json';
import PhoneSection from './PhoneSection';
import AddressSection from './AddressSection';
import EmailSection from './EmailSection';
import LoadingSection from './LoadingSection';
import LoadFail from './LoadFail';

class ContactInformation extends React.Component {

  openModalHandler(modalName) {
    return () => this.props.modal.open(modalName);
  }

  closeModal = () => {
    this.props.modal.open(null);
  }

  renderContent = () => {
    const {
      modal: {
        currentlyOpen: currentlyOpenModal,
        pendingSaves,
        formFields,
        errors,
        clearErrors
      },
      profile: {
        contactInformation: {
          email,
          mailingAddress,
          primaryTelephone,
          alternateTelephone,
        },
        addressConstants
      },
      updateFormFieldActions,
      updateActions
    } = this.props;

    const contactInformationFailed = !email && !mailingAddress && !primaryTelephone && !alternateTelephone;
    if (contactInformationFailed) return <LoadFail information="contact"/>;

    return (
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
    );
  }

  render() {
    return (
      <div>
        <h2 className="va-profile-heading">Contact Information</h2>
        <AlertBox
          isVisible
          status="info"
          content={<p>We’ll use this information to communicate with you about your VA <strong>Compensation &amp; Pension benefits.</strong></p>}/>
        <LoadingSection
          isLoading={!this.props.profile.contactInformation}
          message="Loading contact information..."
          render={this.renderContent}/>
        <div>
          <h3>Want to update the email you use to sign in to Vets.gov?</h3>
          <a href={accountManifest.rootUrl}>Go to your account settings</a>
        </div>
      </div>
    );
  }
}

export default ContactInformation;
