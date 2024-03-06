import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { useSelector } from 'react-redux';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { ProfileLink } from '../../ProfileLink';
import {
  cnpDirectDepositIsEligible,
  eduDirectDepositIsSetUp,
} from '../../../selectors';
import { useSessionStorage } from '../../../../common/hooks/useSessionStorage';

export const EduMigrationAlert = ({ className }) => {
  const directDepositPath = '/profile/direct-deposit';

  const path = useLocation().pathname;
  const includeExtraLinkAndDismiss = path !== directDepositPath;

  const hasBothDirectDeposits = useSelector(
    state =>
      eduDirectDepositIsSetUp(state) && cnpDirectDepositIsEligible(state),
  );

  const [dismissed, setDismissed] = useSessionStorage(
    'dismissedDirectDepositSingleFormAlert',
  );

  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isAlertToggleEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowDirectDepositSingleFormAlert,
  );

  const isDowntimeAlertToggleEnabled = useToggleValue(
    TOGGLE_NAMES.profileShowDirectDepositSingleFormEduDowntime,
  );

  if (
    !isAlertToggleEnabled ||
    !hasBothDirectDeposits ||
    (dismissed && includeExtraLinkAndDismiss) ||
    isDowntimeAlertToggleEnabled
  ) {
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
      <h2 slot="headline">
        By April 20, 2024, you must have a single bank account for all VA
        benefit payments
      </h2>
      <p>Check your direct deposit information for each benefit.</p>
      <p className={!includeExtraLinkAndDismiss && 'vads-u-margin-bottom--0'}>
        If your bank accounts don’t match, update the information so it’s the
        same for all benefits.
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
