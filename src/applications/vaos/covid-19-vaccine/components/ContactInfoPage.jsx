import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import FormButtons from '../../components/FormButtons';

import { getCovid19VaccineFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { useHistory } from 'react-router-dom';
import * as actions from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email'],
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[2-9][0-9]{9}$',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const phoneConfig = phoneUI('Your phone number');
const emailConfig = emailUI('Your email address');
const uiSchema = {
  'ui:description': (
    <>
      <p>
        This is the information we’ll use to contact you about your appointment.
        You can update your contact information here, but the updates will only
        apply to this tool.
      </p>
      <p className="vads-u-margin-y--2">
        To update your contact information for all your VA accounts, please{' '}
        <NewTabAnchor href="/profile">go to your profile page</NewTabAnchor>.
      </p>
    </>
  ),
  phoneNumber: {
    ...phoneConfig,
    'ui:errorMessages': {
      ...phoneConfig['ui:errorMessages'],
      pattern:
        'Please enter a valid 10-digit phone number (with or without dashes)',
    },
  },
  email: emailConfig,
};

const pageKey = 'contactInfo';
const pageTitle = 'Confirm your contact information';

export function ContactInfoPage({
  data,
  openFormPage,
  pageChangeInProgress,
  prefillContactInfo,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  schema,
  updateFormData,
}) {
  const history = useHistory();
  useEffect(() => {
    prefillContactInfo();
    openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Contact info"
          title="Contact info"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          data={data}
        >
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return getCovid19VaccineFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage: actions.openFormPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  prefillContactInfo: actions.prefillContactInfo,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInfoPage);
