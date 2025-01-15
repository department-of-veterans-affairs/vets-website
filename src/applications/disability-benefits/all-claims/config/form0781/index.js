import * as workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import * as mentalHealthSupport from '../../pages/form0781/mentalHealthSupport';
import * as traumaticEventsIntro from '../../pages/form0781/traumaticEventsIntro';
import * as eventType from '../../pages/form0781/traumaticEventTypes';
import * as consentPage from '../../pages/form0781/consentPage';
import * as additionalInformationPage from '../../pages/form0781/additionalInformationPage';
import * as behaviorIntroPage from '../../pages/form0781/behaviorIntroPage';
import * as behaviorIntroCombatPage from '../../pages/form0781/behaviorIntroCombatPage';
import * as behaviorListPage from '../../pages/form0781/behaviorListPage';

import {
  isCompletingForm0781,
  showForm0781Pages,
  isRelatedToMST,
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
  mentalHealthSupport: {
    title: 'Mental health support',
    path: 'additional-forms/mental-health-statement/support',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: mentalHealthSupport.uiSchema,
    schema: mentalHealthSupport.schema,
  },
  eventsIntro: {
    title: 'Traumatic events',
    path: 'additional-forms/mental-health-statement/events',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: traumaticEventsIntro.uiSchema,
    schema: traumaticEventsIntro.schema,
  },
  eventType: {
    title: 'Types of traumatic events',
    path: 'additional-forms/mental-health-statement/events-type',
    depends: formData => isCompletingForm0781(formData),
    uiSchema: eventType.uiSchema,
    schema: eventType.schema,
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
