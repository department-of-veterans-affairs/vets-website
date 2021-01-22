import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import { FACILITY_TYPES } from '../../utils/constants';
import * as actions from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';

const initialSchema = {
  type: 'object',
  required: ['facilityType'],
  properties: {
    facilityType: {
      type: 'string',
      enum: Object.keys(FACILITY_TYPES).map(key => FACILITY_TYPES[key]),
    },
  },
};

const uiSchema = {
  facilityType: {
    'ui:title':
      'You’re eligible to see either a VA provider or community care provider for this type of care.',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        [FACILITY_TYPES.VAMC]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              VA medical center or clinic
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a VA medical center or clinic for this appointment
            </span>
          </>
        ),
        [FACILITY_TYPES.COMMUNITY_CARE]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Community care facility
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              Go to a community care facility near your home
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfFacility';
const pageTitle = 'Choose where you want to receive your care';

function TypeOfFacilityPage({
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
    <div className="vaos-form__facility-type vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
)(TypeOfFacilityPage);
