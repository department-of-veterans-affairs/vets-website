import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import FormButtons from '../../components/FormButtons';
import { FACILITY_TYPES } from '../../utils/constants';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  startDirectScheduleFlow,
  updateFormData,
} from '../redux/actions';
import { getPageTitle } from '../newAppointmentFlow';

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

const pageKey = 'typeOfFacility';

export default function TypeOfFacilityPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const pageTitle = useSelector(state => getPageTitle(state, pageKey));

  const uiSchema = {
    facilityType: {
      'ui:title': pageTitle,
      'ui:widget': 'radio', // Required
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        showFieldLabel: false,
        labelHeaderLevel: '1',
        labels: {
          [FACILITY_TYPES.VAMC]: 'VA medical center or clinic',
          [FACILITY_TYPES.COMMUNITY_CARE]: 'Community care facility',
        },
      },
    },
  };

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

    dispatch(startDirectScheduleFlow({ isRecordEvent: false }));
  }, []);

  return (
    <div className="vaos-form__facility-type">
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
          <va-additional-info
            trigger="What to know about scheduling at community care facilities"
            class="vads-u-margin-bottom--4"
          >
            <div>
              If you select community care, we’ll ask for your preferred date,
              timeframe, and provider. Then we’ll contact you to finish
              scheduling your appointment.
            </div>
          </va-additional-info>

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
