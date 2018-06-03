import {
  SAVE_MAILING_ADDRESS,
  SAVE_PRIMARY_PHONE,
  SAVE_ALTERNATE_PHONE,
  SAVE_EMAIL_ADDRESS,
  SAVE_ALTERNATE_PHONE_FAIL,
  SAVE_PRIMARY_PHONE_FAIL,
  SAVE_MAILING_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS_FAIL,
  SAVE_MOBILE_PHONE,
  SAVE_MOBILE_PHONE_FAIL,
} from '../actions';

import { every } from 'lodash';

import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
import recordEvent from '../../../../platform/monitoring/record-event';
import accountManifest from '../../account/manifest.json';
import PhoneSection from './PhoneSection';
import AddressSection from './AddressSection';
import EmailSection from './EmailSection';
import LoadFail from './LoadFail';
import { handleDowntimeForSection } from './DowntimeBanner';

function recordedAction(actionName, sectionName, callback) {
  return (...args) => {
    if (sectionName && actionName) {
      recordEvent({
        event: 'profile-navigation',
        'profile-action': actionName,
        'profile-section': sectionName,
      });
    }
    callback(...args);
  };
}

class ContactInformationContent extends React.Component {

  componentDidMount() {
    this.props.fetchAddressConstants();
  }

  openModalHandler(modalName) {
    return () => this.props.modal.open(modalName);
  }

  closeModal = () => {
    this.props.modal.open(null);
  }

  renderContent = () => {
    const {
      user: {
        profile: {
          vet360: {
            email,
            homePhone,
            mailingAddress,
            mobilePhone,
            faxNumber,
            residentialAddress,
            temporaryPhone,
            workPhone,
          }
        },
      },
      modal: {
        currentlyOpen: currentlyOpenModal,
        pendingSaves,
        formFields,
        errors,
        clearErrors
      },
      profile: {
        addressConstants
      },
      updateFormFieldActions,
      updateActions
    } = this.props;

    if (every(Object.keys(this.props.user.profile.vet360), false)) {
      return <LoadFail information="contact"/>;
    }

    return (
      <div>
        <AddressSection
          title="Mailing Address"
          addressData={mailingAddress}
          field={formFields.mailingAddress}
          error={errors.includes(SAVE_MAILING_ADDRESS_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.mailingAddress}
          isEditing={currentlyOpenModal === 'mailingAddress'}
          isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
          onEdit={recordedAction('edit-link', 'mailing-address', this.openModalHandler('mailingAddress'))}
          onAdd={recordedAction('add-link', 'mailing-address', this.openModalHandler('mailingAddress'))}
          onSubmit={recordedAction('update-button', 'mailing-address', updateActions.updateMailingAddress)}
          onCancel={recordedAction('cancel-button', 'mailing-address', this.closeModal)}
          addressConstants={addressConstants}/>

        <AddressSection
          title="Residential Address"
          addressData={residentialAddress}
          field={formFields.residentialAddress}
          error={errors.includes(SAVE_MAILING_ADDRESS_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.residentialAddress}
          isEditing={currentlyOpenModal === 'residentialAddress'}
          isLoading={pendingSaves.includes(SAVE_MAILING_ADDRESS)}
          onEdit={recordedAction('edit-link', 'residential-address', this.openModalHandler('residentialAddress'))}
          onAdd={recordedAction('add-link', 'residential-address', this.openModalHandler('residentialAddress'))}
          onSubmit={recordedAction('update-button', 'residential-address', updateActions.updateMailingAddress)}
          onCancel={recordedAction('cancel-button', 'residential-address', this.closeModal)}
          addressConstants={addressConstants}/>

        <PhoneSection
          title="Primary Phone"
          phoneData={homePhone}
          field={formFields.primaryTelephone}
          error={errors.includes(SAVE_PRIMARY_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.primaryTelephone}
          isEditing={currentlyOpenModal === 'primaryPhone'}
          isLoading={pendingSaves.includes(SAVE_PRIMARY_PHONE)}
          onEdit={recordedAction('edit-link', 'primary-telephone', this.openModalHandler('primaryPhone'))}
          onAdd={recordedAction('add-link', 'primary-telephone', this.openModalHandler('primaryPhone'))}
          onSubmit={recordedAction('update-button', 'primary-telephone', updateActions.updatePrimaryPhone)}
          onCancel={recordedAction('cancel-button', 'primary-telephone', this.closeModal)}/>

        <PhoneSection
          title="Mobile Phone"
          phoneData={mobilePhone}
          field={formFields.mobilePhone}
          error={errors.includes(SAVE_MOBILE_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.mobilePhone}
          isEditing={currentlyOpenModal === 'mobilePhone'}
          isLoading={pendingSaves.includes(SAVE_MOBILE_PHONE)}
          onEdit={recordedAction('edit-link', 'mobile-telephone', this.openModalHandler('mobilePhone'))}
          onAdd={recordedAction('add-link', 'mobile-telephone', this.openModalHandler('mobilePhone'))}
          onSubmit={recordedAction('update-button', 'mobile-telephone', updateActions.updateMobilePhone)}
          onCancel={recordedAction('cancel-button', 'mobile-telephone', this.closeModal)}/>

        <PhoneSection
          title="Work Phone"
          phoneData={workPhone}
          field={formFields.alternateTelephone}
          error={errors.includes(SAVE_ALTERNATE_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.alternateTelephone}
          isEditing={currentlyOpenModal === 'altPhone'}
          isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
          onEdit={recordedAction('edit-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onAdd={recordedAction('add-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onSubmit={recordedAction('update-button', 'alternative-telephone', updateActions.updateAlternatePhone)}
          onCancel={recordedAction('cancel-button', 'alternative-telephone', this.closeModal)}/>

        <PhoneSection
          title="Temporary Phone"
          phoneData={temporaryPhone}
          field={formFields.alternateTelephone}
          error={errors.includes(SAVE_ALTERNATE_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.alternateTelephone}
          isEditing={currentlyOpenModal === 'altPhone'}
          isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
          onEdit={recordedAction('edit-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onAdd={recordedAction('add-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onSubmit={recordedAction('update-button', 'alternative-telephone', updateActions.updateAlternatePhone)}
          onCancel={recordedAction('cancel-button', 'alternative-telephone', this.closeModal)}/>

        <PhoneSection
          title="Fax Number"
          phoneData={faxNumber}
          field={formFields.alternateTelephone}
          error={errors.includes(SAVE_ALTERNATE_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.alternateTelephone}
          isEditing={currentlyOpenModal === 'altPhone'}
          isLoading={pendingSaves.includes(SAVE_ALTERNATE_PHONE)}
          onEdit={recordedAction('edit-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onAdd={recordedAction('add-link', 'alternative-telephone', this.openModalHandler('altPhone'))}
          onSubmit={recordedAction('update-button', 'alternative-telephone', updateActions.updateAlternatePhone)}
          onCancel={recordedAction('cancel-button', 'alternative-telephone', this.closeModal)}/>

        <EmailSection
          emailResponseData={email}
          field={formFields.email}
          error={errors.includes(SAVE_EMAIL_ADDRESS_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.email}
          isEditing={currentlyOpenModal === 'email'}
          isLoading={pendingSaves.includes(SAVE_EMAIL_ADDRESS)}
          onEdit={recordedAction('edit-link', 'email', this.openModalHandler('email'))}
          onAdd={recordedAction('add-link', 'email', this.openModalHandler('email'))}
          onSubmit={recordedAction('update-button', 'email', updateActions.updateEmailAddress)}
          onCancel={recordedAction('cancel-button', 'email', this.closeModal)}/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <AlertBox
          isVisible
          status="info"
          content={<p>We’ll use this information to communicate with you about your VA <strong>Compensation &amp; Pension benefits.</strong></p>}/>
        {this.renderContent()}
        <div>
          <h3>Want to update the email you use to sign in to Vets.gov?</h3>
          <a href={accountManifest.rootUrl} onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'profile-section': 'account-settings' }); }}>Go to your account settings</a>
        </div>
      </div>
    );
  }
}

export default function ContactInformation(props) {
  return (
    <div>
      <h2 className="va-profile-heading">Contact Information</h2>
      <DowntimeNotification render={handleDowntimeForSection('contact')} dependencies={[services.evss, services.mvi]}>
        <ContactInformationContent {...props}/>
      </DowntimeNotification>
    </div>
  );
}
