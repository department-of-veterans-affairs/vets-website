import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../components/FormButtons';
import {
  getCovid19VaccineFormPageInfo,
  selectCovid19VaccineFormData,
} from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { openFormPage, updateFormData } from '../redux/actions';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';

const initialSchema = {
  type: 'object',
  required: ['hasReceivedDose'],
  properties: {
    hasReceivedDose: {
      type: 'boolean',
    },
  },
};

const uiSchema = {
  hasReceivedDose: {
    'ui:widget': 'yesNo',
    'ui:options': {
      labels: {
        N: "No/I'm not sure",
      },
    },
    'ui:title':
      "If you've received the first dose of a vaccine that requires 2 doses, answer Yes.",
    'ui:errorMessages': {
      required: 'Please select an answer',
    },
  },
};

const pageKey = 'receivedDoseScreener';
const pageTitle = 'Have you received a COVID-19 vaccine?';

export default function ReceivedDoseScreenerPage({ changeCrumb }) {
  const { schema, data, selectPageChangeInProgress } = useSelector(
    state => getCovid19VaccineFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const userData = useSelector(selectCovid19VaccineFormData);
  useEffect(() => {
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    changeCrumb(pageTitle);
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Received dose screener"
          title="Received dose screener"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() =>
            dispatch(routeToNextAppointmentPage(history, pageKey, data))
          }
          onChange={newData =>
            dispatch(updateFormData(pageKey, uiSchema, newData))
          }
          data={userData}
        >
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
            }
            pageChangeInProgress={selectPageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

ReceivedDoseScreenerPage.propTypes = {
  changeCrumb: PropTypes.func,
};
