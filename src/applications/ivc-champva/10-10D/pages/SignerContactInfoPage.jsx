/* eslint-disable react/sort-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  titleUI,
  titleSchema,
  phoneSchema,
  phoneUI,
  emailSchema,
  emailUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { populateFirstApplicant } from '../helpers/utilities';
import {
  certifierPhoneValidation,
  certifierEmailValidation,
} from '../helpers/validations';

export const signerContactInfoPage = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
    'ui:validations': [certifierPhoneValidation, certifierEmailValidation],
  },
  schema: {
    type: 'object',
    required: ['certifierPhone', 'certifierEmail'],
    properties: {
      titleSchema,
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
    formData.veteransFullName = formData.certifierName;
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
        {props.onReviewPage ? (
          updateButton
        ) : (
          <FormNavButtons
            goBack={props.goBack}
            goForward={() => signerContactOnGoForward(props)}
            submitToContinue
          />
        )}
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
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.number,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  updatePage: PropTypes.func,
};
