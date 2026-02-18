import pollDocumentStatus from './idpStatus';
import fetchRelevantArtifacts from './idpArtifacts';
import { transformArtifactsToSections } from './idpTransformers';

export const processUploadedDocument = async (contract, options = {}) => {
  if (!contract?.id) {
    throw new Error('Invalid contract: missing document id.');
  }

  const status = await pollDocumentStatus(contract.id, options.polling);
  if (status?.scan_status !== 'completed') {
    throw new Error('Document processing did not complete successfully.');
  }

  const artifacts = await fetchRelevantArtifacts(contract.id);
  return transformArtifactsToSections(artifacts);
};

export default processUploadedDocument;
