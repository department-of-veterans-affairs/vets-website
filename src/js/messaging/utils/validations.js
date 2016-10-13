import {
  isNotBlank,
  validateIfDirty
} from '../../common/utils/validations';

import {
  makeField
} from '../../common/model/fields';


export function validateNumAttachments(files, maxAttachments) {
  return files.length > maxAttachments;
}

export function validateFileSize(files, max) {
  return !!files.find((file) => { return file.size > max; });
}

export function validateTotalFileSize(files, max) {
  const total = files.reduce((sum, file) => {
    return sum + file.size;
  }, 0);
  return total > max;
}

export function isValidCategory(category) {
  return validateIfDirty(category, isNotBlank);
}

export function isValidMessageBody(messageBody) {
  return validateIfDirty(messageBody, isNotBlank);
}

export function isValidRecipient(recipient) {
  return validateIfDirty(recipient, isNotBlank);
}

export function isValidSubject(category, subject) {
  if (category.value !== 'OTHER') {
    return true;
  }
  return validateIfDirty(makeField(subject.value, true), isNotBlank);
}

export function isValidSubjectLine(category, subject) {
  const err = { hasError: false };
  if (!isValidCategory(category)) {
    err.hasError = true;
    err.type = 'category';
  }
  if (!isValidSubject(category, subject)) {
    err.hasError = true;
    err.type = 'subject';
  }
  return err;
}
