import React, { useEffect, useState } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

const VaLink = () => (
  <va-link
    href="https://va.gov/pension/veterans-pension-rates"
    text="Review current pension rates for Veterans"
  />
);

const DisabilityRatingAlert = () => {
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDisabilityRating = async () => {
      try {
        const response = await apiRequest(
          `${environment.API_URL}/v0/rated_disabilities`,
        );
        if (isMounted) {
          const combinedDisabilityRating =
            response?.data?.attributes?.combinedDisabilityRating;
          setRating(combinedDisabilityRating ?? 0);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDisabilityRating();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <va-loading-indicator message="Checking your disability rating..." />
    );
  }

  if (error) {
    dataDogLogger({
      message: 'Pension disability rating fetch error',
      attributes: {
        error: error?.message || 'unknown error',
        state: 'visible',
        alertType: 'info',
      },
    });
    return (
      <va-alert visible>
        <h2 slot="headline">
          Consider your disability rating before you apply
        </h2>
        <p className="vads-u-margin-y--0">
          If you have a 100% service-connected disability rating, applying for
          Veterans Pension is unlikely to increase your monthly payments. We
          always pay the higher payment amount.
        </p>
        <p className="vads-u-margin-bottom--0">
          <VaLink />
        </p>
      </va-alert>
    );
  }

  if (rating !== 100) {
    dataDogLogger({
      message:
        'Pension disability rating alert hidden for ratings less than 100',
      attributes: {
        error: null,
        state: 'hidden',
        alertType: null,
      },
    });
    return null;
  }

  dataDogLogger({
    message: 'Pension disability rating alert visible for 100 rating',
    attributes: {
      error: null,
      state: 'visible',
      alertType: 'warning',
    },
  });

  return (
    <va-alert status="warning" visible>
      <h2 slot="headline">
        Applying likely won’t increase your monthly payments
      </h2>
      <p className="vads-u-margin-y--0">
        Our records show you have a 100% service-connected disability rating.
        Your monthly disability compensation payment is higher than a Veterans
        Pension payment in most cases.
      </p>
      <p>
        We always pay the higher payment amount. So applying for a Veterans
        Pension will only increase your payment in certain situations, like if
        you live in a Medicaid-approved nursing home.
      </p>
      <p className="vads-u-margin-bottom--0">
        <VaLink />
      </p>
    </va-alert>
  );
};

export default DisabilityRatingAlert;
