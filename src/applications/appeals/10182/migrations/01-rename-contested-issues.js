import cloneDeep from 'platform/utilities/data/cloneDeep';

/**
 * Renaming `contestableIssues` (used only by NOD) to `contestedIssues`
 * (used by NOD & SC) so we can move code common to all 3 apps into the shared
 * folder
 */
export default function renameContestedIssues(savedData) {
  const { formData, metadata } = savedData;

  if (Array.isArray(formData.contestedIssues)) {
    return savedData;
  }
  const newFormData = cloneDeep(formData);
  const contestedIssues = formData.contestableIssues || [];
  delete newFormData.contestableIssues;

  return {
    formData: { ...newFormData, contestedIssues },
    metadata,
  };
}
