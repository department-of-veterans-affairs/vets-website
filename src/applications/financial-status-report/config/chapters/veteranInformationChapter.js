import {
  veteranInfo,
  combinedDebts,
  contactInformation,
  spouseInformation,
  spouseName,
  dependents,
  dependentRecords,
} from '../../pages';
import VeteranInformation from '../../components/veteranInformation/VeteranInformation';
import VeteranInformationReview from '../../components/veteranInformation/VeteranInformationReview';
import ContactInfo from '../../components/contactInfo/ContactInfo';
import ContactInfoReview from '../../components/contactInfo/ContactInfoReview';
import {
  EditMobilePhone,
  EditEmail,
  EditAddress,
} from '../../components/contactInfo/EditContactInfo';
import DependentCount from '../../components/household/DependentCount';
import DependentAges from '../../components/household/DependentAges';
import DependentAgesReview from '../../components/household/DependentAgesReview';
import SpouseTransitionExplainer from '../../components/householdIncome/SpouseTransitionExplainer';
import { getGlobalState } from '../../utils/checkGlobalState';

export default {
  veteranInformationChapter: {
    title: 'Veteran information',
    pages: {
      veteranInfo: {
        path: 'veteran-information',
        title: 'Veteran information',
        uiSchema: veteranInfo.uiSchema,
        schema: veteranInfo.schema,
        CustomPage: VeteranInformation,
        CustomPageReview: VeteranInformationReview,
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
          selectedDebtsAndCopays: [],
        },
        path: 'all-available-debts',
        title: 'Available Debts',
        uiSchema: combinedDebts.uiSchema,
        schema: combinedDebts.schema,
        depends: formData => !formData.reviewNavigation,
      },
      currentContactInformation: {
        title: 'Contact information',
        path: 'current-contact-information',
        CustomPage: ContactInfo,
        CustomPageReview: ContactInfoReview,
        uiSchema: contactInformation.uiSchema,
        schema: contactInformation.schema,
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
      spouseInformation: {
        path: 'spouse-information',
        title: 'Spouse information',
        uiSchema: spouseInformation.uiSchema,
        schema: spouseInformation.schema,
      },
      spouseName: {
        path: 'spouse-name',
        title: 'Spouse name',
        uiSchema: spouseName.uiSchema,
        schema: spouseName.schema,
        depends: formData => formData.questions.isMarried,
      },
      spouseTransition: {
        path: 'spouse-transition',
        title: 'Spouse Transition',
        uiSchema: {},
        schema: { type: 'object', properties: {} },
        CustomPage: SpouseTransitionExplainer,
        CustomPageReview: null,
        depends: formData => {
          const globalState = getGlobalState();
          return (
            formData.questions.isMarried &&
            !formData.reviewNavigation &&
            globalState.spouseChanged
          );
        },
      },
      dependentCount: {
        path: 'dependents-count',
        title: 'Dependents',
        uiSchema: {},
        schema: dependents.schemaEnhanced,
        CustomPage: DependentCount,
        CustomPageReview: null,
      },
      dependentAges: {
        path: 'dependent-ages',
        title: 'Dependents',
        uiSchema: {},
        schema: dependentRecords.schemaEnhanced,
        depends: formData =>
          formData.questions?.hasDependents &&
          formData.questions.hasDependents !== '0' &&
          formData['view:streamlinedWaiver'],
        CustomPage: DependentAges,
        CustomPageReview: DependentAgesReview,
        editModeOnReviewPage: false,
      },
    },
  },
};
