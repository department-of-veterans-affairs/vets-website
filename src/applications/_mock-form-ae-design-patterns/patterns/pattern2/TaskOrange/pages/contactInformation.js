import { PersonalInformationContact } from './PersonalInformation';

export default function createContactInformationPage() {
  return {
    title: 'Contact information',
    path: 'personal-information/contact-information',
    initialData: {},
    CustomPage: PersonalInformationContact,
    CustomPageReview: null,
    uiSchema: {},
    schema: {
      type: 'string',
      properties: {},
    },
  };
}
