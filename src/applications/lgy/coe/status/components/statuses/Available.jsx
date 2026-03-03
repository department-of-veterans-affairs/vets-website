import React from 'react';
import PropTypes from 'prop-types';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles/useFeatureToggle';
import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import DocumentList from '../DocumentList';
import { MoreQuestions } from '../MoreQuestions';
import { AvailableAlert } from '../StatusAlerts/AvailableAlert';

const coeUrl = getAppUrl('coe');
const introUrl = `${coeUrl}/introduction`;

export const Available = ({ referenceNumber, requestDate }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const enableCveStatus = useToggleValue(TOGGLE_NAMES.coeEnableCveStatus);

  return (
    <div className="row vads-u-margin-bottom--7">
      <div className="medium-8 columns">
        {enableCveStatus && (
          <AvailableAlert
            referenceNumber={referenceNumber}
            requestDate={requestDate}
          />
        )}
        <ReviewAndDownload />
        <h2>What if I need to make changes to my COE?</h2>
        <p>
          Complete and submit a Request for a Certificate of Eligibility (VA
          Form 26-1880) if you need to:
        </p>
        <ul>
          <li>
            Make changes to your COE (correct an error or update your
            information), <strong>or</strong>
          </li>
          <li>Request a restoration of entitlement</li>
        </ul>
        <a className="vads-c-action-link--blue" href={introUrl}>
          Make changes to your COE online by filling out VA Form 26-1880
        </a>
        <DocumentList />
        <MoreQuestions />
      </div>
    </div>
  );
};

Available.propTypes = {
  referenceNumber: PropTypes.string,
  requestDate: PropTypes.number,
};

export default Available;
