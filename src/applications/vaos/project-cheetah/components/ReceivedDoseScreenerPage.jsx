import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import * as actions from '../redux/actions';
import { getProjectCheetahFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

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
      required: 'Please select an option',
    },
  },
};

const pageKey = 'receivedDoseScreener';
const pageTitle = 'Have you received a COVID-19 vaccine?';

function ReceivedDoseScreenerPage({
  schema,
  data,
  openFormPage,
  updateFormData,
  routeToPreviousAppointmentPage,
  routeToNextAppointmentPage,
  pageChangeInProgress,
}) {
  const history = useHistory();
  useEffect(() => {
    openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
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
  updateFormData: actions.updateFormData,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceivedDoseScreenerPage);
