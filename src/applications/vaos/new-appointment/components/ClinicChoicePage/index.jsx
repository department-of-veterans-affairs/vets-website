import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import RequestEligibilityMessage from './RequestEligibilityMessage';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startDirectScheduleFlow,
} from '../../redux/actions';

import {
  selectTypeOfCare,
  selectPageChangeInProgress,
  selectChosenFacilityInfo,
  selectEligibility,
} from '../../redux/selectors';
import useClinicFormState from './useClinicFormState';
import { getPageTitle } from '../../newAppointmentFlow';

function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}

const pageKey = 'clinicChoice';
export default function ClinicChoicePage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const dispatch = useDispatch();
  const history = useHistory();

  const facility = useSelector(selectChosenFacilityInfo);
  const typeOfCare = useSelector(selectTypeOfCare);
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const eligibility = useSelector(selectEligibility);

  const { data, schema, uiSchema, setData } = useClinicFormState(pageTitle);

  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  const usingUnsupportedRequestFlow =
    data.clinicId === 'NONE' && !eligibility?.request;

  useEffect(() => {
    scrollAndFocus();
    document.title = `${pageTitle} | Veterans Affairs`;
    dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
  }, []);

  return (
    <div>
      <SchemaForm
        name="Clinic choice"
        title="Clinic choice"
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={() =>
          dispatch(routeToNextAppointmentPage(history, pageKey, data))
        }
        onChange={newData => setData(newData)}
        data={data}
      >
        {usingUnsupportedRequestFlow && (
          <div className="vads-u-margin-top--2">
            <RequestEligibilityMessage
              eligibility={eligibility}
              typeOfCare={typeOfCare}
              facilityDetails={facility}
              typeOfCareName={typeOfCareLabel}
            />
          </div>
        )}
        <FormButtons
          onBack={() =>
            dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
          }
          disabled={usingUnsupportedRequestFlow}
          pageChangeInProgress={pageChangeInProgress}
          loadingText="Page change in progress"
        />
      </SchemaForm>
    </div>
  );
}
