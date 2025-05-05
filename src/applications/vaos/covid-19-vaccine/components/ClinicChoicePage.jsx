import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import FormButtons from '../../components/FormButtons';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { openClinicPage, updateFormData } from '../redux/actions';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../flow';
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
    'ui:errorMessages': {
      required: 'Please select a clinic for your appointment',
    },
  },
};
const pageKey = 'clinicChoice';
const pageTitle = 'Choose a clinic';
export default function ClinicChoicePage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const history = useHistory();
  const { data, facilityDetails, pageChangeInProgress, schema } = useSelector(
    state => getClinicPageInfo(state, pageKey),
    shallowEqual,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openClinicPage(pageKey, uiSchema, initialSchema));
    scrollAndFocus();
    document.title = `${pageTitle} | Veterans Affairs`;
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      <p>
        {`${facilityDetails.name} clinics offer vaccine appointments at different times.`}
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

ClinicChoicePage.propTypes = {
  changeCrumb: PropTypes.func,
};
