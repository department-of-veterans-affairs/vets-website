import React, { useEffect } from 'react';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { serviceMemberPathPageNames } from '../pageList';
import {
  CHAPTER_31_ROOT_URL,
  WIZARD_STATUS,
} from 'applications/vre/28-1900/constants';

const YesIDES = props => {
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
        Based on your answers, you probably qualify for VR&E benefits.
      </p>
      <p className="vads-u-margin--0">
        <strong>Before you apply,</strong> please go through the VR&E
        orientation below. If you already know you want to apply for VR&E, you
        can go directly to the online application without going through the
        orientation below.{' '}
        <a
          aria-label="Skip VR&E orientation and apply online with VA Form 28-1900"
          onClick={() => {
            sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
          }}
          href={CHAPTER_31_ROOT_URL}
        >
          Apply online now with VA Form 28-1900
        </a>
      </p>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.yesIDES,
  component: YesIDES,
};
