import React, { useCallback } from 'react';
import { getCernerURL } from 'platform/utilities/cerner';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { OhTransitionAlertContent } from '../../util/constants';
import useFeatureToggles from '../../hooks/useFeatureToggles';
import { submitLaunchMyVaHealthAal } from '../../api/SmApi';

/**
 * Blue expandable info alert for users at OH facilities that have transitioned
 * to the integrated MHV experience. Displays messaging that they can now manage
 * their health care on VA.gov instead of My VA Health portal.
 */
const OhTransitionAlert = () => {
  const { isAalEnabled } = useFeatureToggles();

  const handleUrlClick = useCallback(
    () => {
      if (isAalEnabled) {
        submitLaunchMyVaHealthAal();
      }
    },
    [isAalEnabled],
  );

  return (
    <va-alert-expandable
      class="vads-u-margin-bottom--3 vads-u-margin-top--2"
      data-testid="oh-transition-alert"
      status="info"
      trigger={OhTransitionAlertContent.TRIGGER}
    >
      <div data-testid="oh-transition-alert-content">
        <p>{OhTransitionAlertContent.BODY}</p>
        <p>{OhTransitionAlertContent.QUESTION}</p>
        <VaLinkAction
          data-testid="oh-transition-alert-link"
          href={getCernerURL('/pages/messaging/inbox', true)}
          type="secondary"
          onClick={handleUrlClick}
          text={OhTransitionAlertContent.LINK_TEXT}
        />
      </div>
    </va-alert-expandable>
  );
};

export default OhTransitionAlert;
