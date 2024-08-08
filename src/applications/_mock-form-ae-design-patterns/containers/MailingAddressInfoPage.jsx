import React from 'react';
import AddressView from '@@vap-svc/components/AddressField/AddressView';
import { Link } from 'react-router';
import { selectVAPMailingAddress } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import { BorderedInfoSection } from '../components/BorderedInfoSection';

export const MailingAddressInfoPage = () => {
  const mailingAddress = useSelector(selectVAPMailingAddress);

  return (
    <>
      <h4 className="vads-u-font-size--h3">Mailing address</h4>

      <p>
        We’ll send any important information about your application to this
        address.
      </p>

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
        </Link>
      </BorderedInfoSection>
    </>
  );
};
