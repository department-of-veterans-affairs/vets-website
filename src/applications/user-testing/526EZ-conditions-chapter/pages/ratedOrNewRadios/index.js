import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { RATED_OR_NEW_RADIOS as demo } from '../../constants';

import causePage from '../shared/cause';
import causeNewPage from '../shared/causeNew';
import causeSecondaryPage from '../shared/causeSecondary';
import causeVAPage from '../shared/causeVA';
import causeWorsenedPage from '../shared/causeWorsened';
import introPage from '../shared/intro';
import newConditionPage from '../shared/newCondition';
import newConditionDatePage from '../shared/newConditionDate';
import ratedDisabilityDatePage from '../shared/ratedDisabilityDate';
import sideOfBodyPage from '../shared/sideOfBody';
import summaryPage from '../shared/summary';
import {
  arrayBuilderOptions,
  hasCause,
  hasRemainingRatedDisabilities,
  hasSideOfBody,
  isActiveDemo,
  isNewCondition,
} from '../shared/utils';
import ratedDisabilitiesPage from './ratedDisabilities';
import ratedOrNewPage from './ratedOrNew';

const ratedOrNewRadiosPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
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
    [`${demo.name}RatedOrNew`]: pageBuilder.itemPage({
      title: 'Select rated disability or new condition',
      path: `conditions-${demo.label}/:index/rated-or-new`,
      depends: formData =>
        isActiveDemo(formData, demo.name) &&
        hasRemainingRatedDisabilities(formData),
      uiSchema: ratedOrNewPage.uiSchema,
      schema: ratedOrNewPage.schema,
    }),
    [`${demo.name}RatedDisabilities`]: pageBuilder.itemPage({
      title: 'Select which existing disability has worsened.',
      path: `conditions-${demo.label}/:index/rated-disabilities`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        !isNewCondition(formData, index) &&
        hasRemainingRatedDisabilities(formData),
      uiSchema: ratedDisabilitiesPage.uiSchema,
      schema: ratedDisabilitiesPage.schema,
    }),
    [`${demo.name}RatedDisabilityDate`]: pageBuilder.itemPage({
      title: 'Start date of rated disability worsening',
      path: `conditions-${demo.label}/:index/rated-disability-date`,
      depends: (formData, index) =>
        isActiveDemo(formData, demo.name) &&
        !isNewCondition(formData, index) &&
        hasRemainingRatedDisabilities(formData),
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
        const { formData, index } = props;
        const item = formData?.[arrayBuilderOptions.arrayPath]?.[index];

        if (item) item.sideOfBody = undefined;

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
      uiSchema: causeSecondaryPage.uiSchema,
      schema: causeSecondaryPage.schema,
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
  }),
);

export default ratedOrNewRadiosPages;
