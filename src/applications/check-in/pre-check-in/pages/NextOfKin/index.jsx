import React, { useCallback, useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { useDispatch } from 'react-redux';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import recordEvent from 'platform/monitoring/record-event';
import { recordAnswer } from '../../actions';
import { useFormRouting } from '../../hooks/useFormRouting';
import PropTypes from 'prop-types';
import NextOfKinDisplay from '../../../components/pages/nextOfKin/NextOfKinDisplay';

const NextOfKin = props => {
  const { router } = props;
  const dispatch = useDispatch();

  const { goToNextPage, goToPreviousPage, currentPage } = useFormRouting(
    router,
  );
  useEffect(() => {
    focusElement('h1');
  }, []);
  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-next-of-kin',
      });
      dispatch(recordAnswer({ nextOfKinUpToDate: 'yes' }));
      goToNextPage();
    },
    [goToNextPage, dispatch],
  );
  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'no-to-next-of-kin',
      });
      dispatch(recordAnswer({ nextOfKinUpToDate: 'no' }));
      goToNextPage();
    },
    [goToNextPage, dispatch],
  );
  const header = 'Is this your current next of kin?';
  const subtitle =
    'This helps us keep information about your next of kin up to date.';

  const nextOfKin = {
    name: 'VETERAN,JONAH',
    relationship: 'BROTHER',
    phone: '1112223333',
    workPhone: '4445556666',
    address: {
      street1: '123 Main St',
      street2: 'Ste 234',
      street3: '',
      city: 'Los Angeles',
      county: 'Los Angeles',
      state: 'CA',
      zip: '90089',
      zip4: '',
      country: 'USA',
    },
  };

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
      />
      <BackToHome />
    </>
  );
};

NextOfKin.propTypes = {
  router: PropTypes.object,
};

export default NextOfKin;
