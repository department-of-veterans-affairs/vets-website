import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import { getCernerURL } from 'platform/utilities/cerner';
import FormButtons from '../../../components/FormButtons';
import EligibilityCheckMessage from './EligibilityCheckMessage';
import SingleFacilityEligibilityCheckMessage from './SingleFacilityEligibilityCheckMessage';
import ErrorMessage from '../../../components/ErrorMessage';
import SystemsRadioWidget from './SystemsRadioWidget';
import { scrollAndFocus } from '../../../utils/scrollAndFocus';

import {
  openFacilityPage,
  updateFacilityPageData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../../redux/actions';
import { getFacilityPageInfo } from '../../redux/selectors';

import NoVASystems from './NoVASystems';
import NoValidVAFacilities from './NoValidVAFacilities';
import VAFacilityInfoMessage from './VAFacilityInfoMessage';

const initialSchema = {
  type: 'object',
  required: ['vaParent', 'vaFacility'],
  properties: {
    vaParent: {
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
  vaParent: {
    'ui:widget': SystemsRadioWidget,
    'ui:title':
      'You’re registered at the following VA medical centers. Please let us know where you would like to have your appointment.',
  },
  vaFacility: {
    'ui:title':
      'Appointments are available at the following locations. Some types of care are only available at certain locations. Please choose your preferred location.',
    'ui:widget': 'radio',
    'ui:options': {
      hideIf: data => !data.vaParent,
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
    this.props.openFacilityPage(pageKey, uiSchema, initialSchema);
    document.title = `${pageTitle} | Veterans Affairs`;
    scrollAndFocus();
  }

  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.history, pageKey);
  };

  goForward = () => {
    if (this.props.isCernerOnly) {
      window.location.href = getCernerURL('/pages/scheduling/upcoming');
    } else {
      this.props.routeToNextAppointmentPage(this.props.history, pageKey);
    }
  };

  render() {
    const {
      schema,
      data,
      pageChangeInProgress,
      loadingParentFacilities,
      loadingFacilities,
      loadingEligibility,
      facility,
      singleValidVALocation,
      noValidVAParentFacilities,
      noValidVAFacilities,
      eligibility,
      canScheduleAtChosenFacility,
      typeOfCare,
      facilityDetailsStatus,
      parentDetails,
      facilityDetails,
      hasDataFetchingError,
      parentOfChosenFacility,
      cernerOrgIds,
      siteId,
      isCernerOnly,
    } = this.props;

    const notEligibleAtChosenFacility =
      data.vaFacility &&
      parentOfChosenFacility === data.vaParent &&
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

    if (loadingParentFacilities) {
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
            typeOfCare={typeOfCare}
          />
          <div className="vads-u-margin-top--2">
            <FormButtons
              onBack={this.goBack}
              disabled
              pageChangeInProgress={pageChangeInProgress}
              loadingText="Page change in progress"
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
              loadingText="Page change in progress"
            />
          </div>
        </div>
      );
    }

    if (noValidVAParentFacilities) {
      return (
        <div>
          {title}
          <NoVASystems />
          <div className="vads-u-margin-top--2">
            <FormButtons
              onBack={this.goBack}
              disabled
              pageChangeInProgress={pageChangeInProgress}
              loadingText="Page change in progress"
            />
          </div>
        </div>
      );
    }

    const disableSubmitButton =
      loadingFacilities || noValidVAFacilities || notEligibleAtChosenFacility;

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
            siteId,
            typeOfCare,
            facilityDetailsStatus,
            parentDetails,
            cernerOrgIds,
          }}
          data={data}
        >
          {notEligibleAtChosenFacility && (
            <div className="vads-u-margin-top--2">
              <EligibilityCheckMessage
                facilityDetails={facilityDetails}
                eligibility={eligibility}
              />
            </div>
          )}
          <FormButtons
            onBack={this.goBack}
            continueLabel=""
            disabled={disableSubmitButton}
            pageChangeInProgress={loadingEligibility || pageChangeInProgress}
            nextButtonText={isCernerOnly ? 'Go to My VA Health' : 'Continue'}
            loadingText={
              loadingEligibility
                ? 'Checking eligibility requirements'
                : 'Page change in progress'
            }
          />
          {(loadingEligibility || pageChangeInProgress) && (
            <div aria-atomic="true" aria-live="assertive">
              <AlertBox isVisible status="info" headline="Please wait">
                We’re checking if we can create an appointment for you at this
                facility. This may take up to a minute. Thank you for your
                patience.
              </AlertBox>
            </div>
          )}
        </SchemaForm>
      </div>
    );
  }
}

VAFacilityPage.propTypes = {
  schema: PropTypes.object,
  data: PropTypes.object.isRequired,
  facility: PropTypes.object,
  facilityDetails: PropTypes.object,
  loadingParentFacilities: PropTypes.bool,
  loadingFacilities: PropTypes.bool,
  singleValidVALocation: PropTypes.bool,
  noValidVAParentFacilities: PropTypes.bool,
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
