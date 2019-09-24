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
};

const loadingUISchema = {
  ...uiSchema,
  vaFacility: {
    'ui:field': () => <LoadingIndicator message="Finding locations" />,
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'vaFacility';

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
    } = this.props;

    return (
      <div>
        <h1 className="vads-u-font-size--h2">
          Choose a VA location for your apppointment
        </h1>
        {loadingSystems && (
          <LoadingIndicator message="Finding your VA facility..." />
        )}
        {!loadingSystems &&
          schema && (
            <SchemaForm
              name="VA Facility"
              title="VA Facility"
              schema={schema || initialSchema}
              uiSchema={loadingFacilities ? loadingUISchema : uiSchema}
              onSubmit={this.goForward}
              onChange={newData =>
                this.props.updateFacilityPageData(pageKey, uiSchema, newData)
              }
              data={data}
            >
              <FormButtons
                onBack={this.goBack}
                disabled={loadingSystems || loadingFacilities}
                pageChangeInProgress={pageChangeInProgress}
              />
            </SchemaForm>
          )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const formInfo = getFormPageInfo(state, pageKey);
  const newAppointment = getNewAppointment(state);

  return {
    ...formInfo,
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
