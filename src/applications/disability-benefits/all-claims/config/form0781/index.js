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
import * as reassignmentDescriptionPage from '../../pages/form0781/behaviorChangeDescriptions/reassignmentDescriptionPage';
import * as unlistedDescriptionPage from '../../pages/form0781/behaviorChangeDescriptions/unlistedDescriptionPage';
import * as behaviorSummaryPage from '../../pages/form0781/behaviorSummaryPage';
import {
  showForm0781Pages,
  showManualUpload0781Page,
  isCompletingForm0781,
  isRelatedToMST,
  showBehaviorIntroPage,
  showBehaviorIntroCombatPage,
  showBehaviorListPage,
  showReassignmentDescriptionPage,
  showUnlistedDescriptionPage,
  showBehaviorSummaryPage,
} from '../../utils/form0781';
import { workflowChoicePageTitle } from '../../content/form0781/workflowChoicePage';
import { manualUploadPageTitle } from '../../content/form0781/manualUploadPage';
import { mentalHealthSupportPageTitle } from '../../content/mentalHealthSupport';
import { eventsPageTitle } from '../../content/traumaticEventsIntro';
import { eventTypesPageTitle } from '../../content/traumaticEventTypes';
import {
  behaviorPageTitle,
  behaviorListPageTitle,
  reassignmentPageTitle,
  unlistedPageTitle,
  behaviorSummaryPageTitle,
} from '../../content/form0781/behaviorListPages';
import { consentPageTitle } from '../../content/form0781/consentPage';
import { additionalInformationPageTitle } from '../../content/form0781/additionalInformationPage';
import { checkShowDeleteBehavioralAnswersModal } from '../../content/form0781ConfirmDeleteBehavioralAnswers';

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
    uiSchema: behaviorIntroCombatPage.uiSchema,
    schema: behaviorIntroCombatPage.schema,
    onContinue: checkShowDeleteBehavioralAnswersModal,
  },
  behaviorListPage: {
    title: behaviorListPageTitle,
    path: 'mental-health-form-0781/behavior-changes-list',
    depends: formData => showBehaviorListPage(formData),
    uiSchema: behaviorListPage.uiSchema,
    schema: behaviorListPage.schema,
  },
  reassignmentDescriptionPage: {
    title: reassignmentPageTitle,
    path: 'mental-health-form-0781/behavior-changes-1-description',
    depends: formData => showReassignmentDescriptionPage(formData),
    uiSchema: reassignmentDescriptionPage.uiSchema,
    schema: reassignmentDescriptionPage.schema,
  },
  unlistedDescriptionPage: {
    title: unlistedPageTitle,
    path: 'mental-health-form-0781/behavior-changes-2-description',
    depends: formData => showUnlistedDescriptionPage(formData),
    uiSchema: unlistedDescriptionPage.uiSchema,
    schema: unlistedDescriptionPage.schema,
  },
  behaviorSummaryPage: {
    title: behaviorSummaryPageTitle,
    path: 'mental-health-form-0781/behavior-changes-summary',
    depends: formData => showBehaviorSummaryPage(formData),
    uiSchema: behaviorSummaryPage.uiSchema,
    schema: behaviorSummaryPage.schema,
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
};
