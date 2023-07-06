import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  textInput: formChapters.textInput.pages.textInput.path,
  textInputWidgets1: formChapters.textInput.pages.textInputWidgets1.path,
  textInputFullName: formChapters.textInput.pages.textInputFullName.path,
  textInputAddress: formChapters.textInput.pages.textInputAddress.path,
  textInputSsn: formChapters.textInput.pages.textInputSsn.path,
  checkboxAndTextInput: formChapters.checkbox.pages.checkboxAndTextInput.path,
  select: formChapters.select.pages.select.path,
  radio: formChapters.radio.pages.radio.path,
  radioRelationshipToVeteran:
    formChapters.radio.pages.radioRelationshipToVeteran.path,
  date: formChapters.date.pages.date.path,
};
