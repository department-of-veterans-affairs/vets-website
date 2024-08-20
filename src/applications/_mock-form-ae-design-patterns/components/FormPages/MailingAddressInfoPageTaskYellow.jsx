import React from 'react';
import AddressView from '@@vap-svc/components/AddressField/AddressView';
import { Link } from 'react-router';
import { selectVAPMailingAddress } from 'platform/user/selectors';
import { useSelector } from 'react-redux';
import { PrefillAlert } from '../PrefillAlert';

export const MailingAddressInfoPageTaskYellow = () => {
  const mailingAddress = useSelector(selectVAPMailingAddress);

  return (
    <div className="vads-u-margin-top--2">
      <PrefillAlert />

      <h3>Mailing address</h3>

      <p>
        We’ll send any important information about your application to this
        address.
      </p>

      <va-card background class="vads-u-padding-left--3">
        <p className="vads-u-font-weight--bold vads-u-font-family--serif vads-u-margin-y--1">
          Current mailing address
        </p>
        <AddressView data={mailingAddress} />

        <div className="vads-u-margin-y--1">
          <Link
            className="vads-u-font-weight--bold"
            to="/task-yellow/veteran-information/edit-mailing-address"
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
        </div>
      </va-card>
    </div>
  );
};
