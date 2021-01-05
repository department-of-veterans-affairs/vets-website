import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import FacilityAddress from '../../components/FacilityAddress';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import * as actions from '../redux/actions';

import { getClinicPageInfo } from '../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['clinicId'],
  properties: {
    clinicId: {
      type: 'string',
      enum: [],
    },
  },
};
const uiSchema = {
  clinicId: {
    'ui:widget': 'radio',
  },
};
const pageKey = 'clinicChoice';
export function ClinicChoicePage({
  schema,
  data,
  facilityDetails,
  openClinicPage,
  updateFormData,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
}) {
  const history = useHistory();
  useEffect(() => {
    openClinicPage(pageKey, uiSchema, initialSchema);
    scrollAndFocus();
    document.title = `Choose a clinic for your Project Cheetah appointment | Veterans Affairs`;
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">
        Choose a clinic for your Project Cheetah appointment
      </h1>
      Choose a clinic located at:
      {facilityDetails && (
        <div className="vads-u-margin-y--2p5">
          <FacilityAddress
            name={facilityDetails.name}
            facility={facilityDetails}
          />
        </div>
      )}
      {!!schema && (
        <SchemaForm
          name="Clinic choice"
          title="Clinic choice"
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
  return getClinicPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openClinicPage: actions.openClinicPage,
  updateFormData: actions.updateFormData,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClinicChoicePage);
