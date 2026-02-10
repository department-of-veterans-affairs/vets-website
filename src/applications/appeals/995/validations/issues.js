import {
  getIssueDate,
  getIssueName,
  getSelected,
} from '../../shared/utils/issues';
import { missingIssueName } from '../../shared/validations/issues';
import { validateDecisionDate } from '../../shared/validations/date';

export const checkIssues = (
  errors,
  _fieldData,
  formData,
  _schema,
  _uiSchema,
  _index,
  appStateData,
) => {
  const data = Object.keys(appStateData || {}).length ? appStateData : formData;
  // Only use selected in case an API loaded issues includes an invalid date
  getSelected(data).forEach(issue => {
    missingIssueName(errors, getIssueName(issue));
    validateDecisionDate(errors, getIssueDate(issue));
  });
};
