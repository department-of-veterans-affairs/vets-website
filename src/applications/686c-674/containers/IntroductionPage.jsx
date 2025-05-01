import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollTo, waitForRenderThenFocus } from 'platform/utilities/ui/';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { verifyVaFileNumber } from '../actions';
import { IntroductionPageHeader } from '../components/IntroductionPageHeader';
import { IntroductionPageFormProcess } from '../components/IntroductionPageFormProcess';
import {
  VerifiedAlert,
  VaFileNumberMissingAlert,
  ServerErrorAlert,
} from '../config/helpers';
import { V2_LAUNCH_DATE } from '../config/constants';

const IntroductionPage = props => {
  const dispatch = useDispatch();
  const { hasVaFileNumber, isLoading } = useSelector(
    state => state?.vaFileNumber,
  );
  const hasSession = () => JSON.parse(localStorage.getItem('hasSession'));

  useEffect(() => {
    if (hasSession()) {
      dispatch(verifyVaFileNumber());
    }
    waitForRenderThenFocus('.schemaform-title > h1');
    scrollTo('topContentElement');
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
          <va-alert status="error">{alertMessage}</va-alert>
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
      >
        <p className="vads-u-margin-bottom--4">
          You should also know that we updated our online form.{' '}
          <strong>
            If you started applying online before {V2_LAUNCH_DATE},
          </strong>{' '}
          you’ll need to review the information in your application.Select
          Continue your application to use our updated form.
        </p>
      </SaveInProgressIntro>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--2">
        <va-omb-info
          res-burden={30}
          omb-number="2900-0043"
          exp-date="08/31/2025"
        />
      </div>
      <h2>Additional forms you may need to complete</h2>
      <h3>Request for Approval of School Attendance</h3>
      <p>VA Form 21-674</p>
      <div className="omb-info--container vads-u-padding-left--0 vads-u-margin-top--2">
        <va-omb-info
          res-burden={15}
          omb-number="2900-0049"
          exp-date="11/30/2027"
        />
      </div>
    </div>
  );
};

export default IntroductionPage;
