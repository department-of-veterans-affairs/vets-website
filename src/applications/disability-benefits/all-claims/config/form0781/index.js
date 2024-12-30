import * as workflowChoicePage from '../../pages/form0781/workflowChoicePage';
import * as mentalHealthSupport from '../../pages/form0781/mentalHealthSupport';
import * as traumaticEventsIntro from '../../pages/form0781/traumaticEventsIntro';
import * as eventType from '../../pages/form0781/traumaticEventTypes';
import { showForm0781Pages, isCompletingForm0781 } from '../../utils/form0781';
import * as consentPage from '../../pages/form0781/consentPage';
import * as additionalInformationPage from '../../pages/form0781/additionalInformationPage';

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
  consentPage: {
    path: 'additional-forms/mental-health-statement/consent',
    depends: formData => showForm0781Pages(formData),
    uiSchema: consentPage.uiSchema,
    schema: consentPage.schema,
  },
  additionalInformationPage: {
    path: 'additional-forms/mental-health-statement/additional-information',
    depends: formData => showForm0781Pages(formData),
    uiSchema: additionalInformationPage.uiSchema,
    schema: additionalInformationPage.schema,
  },
};
