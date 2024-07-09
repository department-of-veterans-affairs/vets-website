import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import HelpdeskContact from 'platform/user/authentication/components/HelpdeskContact';
import { ProfileLink } from '../../../ProfileLink';
import { useSessionStorage } from '../../../../../common/hooks/useSessionStorage';

export const EduMigrationAlert = ({ className }) => {
  const directDepositPath = '/profile/direct-deposit';

  const path = useLocation().pathname;
  const includeExtraLinkAndDismiss = path !== directDepositPath;

  const [dismissed, setDismissed] = useSessionStorage(
    'dismissedDirectDepositSingleFormAlert',
  );

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isAlertToggleEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowDirectDepositSingleFormAlert,
  );

  if (!isAlertToggleEnabled || (dismissed && includeExtraLinkAndDismiss)) {
    return null;
  }

  const hideAlert = () => {
    setDismissed('true');
  };

  return (
    <VaAlert
      status="warning"
      class={className}
      uswds
      closeable={includeExtraLinkAndDismiss}
      onCloseEvent={hideAlert}
    >
      <h2 slot="headline">Upcoming site maintenance for direct deposit</h2>
      <p>
        We’ll soon be doing some work to update our systems for online direct
        deposit management. We expect the maintenance period will last for 14
        days.
      </p>
      <p>
        During this time, you won’t be able to manage your direct deposit
        information online. You’ll still be able to manage your information by
        phone.
      </p>

      <p>
        <strong>For disability compensation and pension benefits,</strong> call
        us at <HelpdeskContact />. We’re here Monday through Friday, 8:00 a.m.
        to 9:00 p.m. ET.
      </p>
      <p className="vads-u-margin-top--0">
        <strong>For Post 9/11-GI Bill benefits,</strong> call us at{' '}
        <va-telephone contact={CONTACTS.GI_BILL} /> (
        <va-telephone contact={CONTACTS['711']} tty />
        ). We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
      </p>

      <p className="vads-u-margin-bottom--0">
        <strong>Start:</strong> Wednesday, June 26, 2024, at 5:00 p.m. ET
      </p>
      <p className="vads-u-margin-top--0">
        <strong>End:</strong> Wednesday, July 10, 2024, at 5:00 p.m. ET
      </p>

      {includeExtraLinkAndDismiss && (
        <ProfileLink
          href={directDepositPath}
          text="Check your direct deposit information"
        />
      )}
    </VaAlert>
  );
};

EduMigrationAlert.propTypes = {
  className: PropTypes.string,
};
