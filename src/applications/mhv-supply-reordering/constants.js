import React from 'react';
import environment from 'platform/utilities/environment';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

export const TITLE = 'Order medical supplies';
export const SUBTITLE =
  'Use this form to order hearing aid batteries and accessories, and CPAP supplies.';

export const MDOT_API_URL = `${environment.API_URL}/v0/in_progress_forms/mdot`;
export const MDOT_API_STATES = Object.freeze({
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
});

export const customerServiceTelephone = (
  <>
    <va-telephone contact="3032736200">303-273-6200</va-telephone>(
    <va-telephone contact={CONTACTS['711']} tty />)
  </>
);
