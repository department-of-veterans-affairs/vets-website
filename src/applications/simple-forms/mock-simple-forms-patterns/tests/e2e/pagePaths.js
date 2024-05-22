import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  textInput: formChapters.textInput.pages.textInput.path,
  textEmailPhone: formChapters.textInput.pages.textEmailPhone.path,
  fullName: formChapters.textInput.pages.fullName.path,
  address: formChapters.textInput.pages.address.path,
  ssn: formChapters.textInput.pages.ssn.path,
  checkboxAndTextInput: formChapters.checkbox.pages.checkboxAndTextInput.path,
  checkboxGroup: formChapters.checkbox.pages.checkboxGroup.path,
  numberInput: formChapters.numberInput.pages.numberInput.path,
  select: formChapters.select.pages.select.path,
  radio: formChapters.radio.pages.radio.path,
  radioRelationshipToVeteran:
    formChapters.radio.pages.radioRelationshipToVeteran.path,
  date: formChapters.date.pages.date.path,
  arraySinglePage: formChapters.arraySinglePage.pages.arraySinglePage.path,
  arrayMultiPageAggregate:
    formChapters.arrayMultiPageAggregate.pages.multiPageStart.path,
  arrayMultiPageAggregateItem:
    formChapters.arrayMultiPageAggregate.pages.multiPageItem.path,
  arrayMultiPageBuilderFlow:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderChooseFlow.path,
  arrayMultiPageBuilderIntro:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderIntro.path,
  arrayMultiPageBuilderSummary:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummary.path,
  arrayMultiPageBuilderStepOne:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderStepOne.path,
  arrayMultiPageBuilderStepTwo:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderStepTwo.path,
};
