import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import EmergencyContactDisplay from '../../../components/pages/emergencyContact/EmergencyContactDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectVeteranData } from '../../../selectors';

const EmergencyContact = props => {
  const { router } = props;
  const { t } = useTranslation();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { emergencyContact } = demographics;

  const dispatch = useDispatch();

  const {
    goToNextPage,
    goToPreviousPage,
    jumpToPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);

  const buttonClick = useCallback(
    async answer => {
      dispatch(recordAnswer({ emergencyContactUpToDate: `${answer}` }));
      goToNextPage();
    },
    [dispatch, goToNextPage],
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
      <BackButton
        action={goToPreviousPage}
        router={router}
        prevUrl={getPreviousPageFromRouter()}
      />
      <EmergencyContactDisplay
        eyebrow={t('review-your-information')}
        emergencyContact={emergencyContact}
        yesAction={yesClick}
        noAction={noClick}
        jumpToPage={jumpToPage}
        router={router}
      />
    </>
  );
};

EmergencyContact.propTypes = {
  router: PropTypes.object,
};

export default EmergencyContact;
