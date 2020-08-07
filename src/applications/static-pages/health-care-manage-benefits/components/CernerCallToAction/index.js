// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty, map } from 'lodash';
// Relative imports.
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { CERNER_FACILITY_IDS, getCernerURL } from 'platform/utilities/cerner';

export class CernerCallToAction extends Component {
  static propTypes = {
    linksHeaderText: PropTypes.string.isRequired,
    myVAHealthLink: PropTypes.string.isRequired,
    myHealtheVetLink: PropTypes.string.isRequired,
    // From mapStateToProps.
    facilities: PropTypes.arrayOf(
      PropTypes.shape({
        facilityId: PropTypes.string.isRequired,
        isCerner: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: '',
      facilities: [],
      fetching: true,
    };
  }

  componentDidMount() {
    const { facilities } = this.props;

    // Escape early if there are no facilities.
    if (isEmpty(facilities)) {
      this.setState({ fetching: false });
      return;
    }

    // Derive the cerner facilities.
    const cernerFacilities = facilities.filter(facility =>
      CERNER_FACILITY_IDS.includes(facility?.facilityId),
    );

    // Escape early if there are no cerner facilities.
    if (isEmpty(cernerFacilities)) {
      // WARNING: Add sentry logging here if there are no cerner facilities found, this should never happen as the component only renders when there ARE cerner facilities.
      return;
    }

    // Derive the list of facility IDs.
    const cernerFacilityIDs = map(
      cernerFacilities,
      facility => `vha_${facility.facilityId}`,
    );

    // Fetch cerner facilities.
    this.fetchFacilities(cernerFacilityIDs);
  }

  fetchFacilities = async facilityIDs => {
    // Show loading state.
    this.setState({ fetching: true });

    try {
      // Fetch facilities and store them in state.
      const response = await apiRequest(
        `${environment.API_URL}/v1/facilities/va?ids=${facilityIDs.join(',')}`,
      );
      this.setState({ facilities: response?.data, fetching: false });

      // Log any API errors.
    } catch (error) {
      this.setState({ error: error.message, fetching: false });
    }
  };

  render() {
    const { linksHeaderText, myVAHealthLink, myHealtheVetLink } = this.props;
    const { error, fetching, facilities } = this.state;

    // Escape early if we are fetching.
    if (fetching) {
      return <LoadingIndicator message="Loading your information..." />;
    }

    // Escape early if there was an error fetching the Cerner facilities.
    if (error || isEmpty(facilities)) {
      // WARNING: Add sentry logging here if there is an error fetching Cerner facilities.
      return (
        <AlertBox
          headline="Something went wrong"
          content="We’re sorry. Something went wrong on our end. Please try again later."
          status="error"
        />
      );
    }

    return (
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">
            Your VA health care team may be using our new My VA Health portal
          </h3>
          <h4>Our records show that you&apos;re registered at:</h4>

          {/* List of user's facilities */}
          {map(facilities, facility => {
            // Derive facility properties.
            const id = facility?.attributes?.id;
            const name = facility?.attributes?.name;
            const isCerner = CERNER_FACILITY_IDS.inclues(
              id?.replace('vha_', ''),
            );

            return (
              <p key={id}>
                <strong>{name}</strong>{' '}
                {isCerner
                  ? '(Now using My VA Health)'
                  : '(Using My HealtheVet)'}
              </p>
            );
          })}

          <p>
            Please choose a health management portal below, depending on your
            provider&apos;s facility. You may need to disable your
            browser&apos;s pop-up blocker to open the portal. If you&apos;re
            prompted to sign in again, use the same account you used to sign in
            on VA.gov.
          </p>

          <h4>{linksHeaderText}</h4>

          {/* List of user's facility links */}
          {map(facilities, facility => {
            // Derive facility properties.
            const id = facility?.attributes?.id;
            const name = facility?.attributes?.name;
            const isCerner = CERNER_FACILITY_IDS.inclues(
              id?.replace('vha_', ''),
            );

            return (
              <>
                <p>
                  <strong>{name}</strong>
                </p>
                <a
                  href={isCerner ? myVAHealthLink : myHealtheVetLink}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {isCerner ? 'Use My VA Health' : 'Use My HealtheVet'}
                </a>
              </>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  facilities: state?.user?.profile?.facilities,
});

export default connect(
  mapStateToProps,
  null,
)(CernerCallToAction);
