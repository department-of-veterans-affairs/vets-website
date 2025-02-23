import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { isChapterFieldRequired } from '../../helpers';
import { TASK_KEYS } from '../../constants';
import { intro } from './intro';
import { summary } from './summary';
import { information } from './information';
import { arrayBuilderOptions } from './config';
import { identification } from './identification';
import { placeOfBirth } from './placeOfBirth';
import { relationship } from './relationship';
import { stepchild } from './stepchild';
import { additionalInformationPartOne } from './additionalInformationPartOne';
import { additionalInformationPartTwo } from './additionalInformationPartTwo';
import { childAddressPartOne } from './childAddressPartOne';
import { childAddressPartTwo } from './childAddressPartTwo';
import { marriageEndDetails } from './marriageEndDetails';
import { marriageEndDescription } from './marriageEndDescription';

const chapterPages = arrayBuilderPages(arrayBuilderOptions, pages => {
  return {
    addChildIntro: pages.introPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Add child',
      path: '686-report-add-child',
      uiSchema: intro.uiSchema,
      schema: intro.schema,
    }),
    addChildSummary: pages.summaryPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Add child Summary',
      path: '686-report-add-child/summary',
      uiSchema: summary.uiSchema,
      schema: summary.schema,
    }),
    addChildInformation: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Add child Information',
      path: '686-report-add-child/:index/information',
      uiSchema: information.uiSchema,
      schema: information.schema,
    }),
    addChildIdentification: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: "Child's Identification",
      path: '686-report-add-child/:index/identification',
      uiSchema: identification.uiSchema,
      schema: identification.schema,
    }),
    addChildPlaceOfBirth: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: "Child's Place of Birth",
      path: '686-report-add-child/:index/place-of-birth',
      uiSchema: placeOfBirth.uiSchema,
      schema: placeOfBirth.schema,
    }),
    addChildRelationship: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Your relationship to this child',
      path: '686-report-add-child/:index/relationship',
      uiSchema: relationship.uiSchema,
      schema: relationship.schema,
    }),
    addChildStepchild: pages.itemPage({
      depends: (formData, index) => {
        return (
          isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
          formData?.['view:addOrRemoveDependents']?.add &&
          formData?.childrenToAdd?.[index]?.relationshipToChild?.stepchild
        );
      },
      title: "Child's biological parents",
      path: '686-report-add-child/:index/stepchild',
      uiSchema: stepchild.uiSchema,
      schema: stepchild.schema,
    }),
    addChildAdditionalInformationPartOne: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Additional information needed to add child',
      path: '686-report-add-child/:index/additional-information-part-one',
      uiSchema: additionalInformationPartOne.uiSchema,
      schema: additionalInformationPartOne.schema,
    }),
    addChildMarriageEndDetailsPartOne: pages.itemPage({
      depends: (formData, index) => {
        return (
          isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
          formData?.['view:addOrRemoveDependents']?.add &&
          formData?.childrenToAdd[index]?.hasChildEverBeenMarried
        );
      },
      title: 'How and when marriage ended',
      path: '686-report-add-child/:index/marriage-end-details',
      uiSchema: marriageEndDetails.uiSchema,
      schema: marriageEndDetails.schema,
    }),
    addChildMarriageEndDetailsPartTwo: pages.itemPage({
      depends: (formData, index) => {
        return (
          isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
          formData?.['view:addOrRemoveDependents']?.add &&
          formData?.childrenToAdd[index]?.marriageEndReason === 'other'
        );
      },
      title: 'How and when marriage ended',
      path: '686-report-add-child/:index/other-marriage-end-details',
      uiSchema: marriageEndDescription.uiSchema,
      schema: marriageEndDescription.schema,
    }),
    addChildAdditionalInformationPartTwo: pages.itemPage({
      depends: formData =>
        isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
        formData?.['view:addOrRemoveDependents']?.add,
      title: 'Additional information needed to add child',
      path: '686-report-add-child/:index/additional-information-part-two',
      uiSchema: additionalInformationPartTwo.uiSchema,
      schema: additionalInformationPartTwo.schema,
    }),
    addChildChildAddressPartOne: pages.itemPage({
      depends: (formData, index) => {
        return (
          isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
          formData?.['view:addOrRemoveDependents']?.add &&
          formData?.childrenToAdd?.[index]?.doesChildLiveWithYou === false
        );
      },
      title: "Child's Address",
      path: '686-report-add-child/:index/child-address-part-one',
      uiSchema: childAddressPartOne.uiSchema,
      schema: childAddressPartOne.schema,
    }),
    addChildChildAddressPartTwo: pages.itemPage({
      depends: (formData, index) => {
        return (
          isChapterFieldRequired(formData, TASK_KEYS.addChild) &&
          formData?.['view:addOrRemoveDependents']?.add &&
          formData?.childrenToAdd?.[index]?.doesChildLiveWithYou === false
        );
      },
      title: "Child's Address",
      path: '686-report-add-child/:index/child-address-part-two',
      uiSchema: childAddressPartTwo.uiSchema,
      schema: childAddressPartTwo.schema,
    }),
  };
});

export const chapter = {
  title: 'Add one or more children',
  pages: {
    ...chapterPages,
  },
};
