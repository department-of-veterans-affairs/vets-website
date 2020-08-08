import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { Link } from 'react-router';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  FETCH_STATUS,
  EXPRESS_CARE_REASONS,
  EXPRESS_CARE_ERROR_REASON,
} from '../utils/constants';
import FormButtons from '../components/FormButtons';
import * as actions from '../actions/expressCare';

const pageKey = 'reason';
const pageTitle = 'Select a reason for your Express Care request';

const initialSchema = {
  type: 'object',
  required: ['reason'],
  properties: {
    reason: {
      type: 'string',
      enum: EXPRESS_CARE_REASONS.map(r => r.reason),
    },
  },
};

const uiSchema = {
  reason: {
    'ui:widget': 'radio',
    'ui:description':
      'What is your main health concern today? You’ll be able to provide more detail about your concern and symptoms on the next screen.',
    'ui:options': {
      hideLabelText: true,
      labels: EXPRESS_CARE_REASONS.reduce(
        (acc, r) => ({
          ...acc,
          [r.reason]: (
            <>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {r.reason}
              </span>
              {r.secondaryLabel && (
                <span className="vads-u-display--block vads-u-font-size--sm">
                  {r.secondaryLabel}
                </span>
              )}
            </>
          ),
        }),
        {},
      ),
    },
  },
};

let form;

function ExpressCareReasonPage({
  newRequest,
  localWindowString,
  openFormPage,
  router,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  schema,
  submitErrorReason,
  submitExpressCareRequest,
  submitStatus,
  updateFormData,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openFormPage(pageKey, uiSchema, initialSchema);
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
        onChange={newData => updateFormData(pageKey, uiSchema, newData)}
        onSubmit={() => routeToNextAppointmentPage(router, pageKey)}
        data={data}
      >
        <AlertBox
          status="info"
          headline="Same-day mental health appointments"
          className="vads-u-margin-y--2"
        >
          <p>
            If you need a same day mental health appointment, you can{' '}
            <a href="/find-locations">call your VA medical center</a> and
            request a "same day mental health appointment".
          </p>
          <p>
            Don't see your symptoms listed?{' '}
            <Link id="new-appointment" to="/new-appointment">
              Schedule an appointment here
            </Link>
            .
          </p>
        </AlertBox>
        <FormButtons
          backButtonText="Back"
          nextButtonText="Continue"
          onBack={() => routeToPreviousAppointmentPage(router, pageKey)}
        />
      </SchemaForm>
    </div>
  );
}

const mapDispatchToProps = {
  openFormPage: actions.openFormPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  submitExpressCareRequest: actions.submitExpressCareRequest,
  updateFormData: actions.updateFormData,
};

function mapStateToProps(state) {
  return state.expressCare;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareReasonPage);
