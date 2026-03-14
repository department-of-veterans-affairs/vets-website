import pollDocumentStatus from './status';
import { fetchArtifactSummary, downloadArtifactData } from './artifacts';
import { normalizeSections } from './transformers/normalize';
import { autoResolveArtifacts } from './utils/conflictDetection';
import { VETERAN_INFO_FIELDS, MILITARY_HISTORY_FIELDS } from './fieldMapping';

const ALL_FIELDS = [...VETERAN_INFO_FIELDS, ...MILITARY_HISTORY_FIELDS];

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

  const sections = await fetchRelevantArtifacts(contract.id);
  return normalizeSections(sections);
};

// Processes a document and immediately auto-resolves any artifact fields that
// are null/invalid against the current form data. Returns the resolved
// idpArtifacts object for the new file only.
export const processDocumentWithAutoResolve = async (
  contract,
  formData,
  existingFiles,
  options = {},
) => {
  const sections = await processDocument(contract, options);
  const tempFile = { idpArtifacts: sections };
  const allFiles = [...(existingFiles ?? []), tempFile];
  const resolved = autoResolveArtifacts(formData, allFiles, ALL_FIELDS);
  return resolved[resolved.length - 1].idpArtifacts;
};

export default processDocument;
