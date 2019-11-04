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

const address = {
  type: 'object',
  properties: {
    state: {
      type: 'string',
      enum: [
        'AL',
        'AK',
        'AS',
        'AZ',
        'AR',
        'AA',
        'AE',
        'AP',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FM',
        'FL',
        'GA',
        'GU',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MH',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'MP',
        'OH',
        'OK',
        'OR',
        'PW',
        'PA',
        'PR',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VI',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
      ],
    },
    street: {
      type: 'string',
      minLength: 1,
      maxLength: 30,
      pattern: '^.*\\S.*',
    },
    street2: {
      type: 'string',
      maxLength: 30,
    },
    street3: {
      type: 'string',
      maxLength: 30,
    },
    city: {
      type: 'string',
      minLength: 1,
      maxLength: 51,
      pattern: '^.*\\S.*',
    },
    postalCode: {
      type: 'string',
      maxLength: 51,
    },
  },
  required: ['street', 'city'],
};

const initialSchema = {
  type: 'object',
  required: ['hasCommunityCareProvider', 'systemId'],
  definitions: { address },
  properties: {
    systemId: {
      type: 'string',
      enum: [],
    },
    hasCommunityCareProvider: {
      type: 'boolean',
    },
    communityCareProvider: {
      type: 'object',
      required: ['firstName', 'lastName', 'phone'],
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
        address: addressUI(),
        phone: {
          type: 'string',
          minLength: 10,
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
    'ui:required': data => data.hasCommunityCareProvider,
    'ui:options': {
      expandUnder: 'hasCommunityCareProvider',
      viewField: ({ formData }) => (
        <div>
          <strong>
            {formData.firstName} {formData.lastName}
          </strong>
          <br />
          {formData.phone}
          <br />
          {formData.practiceName}
        </div>
      ),
      itemName: 'Community Care provider',
    },
    items: {
      practiceName: {
        'ui:title': 'Practice name',
      },
      firstName: {
        'ui:title': 'First name',
      },
      lastName: {
        'ui:title': 'Last name',
      },
      phone: phoneUI(),
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
