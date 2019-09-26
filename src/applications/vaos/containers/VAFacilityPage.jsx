import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';

import {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import {
  getFormPageInfo,
  getNewAppointment,
  getChosenFacilityInfo,
  hasSingleValidVALocation,
} from '../utils/selectors';

import NoVASystems from '../components/NoVASystems';
import NoValidVAFacilities from '../components/NoValidVAFacilities';
import VAFacilityInfoMessage from '../components/VAFacilityInfoMessage';

const initialSchema = {
  type: 'object',
  required: ['vaSystem', 'vaFacility'],
  properties: {
    vaSystem: {
      type: 'string',
      enum: [],
    },
    vaFacility: {
      type: 'string',
      enum: [],
    },
  },
};

const uiSchema = {
  vaSystem: {
    'ui:widget': 'radio',
    'ui:title':
      'You are registered at the following VA health systems. Select where you would like to have your appointment',
  },
  vaFacility: {
    'ui:title':
      'Appointments are available at the following locations. Some types of care are only available at one location. Select your preferred location',
    'ui:widget': 'radio',
    'ui:validations': [
      (errors, vaFacility, data) => {
        if (vaFacility && !vaFacility.startsWith(data.vaSystem)) {
          errors.add(
            'Please choose a facility that is in the selected VA health systems',
          );
        }
      },
    ],
    'ui:options': {
      hideIf: data => !data.vaSystem,
    },
  },
  vaFacilityLoading: {
    'ui:field': () => <LoadingIndicator message="Finding locations" />,
    'ui:options': {
      hideLabelText: true,
    },
  },
  vaFacilityMessage: {
    'ui:field': ({ formContext }) => (
      <NoValidVAFacilities systemId={formContext.vaSystem} />
    ),
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'vaFacility';

const title = (
  <h1 className="vads-u-font-size--h2">
    Choose a VA location for your apppointment
  </h1>
);

export class VAFacilityPage extends React.Component {
  componentDidMount() {
    this.props.openFacilityPage(pageKey, uiSchema, initialSchema);
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      loadingSystems,
      loadingFacilities,
      facility,
      singleValidVALocation,
      noValidVASystems,
      noValidVAFacilities,
    } = this.props;

    if (loadingSystems) {
      return (
        <div>
          {title}
          <LoadingIndicator message="Finding your VA facility..." />
        </div>
      );
    }

    if (singleValidVALocation) {
      return (
        <div>
          {title}
          <VAFacilityInfoMessage facility={facility} />
          <div className="vads-u-margin-top--2">
            <FormButtons
              onBack={this.goBack}
              pageChangeInProgress={pageChangeInProgress}
            />
          </div>
        </div>
      );
    }

    if (noValidVASystems) {
      return (
        <div>
          {title}
          <NoVASystems />
          <div className="vads-u-margin-top--2">
            <FormButtons
              onBack={this.goBack}
              disabled
              pageChangeInProgress={pageChangeInProgress}
            />
          </div>
        </div>
      );
    }

    const continueDisabled = loadingFacilities || noValidVAFacilities;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Choose a VA location for your apppointment
        </h1>
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFacilityPageData(pageKey, uiSchema, newData)
          }
          formContext={{ vaSystem: data.vaSystem }}
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            disabled={continueDisabled}
            pageChangeInProgress={pageChangeInProgress}
          />
        </SchemaForm>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);

  return {
    ...formInfo,
    facility: getChosenFacilityInfo(state),
    loadingSystems: newAppointment.loadingSystems || !formInfo.schema,
    loadingFacilities: !!formInfo.schema?.properties.vaFacilityLoading,
    singleValidVALocation: hasSingleValidVALocation(state),
    noValidVASystems:
      !formInfo.data.vaSystem &&
      formInfo.schema &&
      !formInfo.schema.properties.vaSystem,
    noValidVAFacilities:
      !!formInfo.schema && !!formInfo.schema.properties.vaFacilityMessage,
  };
}

const mapDispatchToProps = {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VAFacilityPage);
