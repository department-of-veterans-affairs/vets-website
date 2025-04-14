import { ARRAY_PATH, CONDITION_NOT_LISTED_OPTION } from '../../constants';
import causePage from './cause';
import causeNewPage from './causeNew';
import causeSecondaryEnhancedPage from '../ratedOrNewNextPageSecondaryEnhanced/causeSecondaryEnhanced';
import causeSecondaryPage from './causeSecondary';
import causeVAPage from './causeVA';
import causeWorsenedPage from './causeWorsened';
import introPage from './intro';
import newConditionPage from './newCondition';
import newConditionDatePage from './newConditionDate';
import ratedDisabilityDatePage from './ratedDisabilityDate';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import {
  arrayBuilderOptions,
  hasRatedDisabilitiesAndIsRatedDisability,
  hasSideOfBody,
  isActiveDemo,
  isNewCondition,
} from './utils';

export const introAndSummaryPages = (demo, pageBuilder) => ({
  [`${demo.name}Intro`]: pageBuilder.introPage({
    title: 'Conditions intro',
    path: `conditions-${demo.label}-intro`,
    depends: formData => isActiveDemo(formData, demo.name),
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  [`${demo.name}Summary`]: pageBuilder.summaryPage({
    title: 'Review your conditions',
    path: `conditions-${demo.label}-summary`,
    depends: formData => isActiveDemo(formData, demo.name),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
});

const clearSideOfBody = (formData, index, setFormData) => {
  setFormData({
    ...formData,
    [ARRAY_PATH]: formData[ARRAY_PATH].map(
      (item, i) => (i === index ? { ...item, sideOfBody: undefined } : item),
    ),
  });
};

const clearConditionNotListed = (formData, setFormData) => {
  setFormData({
    ...formData,
    [arrayBuilderOptions.arrayPath]: formData[
      arrayBuilderOptions.arrayPath
    ].map(
      item =>
        item?.causedByCondition?.[CONDITION_NOT_LISTED_OPTION] === true
          ? {
              ...item,
              causedByCondition: {},
            }
          : item,
    ),
  });
};

const hasCause = (formData, index, cause) =>
  formData?.[arrayBuilderOptions.arrayPath]?.[index]?.cause === cause;

export const remainingSharedPages = (
  demo,
  pageBuilder,
  helpers,
  isSecondaryEnhanced,
) => ({
  [`${demo.name}RatedDisabilityDate`]: pageBuilder.itemPage({
    title: 'Start date of rated disability worsening',
    path: `conditions-${demo.label}/:index/rated-disability-date`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      hasRatedDisabilitiesAndIsRatedDisability(formData, index),
    uiSchema: ratedDisabilityDatePage.uiSchema,
    schema: ratedDisabilityDatePage.schema,
  }),
  [`${demo.name}NewCondition`]: pageBuilder.itemPage({
    title: 'Add a new condition',
    path: `conditions-${demo.label}/:index/new-condition`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) && isNewCondition(formData, index),
    uiSchema: newConditionPage.uiSchema,
    schema: newConditionPage.schema,
    onNavForward: props => {
      const { formData, index, setFormData } = props;

      if (!hasSideOfBody(formData, index)) {
        clearSideOfBody(formData, Number(index), setFormData);
      }

      return helpers.navForwardKeepUrlParams(props);
    },
  }),
  [`${demo.name}SideOfBody`]: pageBuilder.itemPage({
    title: 'Side of body of new condition',
    path: `conditions-${demo.label}/:index/side-of-body`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      isNewCondition(formData, index) &&
      hasSideOfBody(formData, index),
    uiSchema: sideOfBodyPage.uiSchema,
    schema: sideOfBodyPage.schema,
  }),
  [`${demo.name}NewConditionDate`]: pageBuilder.itemPage({
    title: 'Start date of new condition',
    path: `conditions-${demo.label}/:index/new-condition-date`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) && isNewCondition(formData, index),
    uiSchema: newConditionDatePage.uiSchema,
    schema: newConditionDatePage.schema,
    onNavForward: props => {
      const { formData, setFormData } = props;

      // This is to clear the condition not listed option
      // With this implementation, there is an edge case in which the user
      // hits cancel on the Add a new condition page
      // then the condition not listed option is not cleared
      if (isSecondaryEnhanced) {
        clearConditionNotListed(formData, setFormData);
      }

      return helpers.navForwardKeepUrlParams(props);
    },
  }),
  [`${demo.name}Cause`]: pageBuilder.itemPage({
    title: 'Cause of new condition',
    path: `conditions-${demo.label}/:index/cause`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) && isNewCondition(formData, index),
    uiSchema: causePage.uiSchema,
    schema: causePage.schema,
  }),
  [`${demo.name}CauseNew`]: pageBuilder.itemPage({
    title: 'Follow-up of cause new',
    path: `conditions-${demo.label}/:index/cause-new`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      isNewCondition(formData, index) &&
      hasCause(formData, index, 'NEW'),
    uiSchema: causeNewPage.uiSchema,
    schema: causeNewPage.schema,
  }),
  [`${demo.name}CauseSecondary`]: pageBuilder.itemPage({
    title: 'Follow-up of cause secondary condition',
    path: `conditions-${demo.label}/:index/cause-secondary`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      isNewCondition(formData, index) &&
      hasCause(formData, index, 'SECONDARY'),
    uiSchema: isSecondaryEnhanced
      ? causeSecondaryEnhancedPage.uiSchema
      : causeSecondaryPage.uiSchema,
    schema: isSecondaryEnhanced
      ? causeSecondaryEnhancedPage.schema
      : causeSecondaryPage.schema,
    onNavForward: props => {
      const { formData, index, setFormData } = props;

      if (isSecondaryEnhanced) {
        const hasConditionNotListedSelected =
          formData?.[arrayBuilderOptions.arrayPath]?.[index]
            ?.causedByCondition?.[CONDITION_NOT_LISTED_OPTION];

        if (hasConditionNotListedSelected) {
          clearConditionNotListed(formData, setFormData);
        }
      }

      return helpers.navForwardFinishedItem(props);
    },
  }),
  [`${demo.name}CauseWorsened`]: pageBuilder.itemPage({
    title: 'Follow-up of cause worsened because of my service',
    path: `conditions-${demo.label}/:index/cause-worsened`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      isNewCondition(formData, index) &&
      hasCause(formData, index, 'WORSENED'),
    uiSchema: causeWorsenedPage.uiSchema,
    schema: causeWorsenedPage.schema,
  }),
  [`${demo.name}CauseVA`]: pageBuilder.itemPage({
    title: 'Follow-up of cause VA care',
    path: `conditions-${demo.label}/:index/cause-va`,
    depends: (formData, index) =>
      isActiveDemo(formData, demo.name) &&
      isNewCondition(formData, index) &&
      hasCause(formData, index, 'VA'),
    uiSchema: causeVAPage.uiSchema,
    schema: causeVAPage.schema,
  }),
});
