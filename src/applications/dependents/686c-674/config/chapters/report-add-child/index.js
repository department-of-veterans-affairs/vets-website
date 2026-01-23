import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { isChapterFieldRequired } from '../../helpers';
import { TASK_KEYS } from '../../constants';
import { intro } from './intro';
import { summary } from './summary';
import { information } from './information';
import { arrayBuilderOptions } from './config';
import { identification } from './identification';
import { placeOfBirth } from './placeOfBirth';
import { relationshipType } from './relationshipType';
import { stepchild } from './stepchild';
import { additionalInformationPartOne } from './additionalInformationPartOne';
import { additionalInformationPartTwo } from './additionalInformationPartTwo';
import { childAddressPartOne } from './childAddressPartOne';
import { childAddressPartTwo } from './childAddressPartTwo';
import { marriageEndDetails } from './marriageEndDetails';
import { disabilityPartOne } from './disabilityPartOne';
import { disabilityPartTwo } from './disabilityPartTwo';
import { showPensionRelatedQuestions } from '../../utilities';

const shouldIncludePage = formData => {
  return (
    formData?.['view:addOrRemoveDependents']?.add &&
    (isChapterFieldRequired(formData, TASK_KEYS.addChild) ||
      isChapterFieldRequired(formData, TASK_KEYS.addDisabledChild))
  );
};

const chapterPages = arrayBuilderPages(arrayBuilderOptions, pages => {
  return {
    addChildIntro: pages.introPage({
      depends: shouldIncludePage,
      title: 'Add child',
      path: '686-report-add-child',
      uiSchema: intro.uiSchema,
      schema: intro.schema,
    }),
    addChildSummary: pages.summaryPage({
      depends: shouldIncludePage,
      title: 'Add child Summary',
      path: '686-report-add-child/summary',
      uiSchema: summary.uiSchema,
      schema: summary.schema,
    }),
    addChildInformation: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Add child Information',
      path: '686-report-add-child/:index/information',
      uiSchema: information.uiSchema,
      schema: information.schema,
    }),
    addChildIdentification: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Child’s Identification',
      path: '686-report-add-child/:index/identification',
      uiSchema: identification.uiSchema,
      schema: identification.schema,
    }),
    addChildPlaceOfBirth: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Child’s Place of Birth',
      path: '686-report-add-child/:index/place-of-birth',
      uiSchema: placeOfBirth.uiSchema,
      schema: placeOfBirth.schema,
    }),
    addChildRelationshipType: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Your relationship to this child',
      path: '686-report-add-child/:index/relationship-to-child',
      uiSchema: relationshipType.uiSchema,
      schema: relationshipType.schema,
    }),
    addChildStepchild: pages.itemPage({
      depends: (formData, index) => {
        if (!shouldIncludePage(formData)) {
          return false;
        }
        return (
          formData?.childrenToAdd?.[index]?.isBiologicalChild === false &&
          formData?.childrenToAdd?.[index]?.relationshipToChild?.stepchild
        );
      },
      title: 'Child’s biological parents',
      path: '686-report-add-child/:index/stepchild',
      uiSchema: stepchild.uiSchema,
      schema: stepchild.schema,
    }),
    disabilityPartOne: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Child’s disability',
      path: '686-report-add-child/:index/disability-part-one',
      uiSchema: disabilityPartOne.uiSchema,
      schema: disabilityPartOne.schema,
    }),
    disabilityPartTwo: pages.itemPage({
      depends: (formData, index) => {
        if (!shouldIncludePage(formData)) {
          return false;
        }
        return formData?.childrenToAdd?.[index]?.doesChildHaveDisability;
      },
      title: 'Child’s disability',
      path: '686-report-add-child/:index/disability-part-two',
      uiSchema: disabilityPartTwo.uiSchema,
      schema: disabilityPartTwo.schema,
    }),
    addChildAdditionalInformationPartOne: pages.itemPage({
      depends: shouldIncludePage,
      title: 'Additional information needed to add child',
      path: '686-report-add-child/:index/additional-information-part-one',
      uiSchema: additionalInformationPartOne.uiSchema,
      schema: additionalInformationPartOne.schema,
    }),
    addChildMarriageEndDetails: pages.itemPage({
      depends: (formData, index) =>
        shouldIncludePage(formData) &&
        formData?.childrenToAdd[index]?.hasChildEverBeenMarried,
      title: 'How and when marriage ended',
      path: '686-report-add-child/:index/marriage-end-details',
      uiSchema: marriageEndDetails.uiSchema,
      schema: marriageEndDetails.schema,
    }),
    addChildAdditionalInformationPartTwo: pages.itemPage({
      depends: formData =>
        shouldIncludePage(formData) && showPensionRelatedQuestions(formData),
      title: 'Additional information needed to add child',
      path: '686-report-add-child/:index/additional-information-part-two',
      uiSchema: additionalInformationPartTwo.uiSchema,
      schema: additionalInformationPartTwo.schema,
    }),
    addChildChildAddressPartOne: pages.itemPage({
      depends: (formData, index) =>
        shouldIncludePage(formData) &&
        !formData?.childrenToAdd?.[index]?.doesChildLiveWithYou,
      title: 'Child’s Address',
      path: '686-report-add-child/:index/child-address-part-one',
      uiSchema: childAddressPartOne.uiSchema,
      schema: childAddressPartOne.schema,
    }),
    addChildChildAddressPartTwo: pages.itemPage({
      depends: (formData, index) =>
        shouldIncludePage(formData) &&
        !formData?.childrenToAdd?.[index]?.doesChildLiveWithYou,
      title: 'Child’s Address',
      path: '686-report-add-child/:index/child-address-part-two',
      uiSchema: childAddressPartTwo.uiSchema,
      schema: childAddressPartTwo.schema,
    }),
  };
});

export default {
  title: 'Add one or more children',
  pages: {
    ...chapterPages,
  },
};
