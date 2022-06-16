import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import EmergencyContactDisplay from '../../../components/pages/emergencyContact/EmergencyContactDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';
import {
  makeSelectVeteranData,
  makeSelectPendingEdits,
  makeSelectCurrentContext,
} from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import { api } from '../../../api';

const EmergencyContact = props => {
  const { router } = props;

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { emergencyContact } = demographics;

  const selectPendingEdits = useMemo(makeSelectPendingEdits, []);
  const { pendingEdits } = useSelector(selectPendingEdits);
  const { emergencyContact: newInformation } = pendingEdits || {};

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isEditingPreCheckInEnabled } = useSelector(selectFeatureToggles);

  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);
  const selectContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectContext);

  const [isLoading, setIsLoading] = useState();

  const buttonClick = useCallback(
    async answer => {
      setIsLoading(true);
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': `${answer}-to-emergency-contact`,
      });

      if (isEditingPreCheckInEnabled) {
        setIsLoading(true);
        if (newInformation) {
          await api.v2.postDemographicsData({
            demographics: {
              emergencyContact: newInformation,
            },
            token,
          });
        }
        await api.v2.postPreCheckInData({
          uuid: token,
          emergencyContactUpToDate: true,
        });
        dispatch(recordAnswer({ emergencyContactUpToDate: `${answer}` }));
        goToNextPage();
      } else {
        dispatch(recordAnswer({ emergencyContactUpToDate: `${answer}` }));
        goToNextPage();
      }
    },
    [dispatch, goToNextPage, isEditingPreCheckInEnabled, newInformation, token],
  );

  const yesClick = useCallback(
    () => {
      buttonClick('yes');
    },
    [buttonClick],
  );
  const noClick = useCallback(
    () => {
      buttonClick('no');
    },
    [buttonClick],
  );

  return (
    <>
      <BackButton action={goToPreviousPage} router={router} />
      <EmergencyContactDisplay
        emergencyContact={newInformation || emergencyContact}
        yesAction={yesClick}
        noAction={noClick}
        isLoading={isLoading}
        Footer={Footer}
        isEditEnabled={isEditingPreCheckInEnabled}
        jumpToPage={jumpToPage}
      />
      <BackToHome />
    </>
  );
};

EmergencyContact.propTypes = {
  router: PropTypes.object,
};

export default EmergencyContact;
