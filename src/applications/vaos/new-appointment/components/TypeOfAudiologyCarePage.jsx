import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../components/FormButtons';
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
  required: ['audiologyType'],
  properties: {
    audiologyType: {
      type: 'string',
      enum: ['CCAUDRTNE', 'CCAUDHEAR'],
    },
  },
};

const uiSchema = {
  audiologyType: {
    'ui:widget': 'radio',
    'ui:options': {
      hideLabelText: true,
      labels: {
        CCAUDRTNE: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Routine hearing exam
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for a hearing exam and an evaluation
              using non-invasive tests to check your hearing and inner ear
              health. A routine exam is not meant for any new or sudden changes
              with your hearing or ears.
            </span>
          </>
        ),
        CCAUDHEAR: (
          <>
            <span className="vads-u-display--block vads-u-font-size--lg vads-u-font-weight--bold">
              Hearing aid support
            </span>
            <span className="vads-u-display--block vads-u-font-size--sm">
              This includes an office visit for Veterans who already have a
              hearing aid and need assistance with this device. This visit is
              for troubleshooting or adjusting a hearing aid to improve
              performance. A hearing aid support visit is not for initial
              evaluation to obtain a hearing aid.
            </span>
          </>
        ),
      },
    },
  },
};

const pageKey = 'audiologyCareType';
const pageTitle = 'Choose the type of audiology care you need';

export default function TypeOfAudiologyCarePage({ changeCrumb }) {
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

TypeOfAudiologyCarePage.propTypes = {
  changeCrumb: PropTypes.func,
};
