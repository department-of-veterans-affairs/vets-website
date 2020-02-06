import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import FormButtons from '../components/FormButtons';
import EligibilityCheckMessage from '../components/EligibilityCheckMessage';
import SingleFacilityEligibilityCheckMessage from '../components/SingleFacilityEligibilityCheckMessage';
import ErrorMessage from '../components/ErrorMessage';
import { scrollAndFocus } from '../utils/scrollAndFocus';

import {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFacilityPageInfo } from '../utils/selectors';

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
      'You’re registered at the following VA medical centers. Please let us know where you would like to have your appointment.',
  },
  vaFacility: {
    'ui:title':
      'Appointments are available at the following locations. Some types of care are only available at certain locations. Please choose your preferred location.',
    'ui:widget': 'radio',
    'ui:validations': [
      (errors, vaFacility, data) => {
        if (vaFacility && !vaFacility.startsWith(data.vaSystem)) {
          errors.addError(
            'Please choose a facility that is in the selected VA health system',
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
      <NoValidVAFacilities formContext={formContext} />
    ),
    'ui:options': {
      hideLabelText: true,
    },
  },
};

const pageKey = 'vaFacility';
const pageTitle = 'Choose a VA location for your appointment';
const title = <h1 className="vads-u-font-size--h2">{pageTitle}</h1>;

export class VAFacilityPage extends React.Component {
  componentDidMount() {
    scrollAndFocus();
    this.props.openFacilityPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
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
      loadingEligibility,
      facility,
      singleValidVALocation,
      noValidVASystems,
      noValidVAFacilities,
      eligibility,
      canScheduleAtChosenFacility,
      typeOfCare,
      facilityDetailsStatus,
      systemDetails,
      hasDataFetchingError,
      hasEligibilityError,
    } = this.props;

    const notEligibleAtChosenFacility =
      data.vaFacility &&
      data.vaFacility.startsWith(data.vaSystem) &&
      !loadingEligibility &&
      eligibility &&
      !canScheduleAtChosenFacility;

    if (hasDataFetchingError) {
      return (
        <div>
          {title}
          <ErrorMessage />
        </div>
      );
    }

    if (loadingSystems) {
      return (
        <div>
          {title}
          <LoadingIndicator message="Finding your VA facility..." />
        </div>
      );
    }

    if (singleValidVALocation && notEligibleAtChosenFacility) {
      return (
        <div>
          {title}
          <SingleFacilityEligibilityCheckMessage
            eligibility={eligibility}
            facility={facility}
          />
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

    if (singleValidVALocation) {
      return (
        <div>
          {title}
          <VAFacilityInfoMessage facility={facility} />
          <div className="vads-u-margin-top--2">
            <FormButtons
              onBack={this.goBack}
              onSubmit={this.goForward}
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

    const disableSubmitButton =
      loadingFacilities ||
      noValidVAFacilities ||
      notEligibleAtChosenFacility ||
      hasEligibilityError;

    return (
      <div>
        {title}
        <SchemaForm
          name="VA Facility"
          title="VA Facility"
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={this.goForward}
          onChange={newData =>
            this.props.updateFacilityPageData(pageKey, uiSchema, newData)
          }
          formContext={{
            vaSystem: data.vaSystem,
            typeOfCare,
            facilityDetailsStatus,
            systemDetails,
          }}
          data={data}
        >
          {notEligibleAtChosenFacility && (
            <div className="vads-u-margin-top--2">
              <EligibilityCheckMessage eligibility={eligibility} />
            </div>
          )}
          {hasEligibilityError && <ErrorMessage />}
          <FormButtons
            onBack={this.goBack}
            disabled={disableSubmitButton}
            pageChangeInProgress={loadingEligibility || pageChangeInProgress}
          />
        </SchemaForm>
      </div>
    );
  }
}

VAFacilityPage.propTypes = {
  schema: PropTypes.object,
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  loadingSystems: PropTypes.bool,
  loadingFacilities: PropTypes.bool,
  singleValidVALocation: PropTypes.bool,
  noValidVASystems: PropTypes.bool,
  noValidVAFacilities: PropTypes.bool,
};

function mapStateToProps(state) {
  return getFacilityPageInfo(state, pageKey);
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
