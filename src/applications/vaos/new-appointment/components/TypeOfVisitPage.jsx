import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormButtons from '../../components/FormButtons';
import { getFormPageInfo, getNewAppointment } from '../redux/selectors';
import { FLOW_TYPES, TYPE_OF_VISIT } from '../../utils/constants';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';
import {
  openFormPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../redux/actions';

const uiSchema = {
  visitType: {
    'ui:widget': 'radio',
    'ui:title':
      'Please let us know how you would like to be seen for this appointment.',
    'ui:errorMessages': {
      required: 'Select an option',
    },
  },
};

const pageKey = 'visitType';
const pageTitle = 'How do you want to attend this appointment?';

export default function TypeOfVisitPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  const { schema, data, pageChangeInProgress } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const { flowType } = useSelector(getNewAppointment);

  const initialSchema = {
    type: 'object',
    required: ['visitType'],
    properties: {
      visitType: {
        type: 'string',
        enum: TYPE_OF_VISIT.map(v => v.id),
        enumNames: TYPE_OF_VISIT.map(v => {
          if (FLOW_TYPES.DIRECT === flowType) return v.name;

          // Request flow
          if (v.id === 'clinic') return 'In person';
          if (v.id === 'phone') return 'By phone';
          if (v.id === 'telehealth')
            return 'Through VA Video Connect (telehealth)';

          // It's an error if this is reached so return the original name
          return v.name;
        }),
      },
    },
  };

  const dispatch = useDispatch();
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
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Type of visit"
          title="Type of visit"
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

TypeOfVisitPage.propTypes = {
  changeCrumb: PropTypes.func,
};
