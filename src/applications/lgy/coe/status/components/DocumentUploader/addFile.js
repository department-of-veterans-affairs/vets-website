import { isValidFileType } from '../../validations';

export const addFile = (file, documentType, dispatch, actions, reader) => {
  dispatch({ type: actions.FILE_UPLOAD_PENDING });
  if (!isValidFileType(file)) {
    dispatch({
      type: actions.FILE_UPLOAD_FAIL,
      errorMessage: 'Please choose a file from one of the accepted file types.',
    });
    return;
  }
  const fileName = file.name;
  const fileType = fileName.substr(fileName.length - 3);
  reader.readAsDataURL(file);
  // eslint-disable-next-line no-param-reassign
  reader.onloadend = () => {
    const base64String = reader.result;
    const fileObject = {
      file: base64String,
      documentType,
      fileType,
      fileName,
    };
    dispatch({
      type: actions.FILE_UPLOAD_SUCCESS,
      file: fileObject,
    });
  };
};
