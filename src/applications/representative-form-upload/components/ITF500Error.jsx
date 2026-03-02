import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import ITFClaimantStatusWrapper from './ITFClaimantStatusWrapper';

const ITF500Error = ({ location, route, router }) => {
  const alertRef = useRef(null);
  const { data: formData } = useSelector(state => state.form);
  const type = formData.benefitType;
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

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo(alertRef.current);
        focusElement('h2', {}, alertRef.current);
      }
    },
    [alertRef],
  );

  const benefitCopy = ITFType => {
    switch (ITFType) {
      case 'compensation':
        return <span>disability compensation</span>;
      case 'pension':
        return <span>pension</span>;
      case 'survivor':
        return (
          <span>
            Survivors pension and/or dependency and indemnity compensation (DIC)
          </span>
        );
      default:
        return null;
    }
  };
  return (
    <ITFClaimantStatusWrapper>
      <va-alert
        ref={alertRef}
        close-btn-aria-label="Close notification"
        status="warning"
        visible
      >
        <h2 slot="headline">
          We can’t confirm whether this claimant already has an intent to file
        </h2>
        <p>
          We’re sorry. Our system currently can’t confirm whether this claimant
          already has an intent to file for {type && benefitCopy(type)}.
        </p>
        <p>
          Call us at <va-telephone contact="8552250709" /> to confirm an intent
          to file. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
          We can help submit an intent to file if there is none on record.
        </p>
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
ITF500Error.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};
export default ITF500Error;
