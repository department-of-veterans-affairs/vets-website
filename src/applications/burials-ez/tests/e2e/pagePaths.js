import formConfig from '../../config/form';

const formChapters = formConfig.chapters;
export default {
  mailingAddress: formChapters.claimantInformation.pages.mailingAddress.path,
  separationDocuments:
    formChapters.militaryHistory.pages.separationDocuments.path,
  previousNamesQuestion:
    formChapters.militaryHistory.pages.previousNamesQuestion.path,
  benefitsSelection:
    formChapters.benefitsSelection.pages.benefitsSelection.path,
  burialAllowancePartOne:
    formChapters.benefitsSelection.pages.burialAllowancePartOne.path,
  burialAllowancePartTwo:
    formChapters.benefitsSelection.pages.burialAllowancePartTwo.path,
  finalRestingPlace:
    formChapters.benefitsSelection.pages.finalRestingPlace.path,
  cemeteryLocationQuestion:
    formChapters.benefitsSelection.pages.cemeteryLocationQuestion.path,
};
