import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/layout/Footer';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectVeteranData } from '../../../selectors';

const NextOfKin = props => {
  const { router } = props;
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;

  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);

  const buttonClick = useCallback(
    async answer => {
      setIsLoading(true);
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
      <BackButton action={goToPreviousPage} router={router} />
      <NextOfKinDisplay
        Footer={Footer}
        header={header}
        subtitle={subtitle}
        nextOfKin={nextOfKin}
        yesAction={yesClick}
        noAction={noClick}
        isLoading={isLoading}
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
