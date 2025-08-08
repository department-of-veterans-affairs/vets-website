import { imageRootUri } from '../constants';

/**
 * @param {String} fieldValue value that is being validated
 */
export const getImageUri = fieldValue => {
  const folderNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let folderName = fieldValue
    ? fieldValue.replace(/^0+(?!$)/, '').substring(0, 1)
    : '';
  const fileName = `NDC${fieldValue}.jpg`;
  // check if the foldername is one of the listed folders. if not, set folder name to “other”
  if (!folderNames.includes(folderName)) {
    folderName = 'other';
  }

  return `${imageRootUri + folderName}/${fileName}`;
};
