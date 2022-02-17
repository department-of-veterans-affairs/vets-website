import moment from 'moment';

import { getAppUrl } from 'platform/utilities/registry-helpers';

export const formatDate = date => moment(date).format('MMMM DD, YYYY');

export const introUrl = `${getAppUrl('coe')}/introduction`;
export const statusUrl = getAppUrl('coe-status');
