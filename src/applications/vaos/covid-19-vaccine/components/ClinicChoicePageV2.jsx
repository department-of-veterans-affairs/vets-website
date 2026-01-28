import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';
import { updateFormData } from '../redux/actions';
import useOpenClinicPage from '../redux/useOpenClinicPage';

const uiSchema = {
  clinicId: {
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'Please select a clinic for your appointment',
    },
  },
};
const pageKey = 'clinicChoice';
const pageTitle = 'Choose a clinic';
export default function ClinicChoicePage() {
  const history = useHistory();
  const {
    data,
    facilityDetails,
    pageChangeInProgress,
    schema,
  } = useOpenClinicPage();
  // const { data, facilityDetails, pageChangeInProgress, schema } = useSelector(
  //   state => getClinicPageInfo(state, pageKey),
  //   shallowEqual,
  // );
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(openClinicPage(pageKey, uiSchema, initialSchema));
    scrollAndFocus();
    document.title = `${pageTitle} | Veterans Affairs`;
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <p>
        {`${
          facilityDetails.name
        } clinics offer vaccine appointments at different times.`}
      </p>
      {!!schema && (
        <SchemaForm
          name="Clinic choice"
          title="Clinic choice"
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
