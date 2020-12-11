import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import { TYPE_OF_VISIT } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['visitType'],
  properties: {
    visitType: {
      type: 'string',
      enum: TYPE_OF_VISIT.map(v => v.id),
      enumNames: TYPE_OF_VISIT.map(v => v.name),
    },
  },
};

const uiSchema = {
  visitType: {
    'ui:widget': 'radio',
    'ui:title':
      'Please let us know how you would like to be seen for this appointment.',
  },
};

const pageKey = 'visitType';
const pageTitle = 'Choose a type of appointment';

function TypeOfVisitPage({
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
          name="Type of visit"
          title="Type of visit"
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
  return getFormPageInfo(state, pageKey);
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
)(TypeOfVisitPage);
