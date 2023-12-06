import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import recordEvent from 'platform/monitoring/record-event';
import FormButtons from '../../../components/FormButtons';
import { GA_PREFIX } from '../../../utils/constants';
import {
  openCommunityCareProviderSelectionPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../../redux/actions';
import { getFormPageInfo, getTypeOfCare } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ProviderSelectionField from './ProviderSelectionField';
import { lowerCase } from '../../../utils/formatters';
import { selectFeatureBreadcrumbUrlUpdate } from '../../../redux/selectors';

const initialSchema = {
  type: 'object',
  properties: {
    communityCareProvider: {
      type: 'object',
      properties: {},
    },
  },
};

const pageKey = 'ccPreferences';

export default function CommunityCareProviderSelectionPage({ changeCrumb }) {
  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const dispatch = useDispatch();
  const { data, pageChangeInProgress, schema } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();
  const typeOfCare = getTypeOfCare(data);
  const pageTitle = `Request a ${lowerCase(typeOfCare.name)} provider`;

  const uiSchema = {
    communityCareProvider: {
      'ui:field': ProviderSelectionField,
    },
  };

  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    dispatch(
      openCommunityCareProviderSelectionPage(pageKey, uiSchema, initialSchema),
    );
    recordEvent({
      event: `${GA_PREFIX}-community-care-provider-selection-page`,
    });
    if (featureBreadcrumbUrlUpdate) {
      changeCrumb(pageTitle);
    }
  }, []);

  return (
    <div>
      <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
      {!!schema && (
        <SchemaForm
          name="ccPreferences"
          title="Community Care preferences"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={() => {
            recordEvent({
              event:
                Object.keys(data.communityCareProvider).length === 0
                  ? `${GA_PREFIX}-continue-without-provider`
                  : `${GA_PREFIX}-continue-with-provider`,
            });
            dispatch(routeToNextAppointmentPage(history, pageKey));
          }}
          onChange={newData => {
            dispatch(updateFormData(pageKey, uiSchema, newData));
          }}
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

CommunityCareProviderSelectionPage.propTypes = {
  changeCrumb: PropTypes.func,
};
