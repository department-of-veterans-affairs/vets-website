import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { useHistory } from 'react-router-dom';
import FormButtons from '../../components/FormButtons';
import {
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../redux/actions';
import {
  getFormData,
  selectCommunityCareSupportedSites,
  selectPageChangeInProgress,
} from '../redux/selectors';
import { scrollAndFocus } from '../../utils/scrollAndFocus';
import useFormState from '../../hooks/useFormState';
import { selectFeatureBreadcrumbUrlUpdate } from '../../redux/selectors';

const uiSchema = {
  communityCareSystemId: {
    'ui:title':
      'Choose a city that is near you. This ensures that we send your community care request to your closest VA health system.',
    'ui:widget': 'radio',
  },
};

const pageKey = 'ccClosestCity';
const pageTitle = 'What’s the closest city to you?';

export default function ClosestCityStatePage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const pageChangeInProgress = useSelector(selectPageChangeInProgress);
  const supportedParentSites = useSelector(selectCommunityCareSupportedSites);
  const initialData = useSelector(getFormData, shallowEqual);

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  const { data, schema, setData } = useFormState({
    initialData,
    initialSchema() {
      return {
        type: 'object',
        required: ['communityCareSystemId'],
        properties: {
          communityCareSystemId: {
            type: 'string',
            enum: supportedParentSites.map(site => site.id),
            enumNames: supportedParentSites.map(
              site => `${site.address.city}, ${site.address.state}`,
            ),
          },
        },
      };
    },
    uiSchema,
  });

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="Closest city and state"
          title="Closest city and state"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => {
            dispatch(routeToNextAppointmentPage(history, pageKey, data));
          }}
          onChange={newData => setData(newData)}
          data={data}
        >
          <FormButtons
            onBack={() =>
              dispatch(routeToPreviousAppointmentPage(history, pageKey, data))
            }
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

ClosestCityStatePage.propTypes = {
  changeCrumb: PropTypes.func,
};
