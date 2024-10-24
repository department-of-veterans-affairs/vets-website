import environment from 'platform/utilities/environment';

export const TITLE = 'Order medical supplies';
export const SUBTITLE = '';

export const MDOT_API_URL = `${environment.API_URL}/v0/in_progress_forms/mdot`;
export const MDOT_API_STATES = Object.freeze({
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  PENDING: 'PENDING',
});
