import React, { useEffect } from 'react';
import moment from 'moment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { getPreferredDate } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getPageTitle } from '../newAppointmentFlow';

const initialSchema = {
  type: 'object',
  required: ['preferredDate'],
  properties: {
    preferredDate: {
      type: 'string',
      format: 'date',
    },
  },
};

const uiSchema = {
  preferredDate: {
    'ui:title':
      "Tell us the earliest day you're available and we'll try to find the date closest to your request.",
    'ui:widget': 'date',
    'ui:description':
      'Choose a date within the next 13 months for this appointment.',
    'ui:validations': [
      (errors, preferredDate) => {
        const maxDate = moment().add(395, 'days');
        if (moment(preferredDate).isBefore(moment(), 'day')) {
          errors.addError('Please enter a future date ');
        }
        if (moment(preferredDate).isAfter(maxDate, 'day')) {
          errors.addError(
            'Please enter a date less than 395 days in the future ',
          );
        }
      },
    ],
  },
};

const pageKey = 'preferredDate';

export default function PreferredDatePage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getPreferredDate(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
  }, []);

  return (
    <div>
      <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of appointment"
          title="Type of appointment"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey))
          }
          onChange={newData =>
            dispatch(updateFormData(pageKey, uiSchema, newData))
          }
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
