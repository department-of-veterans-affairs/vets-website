import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import { formatDateLong } from 'platform/utilities/date';

import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import UserInfoSection from '../components/UserInfoSection';

const PrintPage = ({ router }) => {
  const enrollmentData = useSelector(
    state => state.post911GIBStatus.enrollmentData || {},
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isUpdatedPrintPage = useToggleValue(TOGGLE_NAMES.sobPrintPageUpdate);

  useEffect(() => {
    const breadCrumbClassValue = isUpdatedPrintPage
      ? '.va-breadcrumbs'
      : '.va-nav-breadcrumbs';

    focusElement('.print-screen');
    document.querySelector('header').classList.add('no-print-no-sr');
    document.querySelector('footer').classList.add('no-print-no-sr');
    document
      .querySelector(breadCrumbClassValue)
      .classList.add('no-print-no-sr');

    return () => {
      document.querySelector('header').classList.remove('no-print-no-sr');
      document.querySelector('footer').classList.remove('no-print-no-sr');
      document
        .querySelector(breadCrumbClassValue)
        .classList.remove('no-print-no-sr');
    };
  }, []);

  const backToStatement = () => router.push('/');
  const printWindow = () => window.print();

  const todayFormatted = formatDateLong(new Date());

  return (
    <div className="usa-width-two-thirds medium-8 columns gib-info">
      <div className="print-status">
        <div className="print-screen">
          <img src="/img/design/logo/va-logo.png" alt="VA logo" width="300" />
          <h1 className="section-header">
            Post-9/11 GI Bill
            <sup>&reg;</sup> Statement of Benefits
          </h1>
          <button className="usa-button-primary" onClick={printWindow}>
            Print This Page
          </button>
          <p>
            The information in this letter is the Post-9/11 GI Bill Statement of
            Benefits for the beneficiary listed below as of {todayFormatted}.
            Any pending or recent changes to enrollment may affect remaining
            entitlement.
          </p>
          <UserInfoSection enrollmentData={enrollmentData} />
          <button className="usa-button-secondary" onClick={backToStatement}>
            Back to Statement Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;
