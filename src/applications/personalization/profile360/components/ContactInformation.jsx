import React from 'react';

import DowntimeNotification, {
  externalServices,
} from '../../../../platform/monitoring/DowntimeNotification';
import recordEvent from '../../../../platform/monitoring/record-event';

import accountManifest from '../../account/manifest.json';

import { TRANSACTION_CATEGORY_TYPES } from '../vet360/constants';

import Vet360InitializeID from '../vet360/containers/InitializeID';
import Vet360PendingTransactionCategory from '../vet360/containers/PendingTransactionCategory';

import MailingAddress from '../vet360/components/MailingAddress';
import ResidentialAddress from '../vet360/components/ResidentialAddress';
import HomePhone from '../vet360/components/HomePhone';
import MobilePhone from '../vet360/components/MobilePhone';
import WorkPhone from '../vet360/components/WorkPhone';
import FaxNumber from '../vet360/components/FaxNumber';
import Email from '../vet360/components/Email';

import { handleDowntimeForSection } from './DowntimeBanner';
import ContactInformationExplanation from './ContactInformationExplanation';

import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const propertyName = isBrandConsolidationEnabled() ? 'VA.gov' : 'Vets.gov';

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
        <h2 className="va-profile-heading">Contact Information</h2>
        <DowntimeNotification
          render={handleDowntimeForSection('contact')}
          dependencies={[externalServices.vet360]}
        >
          <div>
            {this.renderContent()}
            <div>
              <h3>
                How do I update the email I use to sign in to {propertyName}?
              </h3>
              <a
                href={accountManifest.rootUrl}
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
