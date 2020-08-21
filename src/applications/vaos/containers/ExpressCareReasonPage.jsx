import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { getExpressCareFormPageInfo } from '../utils/selectors';
import { EXPRESS_CARE_REASONS } from '../utils/constants';
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

function ExpressCareReasonPage({
  data,
  openFormPage,
  pageChangeInProgress,
  router,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  schema,
  updateFormData,
}) {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openFormPage(pageKey, uiSchema, initialSchema);
  }, []);

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
        <AlertBox status="info" className="vads-u-margin-y--2">
          <h3 className="vads-u-margin-top--0 vads-u-font-size--h4 vads-u-margin-bottom--1">
            If you need a mental health appointment today
          </h3>
          <p className="vads-u-margin-top--0">
            Please call your nearest VA medical center or Vet center, and ask
            for a “same-day mental health appointment.”
            <br />
            <a href="/find-locations?facilityType=health&serviceType=MentalHealthCare">
              Find a VA location
            </a>
          </p>
          <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--1">
            If your health concern isn’t listed here
          </h3>
          <p className="vads-u-margin-top--0">
            Please use our{' '}
            <Link id="new-appointment" to="/new-appointment">
              appointments tool
            </Link>{' '}
            to schedule an appointment.
          </p>
        </AlertBox>
        <FormButtons
          backButtonText="Back"
          nextButtonText="Continue"
          pageChangeInProgress={pageChangeInProgress}
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
  return getExpressCareFormPageInfo(state);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareReasonPage);
