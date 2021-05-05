import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { FETCH_STATUS, EXPRESS_CARE_ERROR_REASON } from '../../utils/constants';
import FormButtons from '../../components/FormButtons';
import TextareaWidget from '../../components/TextareaWidget';
import { validateWhiteSpace } from 'platform/forms/validations';
import { selectLocalExpressCareWindowString } from '../../appointment-list/redux/selectors';
import {
  selectExpressCare,
  getExpressCareFormPageInfo,
} from '../redux/selectors';

import * as actions from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';

const pageKey = 'details';
const pageTitle = 'Express Care request details';

const initialSchema = {
  type: 'object',
  properties: {
    additionalInformation: {
      title: (
        <span className="vads-u-font-family--serif vads-u-font-weight--bold vads-u-font-size--xl">
          Tell us about your symptom
        </span>
      ),
      type: 'string',
      maxLength: 255,
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
  additionalInformation: {
    'ui:description': (
      <p>
        Please provide additional details about your symptoms. (For example,
        when did they start? How long have you been feeling this way? Are you
        experiencing any other symptoms?)
      </p>
    ),
    'ui:widget': TextareaWidget,
    'ui:options': {
      rows: 5,
    },
    'ui:validations': [validateWhiteSpace],
  },
  contactInfo: {
    'ui:title': (
      <>
        <span className="vads-u-color--gray-dark vads-u-font-size--xl">
          Share your contact information
        </span>
      </>
    ),
    'ui:description': (
      <div className="vads-u-margin-bottom--3">
        <p>
          Please provide your phone number and email address where VA health
          care staff can contact you. This contact information will be used just
          for Express Care and won’t be updated in your VA profile. If you want
          to update your contact information for all your accounts, please{' '}
          <NewTabAnchor href="/profile">go to your profile page</NewTabAnchor>.
        </p>
      </div>
    ),
    phoneNumber: phoneUI('Phone number'),
    email: {
      'ui:title': 'Email address',
    },
  },
};

function ExpressCareDetailsPage({
  data,
  localWindowString,
  openAdditionalDetailsPage,
  routeToPreviousAppointmentPage,
  schema,
  submitErrorReason,
  submitExpressCareRequest,
  submitStatus,
  updateFormData,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();

    openAdditionalDetailsPage(pageKey, uiSchema, initialSchema, history);
  }, []);

  return (
    <div>
      <h1>{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of appointment"
          title="Type of appointment"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => submitExpressCareRequest(history)}
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          data={data}
        >
          <FormButtons
            backButtonText="Back"
            nextButtonText="Submit Express Care request"
            pageChangeInProgress={submitStatus === FETCH_STATUS.loading}
            disabled={submitStatus === FETCH_STATUS.failed}
            loadingText="Submitting your Express Care request"
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
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
                      and you’ll need to start over. We suggest you wait a day
                      to try again or you can call your medical center to help
                      with your request.
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
                      Express Care is only available {localWindowString} today.
                      To use Express Care, check back during the time shown
                      above.
                    </p>
                  }
                />
              )}
            </>
          )}
        </SchemaForm>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  openAdditionalDetailsPage: actions.openAdditionalDetailsPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  submitExpressCareRequest: actions.submitExpressCareRequest,
  updateFormData: actions.updateFormData,
};

function mapStateToProps(state) {
  return {
    ...selectExpressCare(state),
    localWindowString: selectLocalExpressCareWindowString(state),
    ...getExpressCareFormPageInfo(state, pageKey),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareDetailsPage);
