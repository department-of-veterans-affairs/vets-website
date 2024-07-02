import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { useFormRouting } from '../../../hooks/useFormRouting';
import BackButton from '../../../components/BackButton';
import DemographicsDisplay from '../../../components/pages/demographics/DemographicsDisplay';
import { recordAnswer } from '../../../actions/universal';

import { makeSelectVeteranData } from '../../../selectors';

const Demographics = props => {
  const dispatch = useDispatch();
  const { router } = props;
  const {
    goToNextPage,
    goToPreviousPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);
  const { t } = useTranslation();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics, appointments } = useSelector(selectVeteranData);

  const yesClick = useCallback(
    async () => {
      dispatch(recordAnswer({ demographicsUpToDate: 'yes' }));
      goToNextPage();
    },
    [dispatch, goToNextPage],
  );
  const noClick = useCallback(
    async () => {
      dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
      goToNextPage();
    },
    [dispatch, goToNextPage],
  );
  // check if appointment is in-person or phone
  const apptType =
    appointments && appointments.length ? appointments[0]?.kind : null;

  const subtitle =
    apptType === 'phone'
      ? ''
      : t(
          'if-you-need-to-make-changes-please-talk-to-a-staff-member-when-you-check-in',
        );

  return (
    <>
      <BackButton
        action={goToPreviousPage}
        router={router}
        prevUrl={getPreviousPageFromRouter()}
      />
      <DemographicsDisplay
        yesAction={yesClick}
        noAction={noClick}
        eyebrow={t('review-your-information')}
        subtitle={subtitle}
        demographics={demographics}
        router={router}
      />
    </>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
