import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';
import { getFormPageInfo } from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { TYPES_OF_SLEEP_CARE } from '../../utils/constants';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['typeOfSleepCareId'],
  properties: {
    typeOfSleepCareId: {
      type: 'string',
      enum: TYPES_OF_SLEEP_CARE.map(care => care.id),
    },
  },
};

const uiSchema = {
  typeOfSleepCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        [TYPES_OF_SLEEP_CARE[0].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[0].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit to set up or fix your CPAP machine.
              You shouldn’t book a CPAP appointment if you want to schedule a
              sleep study or if you have an undiagnosed sleep issue.{' '}
            </span>
          </>
        ),
        [TYPES_OF_SLEEP_CARE[1].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_SLEEP_CARE[1].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for the diagnosis and treatment of
              sleep problems, such as difficulty sleeping or breathing, snoring,
              teeth grinding, and jaw clenching. You can also choose this type
              of appointment if you want to schedule a home or lab sleep study.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfSleepCare';
const pageTitle = 'Choose the type of sleep care you need';

export default function TypeOfSleepCarePage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  useEffect(() => {
    dispatch(openFormPage(pageKey, uiSchema, initialSchema));
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  return (
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of sleep care"
          title="Type of sleep care"
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

TypeOfSleepCarePage.propTypes = {
  changeCrumb: PropTypes.func,
};
