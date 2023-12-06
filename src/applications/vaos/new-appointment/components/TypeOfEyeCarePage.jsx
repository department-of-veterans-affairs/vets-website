import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo } from '../redux/selectors';
import { TYPES_OF_EYE_CARE } from '../../utils/constants';
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
  required: ['typeOfEyeCareId'],
  properties: {
    typeOfEyeCareId: {
      type: 'string',
      enum: TYPES_OF_EYE_CARE.map(type => type.id),
    },
  },
};

const uiSchema = {
  typeOfEyeCareId: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        [TYPES_OF_EYE_CARE[0].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_EYE_CARE[0].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes routine eye exams, preventive vision testing and
              treatment for conditions like glaucoma. Optometrists also can
              provide prescriptions for eyeglasses and other assistive devices.
            </span>
          </>
        ),
        [TYPES_OF_EYE_CARE[1].id]: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              {TYPES_OF_EYE_CARE[1].name}
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              You can schedule an appointment with an ophthalmology specialist
              to diagnose and provide medical and surgical care for conditions
              that affect your eyes—like cataracts, glaucoma, macular
              degeneration, and diabetic retinopathy.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'typeOfEyeCare';
const pageTitle = 'Choose the type of eye care you need';

export default function TypeOfEyeCarePage({ changeCrumb }) {
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
    <div className="vaos-form__detailed-radio">
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of eye care"
          title="Type of eye care"
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

TypeOfEyeCarePage.propTypes = {
  changeCrumb: PropTypes.func,
};
