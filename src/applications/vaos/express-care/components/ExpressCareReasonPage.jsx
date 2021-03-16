import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getExpressCareFormPageInfo } from '../redux/selectors';
import FormButtons from '../../components/FormButtons';
import * as actions from '../redux/actions';
import PostFormFieldContent from '../../components/PostFormFieldContent';

const EXPRESS_CARE_REASONS = [
  {
    reason: 'Back pain',
  },
  {
    reason: 'Cough',
  },
  {
    reason: 'Pain or other issues in your ear, sinus, throat, or mouth',
  },
  {
    reason: 'Fever',
  },
  {
    reason: 'Loss of appetite or fatigue (feeling tired all the time)',
  },
  {
    reason: 'Headache that isn’t severe or sudden',
  },
  {
    reason: 'High or low blood pressure',
  },
  {
    reason: 'High or low blood sugar',
  },
  {
    reason: 'Joint or muscle pain or minor injury',
    secondaryLabel:
      'Such as pain in your knees, shoulders, hips, ankle, or feet, or a twisted ankle or sprained wrist',
  },
  {
    reason: 'Medication or prescription question',
  },
  {
    reason: 'Minor cut, scrape, or bruise',
  },
  {
    reason: 'Neck pain',
  },
  {
    reason: 'Red or weeping eye without vision loss',
  },
  {
    reason: 'Skin lesion or rash',
  },
  {
    reason: 'Stomach or digestive problem',
  },
  {
    reason: 'Pain when you urinate (pee) or other urology issues',
    secondaryLabel:
      'Such as having the urge to urinate often or blood in your urine',
  },
];

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
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  schema,
  updateFormData,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openFormPage(pageKey, uiSchema, initialSchema);
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
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          data={data}
        >
          <PostFormFieldContent>
            <AlertBox
              status="info"
              className="vads-u-margin-y--2"
              level="2"
              headline="If you need a mental health appointment today"
            >
              <p className="vads-u-margin-top--0">
                Please call your nearest VA medical center or Vet center, and
                ask for a “same-day mental health appointment.”
                <br />
                <a href="/find-locations?facilityType=health&serviceType=MentalHealthCare">
                  Find a VA location
                </a>
              </p>
              <h2 className="vads-u-font-size--h4 vads-u-margin-bottom--1">
                If your health concern isn’t listed here
              </h2>
              <p className="vads-u-margin-top--0">
                Please use our{' '}
                <Link id="new-appointment" to="/new-appointment">
                  appointments tool
                </Link>{' '}
                to schedule an appointment.
              </p>
            </AlertBox>
          </PostFormFieldContent>
          <FormButtons
            backButtonText="Back"
            nextButtonText="Continue"
            pageChangeInProgress={pageChangeInProgress}
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
          />
        </SchemaForm>
      )}
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
  return getExpressCareFormPageInfo(state, pageKey);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareReasonPage);
