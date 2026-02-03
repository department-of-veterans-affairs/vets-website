import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import RequestEligibilityMessage from './RequestEligibilityMessage';
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
import { GA_PREFIX } from '../../../utils/constants';
import { getPageTitle } from '../../newAppointmentFlow';
import { selectFeatureMentalHealthHistoryFiltering } from '../../../redux/selectors';
import { typeOfCareRequiresPastHistory } from '../../../services/patient';

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

  const typeOfCareLabel = formatTypeOfCare(typeOfCare.name);
  const requiresPastHistory = typeOfCareRequiresPastHistory(
    typeOfCare.id,
    featurePastVisitMHFilter,
  );

  const singleClinicTitlePrefix = requiresPastHistory
    ? `Your last ${typeOfCareLabel} appointment was at`
    : `${typeOfCare.name} appointments are available at`;

  const { data, schema, uiSchema, setData } = useClinicFormState(
    pageTitle,
    singleClinicTitlePrefix,
  );
  const usingUnsupportedRequestFlow =
    data.clinicId === 'NONE' &&
    (!eligibility?.request || eligibility.request.disabled);

  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;
      dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
    },
    [dispatch, pageTitle],
  );

  useEffect(
    () => {
      if (Number.isInteger(schema.properties.clinicId.enum.length)) {
        recordEvent({
          event: `${GA_PREFIX}-clinic-choice-count`,
          'clinic-count': schema.properties.clinicId.enum.length - 1,
        });
      }
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
      {schema.properties.clinicId.enum.length === 2 ? (
        <h1 className="vaos__dynamic-font-size--h2">{pageTitle}</h1>
      ) : (
        <h1 className="vaos__dynamic-font-size--h2">
          {pageTitle}
          <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-weight--normal">
            (*Required)
          </span>
        </h1>
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
              facilityDetails={facility}
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
