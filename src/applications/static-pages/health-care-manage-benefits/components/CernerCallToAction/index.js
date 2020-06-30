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
import { getCernerURL } from 'platform/utilities/constants';

class CernerCallToAction extends Component {
  static propTypes = {
    callToActions: PropTypes.arrayOf(
      PropTypes.shape({
        deriveHeaderText: PropTypes.func.isRequired,
        href: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ),
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
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
      return;
    }

    // Derive the cerner facilities.
    const cernerFacilities = facilities.filter(facility => facility.isCerner);

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
    const { callToActions, text, type } = this.props;
    const { error, fetching, facilities } = this.state;

    // Escape early if we are fetching.
    if (fetching) {
      return <LoadingIndicator message="Loading your information..." />;
    }

    // Escape early if there was an error fetching the Cerner facilities.
    if (error || isEmpty(facilities)) {
      return (
        <AlertBox
          headline="Something went wrong"
          content="We’re sorry. Something went wrong on our end. Please try again later."
          status="error"
        />
      );
    }

    // Derive the Cerner facility names.
    const facilityNames = map(
      facilities,
      facility => facility?.attributes?.name || 'unknown facility name',
    );
    const joinedFacilityNames =
      facilityNames.join(', ') || 'cerner facility(s)';

    return (
      <div className="usa-alert usa-alert-warning">
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">
            According to our records, you are registered at a clinic within{' '}
            {joinedFacilityNames}. VA providers at this facility and its clinics
            are using the new My VA Health portal.
          </h3>
          <p className="usa-alert-text vads-u-margin-y--4">
            You may need to sign in again to view your VA lab and test results.
            If you do, please sign in with the same account you used to sign in
            here on VA.gov. You also may need to disable your browser&apos;s
            pop-up blocker so that {type} tools are able to open.
          </p>
          {map(callToActions, callToAction => {
            // Derive callToAction properties.
            const headerText = callToAction?.deriveHeaderText(
              joinedFacilityNames,
            );
            const href = callToAction?.href;
            const label = callToAction?.label;

            return (
              <>
                {headerText && (
                  <h3 className="usa-alert-heading">{headerText}</h3>
                )}
                <a
                  className="usa-button vads-u-color--white"
                  href={href}
                  rel="noopener noreferrer"
                >
                  {label}
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
