import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../../components/FormButtons';

import { getProjectCheetahFormPageInfo } from '../redux/selectors';
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
      pattern: '^[0-9]{10}$',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

const uiSchema = {
  'ui:description': (
    <>
      <p>
        This is the contact information we have on file for you. We’ll use this
        information to contact you about scheduling your appointment. You can
        update your contact information here, but the updates will only apply to
        this tool.
      </p>
      <p className="vads-u-margin-y--2">
        If you want to update your contact information for all your VA accounts,
        please{' '}
        <NewTabAnchor href="/profile">go to your profile page</NewTabAnchor>.
      </p>
    </>
  ),
  phoneNumber: phoneUI('Your phone number'),
  email: {
    'ui:title': 'Your email address',
  },
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
  return getProjectCheetahFormPageInfo(state, pageKey);
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
