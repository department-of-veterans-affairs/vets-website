import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import phoneUI from '@department-of-veterans-affairs/platform-forms-system/phone';
import emailUI from '@department-of-veterans-affairs/platform-forms-system/email';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';

import { getCovid19VaccineFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';

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
        We’ll use this information to contact you about your appointment. Any
        updates you make here will only apply to VA online appointment
        scheduling.
      </p>
      <p className="vads-u-margin-y--2">
        Want to update your contact information for more VA benefits and
        services?
        <br />
        <NewTabAnchor href="/profile/contact-information">
          Go to your VA.gov profile (opens in new tab)
        </NewTabAnchor>
        .
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
  schema,
  updateFormData,
  changeCrumb,
}) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    prefillContactInfo();
    openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
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
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey))
          }
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
          data={data}
        >
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

ContactInfoPage.propTypes = {
  changeCrumb: PropTypes.func,
  data: PropTypes.object,
  openFormPage: PropTypes.func,
  pageChangeInProgress: PropTypes.bool,
  prefillContactInfo: PropTypes.func,
  schema: PropTypes.object,
  updateFormData: PropTypes.func,
};

function mapStateToProps(state) {
  return getCovid19VaccineFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage: actions.openFormPage,
  prefillContactInfo: actions.prefillContactInfo,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactInfoPage);
