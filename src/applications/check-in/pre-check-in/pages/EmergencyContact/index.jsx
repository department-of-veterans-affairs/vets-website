import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

import { recordAnswer } from '../../../actions/pre-check-in';

import BackButton from '../../../components/BackButton';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import EmergencyContactDisplay from '../../../components/pages/emergencyContact/EmergencyContactDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { URLS } from '../../../utils/navigation/pre-check-in';

import { makeSelectVeteranData } from '../../../selectors';

const EmergencyContact = props => {
  const { router } = props;

  const [isSendingData, setIsSendingData] = useState(false);

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { emergencyContact } = demographics;
  const dispatch = useDispatch();

  const {
    currentPage,

    goToNextPage,
    goToPreviousPage,
  } = useFormRouting(router, URLS);

  useEffect(() => {
    focusElement('h1');
  }, []);

  const buttonClick = useCallback(
    async answer => {
      setIsSendingData(true);
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': `${answer}-to-emergency-contact`,
      });
      dispatch(recordAnswer({ emergencyContactUpToDate: `${answer}` }));

      // select the answers from state
      // send to API

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
      <BackButton action={goToPreviousPage} path={currentPage} />
      <EmergencyContactDisplay
        data={emergencyContact}
        yesAction={yesClick}
        noAction={noClick}
        isLoading={isSendingData}
        Footer={Footer}
      />
      <BackToHome />
    </>
  );
};

EmergencyContact.propTypes = {
  router: PropTypes.object,
};

export default EmergencyContact;
