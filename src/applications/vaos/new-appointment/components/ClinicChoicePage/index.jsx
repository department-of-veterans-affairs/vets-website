import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import RequestEligibilityMessage from './RequestEligibilityMessage';
import FacilityAddress from '../../../components/FacilityAddress';
import { scrollAndFocus, focusFormHeader } from '../../../utils/scrollAndFocus';
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
import { TYPE_OF_CARE_IDS } from '../../../utils/constants';
import { getPageTitle } from '../../newAppointmentFlow';
import { selectFeatureMentalHealthHistoryFiltering } from '../../../redux/selectors';

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

  // Flipper state
  const featurePastVisitMHFilter = useSelector(
    selectFeatureMentalHealthHistoryFiltering,
  );

  const {
    data,
    schema,
    uiSchema,
    setData,
    firstMatchingClinic,
  } = useClinicFormState(pageTitle);

  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  const usingUnsupportedRequestFlow =
    data.clinicId === 'NONE' && !eligibility?.request;
  const usingPastClinics =
    typeOfCare.id !== TYPE_OF_CARE_IDS.PRIMARY_CARE &&
    (typeOfCare.id !== TYPE_OF_CARE_IDS.MENTAL_HEALTH_SERVICES_ID ||
      featurePastVisitMHFilter);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (schema.properties.clinicId.enum.length > 2) {
        focusFormHeader();
      } else {
        scrollAndFocus();
      }
    },
    [schema],
  );

  return (
    <div className="vaos-form__radio-field">
      {schema.properties.clinicId.enum.length === 2 && (
        <>
          <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
          {usingPastClinics && (
            <>Your last {typeOfCareLabel} appointment was at </>
          )}
          {!usingPastClinics && (
            <>{typeOfCare.name} appointments are available at </>
          )}
          {firstMatchingClinic.serviceName}:
          <div className="vads-u-margin-top--2">
            <FacilityAddress
              name={facility.name}
              facility={facility}
              level={2}
            />
          </div>
          <br />
        </>
      )}
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
