import React, { useCallback, useEffect, useMemo } from 'react';
import { focusElement } from 'platform/utilities/ui';
import { useDispatch, useSelector } from 'react-redux';
import BackToHome from '../../components/BackToHome';
import { useFormRouting } from '../../../hooks/useFormRouting';
import PropTypes from 'prop-types';
import Footer from '../../components/Footer';
import BackButton from '../../../components/BackButton';
import DemographicsDisplay from '../../../components/pages/demographics/DemographicsDisplay';
import recordEvent from 'platform/monitoring/record-event';
import { recordAnswer } from '../../../actions/pre-check-in';
import { URLS } from '../../../utils/navigation/pre-check-in';

import { makeSelectVeteranData } from '../../../selectors';

const Demographics = props => {
  const dispatch = useDispatch();
  const { router } = props;
  const { goToNextPage, goToPreviousPage, currentPage } = useFormRouting(
    router,
    URLS,
  );
  useEffect(() => {
    focusElement('h1');
  }, []);
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
        'button-click-label': 'no-to-demographic-information',
      });
      dispatch(recordAnswer({ demographicsUpToDate: 'no' }));
      goToNextPage();
    },
    [goToNextPage, dispatch],
  );
  const subtitle =
    'If you need to make changes, please talk to a staff member when you check in.';

  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const { demographics } = useSelector(selectVeteranData);

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
