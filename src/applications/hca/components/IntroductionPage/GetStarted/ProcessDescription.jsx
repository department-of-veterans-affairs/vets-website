import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { selectProfile } from '@department-of-veterans-affairs/platform-user/selectors';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
import SaveInProgressIntro from '@department-of-veterans-affairs/platform-forms/save-in-progress/SaveInProgressIntro';
import { selectAuthStatus } from '../../../utils/selectors';
import SaveInProgressDescription from './SaveInProgressDescription';
import CheckAppStatusAlert from '../../FormAlerts/CheckAppStatusAlert';
import SaveTimeSipAlert from '../../FormAlerts/SaveTimeSipAlert';
import ProcessTimeline from './ProcessTimeline';
import content from '../../../locales/en/content.json';

const ProcessDescription = ({ route: { formConfig, pageList } }) => {
  const { className, isLoggedIn } = useSelector(state => {
    const hasSavedForm = selectProfile(state).savedForms.some(
      ({ form }) => form === VA_FORM_IDS.FORM_10_10EZ,
    );
    return {
      className: classnames({ 'vads-u-display--none': hasSavedForm }),
      isLoggedIn: selectAuthStatus(state).isLoggedIn,
    };
  });

  const sipIntro = useCallback(
    ({ buttonOnly = false, children = null }) => {
      const { savedFormMessages, prefillEnabled, downtime } = formConfig;
      const sipProps = {
        startText: content['sip-start-form-text'],
        messages: savedFormMessages,
        prefillEnabled,
        buttonOnly,
        downtime,
        pageList,
      };
      return (
        <SaveInProgressIntro {...sipProps}>{children}</SaveInProgressIntro>
      );
    },
    [formConfig, pageList],
  );

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
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      savedFormMessages: PropTypes.array,
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
    pageList: PropTypes.array,
  }),
};

export default ProcessDescription;
