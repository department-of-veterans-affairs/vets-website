import workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import * as manualUploadPage from '../../pages/form0781/manualUploadPage';
import * as mentalHealthSupport from '../../pages/form0781/mentalHealthSupport';
import * as traumaticEventsIntro from '../../pages/form0781/traumaticEventsIntro';
import * as eventType from '../../pages/form0781/traumaticEventTypes';
import * as eventDetails from '../../pages/form0781/traumaticEventDetails';
import * as officialReport from '../../pages/form0781/officialReport';
import * as policeReport from '../../pages/form0781/policeReportLocation';
import * as consentPage from '../../pages/form0781/consentPage';
import * as additionalInformationPage from '../../pages/form0781/additionalInformationPage';
import * as behaviorIntroPage from '../../pages/form0781/behaviorIntroPage';
import * as behaviorIntroCombatPage from '../../pages/form0781/behaviorIntroCombatPage';
import * as behaviorListPage from '../../pages/form0781/behaviorListPage';

import {
  showForm0781Pages,
  showManualUpload0781Page,
  isCompletingForm0781,
  isRelatedToMST,
  isAddingEvent,
  policeReportSelected,
  showBehaviorIntroPage,
  showBehaviorIntroCombatPage,
  showBehaviorListPage,
} from '../../utils/form0781';

/**
 * Configuration for our modern 0781 paper sync (2024/2025)
 *
 * @returns Object
 */
export const form0781PagesConfig = {
  workflowChoicePage: {
    path: 'additional-forms/mental-health-statement',
    depends: formData => showForm0781Pages(formData),
    uiSchema: workflowChoicePage.uiSchema,
    schema: workflowChoicePage.schema,
  },
  manualUploadPage: {
    path:
      'disability/file-disability-claim-form-21-526ez/additional-forms/mental-health-statement/upload',
    uiSchema: manualUploadPage.uiSchema,
    depends: formData => showManualUpload0781Page(formData),
    schema: manualUploadPage.schema,
  },
  mentalHealthSupport: {
    path: 'additional-forms/mental-health-statement/support',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: mentalHealthSupport.uiSchema,
    schema: mentalHealthSupport.schema,
  },
  eventsIntro: {
    path: 'additional-forms/mental-health-statement/events',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: traumaticEventsIntro.uiSchema,
    schema: traumaticEventsIntro.schema,
  },
  eventType: {
    path: 'additional-forms/mental-health-statement/events-type',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: eventType.uiSchema,
    schema: eventType.schema,
  },
  // Add event section includes details and 2 report pages
  // Note: event indexing is temporarily hardcoded as 1 for this first event
  // until the Event list page and List & Loop functionality are implemented
  eventDetails: {
    path: `additional-forms/mental-health-statement/event-1-details`,
    depends: formData => isAddingEvent(formData),
    uiSchema: eventDetails.uiSchema(1),
    schema: eventDetails.schema(1),
  },
  officialReport: {
    path: `additional-forms/mental-health-statement/event-1-report`,
    depends: formData => isAddingEvent(formData),
    uiSchema: officialReport.uiSchema(1),
    schema: officialReport.schema(1),
  },
  policeReport: {
    path: `additional-forms/mental-health-statement/event-1-police-report`,
    depends: policeReportSelected(1),
    uiSchema: policeReport.uiSchema(1),
    schema: policeReport.schema(1),
  },
  // Behavioral Changes Pages
  behaviorIntroPage: {
    path: 'additional-forms/mental-health-statement/behavior-changes',
    depends: formData => showBehaviorIntroPage(formData),
    uiSchema: behaviorIntroPage.uiSchema,
    schema: behaviorIntroPage.schema,
  },
  behaviorIntroCombatPage: {
    path: 'additional-forms/mental-health-statement/behavior-changes-combat',
    depends: formData => showBehaviorIntroCombatPage(formData),
    uiSchema: behaviorIntroCombatPage.uiSchema,
    schema: behaviorIntroCombatPage.schema,
  },
  behaviorListPage: {
    path: 'additional-forms/mental-health-statement/behavior-changes-list',
    depends: formData => showBehaviorListPage(formData),
    uiSchema: behaviorListPage.uiSchema,
    schema: behaviorListPage.schema,
  },
  // Conclusion Pages
  consentPage: {
    path: 'additional-forms/mental-health-statement/consent',
    depends: formData => isRelatedToMST(formData),
    uiSchema: consentPage.uiSchema,
    schema: consentPage.schema,
  },
  additionalInformationPage: {
    path: 'additional-forms/mental-health-statement/additional-information',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: additionalInformationPage.uiSchema,
    schema: additionalInformationPage.schema,
  },
};
