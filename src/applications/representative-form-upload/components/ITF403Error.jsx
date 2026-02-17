import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import ITFClaimantStatusWrapper from './ITFClaimantStatusWrapper';

const ITF403Error = ({ location, route, router }) => {
  const alertRef = useRef(null);
  const { data: formData } = useSelector(state => state.form);
  const prevUrl =
    formData.isVeteran === 'yes'
      ? '/submit-va-form-21-0966/veteran-information'
      : '/submit-va-form-21-0966/claimant-information';
  const goBack = useCallback(
    () => router.push(prevUrl),
    [formData, location.pathname, route.pageList, router],
  );

  useEffect(() => {
    if (alertRef?.current) {
      scrollTo(alertRef.current);
      focusElement('h2', {}, alertRef.current);
    }
  }, [alertRef]);

  return (
    <ITFClaimantStatusWrapper>
      <va-alert
        ref={alertRef}
        close-btn-aria-label="Close notification"
        status="info"
        visible
      >
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
ITF403Error.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};
export default ITF403Error;
