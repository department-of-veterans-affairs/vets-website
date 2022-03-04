import { isValidFileType } from '../../validations';

export const addFile = (file, documentType, state, setState, reader) => {
  // dispatch({ type: actions.FILE_UPLOAD_PENDING });
  if (!isValidFileType(file)) {
    setState({
      ...state,
      files: [],
      errorMessage: 'Please choose a file from one of the accepted file types.',
      submissionPending: false,
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
    setState({
      ...state,
      files: [...state.files, fileObject],
      errorMessage: null,
    });
  };
};
