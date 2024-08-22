import React from 'react';
import AddressView from '@@vap-svc/components/AddressField/AddressView';
import { Link } from 'react-router';
import { selectVAPMailingAddress } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import { BorderedInfoSection } from '../BorderedInfoSection';
import { MailingAddressSaveSuccessAlert } from '../FormAlerts/MailingAddressSaveSuccessAlert';

export const MailingAddressInfoPageTaskGreen = () => {
  const mailingAddress = useSelector(selectVAPMailingAddress);

  const showSuccessAlert = window.sessionStorage.getItem(
    'onReviewPageContactInfoEdit',
  );

  return (
    <>
      <h3>Mailing address</h3>

      <p>
        We’ll send any important information about your application to this
        address.
      </p>

      {showSuccessAlert &&
        showSuccessAlert === 'address,updated' && (
          <MailingAddressSaveSuccessAlert />
        )}

      <BorderedInfoSection>
        <span className="vads-u-font-weight--bold">Mailing Address</span>
        <AddressView data={mailingAddress} />

        <Link
          className="vads-u-font-weight--bold"
          to="/task-green/veteran-information/edit-mailing-address"
          aria-label="Edit mailing address"
        >
          Edit{' '}
          <span className="vads-u-visibility--screen-reader">
            your mailing address
          </span>
          <va-icon
            icon="chevron_right"
            size="2"
            style={{ position: 'relative', top: '-5px', left: '-1px' }}
          />
        </Link>
      </BorderedInfoSection>
    </>
  );
};
