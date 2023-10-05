import React, { useEffect, useCallback } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';
import recordEvent from 'platform/monitoring/record-event';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import * as userSelectors from 'platform/user/selectors';
import { requestStates } from 'platform/utilities/constants';
import { focusElement } from 'platform/utilities/ui';

import FormFooter from 'platform/forms/components/FormFooter';
import * as actions from '../actions';

import useInitializeForm from '../hooks/useInitializeForm';
import useSubmitForm from '../hooks/useSubmitForm';

import GetHelp from './GetHelp';

function Form({ formState, updateFormData, router, isLoggedIn, profile }) {
  const [submitStatus, submitToApi] = useSubmitForm();

  useEffect(() => {
    focusElement('#covid-vaccination-heading-form');
  }, []);

  useEffect(
    () => {
      if (submitStatus === requestStates.succeeded) {
        recordEvent({
          event: 'covid-vaccination--submission-successful',
        });
        router.replace('/confirmation');
      } else if (submitStatus === requestStates.failed) {
        recordEvent({
          event: 'covid-vaccination--submission-failed',
        });
      }
    },
    [submitStatus],
  );

  const [previouslySubmittedFormData] = useInitializeForm(
    formState,
    updateFormData,
    isLoggedIn,
    profile,
  );

  const onFormChange = useCallback(
    nextFormData => {
      updateFormData(formState.formSchema, formState.uiSchema, nextFormData);
    },
    [formState],
  );

  const onFormSubmit = useCallback(
    () => {
      recordEvent({ event: 'covid-vaccination--submission' });
      submitToApi(formState.formData);
    },
    [router, formState],
  );

  if (submitStatus === requestStates.pending) {
    return <va-loading-indicator message="Submitting your form..." />;
  }
  return (
    <>
      <DowntimeNotification
        appTitle="Covid 19 Vaccination Information"
        dependencies={[externalServices.vetextVaccine]}
      >
        <h1 id="covid-vaccination-heading-form" className="no-outline">
          Sign up for vaccine updates
        </h1>
        {previouslySubmittedFormData ? (
          <p>
            Our records show you provided the information below on{' '}
            {moment(previouslySubmittedFormData.createdAt).format(
              'MMMM D, YYYY',
            )}
            . If you’d like to update your information, please make any updates
            below and click <strong>Submit form.</strong>
          </p>
        ) : (
          <p>
            <p>
              <strong>
                If you’re a Veteran who receives care at VA, you don’t need to
                fill out this form to get your COVID-19 vaccine.
              </strong>{' '}
              You can call your nearest VA health facility, or go to the
              facility’s vaccine clinic during walk-in hours.{' '}
              <a href="/find-locations/?facilityType=health&serviceType=Covid19Vaccine">
                Find VA facilities near you that offer COVID-19 vaccines
              </a>
            </p>
            <p>
              If you’re not ready to get your vaccine yet, sign up here to stay
              informed about your options. We’ll send you updates about our
              vaccine plans and other helpful information. We may also use your
              information to contact you about your vaccine options. It's always
              your choice if you want to get a vaccine.
            </p>
          </p>
        )}

        {isLoggedIn ? (
          <p>
            <strong>Note:</strong> The information below is from your VA.gov
            profile. If you need to make a change,{' '}
            <a
              href="/profile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Go to your VA Profile (Open in a new window)"
            >
              go to your profile now.
            </a>{' '}
          </p>
        ) : null}
        {formState ? (
          <SchemaForm
            addNameAttribute
            // "name" and "title" are used only internally to SchemaForm
            name="Coronavirus vaccination"
            title="Coronavirus vaccination"
            data={formState.formData}
            schema={formState.formSchema}
            uiSchema={formState.uiSchema}
            onChange={onFormChange}
            onSubmit={onFormSubmit}
          >
            {submitStatus === requestStates.failed ? (
              <div className="vads-u-margin-bottom-2">
                <va-alert visible status="error">
                  An error occurred while trying to save your form. Please try
                  again later.
                </va-alert>
              </div>
            ) : null}
            <button
              type="submit"
              className="usa-button"
              aria-label="Submit form for COVID-19 vaccine updates"
            >
              Submit form
            </button>
          </SchemaForm>
        ) : (
          <va-loading-indicator message="Loading the form..." />
        )}
      </DowntimeNotification>
      <div className="vads-u-margin-top--1">
        <FormFooter formConfig={{ getHelp: GetHelp }} />
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    isLoggedIn: userSelectors.isLoggedIn(state),
    profile: userSelectors.selectProfile(state),
    formState: state.coronavirusVaccinationApp.formState,
  };
};

const mapDispatchToProps = {
  updateFormData: actions.updateFormData,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Form),
);
export { Form };
