import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  textInput: formChapters.textInput.pages.textInput.path,
  textEmailPhone: formChapters.textInput.pages.textEmailPhone.path,
  fullName: formChapters.textInput.pages.fullName.path,
  address: formChapters.textInput.pages.address.path,
  ssn: formChapters.textInput.pages.ssn.path,
  checkbox: formChapters.checkbox.pages.checkbox.path,
  checkboxGroup: formChapters.checkbox.pages.checkboxGroup.path,
  numberInput: formChapters.numberInput.pages.numberInput.path,
  select: formChapters.select.pages.select.path,
  radio: formChapters.radio.pages.radio.path,
  radioRelationshipToVeteran:
    formChapters.radio.pages.radioRelationshipToVeteran.path,
  date: formChapters.date.pages.date.path,
  internationalPhone:
    formChapters.internationalPhone.pages.internationalPhone.path,
  fileInput: formChapters.fileInput.pages.fileInput.path,
  fileInputMultiple:
    formChapters.fileInputMultiple.pages.fileInputMultiple.path,
  arraySinglePage: formChapters.arraySinglePage.pages.arraySinglePage.path,
  arrayMultiPageAggregate:
    formChapters.arrayMultiPageAggregate.pages.multiPageStart.path,
  arrayMultiPageAggregateItem:
    formChapters.arrayMultiPageAggregate.pages.multiPageItem.path,
  arrayMultiPageBuilderFlow:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderChooseFlow.path,
  // YesNo Question variation A (default for most tests)
  arrayMultiPageBuilderIntro:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderIntroA.path,
  arrayMultiPageBuilderSummary:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryA.path,
  // YesNo Question variation B
  arrayMultiPageBuilderIntroB:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderIntroB.path,
  arrayMultiPageBuilderSummaryB:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryB.path,
  // Add Button variations
  arrayMultiPageBuilderSummaryAddButton:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryAAddButton
      .path,
  arrayMultiPageBuilderSummaryBAddButton:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryBAddButton
      .path,
  // Add Link variations
  arrayMultiPageBuilderSummaryAddLink:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryAAddLink
      .path,
  arrayMultiPageBuilderSummaryBAddLink:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderSummaryBAddLink
      .path,
  // Item pages (shared across all variations)
  arrayMultiPageBuilderStepOne:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderStepOne.path,
  arrayMultiPageBuilderStepTwo:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderStepTwo.path,
  multiPageBuilderOptional:
    formChapters.arrayMultiPageBuilder.pages.multiPageBuilderOptional.path,
  serviceBranch: formChapters.serviceBranch.pages.serviceBranch.path,
};
