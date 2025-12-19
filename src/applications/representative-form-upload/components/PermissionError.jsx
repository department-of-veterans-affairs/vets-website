import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ITFClaimantStatusWrapper from './ITFClaimantStatusWrapper';

const PermissionError = ({ location, route, router }) => {
  const { data: formData } = useSelector(state => state.form);
  const prevUrl =
    formData.isVeteran === 'yes'
      ? '/submit-va-form-21-0966/veteran-information'
      : '/submit-va-form-21-0966/claimant-information';
  const goBack = useCallback(() => router.push(prevUrl), [
    formData,
    location.pathname,
    route.pageList,
    router,
  ]);

  return (
    <ITFClaimantStatusWrapper>
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          You don’t represent this claimant
        </h2>
        <p>
          This claimant may be in our system, but you can’t access their
          information or act on their behalf until you establish representation.
        </p>
        <va-link
          href="https://www.va.gov/representative/help#establishing-representation"
          text="Learn about establishing representation"
        />
      </va-alert>
      <va-link
        href="/representative/submissions"
        text="Go back to submissions"
        class="vads-u-display--block vads-u-margin-top--4 vads-u-margin-bottom--4"
      />
      <FormNavButtons goBack={goBack} />
    </ITFClaimantStatusWrapper>
  );
};

export default PermissionError;
