import { apiRequest } from 'platform/utilities/api';
import { buildOutputUrl, buildDownloadUrl } from './endpoints';

export const fetchArtifactSummary = async documentId => {
  return apiRequest(buildOutputUrl(documentId, 'artifact'));
};

export const downloadArtifactData = async (documentId, kvpId) => {
  return apiRequest(buildDownloadUrl(documentId, kvpId), {
    headers: {
      'X-Key-Inflection': 'snake',
    },
  });
};
