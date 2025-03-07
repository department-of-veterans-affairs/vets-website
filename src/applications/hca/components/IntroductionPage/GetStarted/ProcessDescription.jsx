import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { selectProfile } from 'platform/user/selectors';
import { VA_FORM_IDS } from 'platform/forms/constants';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import {
  selectAuthStatus,
  selectFeatureToggles,
} from '../../../utils/selectors';
import SaveInProgressDescription from './SaveInProgressDescription';
import CheckAppStatusAlert from '../../FormAlerts/CheckAppStatusAlert';
import SaveTimeSipAlert from '../../FormAlerts/SaveTimeSipAlert';
import ProcessTimeline from './ProcessTimeline';
import content from '../../../locales/en/content.json';

const ProcessDescription = ({ route }) => {
  const { isLoggedIn } = useSelector(selectAuthStatus);
  const { savedForms } = useSelector(selectProfile);
  const { isPerformanceAlertEnabled } = useSelector(selectFeatureToggles);

  // set display variables
  const formID = VA_FORM_IDS.FORM_10_10EZ;
  const hasSavedForm = savedForms.some(o => o.form === formID);
  const className = classnames({ 'vads-u-display--none': hasSavedForm });

  // build SaveInProgressIntro component
  const sipIntro = ({ buttonOnly = false, children = null }) => {
    const { formConfig, pageList } = route;
    const { savedFormMessages, prefillEnabled, downtime } = formConfig;
    const sipProps = {
      startText: content['sip-start-form-text'],
      hideUnauthedStartLink: isPerformanceAlertEnabled,
      messages: savedFormMessages,
      prefillEnabled,
      buttonOnly,
      downtime,
      pageList,
    };
    return <SaveInProgressIntro {...sipProps}>{children}</SaveInProgressIntro>;
  };

  // render based on display enrollment & feature toggle data
  return (
    <>
      <p className={className} data-testid="hca-process-description">
        VA health care covers care for your physical and mental health. This
        includes a range of services from checkups to surgeries to home health
        care. It also includes prescriptions and medical equipment. Apply online
        now.
      </p>

      {isLoggedIn ? (
        sipIntro({ children: SaveInProgressDescription })
      ) : (
        <CheckAppStatusAlert />
      )}

      <span className={className}>
        <ProcessTimeline />

        {isLoggedIn ? (
          sipIntro({ buttonOnly: true })
        ) : (
          <SaveTimeSipAlert sipIntro={sipIntro({ buttonOnly: true })} />
        )}
      </span>
    </>
  );
};

ProcessDescription.propTypes = {
  route: PropTypes.object,
};

export default ProcessDescription;
