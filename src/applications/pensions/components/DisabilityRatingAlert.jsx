import React, { useEffect, useState } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

const VaLink = () => (
  <va-link
    href="https://va.gov/pension/veterans-pension-rates"
    text="View Veterans Pension rates"
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
          A 100% disability rating pays more than a Veterans Pension
        </h2>
        <p className="vads-u-margin-y--0">
          Veterans with a 100% disability rating get a higher payment from
          disability compensation than from a Veterans Pension. If you have this
          rating, applying for a Veterans Pension won’t increase your monthly
          payments.
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
        You’re unlikely to get a higher payment from a Veterans Pension
      </h2>
      <p className="vads-u-margin-y--0">
        Our records show you have a 100% disability rating. Your current monthly
        payment is higher than a Veterans Pension payment. You can still apply,
        but your payments won’t increase.
      </p>
      <p className="vads-u-margin-bottom--0">
        <VaLink />
      </p>
    </va-alert>
  );
};

export default DisabilityRatingAlert;
