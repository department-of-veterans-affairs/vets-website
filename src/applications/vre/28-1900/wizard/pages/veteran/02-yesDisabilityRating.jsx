import React, { useEffect } from 'react';
import { veteranPathPageNames } from '../pageList';
import { WIZARD_STATUS_COMPLETE } from 'applications/vre/28-1900/constants';

const YesDisabilityRating = props => {
  const { setWizardStatus } = props;
  useEffect(
    () => {
      setWizardStatus(WIZARD_STATUS_COMPLETE);
    },
    [setWizardStatus],
  );
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest">
      <p className="vads-u-margin-top--0">
        Based on your answers,{' '}
        <strong>you probably qualify for VR&E benefits</strong>
      </p>
      <p className="vads-u-margin--0">
        <strong>Before you apply,</strong> please go through the VR&E
        orientation below. This section will guide you through the VR&E tracks
        or paths to employment.
      </p>
    </div>
  );
};

export default {
  name: veteranPathPageNames.yesDisabilityRating,
  component: YesDisabilityRating,
};
