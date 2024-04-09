import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { usePostTravelClaims } from '../../../hooks/usePostTravelClaims';
import { useUpdateError } from '../../../hooks/useUpdateError';
import { makeSelectForm } from '../../../selectors';
import Wrapper from '../../../components/layout/Wrapper';
import ExternalLink from '../../../components/ExternalLink';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';

const Complete = props => {
  const { router } = props;
  const { t } = useTranslation();
  const selectForm = useMemo(makeSelectForm, []);
  const { updateError } = useUpdateError();
  const { data } = useSelector(selectForm);
  const { facilitiesToFile } = data;
  const { isLoading, travelPayClaimError } = usePostTravelClaims({ router });

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
        pageTitle={t('were-processing-your-travel-claim', {
          count: facilitiesToFile.length,
        })}
        classNames="travel-page"
        testID="travel-complete-page"
      >
        <TravelClaimSuccessAlert claims={facilitiesToFile} />
        <div data-testid="travel-complete-content">
          <p>
            <Trans
              i18nKey="to-file-another-claim-for-today"
              components={[
                <span key="bold" className="vads-u-font-weight--bold" />,
              ]}
            />
          </p>
          <p>{t('or-you-can-still-file-your-claim')}</p>
        </div>
        <ExternalLink
          key="link"
          href="https://www.va.gov/health-care/get-reimbursed-for-travel-pay/"
          hrefLang="en"
          eventId="travel-claim-info-clicked"
          eventPrefix="nav"
          dataTestId="travel-info-external-link"
        >
          {t('find-out-how-to-file--link')}
        </ExternalLink>
      </Wrapper>
    </>
  );
};

Complete.propTypes = {
  router: PropTypes.object.isRequired,
};

export default Complete;
