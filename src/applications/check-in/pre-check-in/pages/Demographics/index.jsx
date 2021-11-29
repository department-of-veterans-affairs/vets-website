import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import BackToHome from '../../components/BackToHome';
import { useFormRouting } from '../../hooks/useFormRouting';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import DemographicsDisplay from '../../../components/pages/DemographicsDisplay';
import recordEvent from 'platform/monitoring/record-event';
import { recordAnswer } from '../../actions';

const Demographics = props => {
  const dispatch = useDispatch();
  const { router } = props;
  const { goToNextPage, goToPreviousPage, currentPage } = useFormRouting(
    router,
  );
  const yesClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'yes-to-demographic-information',
      });
      dispatch(recordAnswer({ demographicsUpToDate: 'yes' }));
      goToNextPage();
    },
    [goToNextPage, dispatch],
  );
  const noClick = useCallback(
    () => {
      recordEvent({
        event: 'cta-button-click',
        'button-click-label': 'np-to-demographic-information',
      });
      dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
      goToNextPage();
    },
    [goToNextPage, dispatch],
  );
  const subtitle =
    'If you need to make changes, please talk to a staff member when you check in.';

  // Temp data
  const demographics = {
    nextOfKin1: {
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
    },
    mailingAddress: {
      street1: '123 Turtle Trail',
      street2: '',
      street3: '',
      city: 'Treetopper',
      state: 'Tennessee',
      zip: '101010',
    },
    homeAddress: {
      street1: '445 Fine Finch Fairway',
      street2: 'Apt 201',
      city: 'Fairfence',
      state: 'Florida',
      zip: '445545',
    },
    homePhone: '5552223333',
    mobilePhone: '5553334444',
    workPhone: '5554445555',
    emailAddress: 'kermit.frog@sesameenterprises.us',
  };
  //
  return (
    <>
      <BackButton action={goToPreviousPage} path={currentPage} />
      <DemographicsDisplay
        yesAction={yesClick}
        noAction={noClick}
        subtitle={subtitle}
        demographics={demographics}
        Footer={Footer}
      />
      <BackToHome />
    </>
  );
};

Demographics.propTypes = {
  router: PropTypes.object,
};

export default Demographics;
