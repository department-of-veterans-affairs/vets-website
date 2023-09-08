import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import { FACILITY_TYPES } from '../../utils/constants';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';

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

export default function TypeOfFacilityPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  useEffect(() => {
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
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

TypeOfFacilityPage.propTypes = {
  changeCrumb: PropTypes.func,
};
