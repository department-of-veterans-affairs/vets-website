import React, { useEffect } from 'react';
import moment from 'moment';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import { getPreferredDate } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { useHistory } from 'react-router-dom';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';

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
    'ui:title': 'What is the earliest date you’d like to be seen?',
    'ui:widget': 'date',
    'ui:description': 'Please pick a date within the next 13 months.',
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
const pageTitle = 'Tell us when you want to schedule your appointment';

export default function PreferredDatePage() {
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
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
          <div className="vads-u-margin-bottom--2p5 vads-u-margin-top--neg2">
            <AdditionalInfo triggerText="Why are you asking me this?">
              Tell us the earliest day you’re available and we'll try find the
              date closest to your request. Please note that we might not be
              able to find an appointment for that particular day.
            </AdditionalInfo>
          </div>
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
