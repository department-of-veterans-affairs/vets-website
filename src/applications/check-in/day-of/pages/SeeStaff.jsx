import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { api } from '../../api';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';

import { makeSelectSeeStaffMessage } from '../../selectors';
import { makeSelectFeatureToggles } from '../../utils/selectors/feature-toggles';
import TravelPayReimbursementLink from '../../components/TravelPayReimbursementLink';
import { useFormRouting } from '../../hooks/useFormRouting';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { useDemographicsFlags } from '../../hooks/useDemographicsFlags';

const SeeStaff = props => {
  const { router } = props;
  const selectFeatureToggles = useMemo(makeSelectFeatureToggles, []);
  const featureToggles = useSelector(selectFeatureToggles);
  const { isDayOfDemographicsFlagsEnabled } = featureToggles;
  const { goToErrorPage, jumpToPage } = useFormRouting(router);
  const { getDemographicsConfirmed } = useSessionStorage(false);
  const {
    demographicsData,
    demographicsFlagsSent,
    setDemographicsFlagsSent,
    demographicsFlagsEmpty,
  } = useDemographicsFlags();
  const { goBack } = router;
  const selectSeeStaffMessage = useMemo(makeSelectSeeStaffMessage, []);
  const { message } = useSelector(selectSeeStaffMessage);

  useEffect(() => {
    focusElement('h1');
  }, []);

  useEffect(
    () => {
      if (
        !isDayOfDemographicsFlagsEnabled ||
        demographicsFlagsSent ||
        demographicsFlagsEmpty ||
        getDemographicsConfirmed(window)
      )
        return;
      api.v2
        .patchDayOfDemographicsData(demographicsData)
        .then(resp => {
          if (resp.data.error || resp.data.errors) {
            throw new Error();
          } else {
            setDemographicsFlagsSent(true);
          }
        })
        .catch(() => {});
    },
    [
      demographicsData,
      demographicsFlagsEmpty,
      demographicsFlagsSent,
      getDemographicsConfirmed,
      goToErrorPage,
      isDayOfDemographicsFlagsEnabled,
      jumpToPage,
      setDemographicsFlagsSent,
    ],
  );
  return (
    <div className="vads-l-grid-container vads-u-padding-top--3 vads-u-padding-bottom--3">
      <BackButton router={router} action={goBack} />
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Check in with a staff member
      </h1>
      {message ? (
        <span>{message}</span>
      ) : (
        <p>Our staff can help you update your contact information.</p>
      )}
      <TravelPayReimbursementLink />
      <Footer />
      <BackToHome />
    </div>
  );
};

SeeStaff.propTypes = {
  router: PropTypes.object,
};

export default SeeStaff;
