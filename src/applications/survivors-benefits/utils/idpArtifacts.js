import { buildOutputUrl, buildDownloadUrl } from './idpEndpoints';

const ARTIFACT_TYPES = {
  DD214: 'DD214',
  DEATH: 'death',
};

const normalizeType = type => (type || '').toLowerCase();

const fetchJson = async url => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed (${response.status}): ${body || response.statusText}`,
    );
  }
  return response.json();
};

export const fetchArtifactSummary = async documentId => {
  return fetchJson(buildOutputUrl(documentId, 'artifact'));
};

export const downloadArtifactData = async (documentId, kvpId) => {
  return fetchJson(buildDownloadUrl(documentId, kvpId));
};

export const fetchRelevantArtifacts = async documentId => {
  const summary = await fetchArtifactSummary(documentId);
  const forms = summary?.forms || [];

  const dd214Forms = forms.filter(
    form =>
      normalizeType(form?.artifactType) === normalizeType(ARTIFACT_TYPES.DD214),
  );
  const deathForms = forms.filter(
    form =>
      normalizeType(form?.artifactType) === normalizeType(ARTIFACT_TYPES.DEATH),
  );

  const [dd214Data, deathData] = await Promise.all([
    Promise.all(
      dd214Forms.map(form =>
        downloadArtifactData(documentId, form?.mmsArtifactValidationId),
      ),
    ),
    Promise.all(
      deathForms.map(form =>
        downloadArtifactData(documentId, form?.mmsArtifactValidationId),
      ),
    ),
  ]);

  return {
    dd214: dd214Data.filter(Boolean),
    deathCertificates: deathData.filter(Boolean),
  };
};

export default fetchRelevantArtifacts;
