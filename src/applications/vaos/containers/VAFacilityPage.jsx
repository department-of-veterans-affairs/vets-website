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
import { getFormPageInfo, getNewAppointment } from '../utils/selectors';

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
    'ui:field': NoValidVAFacilities,
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
    } = this.props;

    if (!schema || loadingSystems) {
      return (
        <div>
          {title}
          <LoadingIndicator message="Finding your VA facility..." />
        </div>
      );
    }

    if (
      !schema.properties.vaSystem &&
      !schema.properties.vaFacility &&
      data.vaSystem &&
      data.vaFacility
    ) {
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

    if (!schema.properties.vaSystem) {
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

    let currentSchema = schema;
    let canContinue = true;

    if (loadingFacilities) {
      currentSchema = {
        type: 'object',
        properties: {
          vaSystem: schema.properties.vaSystem,
          vaFacilityLoading: { type: 'string' },
        },
      };
      canContinue = false;
    } else if (
      !schema.properties.vaFacility &&
      data.vaSystem &&
      !data.vaFacility
    ) {
      currentSchema = {
        type: 'object',
        properties: {
          vaSystem: schema.properties.vaSystem,
          vaFacilityMessage: { type: 'string' },
        },
      };
      canContinue = false;
    }

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Choose a VA location for your apppointment
        </h1>
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={currentSchema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFacilityPageData(pageKey, uiSchema, newData)
          }
          data={data}
        >
          <FormButtons
            onBack={this.goBack}
            disabled={!canContinue}
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
    facility: newAppointment.facilities[
      `${formInfo.data.typeOfCareId}_${formInfo.data.vaSystem}`
    ]?.find(
      facility =>
        facility.institution.institutionCode === formInfo.data.vaFacility,
    ),
    loadingSystems: newAppointment.loadingSystems,
    loadingFacilities: newAppointment.loadingFacilities,
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
