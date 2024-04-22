import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { ProfileLink } from '../../../ProfileLink';
import { useSessionStorage } from '../../../../../common/hooks/useSessionStorage';
import HelpDeskContact from '../../../HelpDeskContact';

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
        deposit management. We expect the maintenance period will last for 5
        days.
      </p>
      <p>
        During this time, you won’t be able to manage your direct deposit
        information online. You’ll still be able to manage your information for
        disability compensation, pension, or education benefits by phone. Call
        us at <HelpDeskContact />. We’re here Monday through Friday, 8:00 a.m.
        to 9:00 p.m. ET.
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
