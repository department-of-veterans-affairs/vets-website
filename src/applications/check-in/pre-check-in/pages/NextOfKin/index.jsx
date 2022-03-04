import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../../actions/pre-check-in';

import BackButton from '../../../components/BackButton';
import BackToHome from '../../../components/BackToHome';
import Footer from '../../../components/Footer';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';

import { makeSelectVeteranData } from '../../../selectors';

const NextOfKin = props => {
  const { router } = props;

  const [isSendingData, setIsSendingData] = useState(false);

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;

  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage } = useFormRouting(router);

  const buttonClick = useCallback(
    async answer => {
      setIsSendingData(true);
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': `${answer}-to-next-of-kin`,
      });
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
  const header = 'Is this your current next of kin?';
  const subtitle =
    'This helps us keep information about your next of kin up to date.';

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
        isSendingData={isSendingData}
      />
      <BackToHome />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
