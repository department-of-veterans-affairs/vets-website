import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  selectVAPEmailAddress,
  selectVAPHomePhoneString,
  selectVAPMobilePhoneString,
} from 'platform/user/selectors';
import recordEvent from 'platform/monitoring/record-event';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';

import {
  getFlowType,
  getFormData,
  selectPageChangeInProgress,
} from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';
import useFormState from '../../hooks/useFormState';
import { FACILITY_TYPES, FLOW_TYPES, GA_PREFIX } from '../../utils/constants';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email', 'bestTimeToCall'],
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[2-9][0-9]{9}$',
    },
    bestTimeToCall: {
      type: 'object',
      properties: {
        morning: {
          type: 'boolean',
        },
        afternoon: {
          type: 'boolean',
        },
        evening: {
          type: 'boolean',
        },
      },
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
};

function validateLength(errors, email) {
  const MAX_LENGTH = 50;

  if (email && email?.length > MAX_LENGTH) {
    errors.addError(
      `We do not support email addresses that exceeds ${MAX_LENGTH} characters`,
    );
  }
}

function recordPopulatedEvents(email, phone) {
  recordEvent({
    event: `${GA_PREFIX}-contact-info-email-${
      email ? 'populated' : 'not-populated'
    }`,
  });
  recordEvent({
    event: `${GA_PREFIX}-contact-info-phone-${
      phone ? 'populated' : 'not-populated'
    }`,
  });
}

function recordChangedEvents(email, phone, data) {
  if (email) {
    recordEvent({
      event: `${GA_PREFIX}-contact-info-email-${
        email !== data.email ? 'changed' : 'not-changed'
      }`,
    });
  }

  if (phone) {
    recordEvent({
      event: `${GA_PREFIX}-contact-info-phone-${
        phone !== data.phoneNumber ? 'changed' : 'not-changed'
      }`,
    });
  }
}

const phoneConfig = phoneUI('Your phone number');
const pageKey = 'contactInfo';
const pageTitle = 'Confirm your contact information';

export default function ContactInfoPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const userData = useSelector(getFormData);
  const email = useSelector(selectVAPEmailAddress);
  const homePhone = useSelector(selectVAPHomePhoneString);
  const mobilePhone = useSelector(selectVAPMobilePhoneString);
  const flowType = useSelector(getFlowType);

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    recordPopulatedEvents(email, mobilePhone || homePhone);
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

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
            Go to your VA profile
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
    bestTimeToCall: {
      'ui:title': 'What are the best times for us to call you?',
      'ui:validations':
        flowType === FLOW_TYPES.REQUEST &&
        userData.facilityType === FACILITY_TYPES.COMMUNITY_CARE
          ? [validateBooleanGroup]
          : [],
      'ui:options': {
        showFieldLabel: true,
        classNames: 'vaos-form__checkboxgroup',
        hideIf: () => {
          return (
            flowType === FLOW_TYPES.DIRECT ||
            (flowType === FLOW_TYPES.REQUEST &&
              userData.facilityType === FACILITY_TYPES.VAMC)
          );
        },
      },
      morning: {
        'ui:title': 'Morning (8:00 a.m. – noon)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
      afternoon: {
        'ui:title': 'Afternoon (noon – 4:00 p.m.)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
      evening: {
        'ui:title': 'Evening (4:00 p.m. – 8:00 p.m.)',
        'ui:options': { widgetClassNames: 'vaos-form__checkbox' },
      },
    },
    email: {
      'ui:title': 'Your email address',
      'ui:errorMessages': {
        required: 'Please enter an email address',
      },
      'ui:validations': [validateLength],
    },
  };

  const { data, schema, setData } = useFormState({
    initialSchema,
    uiSchema,
    initialData: {
      ...userData,
      email: userData.email || email,
      phoneNumber: userData.phoneNumber || mobilePhone || homePhone,
    },
  });

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Contact info"
          title="Contact info"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => {
            recordChangedEvents(email, mobilePhone || homePhone, data);
            dispatch(routeToNextAppointmentPage(history, pageKey, data));
          }}
          onChange={newData => setData(newData)}
          data={data}
        >
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
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
};
