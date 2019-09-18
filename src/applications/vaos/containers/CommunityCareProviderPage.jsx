import React from 'react';
import { connect } from 'react-redux';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import FormButtons from '../components/FormButtons';

import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';

const initialSchema = {
  type: 'object',
  required: ['phoneNumber'],
  properties: {
    hasCommunityCareProvider: {
      type: 'boolean',
    },
    communityCareProviders: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          practiceName: {
            type: 'string',
          },
          firstName: {
            type: 'string',
          },
          lastName: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
        },
      },
    },
  },
};

const uiSchema = {
  hasCommunityCareProvider: {
    'ui:widget': 'yesNo',
    'ui:title':
      'Do you have a preferred Community Care provider? You may specify up to three providers',
    'ui:options': {
      labels: {
        N: "No/I don't know",
      },
    },
  },
  communityCareProviders: {
    'ui:title': 'Community Care provider',
    'ui:options': {
      expandUnder: 'hasCommunityCareProvider',
      viewField: ({ formData }) => <div>{formData.practiceName}</div>,
      itemName: 'Community Care provider',
    },
    items: {
      'ui:options': {
        expandUnder: 'hasCommunityCareProvider',
      },
      practiceName: {
        'ui:title': 'Practice name',
      },
      firstName: {
        'ui:title': 'Provider first name',
      },
      lastName: {
        'ui:title': 'Provider last name',
      },
      phone: phoneUI('Provider phone number'),
    },
  },
};

const pageKey = 'ccProvider';

export class CommunityCareProviderPage extends React.Component {
  componentDidMount() {
    this.props.openFormPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const { schema, data, pageChangeInProgress } = this.props;

    return (
      <>
        <h1 className="vads-u-font-size--h2">
          Share your community care provider preferences (1/2)
        </h1>
        {!!schema && (
          <SchemaForm
            name="ccProvider"
            title="Community Care provider"
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={this.goForward}
            onChange={newData =>
              this.props.updateFormData(pageKey, uiSchema, newData)
            }
            data={data}
          >
            <FormButtons
              onBack={this.goBack}
              pageChangeInProgress={pageChangeInProgress}
            />
          </SchemaForm>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityCareProviderPage);
