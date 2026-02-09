import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { getFormLink, inProgressApi } from 'platform/forms/helpers';

const NextStepsSection = () => {
  const [loading, setLoading] = useState(false);
  const [hasInProgress, setHasInProgress] = useState(false);

  const pensionLink = getFormLink('21P-527EZ');

  const NextSteps = () => (
    <>
      <p>
        You don’t need to reapply for Veterans Pension or DIC if you’re already
        receiving these benefits.
      </p>

      <h3>If you’re applying for Veterans Pension benefits</h3>
      <p>
        If you submitted this form as part of your Veterans Pension application,
        you can return to the online form to complete your application.
      </p>
      <va-link
        href={pensionLink}
        text="Continue your Veterans Pension application"
      />

      <h3>If you’re applying for DIC benefits</h3>
      <p>
        If you submitted this form as part of your DIC application, you can
        submit your completed DIC application by mail or in person.
      </p>
      <va-link
        href="https://www.va.gov/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation/"
        text="Apply for DIC compensation"
      />
    </>
  );

  useEffect(() => {
    let isMounted = true;

    const checkInProgress = async () => {
      setLoading(true);
      try {
        await apiRequest(inProgressApi('21P-527EZ'));
        if (isMounted) {
          setHasInProgress(true);
        }
      } catch (e) {
        // Any failure → log and gracefully fall back to NextSteps content
        /* eslint-disable no-console */
        console.warn('Failed to check in-progress 21P-527EZ:', e);
        /* eslint-enable no-console */
        if (isMounted) {
          setHasInProgress(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkInProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section>
      <h2>What to do next</h2>
      {loading && (
        <va-loading-indicator message="Checking your in-progress applications…" />
      )}

      {!loading && (
        <>
          {hasInProgress ? (
            <>
              <p>
                You have an in-progress Pension benefits application. You can
                return to the online form to complete your application.
              </p>
              <va-link-action
                href={pensionLink}
                text="Continue Veterans Pension application"
              />
            </>
          ) : (
            <NextSteps />
          )}
        </>
      )}
    </section>
  );
};

export default NextStepsSection;
