import React from 'react';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import { EffectiveDateViewField } from '../helpers';

export const forwardingAddressCheckboxLabel =
  'My address will be changing soon';

export const forwardingAddressCheckboxDescription = `
  If you give us a temporary or forwarding address, we’ll look at the dates
  you provide to see if we need to use this address when contacting you about
  your Higher-Level Review.`;

export const ForwardingAddressReviewWidget = ({ value }) =>
  value ? 'Yes' : 'No';

export const ForwardingAddressDescription = () => (
  <p className="help-talk">{forwardingAddressCheckboxDescription}</p>
);

export const ForwardingAddressViewField = ({ formData }) => (
  <>
    <EffectiveDateViewField formData={formData} />
    <AddressViewField formData={formData} />
  </>
);
