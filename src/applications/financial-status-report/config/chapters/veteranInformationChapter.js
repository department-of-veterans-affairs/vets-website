import {
  veteranInfo,
  availableDebts,
  combinedDebts,
  contactInfo,
  contactInformation,
} from '../../pages';
import ContactInfo, {
  customContactFocus,
} from '../../components/contactInfo/ContactInfo';
import ContactInfoReview from '../../components/contactInfo/ContactInfoReview';
import {
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../../components/contactInfo/EditContactInfo';

export default {
  veteranInformationChapter: {
    title: 'Veteran information',
    pages: {
      veteranInfo: {
        path: 'veteran-information',
        title: 'Veteran information',
        uiSchema: veteranInfo.uiSchema,
        schema: veteranInfo.schema,
        editModeOnReviewPage: true,
        initialData: {
          personalData: {
            veteranFullName: {
              first: '',
              last: '',
              middle: '',
            },
            dateOfBirth: '',
          },
          personalIdentification: {
            ssn: '',
            fileNumber: '',
          },
        },
      },
      availableDebts: {
        initialData: {
          selectedDebts: [],
          selectedDebtsAndCopays: [],
          debt: {
            currentAr: 0,
            debtHistory: [{ date: '' }],
            deductionCode: '',
            originalAr: 0,
          },
        },
        path: 'available-debts',
        title: 'Available Debts',
        uiSchema: availableDebts.uiSchema,
        schema: availableDebts.schema,
        depends: formData => !formData['view:combinedFinancialStatusReport'],
      },
      combinedAvailableDebts: {
        initialData: {
          selectedDebts: [],
          selectedDebtsAndCopays: [],
        },
        path: 'all-available-debts',
        title: 'Available Debts',
        uiSchema: combinedDebts.uiSchema,
        schema: combinedDebts.schema,
        depends: formData => formData['view:combinedFinancialStatusReport'],
      },
      contactInfo: {
        initialData: {
          personalData: {
            address: {
              street: '',
              city: '',
              state: '',
              country: '',
              postalCode: '',
            },
            telephoneNumber: '',
            emailAddress: '',
          },
        },
        path: 'contact-information',
        title: 'Contact Information',
        uiSchema: contactInfo.uiSchema,
        schema: contactInfo.schema,
        depends: formData => !formData['view:enhancedFinancialStatusReport'],
      },
      currentContactInformation: {
        title: 'Contact information',
        path: 'current-contact-information',
        CustomPage: ContactInfo,
        CustomPageReview: ContactInfoReview,
        uiSchema: contactInformation.uiSchema,
        schema: contactInformation.schema,
        // needs useCustomScrollAndFocus: true to work
        scrollAndFocusTarget: customContactFocus,
        depends: formData => formData['view:enhancedFinancialStatusReport'],
      },
      editMobilePhone: {
        title: 'Edit mobile phone number',
        path: 'edit-mobile-phone',
        CustomPage: EditMobilePhone,
        CustomPageReview: EditMobilePhone,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      editEmailAddress: {
        title: 'Edit email address',
        path: 'edit-email-address',
        CustomPage: EditEmail,
        CustomPageReview: EditEmail,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
      editMailingAddress: {
        title: 'Edit mailing address',
        path: 'edit-mailing-address',
        CustomPage: EditAddress,
        CustomPageReview: EditAddress,
        depends: () => false, // accessed from contact info page
        uiSchema: {},
        schema: { type: 'object', properties: {} },
      },
    },
  },
};
