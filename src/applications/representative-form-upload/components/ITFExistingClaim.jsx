import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { formatDateParsedZoneLong } from 'platform/utilities/date/index';
import { focusElement } from 'platform/utilities/ui';
import { scrollTo } from 'platform/utilities/scroll';
import ITFClaimantStatusWrapper from './ITFClaimantStatusWrapper';
import { expiresIn, expiresSoonIcon, benefitCopy } from '../helpers/index';

const ITFExistingClaim = ({ location, route, router }) => {
  const alertRef = useRef(null);
  const { data: formData } = useSelector(state => state.form);
  const { expirationDate, type } = formData['view:activeITF'].attributes;

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
        <h2 slot="headline">This claimant has an intent to file</h2>
        <p>
          The current intent to file has to expire before you can submit a new
          one in the portal.
        </p>
      </va-alert>
      <va-card class="form__itf-card vads-u-margin-top--2">
        <h3 className="vads-u-margin-y--0">
          {formData?.veteranFullName?.last}, {formData?.veteranFullName?.first}
        </h3>
        <p className="vads-u-margin-bottom--0">
          <strong>Benefit:</strong> {type && benefitCopy(type)}
        </p>
        <p className="vads-u-margin-y--0 vads-u-display--flex vads-u-align-items--center">
          <strong>ITF Date:</strong>{' '}
          {expirationDate && expiresSoonIcon(expirationDate)}
          <span className="form__itf-card--date">
            {expirationDate && formatDateParsedZoneLong(expirationDate)}{' '}
            {expirationDate && expiresIn(expirationDate)}
          </span>
        </p>
      </va-card>
      <va-link
        href="/representative/submissions"
        text="Go back to submissions"
        class="vads-u-display--block vads-u-margin-top--4 vads-u-margin-bottom--4"
      />
      <FormNavButtons goBack={goBack} />
    </ITFClaimantStatusWrapper>
  );
};
ITFExistingClaim.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
  router: PropTypes.object,
};
export default ITFExistingClaim;
