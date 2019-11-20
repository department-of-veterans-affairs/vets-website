import React from 'react';
import { AddressViewField } from '../../all-claims/utils';
import { EffectiveDateViewField } from '../helpers';

export const forwardingAddressCheckboxLabel =
  'My address will be changing soon.';

export const ForwardingAddressDescription = () => (
  <p className="help-talk">
    If you give us a temporary or forwarding address, we’ll look at the dates
    you provide to see if we need to use this address when contacting you about
    your Higher-Level Review.
  </p>
);

export const ForwardingAddressViewField = ({ formData }) => (
  <>
    <EffectiveDateViewField formData={formData} />
    <AddressViewField formData={formData} />
  </>
);
