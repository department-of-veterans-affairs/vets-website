import React from 'react';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import recordEvent from 'platform/monitoring/record-event';

import { TRANSACTION_CATEGORY_TYPES } from '@@vap-svc/constants';

import Vet360InitializeID from '@@vap-svc/containers/InitializeVet360ID';
import Vet360PendingTransactionCategory from '@@vap-svc/containers/Vet360PendingTransactionCategory';

import MailingAddress from '@@vap-svc/components/MailingAddress';
import ResidentialAddress from '@@vap-svc/components/ResidentialAddress';
import HomePhone from '@@vap-svc/components/HomePhone';
import MobilePhone from '@@vap-svc/components/MobilePhone';
import WorkPhone from '@@vap-svc/components/WorkPhone';
import FaxNumber from '@@vap-svc/components/FaxNumber';
import Email from '@@vap-svc/components/Email';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import ContactInformationExplanation from './ContactInformationExplanation';

export default class ContactInformation extends React.Component {
  renderContent = () => (
    <Vet360InitializeID>
      <ContactInformationExplanation />

      <Vet360PendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.ADDRESS}
      >
        <MailingAddress />
        <ResidentialAddress />
      </Vet360PendingTransactionCategory>

      <Vet360PendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.PHONE}
      >
        <HomePhone />
        <MobilePhone />
        <WorkPhone />
        <FaxNumber />
      </Vet360PendingTransactionCategory>

      <Vet360PendingTransactionCategory
        categoryType={TRANSACTION_CATEGORY_TYPES.EMAIL}
      >
        <Email />
      </Vet360PendingTransactionCategory>
    </Vet360InitializeID>
  );

  render() {
    return (
      <div>
        <h2 className="va-profile-heading" tabIndex="-1">
          Contact information
        </h2>
        <DowntimeNotification
          render={handleDowntimeForSection('contact')}
          dependencies={[externalServices.vet360]}
        >
          <div>
            {this.renderContent()}
            <div>
              <h3>How do I update the email I use to sign in to VA.gov?</h3>
              <a
                href="/profile/account-security"
                onClick={() => {
                  recordEvent({
                    event: 'profile-navigation',
                    'profile-action': 'view-link',
                    'profile-section': 'account-settings',
                  });
                }}
              >
                Go to your account settings
              </a>
            </div>
          </div>
        </DowntimeNotification>
      </div>
    );
  }
}
