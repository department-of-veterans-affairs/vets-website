import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import {
  makeSelectCurrentContext,
  makeSelectVeteranData,
  makeSelectPendingEdits,
} from '../../../selectors';
import { makeSelectFeatureToggles } from '../../../utils/selectors/feature-toggles';

import { api } from '../../../api';

const NextOfKin = props => {
  const { router } = props;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;

  const selectPendingEdits = useMemo(makeSelectPendingEdits, []);
  const { pendingEdits } = useSelector(selectPendingEdits);
  const { nextOfKin1: newInformation } = pendingEdits || {};

  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const { isEditingPreCheckInEnabled } = useSelector(selectFeatureToggles);

  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);

  const selectContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectContext);

  const buttonClick = useCallback(
    async answer => {
      setIsLoading(true);
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': `${answer}-to-next-of-kin`,
      });
      if (isEditingPreCheckInEnabled) {
        setIsLoading(true);
        if (newInformation) {
          await api.v2.postDemographicsData({
            demographics: {
              nextOfKin1: newInformation,
            },
            token,
          });
        }
        await api.v2.postPreCheckInData({
          uuid: token,
          nextOfKinUpToDate: true,
        });
        dispatch(recordAnswer({ nextOfKinUpToDate: `${answer}` }));
        goToNextPage();
      } else {
        dispatch(recordAnswer({ nextOfKinUpToDate: `${answer}` }));
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
  const header = t('is-this-your-current-next-of-kin');
  const subtitle = t(
    'this-helps-us-keep-information-about-your-next-of-kin-up-to-date',
  );

  return (
    <>
      <BackButton action={goToPreviousPage} router={router} />
      <NextOfKinDisplay
        Footer={Footer}
        header={header}
        subtitle={subtitle}
        nextOfKin={newInformation || nextOfKin}
        yesAction={yesClick}
        noAction={noClick}
        isLoading={isLoading}
        isEditEnabled={isEditingPreCheckInEnabled}
        jumpToPage={jumpToPage}
      />
      <BackToHome />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
