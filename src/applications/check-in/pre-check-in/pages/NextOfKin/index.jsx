import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectVeteranData } from '../../../selectors';

const NextOfKin = props => {
  const { router } = props;
  const { t } = useTranslation();

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;

  const dispatch = useDispatch();

  const {
    goToNextPage,
    goToPreviousPage,
    jumpToPage,
    getPreviousPageFromRouter,
  } = useFormRouting(router);

  const buttonClick = useCallback(
    async answer => {
      dispatch(recordAnswer({ nextOfKinUpToDate: `${answer}` }));
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
  const header = t('is-this-your-current-next-of-kin');
  const subtitle = t(
    'this-helps-us-keep-information-about-your-next-of-kin-up-to-date',
  );

  return (
    <>
      <BackButton
        action={goToPreviousPage}
        router={router}
        prevUrl={getPreviousPageFromRouter()}
      />
      <NextOfKinDisplay
        header={header}
        eyebrow={t('review-your-information')}
        subtitle={subtitle}
        nextOfKin={nextOfKin}
        yesAction={yesClick}
        noAction={noClick}
        jumpToPage={jumpToPage}
        router={router}
      />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
