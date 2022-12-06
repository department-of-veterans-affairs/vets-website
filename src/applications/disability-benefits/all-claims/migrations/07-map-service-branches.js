import { migrateBranches } from '../utils/serviceBranches';

export default function mapServiceBranches(savedData) {
  return {
    formData: migrateBranches(savedData.formData),
    metadata: savedData.metadata,
  };
}
