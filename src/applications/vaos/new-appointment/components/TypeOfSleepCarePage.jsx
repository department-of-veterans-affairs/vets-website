import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { TYPES_OF_SLEEP_CARE } from '../../utils/constants';

const initialSchema = {
  type: 'object',
  required: ['typeOfSleepCareId'],
  properties: {
    typeOfSleepCareId: {
      type: 'string',
      enum: TYPES_OF_SLEEP_CARE.map(care => care.id),
    },
  },
};

const uiSchema = {
  typeOfSleepCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        [TYPES_OF_SLEEP_CARE[0].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[0].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit to set up or fix your CPAP machine.
              You shouldn’t book a CPAP appointment if you want to schedule a
              sleep study or if you have an undiagnosed sleep issue.{' '}
            </span>
          </>
        ),
        [TYPES_OF_SLEEP_CARE[1].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[1].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for the diagnosis and treatment of
              sleep problems, such as difficulty sleeping or breathing, snoring,
              teeth grinding, and jaw clenching. You can also choose this type
              of appointment if you want to schedule a home or lab sleep study.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfSleepCare';
const pageTitle = 'Choose the type of sleep care you need';

function TypeOfSleepCarePage({
  schema,
  data,
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  pageChangeInProgress,
}) {
  const history = useHistory();
  useEffect(() => {
    openFormPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }, []);

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of sleep care"
          title="Type of sleep care"
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
)(TypeOfSleepCarePage);
