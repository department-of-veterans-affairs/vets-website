import readAndCheckFile, { standardFileChecks } from './readAndCheckFile';
import checkTypeAndExtensionMatches, {
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
} from './checkTypeAndExtensionMatches';
import checkIsEncryptedPdf from './checkIsEncryptedPdf';
import {
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
} from './ShowPdfPassword';
import arrayIncludesArray from './arrayIncludesArray';
import reMapErrorMessage from './errorMessageMaps';
import validatePdfPassword from './validatePdfPassword';

export {
  readAndCheckFile,
  checkTypeAndExtensionMatches,
  arrayIncludesArray,
  fileTypeSignatures,
  FILE_TYPE_MISMATCH_ERROR,
  checkIsEncryptedPdf,
  ShowPdfPassword,
  PasswordLabel,
  PasswordSuccess,
  reMapErrorMessage,
  standardFileChecks,
  validatePdfPassword,
};
