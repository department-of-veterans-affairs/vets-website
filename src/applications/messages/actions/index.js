import { apiRequest } from 'platform/utilities/api';

export const FETCH_INQUIRIES = 'FETCH_INQUIRIES';

const getInquiries = async () => {
  return apiRequest('/messages/inquiries');
};

export const fetchInquiries = () => {
  const data = getInquiries();
  return {
    type: FETCH_INQUIRIES,
    data,
  };
};
