import { cloneDeep } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import get from 'platform/utilities/data/get';
import {
  addressUI,
  addressSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  fullNameUI,
  fullNameSchema,
  titleUI,
  descriptionUI,
  radioUI,
  radioSchema,
  phoneUI,
  phoneSchema,
  emailUI,
  emailSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { CustomPageNavButtons } from '../../shared/components/CustomPageNavButtons';
import { populateFirstApplicant } from '../utils/helpers';
import SignInAlert from '../components/FormAlerts/SignInAlert';

const fullNameMiddleInitialUI = cloneDeep(fullNameUI());
fullNameMiddleInitialUI.middle['ui:title'] = 'Middle initial';

export const certifierRoleSchema = {
  uiSchema: {
    ...titleUI('Your information'),
    ...descriptionUI(SignInAlert),
    certifierRole: radioUI({
      title: 'Which of these best describes you?',
      labels: {
        applicant:
          'I’m the spouse, dependent, or survivor of a Veteran applying for benefits for myself',
        sponsor:
          'I’m a Veteran applying for benefits for my spouse, dependents, or both',
        other: 'I’m applying for benefits on behalf of someone else',
      },
      // Changing this data on review messes up the ad hoc prefill
      // mapping of certifier -> applicant|sponsor:
      hideOnReview: true,
    }),
  },
  schema: {
    type: 'object',
    required: ['certifierRole'],
    properties: {
      certifierRole: radioSchema(['applicant', 'sponsor', 'other']),
    },
  },
};

export const certifierNameSchema = {
  uiSchema: {
    ...titleUI('Your name'),
    certifierName: fullNameMiddleInitialUI,
    // TODO: get this validation back in place
    // 'ui:validations': [certifierNameValidation],
  },
  schema: {
    type: 'object',
    required: ['certifierName'],
    properties: {
      certifierName: {
        ...fullNameSchema,
        properties: {
          ...fullNameSchema.properties,
          middle: {
            type: 'string',
            maxLength: 1,
          },
        },
      },
    },
  },
};

export const certifierAddressSchema = {
  uiSchema: {
    ...titleUI(
      'Your mailing address',
      'We’ll send any important information about this application to your address.',
    ),
    certifierAddress: addressUI({
      labels: {
        militaryCheckbox:
          'Address is on military base outside of the United States.',
      },
    }),
    // TODO: get these validations back in place
    /*
    'ui:validations': [
      certifierAddressValidation,
      certifierAddressCleanValidation,
    ],
    */
  },
  schema: {
    type: 'object',
    required: ['certifierAddress'],
    properties: {
      certifierAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};

export const signerContactInfoPage = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
    // TODO: get these validations back in place
    // 'ui:validations': [certifierPhoneValidation, certifierEmailValidation],
  },
  schema: {
    type: 'object',
    required: ['certifierPhone', 'certifierEmail'],
    properties: {
      certifierPhone: phoneSchema,
      certifierEmail: emailSchema,
    },
  },
};

export function signerContactOnGoForward(props) {
  const formData = props.data; // changes made here will reflect in global formData;
  if (props?.data?.certifierRole === 'applicant') {
    populateFirstApplicant(
      formData,
      formData.certifierName,
      formData.certifierEmail,
      formData.certifierPhone,
      formData.certifierAddress,
    );
  } else if (props?.data?.certifierRole === 'sponsor') {
    // Populate some sponsor fields with certifier info:
    formData.sponsorIsDeceased = false;
    formData.sponsorName = formData.certifierName;
    formData.sponsorAddress = formData.certifierAddress;
    formData.sponsorPhone = formData.certifierPhone;
  }

  if (formData?.applicants?.[0]) {
    // This is so we have an accurate `certifierRole` prop inside the
    // list loop where that context is normally unavailable:
    formData.applicants[0]['view:certifierRole'] = formData?.certifierRole;
  }
}

/** @type {CustomPageType} */
export function SignerContactInfoPage(props) {
  const updateButton = (
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button type="submit" onClick={props.updatePage}>
      Update page
    </button>
  );

  const navButtons = CustomPageNavButtons({
    ...props,
    onContinue: () => signerContactOnGoForward(props),
  });

  return (
    <SchemaForm
      name={props.name}
      title={props.title}
      data={props.data}
      appStateData={props.appStateData}
      schema={props.schema}
      uiSchema={props.uiSchema}
      pagePerItemIndex={props.pagePerItemIndex}
      formContext={props.formContext}
      trackingPrefix={props.trackingPrefix}
      onChange={props.onReviewPage ? props.setFormData : props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        {props.onReviewPage ? updateButton : navButtons}
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  );
}

SignerContactInfoPage.propTypes = {
  name: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  appStateData: PropTypes.object,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.object,
  formContext: PropTypes.object,
  goBack: PropTypes.func,
  onChange: PropTypes.func,
  onContinue: PropTypes.func,
  onReviewPage: PropTypes.bool,
  // eslint-disable-next-line react/sort-prop-types
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
};

export const certifierContactSchema = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We’ll use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierPhone', 'certifierEmail'],
    properties: {
      certifierPhone: phoneSchema,
      certifierEmail: emailSchema,
    },
  },
};

export const certifierRelationshipSchema = {
  uiSchema: {
    ...titleUI('Your relationship to the applicant'),
    certifierRelationship: {
      relationshipToVeteran: checkboxGroupUI({
        title: 'Which of these best describes you?',
        hint: 'If you’re applying for multiple applicants, select all that apply.',
        required: () => true,
        labels: {
          spouse: 'I’m an applicant’s spouse',
          child: 'I’m an applicant’s child',
          parent: 'I’m an applicant’s parent',
          thirdParty:
            'I’m a third-party representative who isn’t a family member',
          other: 'My relationship is not listed',
        },
      }),
      otherRelationshipToVeteran: {
        'ui:title':
          'Since your relationship with the applicant was not listed, please describe it here',
        'ui:webComponentField': VaTextInputField,
        'ui:options': {
          expandUnder: 'relationshipToVeteran',
          expandUnderCondition: 'other',
          expandedContentFocus: true,
        },
        'ui:errorMessages': {
          required: 'Please enter your relationship to the applicant',
        },
      },
      'ui:options': {
        updateSchema: (formData, formSchema) => {
          const fs = formSchema;
          // If 'other', open the text field to specify:
          if (
            get('certifierRelationship.relationshipToVeteran.other', formData)
          )
            fs.properties.otherRelationshipToVeteran['ui:collapsed'] = false;
          if (fs.properties.otherRelationshipToVeteran['ui:collapsed']) {
            return {
              ...fs,
              required: ['relationshipToVeteran'],
            };
          }
          return {
            ...fs,
            required: ['relationshipToVeteran', 'otherRelationshipToVeteran'],
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['certifierRelationship'],
    properties: {
      certifierRelationship: {
        type: 'object',
        properties: {
          relationshipToVeteran: checkboxGroupSchema([
            'spouse',
            'child',
            'parent',
            'thirdParty',
            'other',
          ]),
          otherRelationshipToVeteran: {
            type: 'string',
          },
        },
      },
    },
  },
};
