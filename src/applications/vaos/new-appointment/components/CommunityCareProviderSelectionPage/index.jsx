import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../../../components/FormButtons';
import { LANGUAGES } from '../../../utils/constants';
import * as actions from '../../redux/actions';
import { getFormPageInfo } from '../../../utils/selectors';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';
import ProviderSelectionField from './ProviderSelectionField';

const initialSchema = {
  type: 'object',
  required: ['preferredLanguage'],
  properties: {
    communityCareSystemId: {
      type: 'string',
      enum: [],
    },
    preferredLanguage: {
      type: 'string',
      enum: LANGUAGES.map(l => l.id),
      enumNames: LANGUAGES.map(l => l.text),
    },
    communityCareProvider: {
      type: 'object',
      properties: {
        uniqueId: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        lat: {
          type: 'number',
        },
        long: {
          type: 'number',
        },
        address: {
          type: 'object',
          properties: {
            street: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            zip: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

const uiSchema = {
  communityCareSystemId: {
    'ui:title': 'What’s the closest city and state to you?',
    'ui:widget': 'radio',
  },
  preferredLanguage: {
    'ui:title':
      'Do you prefer that your community care provider speak a certain language?',
  },
  communityCareProvider: {
    'ui:options': {
      showFieldLabel: true,
    },
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
    if (history && !data?.typeOfCareId) {
      history.replace('/new-appointment');
    } else {
      document.title = `${pageTitle} | Veterans Affairs`;
      scrollAndFocus();
      openCommunityCareProviderSelectionPage(pageKey, uiSchema, initialSchema);
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
          onSubmit={() => routeToNextAppointmentPage(history, pageKey)}
          onChange={newData => updateFormData(pageKey, uiSchema, newData)}
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
