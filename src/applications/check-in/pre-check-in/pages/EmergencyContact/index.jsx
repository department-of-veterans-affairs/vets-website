import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { recordAnswer } from '../../../actions/universal';

import BackButton from '../../../components/BackButton';
import EmergencyContactDisplay from '../../../components/pages/emergencyContact/EmergencyContactDisplay';

import { useFormRouting } from '../../../hooks/useFormRouting';
import { makeSelectVeteranData } from '../../../selectors';

const EmergencyContact = props => {
  const { router } = props;

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);
  const { emergencyContact } = demographics;

  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage, jumpToPage } = useFormRouting(router);

  const [isLoading, setIsLoading] = useState();

  const buttonClick = useCallback(
    async answer => {
      setIsLoading(true);
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
      <BackButton action={goToPreviousPage} router={router} />
      <EmergencyContactDisplay
        emergencyContact={emergencyContact}
        yesAction={yesClick}
        noAction={noClick}
        isLoading={isLoading}
        jumpToPage={jumpToPage}
      />
    </>
  );
};

EmergencyContact.propTypes = {
  router: PropTypes.object,
};

export default EmergencyContact;
