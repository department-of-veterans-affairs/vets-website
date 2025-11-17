import { ARRAY_PATH } from '../../../constants';
import causePage from './cause';
import causeNewPage from './causeNew';
import causeSecondaryPage from './causeSecondary';
import causeVAPage from './causeVA';
import causeWorsenedPage from './causeWorsened';
import newConditionPage from './newCondition';
import newConditionDatePage from './newConditionDate';
import ratedDisabilityDatePage from './ratedDisabilityDate';
import sideOfBodyPage from './sideOfBody';
import summaryPage from './summary';
import {
  arrayOptions,
  backfillCauseForIncreaseRows,
  hasSideOfBody,
  isNewCondition,
  isRatedDisability,
} from './utils';

export const SummaryPage = pageBuilder => ({
  Summary: pageBuilder.summaryPage({
    title: 'Review your conditions',
    path: `conditions/summary`,
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

const hasCause = (formData, index, cause) =>
  formData?.[arrayOptions.arrayPath]?.[index]?.cause === cause;

export const remainingSharedPages = (pageBuilder, helpers) => ({
  DisabilityDate: pageBuilder.itemPage({
    title: 'Approximate date of service-connected disability worsening',
    path: `conditions/:index/rated-disability-date`,
    depends: (formData, index) => isRatedDisability(formData, index),
    uiSchema: ratedDisabilityDatePage.uiSchema,
    schema: ratedDisabilityDatePage.schema,
    onNavForward: props => {
      const { formData, setFormData } = props;
      const updated = backfillCauseForIncreaseRows(formData);
      if (updated && updated !== formData) {
        setFormData(updated);
      }
      return helpers.navForwardFinishedItem(props);
    },
  }),
  NewCondition: pageBuilder.itemPage({
    title: 'Add new condition',
    path: `conditions/:index/new-condition`,
    depends: (formData, index) => isNewCondition(formData, index),
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
  SideOfBody: pageBuilder.itemPage({
    title: 'Side of the body for new condition',
    path: `conditions/:index/side-of-body`,
    depends: (formData, index) =>
      isNewCondition(formData, index) && hasSideOfBody(formData, index),
    uiSchema: sideOfBodyPage.uiSchema,
    schema: sideOfBodyPage.schema,
  }),
  NewConditionDate: pageBuilder.itemPage({
    title: 'Approximate start date of new condition',
    path: `conditions/:index/new-condition-date`,
    depends: (formData, index) => isNewCondition(formData, index),
    uiSchema: newConditionDatePage.uiSchema,
    schema: newConditionDatePage.schema,
    onNavForward: props => helpers.navForwardKeepUrlParams(props),
  }),
  ConditionCause: pageBuilder.itemPage({
    title: 'Cause of new condition',
    path: `conditions/:index/cause`,
    depends: (formData, index) => isNewCondition(formData, index),
    uiSchema: causePage.uiSchema,
    schema: causePage.schema,
  }),
  CauseNewDetails: pageBuilder.itemPage({
    title:
      'Details of the injury, event, disease or exposure that caused new condition',
    path: `conditions/:index/cause-new`,
    depends: (formData, index) =>
      isNewCondition(formData, index) && hasCause(formData, index, 'NEW'),
    uiSchema: causeNewPage.uiSchema,
    schema: causeNewPage.schema,
  }),
  CauseSecondary: pageBuilder.itemPage({
    title:
      'Details of the service-connected disability or condition that caused new condition',
    path: `conditions/:index/cause-secondary`,
    depends: (formData, index) =>
      isNewCondition(formData, index) && hasCause(formData, index, 'SECONDARY'),
    uiSchema: causeSecondaryPage.uiSchema,
    schema: causeSecondaryPage.schema,
    onNavForward: props => helpers.navForwardFinishedItem(props),
  }),
  CauseWorsened: pageBuilder.itemPage({
    title:
      'Details of the injury, event or exposure that worsened new condition',
    path: `conditions/:index/cause-worsened`,
    depends: (formData, index) =>
      isNewCondition(formData, index) && hasCause(formData, index, 'WORSENED'),
    uiSchema: causeWorsenedPage.uiSchema,
    schema: causeWorsenedPage.schema,
  }),
  CauseVA: pageBuilder.itemPage({
    title:
      'Details of the injury or event in VA care that caused new condition',
    path: `conditions/:index/cause-va`,
    depends: (formData, index) =>
      isNewCondition(formData, index) && hasCause(formData, index, 'VA'),
    uiSchema: causeVAPage.uiSchema,
    schema: causeVAPage.schema,
  }),
});
