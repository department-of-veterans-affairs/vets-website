import { apiRequest } from 'platform/utilities/api';

const COE_DOCUMENTS_URI = '/coe/documents';

export const getCoeDocuments = async () => {
  try {
    const response = await apiRequest(COE_DOCUMENTS_URI);
    return response.data.attributes;
  } catch (error) {
    return Promise.reject(error);
  }
};
