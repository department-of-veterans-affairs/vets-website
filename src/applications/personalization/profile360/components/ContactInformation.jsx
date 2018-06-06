import { every } from 'lodash';

import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import DowntimeNotification, { services } from '../../../../platform/monitoring/DowntimeNotification';
import recordEvent from '../../../../platform/monitoring/record-event';
import accountManifest from '../../account/manifest.json';
import { FIELD_NAMES } from '../constants/vet360';
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
          vet360
        },
      },
      modal: {
        currentlyOpen: currentlyOpenModal,
        formFields,
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
          addressData={vet360[FIELD_NAMES.MAILING_ADDRESS]}
          transaction={transactions[FIELD_NAMES.MAILING_ADDRESS]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.MAILING_ADDRESS)}
          field={formFields[FIELD_NAMES.MAILING_ADDRESS]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.MAILING_ADDRESS]}
          isEditing={currentlyOpenModal === FIELD_NAMES.MAILING_ADDRESS}
          onEdit={recordedAction('edit-link', 'mailing-address', this.openModalHandler(FIELD_NAMES.MAILING_ADDRESS))}
          onAdd={recordedAction('add-link', 'mailing-address', this.openModalHandler(FIELD_NAMES.MAILING_ADDRESS))}
          onSubmit={recordedAction('update-button', 'mailing-address', updateActions.updateMailingAddress)}
          onCancel={recordedAction('cancel-button', 'mailing-address', this.closeModal)}
          addressConstants={addressConstants}/>

        <AddressSection
          title="Residential Address"
          addressData={vet360[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
          transaction={transactions[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.RESIDENTIAL_ADDRESS)}
          field={formFields[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
          isEditing={currentlyOpenModal === FIELD_NAMES.RESIDENTIAL_ADDRESS}
          onEdit={recordedAction('edit-link', 'residential-address', this.openModalHandler(FIELD_NAMES.RESIDENTIAL_ADDRESS))}
          onAdd={recordedAction('add-link', 'residential-address', this.openModalHandler(FIELD_NAMES.RESIDENTIAL_ADDRESS))}
          onSubmit={recordedAction('update-button', 'residential-address', updateActions.updateResidentialAddress)}
          onCancel={recordedAction('cancel-button', 'residential-address', this.closeModal)}
          addressConstants={addressConstants}/>

        <PhoneSection
          title="Home Phone"
          phoneData={vet360[FIELD_NAMES.HOME_PHONE]}
          transaction={transactions[FIELD_NAMES.HOME_PHONE]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.HOME_PHONE)}
          field={formFields[FIELD_NAMES.HOME_PHONE]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.HOME_PHONE]}
          isEditing={currentlyOpenModal === FIELD_NAMES.HOME_PHONE}
          onEdit={recordedAction('edit-link', 'home-telephone', this.openModalHandler(FIELD_NAMES.HOME_PHONE))}
          onAdd={recordedAction('add-link', 'home-telephone', this.openModalHandler(FIELD_NAMES.HOME_PHONE))}
          onSubmit={recordedAction('update-button', 'home-telephone', updateActions.updateHomePhone)}
          onCancel={recordedAction('cancel-button', 'home-telephone', this.closeModal)}/>

        <PhoneSection
          title="Mobile Phone"
          phoneData={vet360[FIELD_NAMES.MOBILE_PHONE]}
          transaction={transactions[FIELD_NAMES.MOBILE_PHONE]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.MOBILE_PHONE)}
          field={formFields[FIELD_NAMES.MOBILE_PHONE]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.MOBILE_PHONE]}
          isEditing={currentlyOpenModal === FIELD_NAMES.MOBILE_PHONE}
          onEdit={recordedAction('edit-link', 'mobile-telephone', this.openModalHandler(FIELD_NAMES.MOBILE_PHONE))}
          onAdd={recordedAction('add-link', 'mobile-telephone', this.openModalHandler(FIELD_NAMES.MOBILE_PHONE))}
          onSubmit={recordedAction('update-button', 'mobile-telephone', updateActions.updateMobilePhone)}
          onCancel={recordedAction('cancel-button', 'mobile-telephone', this.closeModal)}/>

        <PhoneSection
          title="Work Phone"
          phoneData={vet360[FIELD_NAMES.WORK_PHONE]}
          transaction={transactions[FIELD_NAMES.WORK_PHONE]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.WORK_PHONE)}
          field={formFields[FIELD_NAMES.WORK_PHONE]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.WORK_PHONE]}
          isEditing={currentlyOpenModal === FIELD_NAMES.WORK_PHONE}
          onEdit={recordedAction('edit-link', 'work-telephone', this.openModalHandler(FIELD_NAMES.WORK_PHONE))}
          onAdd={recordedAction('add-link', 'work-telephone', this.openModalHandler(FIELD_NAMES.WORK_PHONE))}
          onSubmit={recordedAction('update-button', 'work-telephone', updateActions.updateWorkPhone)}
          onCancel={recordedAction('cancel-button', 'work-telephone', this.closeModal)}/>

        <PhoneSection
          title="Fax Number"
          phoneData={vet360[FIELD_NAMES.FAX_NUMBER]}
          transaction={transactions[FIELD_NAMES.FAX_NUMBER]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.FAX_NUMBER)}
          field={formFields[FIELD_NAMES.FAX_NUMBER]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.FAX_NUMBER]}
          isEditing={currentlyOpenModal === FIELD_NAMES.FAX_NUMBER}
          onEdit={recordedAction('edit-link', 'fax-number', this.openModalHandler(FIELD_NAMES.FAX_NUMBER))}
          onAdd={recordedAction('add-link', 'fax-number', this.openModalHandler(FIELD_NAMES.FAX_NUMBER))}
          onSubmit={recordedAction('update-button', 'fax-number', updateActions.updateFaxNumber)}
          onCancel={recordedAction('cancel-button', 'fax-number', this.closeModal)}/>

        <EmailSection
          emailData={vet360[FIELD_NAMES.EMAIL]}
          transaction={transactions[FIELD_NAMES.EMAIL]}
          getTransactionStatus={(transaction) => getTransactionStatus(transaction, FIELD_NAMES.EMAIL)}
          field={formFields[FIELD_NAMES.EMAIL]}
          clearErrors={clearErrors}
          onChange={updateFormFieldActions[FIELD_NAMES.EMAIL]}
          isEditing={currentlyOpenModal === FIELD_NAMES.EMAIL}
          onEdit={recordedAction('edit-link', 'email', this.openModalHandler(FIELD_NAMES.EMAIL))}
          onAdd={recordedAction('add-link', 'email', this.openModalHandler(FIELD_NAMES.EMAIL))}
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
