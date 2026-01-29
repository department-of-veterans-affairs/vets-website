import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { scrollTo } from 'platform/utilities/scroll';
import { waitForRenderThenFocus } from 'platform/utilities/ui/focus';
import PropTypes from 'prop-types';
import { benefitCopy } from '../helpers/index';

export const ConfirmationPageViewITF = ({
  submitDate,
  expirationDate,
  benefitType,
  address,
  name,
}) => {
  const { first, last } = name;
  const alertRef = useRef(null);

  const formattedSubmitDate =
    submitDate && typeof submitDate === 'object'
      ? format(submitDate, 'MMMM d, yyyy')
      : null;

  const formattedExpirationDateTime =
    expirationDate && typeof expirationDate === 'object'
      ? format(expirationDate, "MMMM d, yyyy 'at' h:mm aaaa 'ET'")
      : null;

  const formattedAddress =
    address && address.city && address.state && address.postalCode
      ? `${address.city}, ${address.state} ${address.postalCode}`
      : null;

  useEffect(
    () => {
      if (alertRef?.current) {
        scrollTo('topScrollElement');
        // delay focus for Safari
        waitForRenderThenFocus('h2', alertRef.current);
      }
    },
    [alertRef],
  );

  return (
    <div>
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
      </div>
      {submitDate && (
        <va-alert status="success" ref={alertRef}>
          <h2 slot="headline">We recorded the intent to file</h2>
          {formattedExpirationDateTime ? (
            <p className="vads-u-margin-y--0">
              Submit the claim by <strong>{formattedExpirationDateTime}</strong>{' '}
              to receive payments starting from the effective date.
            </p>
          ) : null}
        </va-alert>
      )}
      <p className="vads-u-margin-top--4">
        This information was recorded for the new intent to file.
      </p>
      <va-card>
        <h2 className="vads-u-margin--0 vads-u-font-size--h3">
          {last}, {first}
        </h2>
        {formattedAddress && <div>{formattedAddress}</div>}
        <p className="vads-u-margin-bottom--0">
          <b>Benefit:</b> {benefitType && benefitCopy(benefitType)}
          <br />
          <b>ITF Date:</b> {formattedSubmitDate} (Expires in 365 days)
        </p>
      </va-card>
      <section>
        <h2 className="vads-u-margin-top--4">What to expect</h2>
        <va-process-list>
          <va-process-list-item header="We'll confirm the intent to file was recorded" />
          <va-process-list-item
            header="Submit the claim prior to ITF expiration date"
            class="vads-u-padding-bottom--3"
          >
            <p>
              You should submit the claim as soon as possible. The intent to
              file for {benefitType && benefitCopy(benefitType)} expires one
              year from today.
            </p>
          </va-process-list-item>
        </va-process-list>
      </section>
      <va-link-action
        href="/representative/submissions"
        label="Go back to submissions"
        class="vads-u-margin-bottom--4"
        text="Go back to submissions"
        type="primary"
      />
    </div>
  );
};

ConfirmationPageViewITF.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    postalCode: PropTypes.string,
    state: PropTypes.string,
  }),
  benefitType: PropTypes.string,
  expirationDate: PropTypes.string,
  name: PropTypes.shape({
    first: PropTypes.string,
    last: PropTypes.string,
  }),
  submitDate: PropTypes.string,
};
