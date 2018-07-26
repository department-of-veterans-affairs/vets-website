import { every } from 'lodash';

import React from 'react';
import DowntimeNotification, { externalServices } from '../../../../platform/monitoring/DowntimeNotification';
import recordEvent from '../../../../platform/monitoring/record-event';
import accountManifest from '../../account/manifest.json';
import { TRANSACTION_CATEGORY_TYPES } from '../constants/vet360';
import Vet360PendingTransactionCategory from '../vet360/containers/PendingTransactionCategory';
import LoadFail from './LoadFail';
import { handleDowntimeForSection } from './DowntimeBanner';
import MissingVet360IDError from './MissingVet360IDError';
import ContactInformationExplanation from './ContactInformationExplanation';

import MailingAddress from '../vet360/components/MailingAddress';
import ResidentialAddress from '../vet360/components/ResidentialAddress';
import HomePhone from '../vet360/components/HomePhone';
import MobilePhone from '../vet360/components/MobilePhone';
import WorkPhone from '../vet360/components/WorkPhone';
import FaxNumber from '../vet360/components/FaxNumber';
import Email from '../vet360/components/Email';

export default class ContactInformation extends React.Component {

  renderContent = () => {
    if (every(Object.keys(this.props.user.profile.vet360), false)) {
      return <LoadFail information="contact"/>;
    }

    const {
      isVet360AvailableForUser,
    } =  this.props;

    if (!isVet360AvailableForUser) {
      return <MissingVet360IDError/>;
    }

    return (
      <div>
        <ContactInformationExplanation/>

        <Vet360PendingTransactionCategory categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}>
          <MailingAddress/>
          <ResidentialAddress/>
        </Vet360PendingTransactionCategory>

        <Vet360PendingTransactionCategory categoryType={TRANSACTION_CATEGORY_TYPES.PHONE}>
          <HomePhone/>
          <MobilePhone/>
          <WorkPhone/>
          <FaxNumber/>
        </Vet360PendingTransactionCategory>

        <Vet360PendingTransactionCategory categoryType={TRANSACTION_CATEGORY_TYPES.EMAIL}>
          <Email/>
        </Vet360PendingTransactionCategory>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h2 className="va-profile-heading">Contact Information</h2>
        <DowntimeNotification render={handleDowntimeForSection('contact')} dependencies={[externalServices.vet360]}>
          <div>
            {this.renderContent()}
            <div>
              <h3>How do I update the email I use to sign in to Vets.gov?</h3>
              <a href={accountManifest.rootUrl} onClick={() => { recordEvent({ event: 'profile-navigation', 'profile-action': 'view-link', 'profile-section': 'account-settings' }); }}>Go to your account settings</a>
            </div>
          </div>
        </DowntimeNotification>
      </div>
    );
  }
}
