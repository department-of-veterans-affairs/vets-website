import React, { useEffect, useState } from 'react';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const DisabilityRatingAlert = () => {
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDisabilityRating = async () => {
      try {
        const data = await apiRequest(
          `${environment.API_URL}/v0/disability_compensation_form/rating_info`,
        );
        if (isMounted) {
          setRating(data?.user_percent_of_disability ?? 0);
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
    return (
      <va-alert visible>
        <h2 slot="headline">
          Consider your disability rating before you apply
        </h2>
        <p className="vads-u-margin-y--0">
          If you have a 100% disability rating, applying for Veterans Pension is
          unlikely to increase your monthly payments.
        </p>
      </va-alert>
    );
  }

  if (rating !== 100) {
    return null;
  }

  return (
    <va-alert status="warning" visible>
      <h2 slot="headline">
        This benefit is unlikely to increase your payments
      </h2>
      <p className="vads-u-margin-y--0">
        Because you have a{' '}
        <va-link
          href="https://va.gov/disability/view-disability-rating/rating"
          text="100% disability rating"
        />
        , your current compensation rate is higher than what you could receive
        from Veterans Pension. You can still apply, but it’s unlikely to
        increase your monthly payments.
      </p>
    </va-alert>
  );
};

export default DisabilityRatingAlert;
