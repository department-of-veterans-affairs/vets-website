import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  selectVAPEmailAddress,
  selectVAPHomePhoneString,
  selectVAPMobilePhoneString,
} from 'platform/user/selectors';
import FormButtons from '../../components/FormButtons';

import { getFormData, selectPageChangeInProgress } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { useHistory } from 'react-router-dom';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import NewTabAnchor from '../../components/NewTabAnchor';
import useFormState from '../../hooks/useFormState';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber', 'email', 'bestTimeToCall'],
  properties: {
    phoneNumber: {
      type: 'string',
      pattern: '^[0-9]{10}$',
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
  bestTimeToCall: {
    'ui:title': 'What are the best times for us to call you?',
    'ui:validations': [validateBooleanGroup],
    'ui:options': {
      showFieldLabel: true,
      classNames: 'vaos-form__checkboxgroup',
    },
    morning: {
      'ui:title': 'Morning (8 a.m. – noon)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    afternoon: {
      'ui:title': 'Afternoon (noon – 4 p.m.)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
    evening: {
      'ui:title': 'Evening (4 p.m. – 8 p.m.)',
      'ui:options': {
        widgetClassNames: 'vaos-form__checkbox',
      },
    },
  },
  email: {
    'ui:title': 'Your email address',
  },
};

const pageKey = 'contactInfo';
const pageTitle = 'Your contact information';

export default function ContactInfoPage() {
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);
  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const userData = useSelector(getFormData);
  const email = useSelector(selectVAPEmailAddress);
  const homePhone = useSelector(selectVAPHomePhoneString);
  const mobilePhone = useSelector(selectVAPMobilePhoneString);
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
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey, data))
          }
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
