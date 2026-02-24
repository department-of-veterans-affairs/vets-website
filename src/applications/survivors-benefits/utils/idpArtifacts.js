import { apiRequest } from 'platform/utilities/api';
import { buildOutputUrl, buildDownloadUrl } from './idpEndpoints';

const ARTIFACT_TYPES = {
  DD214: 'DD214',
  DEATH: 'death',
};

const normalizeType = type => (type || '').toLowerCase();

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
