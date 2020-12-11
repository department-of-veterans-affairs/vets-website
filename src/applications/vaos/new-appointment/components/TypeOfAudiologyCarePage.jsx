import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['audiologyType'],
  properties: {
    audiologyType: {
      type: 'string',
      enum: ['CCAUDRTNE', 'CCAUDHEAR'],
    },
  },
};

const uiSchema = {
  audiologyType: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        CCAUDRTNE: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Routine hearing exam
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for a hearing exam and an evaluation
              using non-invasive tests to check your hearing and inner ear
              health. A routine exam is not meant for any new or sudden changes
              with your hearing or ears.
            </span>
          </>
        ),
        CCAUDHEAR: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Hearing aid support
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for Veterans who already have a
              hearing aid and need assistance with this device. This visit is
              for troubleshooting or adjusting a hearing aid to improve
              performance. A hearing aid support visit is not for initial
              evaluation to obtain a hearing aid.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'audiologyCareType';

function TypeOfAudiologyCarePage({
  schema,
  data,
  pageChangeInProgress,
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
}) {
  const history = useHistory();
  useEffect(() => {
    openFormPage(pageKey, uiSchema, initialSchema);
    scrollAndFocus();
  }, []);

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">
        Choose the type of audiology care you need
      </h1>
      {!!schema && (
        <SchemaForm
          name="Type of appointment"
          title="Type of appointment"
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
)(TypeOfAudiologyCarePage);
