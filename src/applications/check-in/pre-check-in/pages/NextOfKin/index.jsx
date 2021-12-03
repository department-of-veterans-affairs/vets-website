import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../actions';

import { api } from '../../api/';

import BackButton from '../../components/BackButton';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

import { useFormRouting } from '../../hooks/useFormRouting';

import {
  makeSelectCurrentContext,
  makeSelectVeteranData,
  makeSelectForm,
} from '../../selectors';

const NextOfKin = props => {
  const { router } = props;

  const [isSendingData, setIsSendingData] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { demographicsUpToDate } = data;

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { nextOfKin1: nextOfKin } = demographics;

  const dispatch = useDispatch();

  const {
    currentPage,
    goToErrorPage,
    goToNextPage,
    goToPreviousPage,
  } = useFormRouting(router);

  useEffect(() => {
    focusElement('h1');
  }, []);

  const buttonClick = useCallback(
    async answer => {
      setIsSendingData(true);
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': `${answer}-to-next-of-kin`,
      });
      dispatch(recordAnswer({ nextOfKinUpToDate: `${answer}` }));
      // select the answers from state
      // send to API
      const preCheckInData = {
        uuid: token,
        demographicsUpToDate: demographicsUpToDate === 'yes',
        nextOfKinUpToDate: answer === 'yes',
      };
      try {
        await api.v2.postPreCheckInData({ ...preCheckInData });
        goToNextPage();
      } catch (error) {
        goToErrorPage();
      }
    },
    [dispatch, goToErrorPage, goToNextPage, token, demographicsUpToDate],
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
      <BackButton action={goToPreviousPage} path={currentPage} />
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
