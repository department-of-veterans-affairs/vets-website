import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import { GA_PREFIX } from '../../../utils/constants';
import * as actions from '../../redux/actions';
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
      <p id="providerSelectionDescription">
        You can request a provider for this care. If they aren’t available,
        we’ll schedule your appointment with a provider close to your home.
      </p>
    ),
    'ui:field': ProviderSelectionField,
  },
};

const pageKey = 'ccPreferences';
const pageTitle = 'Tell us your community care preferences';

function CommunityCareProviderSelectionPage({
  schema,
  data,
  pageChangeInProgress,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
  updateFormData,
  openCommunityCareProviderSelectionPage,
}) {
  const history = useHistory();
  useEffect(() => {
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
    openCommunityCareProviderSelectionPage(pageKey, uiSchema, initialSchema);
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
            routeToNextAppointmentPage(history, pageKey);
          }}
          onChange={newData => {
            updateFormData(pageKey, uiSchema, newData);
          }}
          data={data}
        >
          <FormButtons
            onBack={() => routeToPreviousAppointmentPage(history, pageKey)}
            pageChangeInProgress={pageChangeInProgress}
            loadingText="Page change in progress"
          />
        </SchemaForm>
      )}
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...getFormPageInfo(state, pageKey),
  };
}

const mapDispatchToProps = {
  openCommunityCareProviderSelectionPage:
    actions.openCommunityCareProviderSelectionPage,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
  routeToNextAppointmentPage: actions.routeToNextAppointmentPage,
  updateFormData: actions.updateFormData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCareProviderSelectionPage);
