import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';

import BackToHome from '../../../components/BackToHome';
import { useFormRouting } from '../../../hooks/useFormRouting';
import Footer from '../../../components/layout/Footer';
import BackButton from '../../../components/BackButton';
import DemographicsDisplay from '../../../components/pages/demographics/DemographicsDisplay';
import { recordAnswer } from '../../../actions/universal';

import {
  makeSelectVeteranData,
  makeSelectPendingEdits,
  makeSelectCurrentContext,
} from '../../../selectors';

import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import { api } from '../../../api';

const Demographics = props => {
  const dispatch = useDispatch();
  const { router } = props;
  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);
  const { t } = useTranslation();

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const {
    isEditingPreCheckInEnabled,
    isPhoneAppointmentsEnabled,
  } = useSelector(selectFeatureToggles);

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics, appointments } = useSelector(selectVeteranData);

  const selectPendingEdits = useMemo(makeSelectPendingEdits, []);
  const { pendingEdits } = useSelector(selectPendingEdits);
  const { demographics: newInformation } = pendingEdits || {};

  const selectContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectContext);

  const [isLoading, setIsLoading] = useState();

  const yesClick = useCallback(
    async () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      if (isEditingPreCheckInEnabled) {
        setIsLoading(true);
        if (newInformation) {
          await api.v2.postDemographicsData({
            demographics: newInformation,
            token,
          });
        }
        await api.v2.postPreCheckInData({
          uuid: token,
          demographicsUpToDate: 'yes',
        });
        dispatch(recordAnswer({ demographicsUpToDate: 'yes' }));
        goToNextPage();
      } else {
        dispatch(recordAnswer({ demographicsUpToDate: 'yes' }));
        goToNextPage();
      }
    },
    [isEditingPreCheckInEnabled, newInformation, token, dispatch, goToNextPage],
  );
  const noClick = useCallback(
    async () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-demographic-information',
      });
      if (isEditingPreCheckInEnabled) {
        setIsLoading(true);
        await api.v2.postPreCheckInData({
          uuid: token,
          demographicsUpToDate: 'no',
        });
        dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
        goToNextPage();
      } else {
        dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
        goToNextPage();
      }
    },
    [isEditingPreCheckInEnabled, token, dispatch, goToNextPage],
  );
  // check if appointment is in-person or phone
  const apptType =
    appointments && appointments.length ? appointments[0]?.kind : null;
  const subtitle =
    isPhoneAppointmentsEnabled && apptType === 'phone'
      ? ''
      : t(
          'if-you-need-to-make-changes-please-talk-to-a-staff-member-when-you-check-in',
        );

  return (
    <>
      <BackButton action={goToPreviousPage} router={router} />
      <DemographicsDisplay
        yesAction={yesClick}
        noAction={noClick}
        subtitle={subtitle}
        demographics={newInformation || demographics}
        Footer={Footer}
        isEditEnabled={isEditingPreCheckInEnabled}
        jumpToPage={jumpToPage}
        isLoading={isLoading}
      />
      <BackToHome />
    </>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
