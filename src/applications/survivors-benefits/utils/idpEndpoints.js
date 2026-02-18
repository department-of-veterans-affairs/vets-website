import environment from 'platform/utilities/environment';

const BASE_URL = `${environment.API_URL}/v0/idp_documents`;

const encodeIdSegment = id => encodeURIComponent(id);

export const buildIntakeUrl = () => BASE_URL;

export const buildStatusUrl = id => `${BASE_URL}/${encodeIdSegment(id)}/status`;

export const buildOutputUrl = (id, type = 'artifact') =>
  `${BASE_URL}/${encodeIdSegment(id)}/output?type=${encodeURIComponent(type)}`;

export const buildDownloadUrl = (id, kvpId) =>
  `${BASE_URL}/${encodeIdSegment(id)}/download?kvpid=${encodeURIComponent(
    kvpId,
  )}`;
