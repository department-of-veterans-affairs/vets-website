import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  FETCH_STATUS,
  EXPRESS_CARE_REASONS,
  EXPRESS_CARE_ERROR_REASON,
} from '../utils/constants';
import FormButtons from '../components/FormButtons';
import ExpressCareReasonField from '../components/ExpressCareReasonField';

import * as actions from '../actions/expressCare';

const pageKey = 'form';
const pageTitle = 'Select a reason for your Express Care request';

const initialSchema = {
  type: 'object',
  properties: {
    reasonForRequest: {
      type: 'object',
      required: ['reason'],
      properties: {
        reason: {
          type: 'string',
        },
        additionalInformation: {
          type: 'string',
        },
      },
    },
    contactInfo: {
      type: 'object',
      required: ['phoneNumber', 'email'],
      properties: {
        phoneNumber: {
          type: 'string',
          pattern: '^[0-9]{10}$',
        },
        email: {
          type: 'string',
          format: 'email',
        },
      },
    },
  },
};

const uiSchema = {
  reasonForRequest: {
    'ui:field': ExpressCareReasonField,
    'ui:description': <h3>text</h3>,
    options: {
      items: EXPRESS_CARE_REASONS.map((r, index) => ({
        id: `express-care-reason-${index}`,
        value: r.reason,
        label: r.reason,
        secondaryLabel: r.secondaryLabel,
      })),
    },
  },
  contactInfo: {
    'ui:title': (
      <h2 className="vads-u-color--gray-dark">Your contact information</h2>
    ),
    'ui:description': (
      <div className="vads-u-margin-bottom--3">
        <p>
          Please provide your phone number and email address where VA health
          care staff can contact you. This contact information will be used just
          for Express Care and won’t be updated in your VA profile.
        </p>
        <p className="vads-u-margin-top--1">
          If you want to update your contact information for all your accounts,
          please{' '}
          <a href="/profile" target="_blank" rel="noopener noreferrer">
            go to your profile page
          </a>
          .
        </p>
      </div>
    ),
    phoneNumber: phoneUI('Phone number'),
    email: {
      'ui:title': 'Email address',
    },
  },
};

let form;

function ExpressCareFormPage({
  newRequest,
  localWindowString,
  openReasonForRequestPage,
  router,
  routeToPreviousAppointmentPage,
  schema,
  submitErrorReason,
  submitExpressCareRequest,
  submitStatus,
  updateFormData,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openReasonForRequestPage(pageKey, uiSchema, initialSchema);
  }, []);

  const { data } = newRequest;

  return (
    <div>
      <h1>{pageTitle}</h1>
      <SchemaForm
        name="Type of appointment"
        title="Type of appointment"
        schema={schema || initialSchema}
        uiSchema={uiSchema}
        onSubmit={() => submitExpressCareRequest(router)}
        onChange={newData => updateFormData(pageKey, uiSchema, newData)}
        data={data}
      >
        <FormButtons
          backButtonText="Back"
          nextButtonText="Submit Express Care request"
          pageChangeInProgress={submitStatus === FETCH_STATUS.loading}
          disabled={submitStatus === FETCH_STATUS.failed}
          loadingText="Submitting your Express Care request"
          onBack={() => routeToPreviousAppointmentPage(router, 'form')}
        />
        {submitStatus === FETCH_STATUS.failed && (
          <>
            {submitErrorReason === EXPRESS_CARE_ERROR_REASON.error && (
              <AlertBox
                status="error"
                headline="Your request didn’t go through"
                content={
                  <p>
                    Something went wrong when we tried to submit your request
                    and you’ll need to start over. We suggest you wait a day to
                    try again or you can call your medical center to help with
                    your request.
                  </p>
                }
              />
            )}
            {submitErrorReason ===
              EXPRESS_CARE_ERROR_REASON.noActiveFacility && (
              <AlertBox
                status="error"
                headline="Express Care isn’t available right now"
                content={
                  <p>
                    Express Care is only available {localWindowString} today. To
                    use Express Care, check back during the time shown above.
                  </p>
                }
              />
            )}
          </>
        )}
      </SchemaForm>
    </div>
  );
}

const mapDispatchToProps = {
  openReasonForRequestPage: actions.openReasonForRequestPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  submitExpressCareRequest: actions.submitExpressCareRequest,
  updateFormData: actions.updateFormData,
};

function mapStateToProps(state) {
  return state.expressCare;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareFormPage);
