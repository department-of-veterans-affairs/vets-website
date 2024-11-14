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

export const signerContactInfoPage = {
  uiSchema: {
    ...titleUI(
      'Your contact information',
      'We use this information to contact you if we have more questions.',
    ),
    certifierPhone: phoneUI(),
    certifierEmail: emailUI(),
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

/** @type {CustomPageType} */
export function SignerContactInfoPage(props) {
  function onGoForward() {
    const formData = props.data; // changes made here will reflect in global formData;
    if (props.data.certifierRole === 'applicant') {
      populateFirstApplicant(
        formData,
        formData.certifierName,
        formData.certifierEmail,
        formData.certifierPhone,
        formData.certifierAddress,
      );
    } else if (props.data.certifierRole === 'sponsor') {
      // Populate some sponsor fields with certifier info:
      formData.sponsorIsDeceased = false;
      formData.veteransFullName = formData.certifierName;
      formData.sponsorAddress = formData.certifierAddress;
      formData.sponsorPhone = formData.certifierPhone;
    }

    if (formData?.applicants?.[0]) {
      // This is so we have an accurate `certifierRole` prop inside the
      // list loop where that context is normally unavailable:
      formData.applicants[0]['view:certifierRole'] = formData.certifierRole;
    }
  }
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
      onChange={props.onChange}
      onSubmit={props.onSubmit}
    >
      <>
        {/* contentBeforeButtons = save-in-progress links */}
        {props.contentBeforeButtons}
        <FormNavButtons
          goBack={props.goBack}
          goForward={onGoForward}
          submitToContinue
        />
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
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
};
