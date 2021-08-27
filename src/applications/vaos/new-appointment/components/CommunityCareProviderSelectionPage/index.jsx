import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import { GA_PREFIX } from '../../../utils/constants';
import {
  openCommunityCareProviderSelectionPage,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
} from '../../redux/actions';
import { getFormPageInfo } from '../../redux/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ProviderSelectionField from './ProviderSelectionField';
import recordEvent from 'platform/monitoring/record-event';

const initialSchema = {
  type: 'object',
  properties: {
    communityCareSystemId: {
      type: 'string',
      enum: [],
    },
    communityCareProvider: {
      type: 'object',
      properties: {},
    },
  },
};

const pageKey = 'ccPreferences';
const pageTitle = 'Tell us your community care preferences';

export default function CommunityCareProviderSelectionPage() {
  const dispatch = useDispatch();
  const { data, pageChangeInProgress, schema, showCCIterations } = useSelector(
    state => getFormPageInfo(state, pageKey),
    shallowEqual,
  );
  const history = useHistory();

  const descriptionText = showCCIterations
    ? 'We’ll call you to confirm your provider choice'
    : 'You can request a provider for this care. If they aren’t available, we’ll schedule your appointment with a provider close to your home.';

  const uiSchema = {
    communityCareSystemId: {
      'ui:title': 'What’s the closest city and state to you?',
      'ui:widget': 'radio',
    },
    communityCareProvider: {
      'ui:options': {
        showFieldLabel: true,
      },
      'ui:description': (
        <p id="providerSelectionDescription">{descriptionText}</p>
      ),
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
