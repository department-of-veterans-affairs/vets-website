import workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import * as manualUploadPage from '../../pages/form0781/manualUploadPage';
import * as mentalHealthSupport from '../../pages/form0781/mentalHealthSupport';
import eventsIntro from '../../pages/form0781/traumaticEventsIntro';
import eventTypes from '../../pages/form0781/traumaticEventTypes';
import { traumaticEventsPages } from '../../pages/form0781/traumaticEventsPages';
import * as consentPage from '../../pages/form0781/consentPage';
import * as additionalInformationPage from '../../pages/form0781/additionalInformationPage';
import * as behaviorIntroPage from '../../pages/form0781/behaviorIntroPage';
import * as behaviorIntroCombatPage from '../../pages/form0781/behaviorIntroCombatPage';
import * as behaviorListPage from '../../pages/form0781/behaviorListPage';
import BehaviorListPage from '../../components/BehaviorListPage';
import * as behaviorDescriptions from '../../pages/form0781/behaviorDescriptions';
import * as unlistedBehaviorDescriptionPage from '../../pages/form0781/unlistedBehaviorDescriptionPage';
import * as treatmentReceivedPage from '../../pages/form0781/treatmentReceivedPage';
import * as behaviorSummaryPage from '../../pages/form0781/behaviorSummaryPage';
import * as supportingEvidencePage from '../../pages/form0781/supportingEvidencePage';
import * as reviewPage from '../../pages/form0781/reviewPage';
import {
  showForm0781Pages,
  showManualUpload0781Page,
  isCompletingForm0781,
  isRelatedToMST,
  showBehaviorIntroPage,
  showBehaviorIntroCombatPage,
  showBehaviorListPage,
  showUnlistedDescriptionPage,
  showBehaviorSummaryPage,
} from '../../utils/form0781';
import WorkflowChoicePage, {
  workflowChoicePageTitle,
} from '../../content/form0781/workflowChoicePage';
import { manualUploadPageTitle } from '../../content/form0781/manualUploadPage';
import { mentalHealthSupportPageTitle } from '../../content/mentalHealthSupport';
import { eventsPageTitle } from '../../content/traumaticEventsIntro';
import { eventTypesPageTitle } from '../../content/traumaticEventTypes';
import {
  behaviorPageTitle,
  behaviorListPageTitle,
  unlistedPageTitle,
  unlistedDescriptionPageNumber,
  behaviorSummaryPageTitle,
} from '../../content/form0781/behaviorListPages';
import { supportingEvidencePageTitle } from '../../content/form0781/supportingEvidencePage';
import { consentPageTitle } from '../../content/form0781/consentPage';
import { additionalInformationPageTitle } from '../../content/form0781/additionalInformationPage';
import BehaviorIntroCombatPage from '../../components/BehaviorIntroCombatPage';
import TraumaticEventTypesPage from '../../components/TraumaticEventTypesPage';
import { treatmentReceivedTitle } from '../../content/form0781/treatmentReceivedPage';

/**
 * Configuration for our modern 0781 paper sync (2024/2025)
 *
 * @returns Object
 */
export const form0781PagesConfig = {
  workflowChoicePage: {
    title: workflowChoicePageTitle,
    path: 'mental-health-form-0781/workflow',
    depends: formData => showForm0781Pages(formData),
    uiSchema: workflowChoicePage.uiSchema,
    schema: workflowChoicePage.schema,
    CustomPage: WorkflowChoicePage,
    CustomPageReview: null,
  },
  manualUploadPage: {
    title: manualUploadPageTitle,
    path: 'mental-health-form-0781/upload',
    uiSchema: manualUploadPage.uiSchema,
    depends: formData => showManualUpload0781Page(formData),
    schema: manualUploadPage.schema,
  },
  mentalHealthSupport: {
    title: mentalHealthSupportPageTitle,
    path: 'mental-health-form-0781/support',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: mentalHealthSupport.uiSchema,
    schema: mentalHealthSupport.schema,
  },
  eventsIntro: {
    title: eventsPageTitle,
    path: 'mental-health-form-0781/events',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: eventsIntro.uiSchema,
    schema: eventsIntro.schema,
  },
  eventTypes: {
    title: eventTypesPageTitle,
    path: 'mental-health-form-0781/events-type',
    depends: formData => isCompletingForm0781(formData),
    CustomPage: TraumaticEventTypesPage,
    uiSchema: eventTypes.uiSchema,
    schema: eventTypes.schema,
  },
  ...traumaticEventsPages,
  // Behavioral Changes Pages
  behaviorIntroPage: {
    title: behaviorPageTitle,
    path: 'mental-health-form-0781/behavior-changes',
    depends: formData => showBehaviorIntroPage(formData),
    uiSchema: behaviorIntroPage.uiSchema,
    schema: behaviorIntroPage.schema,
  },
  behaviorIntroCombatPage: {
    title: behaviorPageTitle,
    path: 'mental-health-form-0781/behavior-changes-combat',
    depends: formData => showBehaviorIntroCombatPage(formData),
    CustomPage: BehaviorIntroCombatPage,
    CustomPageReview: null,
    schema: behaviorIntroCombatPage.schema,
    uiSchema: behaviorIntroCombatPage.uiSchema,
  },
  behaviorListPage: {
    title: behaviorListPageTitle,
    path: 'mental-health-form-0781/behavior-changes-list',
    depends: formData => showBehaviorListPage(formData),
    CustomPage: BehaviorListPage,
    CustomPageReview: null,
    schema: behaviorListPage.schema,
    uiSchema: behaviorListPage.uiSchema,
  },
  ...behaviorDescriptions.makePages(),
  unlistedBehaviorDescriptionPage: {
    title: unlistedPageTitle,
    path: `mental-health-form-0781/behavior-changes-${unlistedDescriptionPageNumber}-description`,
    depends: formData => showUnlistedDescriptionPage(formData),
    uiSchema: unlistedBehaviorDescriptionPage.uiSchema,
    schema: unlistedBehaviorDescriptionPage.schema,
  },
  behaviorSummaryPage: {
    title: behaviorSummaryPageTitle,
    path: 'mental-health-form-0781/behavior-changes-summary',
    depends: formData => showBehaviorSummaryPage(formData),
    uiSchema: behaviorSummaryPage.uiSchema,
    schema: behaviorSummaryPage.schema,
  },
  supportingEvidencePage: {
    title: supportingEvidencePageTitle,
    path: 'mental-health-form-0781/supporting-evidence',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: supportingEvidencePage.uiSchema,
    schema: supportingEvidencePage.schema,
  },
  treatmentReceivedPage: {
    title: treatmentReceivedTitle,
    path: 'mental-health-form-0781/treatment-received',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: treatmentReceivedPage.uiSchema,
    schema: treatmentReceivedPage.schema,
  },
  // Conclusion Pages
  consentPage: {
    title: consentPageTitle,
    path: 'mental-health-form-0781/consent',
    depends: formData => isRelatedToMST(formData),
    uiSchema: consentPage.uiSchema,
    schema: consentPage.schema,
  },
  additionalInformationPage: {
    title: additionalInformationPageTitle,
    path: 'mental-health-form-0781/additional-information',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: additionalInformationPage.uiSchema,
    schema: additionalInformationPage.schema,
  },
  reviewPage: {
    path: 'mental-health-form-0781/review-page',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: reviewPage.uiSchema,
    schema: reviewPage.schema,
  },
};
