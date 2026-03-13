export const config = {
  $schema:
    'https://vefs-forms-api.prod.bip.vba.va.gov/api/v1/rest/forms/formTemplateSchema/versions/1.0/schema',
  formId: '21-686c',
  title: '21-686c Form Template',
  description:
    'Form Template for 21-686c Application Request to Add and/or Remove Dependents',
  version: '1.0',
  sections: [
    {
      sectionNumber: '1',
      sectionId: 'veteranInformationSection',
      sectionHeader: 'Section 1: Veteran information',
      repeatable: false,
      blocks: [
        {
          blockLabel: 'Personal information',
          fields: [
            {
              fieldLabel: 'Name:',
              fieldType: 'string',
              fieldValue:
                '{{veteranInformation.fullName.first}} {{#veteranInformation.fullName.middle}}{{.}} {{/veteranInformation.fullName.middle}}{{veteranInformation.fullName.last}}',
            },
            {
              fieldLabel: 'Last 4 Digits of Social Security number:',
              fieldFormat: 'lastFourSSN',
              fieldType: 'string',
              fieldValue: '{{veteranInformation.ssnLastFour}}',
            },
            {
              fieldLabel: 'Date of Birth:',
              fieldFormat: 'dob',
              fieldType: 'string',
              fieldValue: '{{veteranInformation.birthDate}}',
            },
          ],
        },
        {
          blockLabel: 'Mailing address',
          fields: [
            {
              fieldLabel:
                'I live on a United States military base outside of the U.S.:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.veteranAddress.todo}}',
            },
            {
              fieldLabel: 'Country:',
              fieldType: 'string',
              fieldValue:
                '{{veteranContactInformation.veteranAddress.country}}',
            },
            {
              fieldLabel: 'Street address:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.veteranAddress.street}}',
            },
            {
              fieldLabel: 'Street address line 2:',
              fieldType: 'string',
              fieldValue:
                '{{veteranContactInformation.veteranAddress.street2}}',
            },
            {
              fieldLabel: 'Street address line 3:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.veteranAddress.todo}}',
            },
            {
              fieldLabel: 'City:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.veteranAddress.city}}',
            },
            {
              fieldLabel: 'State:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.veteranAddress.state}}',
            },
            {
              fieldLabel: 'Postal Code:',
              fieldType: 'string',
              fieldValue:
                '{{veteranContactInformation.veteranAddress.postalCode}}',
            },
          ],
        },
        {
          blockLabel: 'Phone and email address',
          fields: [
            {
              fieldLabel: 'Phone number:',
              fieldFormat: 'phone',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.phoneNumber}}',
            },
            {
              fieldLabel: 'International phone number:',
              fieldFormat: 'internationalPhone',
              fieldType: 'string',
              fieldValue: 'todo',
            },
            {
              fieldLabel: 'Email address:',
              fieldType: 'string',
              fieldValue: '{{veteranContactInformation.emailAddress}}',
            },
            {
              fieldLabel:
                'I agree to receive electronic correspondence from the VA about my claim.',
              fieldType: 'boolean',
              fieldValue: 'todo',
            },
          ],
        },
      ],
    },
  ],
};

export const data = {
  veteranInformation: {
    fullName: {
      first: 'Bruno',
      last: 'Mars',
    },
    birthDate: '1985-10-08',
    ssnLastFour: '1234',
    vaFileLastFour: '5678',
  },
  veteranContactInformation: {
    veteranAddress: {
      street: '123 Main St',
      street2: 'Apt 4B',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90001',
    },
    phoneNumber: '1234567890',
    emailAddress: 'bruno.mars@example.com',
  },
};
