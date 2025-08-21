/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
// eslint-disable-next-line deprecate/import
import ProfileInfoCard from '../../../src/applications/personalization/profile/components/ProfileInfoCard';

export const Sample = () => (
  <va-additional-info
    class="vads-u-margin-bottom--2"
    trigger="Why aren’t all my issues listed here?"
    disableAnalytics
    onClick={null}
  >
    <p className="vads-u-margin-top--0">
      If you don’t see your issue or decision listed here, it may not be in our
      system yet. This can happen if it’s a more recent claim decision. We may
      still be processing it.
    </p>
  </va-additional-info>
);

export const SampleOther = () => (
  <va-additional-info
    trigger="Learn more about military base addresses"
    onClick={null}
    disableAnalytics
    status="info"
  >
    <span onClick={null}>
      The United States is automatically chosen as your country if you live on a
      military base outside of the country.
    </span>
  </va-additional-info>
);

export const Sample3 = ({ className = 'sample' }) => (
  <div className={className}>
    <div className="vads-u-margin-bottom--2">
      <va-additional-info trigger="How do I update my personal information?">
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3">
          If you’re enrolled in the VA health care program
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA medical center to update your personal
          information.
        </p>
        <a href="/find-locations/?facilityType=health">
          Find your nearest VA medical center{' '}
        </a>
        <h2 className="vads-u-font-size--h5 vads-u-margin-top--3 vads-u-margin-bottom--1">
          If you receive VA benefits, but aren’t enrolled in VA health care
        </h2>
        <p className="vads-u-margin-y--1">
          Please contact your nearest VA regional office to update your personal
          information
        </p>
        <a href="/find-locations/?facilityType=benefits">
          Find your nearest VA regional office
        </a>
      </va-additional-info>
    </div>
    <ProfileInfoCard
      title="Personal information"
      data={[
        { title: 'Date of birth', value: 'N/A' },
        { title: 'Gender', value: 'N/A' },
      ]}
      className="vads-u-margin-bottom--3"
      level={2}
    />
  </div>
);

export const Sample4 = () => (
  <div className="vads-u-margin-y--3 available-connected-apps">
    <va-additional-info trigger="What other third-party apps can I connect to my profile?">
      To find out what other third-party apps are available to connect to your
      profile,{' '}
      <a href="/resources/find-apps-you-can-use" onClick={null}>
        go to the app directory
      </a>
    </va-additional-info>
  </div>
);

export const Sample5 = () => (
  <va-additional-info
    trigger="What if I don’t have a bank account?"
    onClick={null}
  >
    <p>
      The Veterans{' '}
      <a
        href="https://veteransbenefitsbanking.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="Benefits Banking Program (VBBP) - Opens in a new window"
      >
        Benefits Banking Program (VBBP)
      </a>{' '}
      provides a list of Veteran-friendly banks and credit unions. They’ll work
      with you to set up an account, or help you qualify for an account, so you
      can use direct deposit.
    </p>

    <p>
      To get started, call one of the participating banks or credit unions
      listed on the VBBP website. Be sure to mention the Veterans Benefits
      Banking Program.
    </p>

    <p>
      <strong>Note:</strong> The Department of the Treasury requires us to make
      electronic payments. If you don’t want to use direct deposit, you’ll need
      to call the Department of the Treasury at ? Ask to talk with a
      representative who handles waiver requests. They can answer any questions
      or concerns you may have.
    </p>
  </va-additional-info>
);
