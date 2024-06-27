import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { hasSession } from 'platform/user/profile/utilities';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { verifyVaFileNumber } from '../actions';
import { IntroductionPageHeader } from '../components/IntroductionPageHeader';
import { IntroductionPageFormProcess } from '../components/IntroductionPageFormProcess';
import {
  VerifiedAlert,
  VaFileNumberMissingAlert,
  ServerErrorAlert,
} from '../config/helpers';

const IntroductionPage = props => {
  const dispatch = useDispatch();
  const { hasVaFileNumber, isLoading } = useSelector(
    state => state?.vaFileNumber,
  );

  useEffect(() => {
    if (hasSession()) {
      dispatch(verifyVaFileNumber());
    }
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const getStatus = () => {
    if (hasVaFileNumber?.errors) return 'error';
    if (!hasVaFileNumber?.VALIDVAFILENUMBER && !isLoading)
      return 'missingVaFileNumber';
    if (isLoading) return 'loading';
    return '';
  };

  const renderLoadingOrError = status => {
    if (status === 'loading') {
      return (
        <va-loading-indicator message="Verifying veteran account information..." />
      );
    }
    if (['error', 'missingVaFileNumber']?.includes(status) && hasSession()) {
      const alertMessage =
        status === 'missingVaFileNumber'
          ? VaFileNumberMissingAlert
          : ServerErrorAlert;

      return (
        <div className="vads-u-margin-y--2">
          <va-alert status="error" uswds>
            {alertMessage}
          </va-alert>
        </div>
      );
    }
    return null;
  };

  return getStatus() !== '' && hasSession() ? (
    renderLoadingOrError(getStatus())
  ) : (
    <div className="schemaform-intro">
      <IntroductionPageHeader />
      <IntroductionPageFormProcess />
      <SaveInProgressIntro
        {...props}
        hideUnauthedStartLink
        verifiedPrefillAlert={VerifiedAlert}
        prefillEnabled={props.route.formConfig.prefillEnabled}
        messages={props.route.formConfig.savedFormMessages}
        downtime={props.route.formConfig.downtime}
        pageList={props.route.pageList}
        startText="Add or remove a dependent"
        headingLevel={2}
      />
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--2">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0043"
          exp-date="09/30/2021"
        />
      </div>
    </div>
  );
};

export default IntroductionPage;
