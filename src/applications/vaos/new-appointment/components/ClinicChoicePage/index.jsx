import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import RequestEligibilityMessage from './RequestEligibilityMessage';
import FacilityAddress from '../../../components/FacilityAddress';
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
import { MENTAL_HEALTH, PRIMARY_CARE } from '../../../utils/constants';
import { selectFeatureClinicFilter } from '../../../redux/selectors';
import { getPageTitle } from '../../newAppointmentFlow';

function formatTypeOfCare(careLabel) {
  if (careLabel.startsWith('MOVE') || careLabel.startsWith('CPAP')) {
    return careLabel;
  }

  return careLabel.slice(0, 1).toLowerCase() + careLabel.slice(1);
}

function vowelCheck(givenString) {
  return /^[aeiou]$/i.test(givenString.charAt(0));
}

const pageKey = 'clinicChoice';
export default function ClinicChoicePage() {
  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const featureClinicFilter = useSelector(state =>
    selectFeatureClinicFilter(state),
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const facility = useSelector(selectChosenFacilityInfo);
  const typeOfCare = useSelector(selectTypeOfCare);
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const eligibility = useSelector(selectEligibility);

  const {
    data,
    schema,
    uiSchema,
    setData,
    firstMatchingClinic,
  } = useClinicFormState();

  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  const usingUnsupportedRequestFlow =
    data.clinicId === 'NONE' && !eligibility?.request;
  const usingPastClinics =
    typeOfCare.id !== PRIMARY_CARE && typeOfCare.id !== MENTAL_HEALTH;
  const pastMonths = featureClinicFilter ? 36 : 24;

  useEffect(() => {
    scrollAndFocus();
    document.title = `${pageTitle} | Veterans Affairs`;
    dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
  }, []);

  return (
    <div>
      {schema.properties.clinicId.enum.length === 2 && (
        <>
          <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
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
        </>
      )}
      {schema.properties.clinicId.enum.length > 2 && (
        <>
          <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
          {usingPastClinics && (
            <p>
              In the last {pastMonths} months you’ve had{' '}
              {vowelCheck(typeOfCareLabel) ? 'an' : 'a'} {typeOfCareLabel}{' '}
              appointment at the following {facility.name} clinics:
            </p>
          )}
          {!usingPastClinics && (
            <p>
              {typeOfCare.name} appointments are available at the following{' '}
              {facility.name} clinics:
            </p>
          )}
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
