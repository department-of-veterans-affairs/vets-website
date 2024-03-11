import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { usePostTravelClaims } from '../../../hooks/usePostTravelClaims';
import { setError } from '../../../actions/universal';
import { makeSelectForm } from '../../../selectors';
import Wrapper from '../../../components/layout/Wrapper';
import ExternalLink from '../../../components/ExternalLink';
import TravelClaimSuccessAlert from './TravelClaimSuccessAlert';

const Complete = () => {
  const { t } = useTranslation();
  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const { facilitiesToFile } = data;
  const dispatch = useDispatch();
  const { isLoading, travelPayClaimError } = usePostTravelClaims();

  useEffect(
    () => {
      if (travelPayClaimError) {
        dispatch(setError('completing-travel-submission'));
      }
    },
    [dispatch, travelPayClaimError],
  );
  if (isLoading) {
    return (
      <va-loading-indicator data-testid="loading-indicator" message="doin it" />
    );
  }
  return (
    <>
      <Wrapper
        pageTitle={t('were-processing-your-travel-claim', {
          count: facilitiesToFile.length,
        })}
        classNames="travel-page"
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

export default Complete;
