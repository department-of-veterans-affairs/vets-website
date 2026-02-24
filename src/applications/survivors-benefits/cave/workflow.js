import pollDocumentStatus from './status';
import { fetchArtifactSummary, downloadArtifactData } from './artifacts';
import { transformArtifactsToSections } from './transformers';

const ARTIFACT_TYPES = {
  DD214: 'DD214',
  DEATH: 'death',
};

const normalizeType = type => (type || '').toLowerCase();

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

export const processDocument = async (contract, options = {}) => {
  if (!contract?.id) {
    throw new Error('Invalid contract: missing document id.');
  }

  const status = await pollDocumentStatus(contract.id, options.polling);
  if (status?.scanStatus !== 'completed') {
    throw new Error('Document processing did not complete successfully.');
  }

  const artifacts = await fetchRelevantArtifacts(contract.id);
  return transformArtifactsToSections(artifacts);
};

export default processDocument;
