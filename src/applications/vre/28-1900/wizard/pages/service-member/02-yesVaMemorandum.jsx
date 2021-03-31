import React, { useEffect } from 'react';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { serviceMemberPathPageNames } from '../pageList';
import {
  CHAPTER_31_ROOT_URL,
  WIZARD_STATUS,
} from 'applications/vre/28-1900/constants';

const YesVaMemorandum = props => {
  const { setWizardStatus } = props;
  useEffect(
    () => {
      setWizardStatus(WIZARD_STATUS_COMPLETE);
    },
    [setWizardStatus],
  );
  return (
    <div
      className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="vads-u-margin--0" id="orientation-complete-notification">
        <span className="vads-u-display--block vads-u-margin-y--1">
          Based on your answers, you probably qualify to apply for VR&E
          benefits.
        </span>
        <strong>Before you apply,</strong> please go through the VR&E
        orientation below. If you already know you want to apply for VR&E, you
        can go directly to the online application without going through the
        orientation below.{' '}
      </p>
      <a
        aria-describedby="orientation-complete-notification"
        onClick={() => {
          sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        }}
        href={CHAPTER_31_ROOT_URL}
        className="va-action-link--green vads-u-padding-left--0"
      >
        Apply online now with VA Form 28-1900
      </a>
    </div>
  );
};

export default {
  name: serviceMemberPathPageNames.yesVaMemorandum,
  component: YesVaMemorandum,
};
