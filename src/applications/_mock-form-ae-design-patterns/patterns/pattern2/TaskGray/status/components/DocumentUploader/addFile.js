import { isValidFileType } from '../../validations';

export const addFile = (file, state, setState) => {
  let docType = '';
  if (!isValidFileType(file)) {
    setState({
      ...state,
      files: [],
      errorMessage: 'Choose a file from one of the accepted file types.',
      submissionPending: false,
    });
    return;
  }

  if (state.documentType === 'Other') {
    docType = state.documentDescription;
  } else {
    docType = state.documentType;
  }
  const fileName = file.name;
  const fileType = fileName.substr(fileName.length - 3);
  state.reader.readAsDataURL(file);
  // eslint-disable-next-line no-param-reassign
  state.reader.onloadend = () => {
    const base64String = state.reader.result;
    const fileObject = {
      file: base64String,
      documentType: docType,
      fileType,
      fileName,
    };
    setState({
      ...state,
      documentType: '',
      documentDescription: '',
      files: [...state.files, fileObject],
      errorMessage: null,
    });
  };
};
