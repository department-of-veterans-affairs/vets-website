import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaDateField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  addDays,
  format,
  isAfter,
  isBefore,
  isValid,
  parse,
  startOfDay,
} from 'date-fns';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GA_PREFIX } from '../../utils/constants';
import FormButtons from '../../components/FormButtons';
import useFormState from '../../hooks/useFormState';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { getFormData, selectPageChangeInProgress } from '../redux/selectors';

import { getPageTitle } from '../newAppointmentFlow';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
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
    'ui:title':
      "Tell us the earliest day you're available and we'll try to find the date closest to your request.",
    'ui:widget': 'date',
    'ui:webComponentField': VaDateField,
    'ui:description':
      'Choose a date within the next 13 months for this appointment.',
    'ui:validations': [
      (errors, preferredDate) => {
        const date = parse(preferredDate, 'yyyy-MM-dd', new Date());
        if (!isValid(date)) {
          errors.addError('Please enter a valid date ');
        }
        const today = startOfDay(new Date());
        if (isBefore(date, today)) {
          errors.addError('Please enter a future date ');
        }
        if (isAfter(date, addDays(today, 395))) {
          errors.addError(
            'Please enter a date less than 395 days in the future ',
          );
        }
      },
    ],
  },
};

const pageKey = 'preferredDate';

export default function PreferredDatePageVaDate() {
  const defaultDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const dispatch = useDispatch();
  const currentData = useSelector(getFormData);
  const { data, schema, setData } = useFormState({
    initialSchema,
    uiSchema,
    initialData: {
      ...currentData,
      preferredDate: currentData.preferredDate || defaultDate,
    },
  });

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
          onSubmit={() => {
            if (data.preferredDate !== defaultDate) {
              recordEvent({ event: `${GA_PREFIX}-preferred-date-modified` });
            }
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
