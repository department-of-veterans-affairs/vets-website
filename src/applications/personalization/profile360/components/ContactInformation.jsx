import {
  SAVE_EMAIL_ADDRESS_FAIL,
  SAVE_EMAIL_ADDRESS,
  SAVE_FAX_NUMBER_FAIL,
  SAVE_FAX_NUMBER,
  SAVE_HOME_PHONE_FAIL,
  SAVE_HOME_PHONE,
  SAVE_MAILING_ADDRESS_FAIL,
  SAVE_MAILING_ADDRESS,
  SAVE_MOBILE_PHONE_FAIL,
  SAVE_MOBILE_PHONE,
  SAVE_TEMPORARY_PHONE_FAIL,
  SAVE_TEMPORARY_PHONE,
  SAVE_WORK_PHONE_FAIL,
  SAVE_WORK_PHONE,
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
        addressConstants,
        transactions
      },
      updateFormFieldActions,
      updateActions,
      getTransactionStatus
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
          title="Home Phone"
          phoneData={homePhone}
          transaction={transactions.homePhone}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'homePhone')}
          field={formFields.homePhone}
          error={errors.includes(SAVE_HOME_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.homePhone}
          isEditing={currentlyOpenModal === 'homePhone'}
          isLoading={pendingSaves.includes(SAVE_HOME_PHONE)}
          onEdit={recordedAction('edit-link', 'home-telephone', this.openModalHandler('homePhone'))}
          onAdd={recordedAction('add-link', 'home-telephone', this.openModalHandler('homePhone'))}
          onSubmit={recordedAction('update-button', 'home-telephone', updateActions.updateHomePhone)}
          onCancel={recordedAction('cancel-button', 'home-telephone', this.closeModal)}/>

        <PhoneSection
          title="Mobile Phone"
          phoneData={mobilePhone}
          transaction={transactions.mobilePhone}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'mobilePhone')}
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
          transaction={transactions.workPhone}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'workPhone')}
          field={formFields.workPhone}
          error={errors.includes(SAVE_WORK_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.workPhone}
          isEditing={currentlyOpenModal === 'workPhone'}
          isLoading={pendingSaves.includes(SAVE_WORK_PHONE)}
          onEdit={recordedAction('edit-link', 'work-telephone', this.openModalHandler('workPhone'))}
          onAdd={recordedAction('add-link', 'work-telephone', this.openModalHandler('workPhone'))}
          onSubmit={recordedAction('update-button', 'work-telephone', updateActions.updateWorkPhone)}
          onCancel={recordedAction('cancel-button', 'work-telephone', this.closeModal)}/>

        <PhoneSection
          title="Temporary Phone"
          phoneData={temporaryPhone}
          transaction={transactions.tempPhone}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'tempPhone')}
          field={formFields.temporaryTelephone}
          error={errors.includes(SAVE_TEMPORARY_PHONE_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.temporaryPhone}
          isEditing={currentlyOpenModal === 'tempPhone'}
          isLoading={pendingSaves.includes(SAVE_TEMPORARY_PHONE)}
          onEdit={recordedAction('edit-link', 'temporary-telephone', this.openModalHandler('tempPhone'))}
          onAdd={recordedAction('add-link', 'temporary-telephone', this.openModalHandler('tempPhone'))}
          onSubmit={recordedAction('update-button', 'temporary-telephone', updateActions.updateTemporaryPhone)}
          onCancel={recordedAction('cancel-button', 'temporary-telephone', this.closeModal)}/>

        <PhoneSection
          title="Fax Number"
          phoneData={faxNumber}
          transaction={transactions.faxNumber}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'faxNumber')}
          field={formFields.faxNumber}
          error={errors.includes(SAVE_FAX_NUMBER_FAIL)}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions.faxNumber}
          isEditing={currentlyOpenModal === 'faxNumber'}
          isLoading={pendingSaves.includes(SAVE_FAX_NUMBER)}
          onEdit={recordedAction('edit-link', 'fax-number', this.openModalHandler('faxNumber'))}
          onAdd={recordedAction('add-link', 'fax-number', this.openModalHandler('faxNumber'))}
          onSubmit={recordedAction('update-button', 'fax-number', updateActions.updateFaxNumber)}
          onCancel={recordedAction('cancel-button', 'fax-number', this.closeModal)}/>

        <EmailSection
          emailData={email}
          transaction={transactions.email}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, 'email')}
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
