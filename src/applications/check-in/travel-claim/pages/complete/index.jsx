import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { usePostTravelOnlyClaim } from '../../../hooks/usePostTravelOnlyClaim';
import { useUpdateError } from '../../../hooks/useUpdateError';
import Wrapper from '../../../components/layout/Wrapper';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';

const Complete = props => {
  const { router } = props;
  const { t } = useTranslation();
  const { updateError } = useUpdateError();
  const { isLoading, travelPayClaimError } = usePostTravelOnlyClaim({ router });

  useEffect(
    () => {
      if (travelPayClaimError) {
        updateError('completing-travel-submission');
      }
    },
    [travelPayClaimError, updateError],
  );
  if (isLoading) {
    return (
      <va-loading-indicator
        data-testid="loading-indicator"
        message={t('loading')}
      />
    );
  }
  return (
    <>
      <Wrapper
        pageTitle={t('were-processing-your-travel-claim')}
        classNames="travel-page"
        testID="travel-complete-page"
      >
        <TravelClaimSuccessAlert />
      </Wrapper>
    </>
  );
};

Complete.propTypes = {
  router: PropTypes.object.isRequired,
};

export default Complete;
