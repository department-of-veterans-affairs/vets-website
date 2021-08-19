// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map, replace } from 'lodash';
import * as Sentry from '@sentry/browser';
// Relative imports.
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import environment from 'platform/utilities/environment';
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { appointmentsToolLink } from 'platform/utilities/cerner';
import { getButtonType } from 'applications/static-pages/analytics/addButtonLinkListeners';

export class CernerCallToAction extends Component {
  static defaultProps = {
    cernerFacilities: [],
    otherFacilities: [],
  };

  static propTypes = {
    cernerFacilities: PropTypes.arrayOf(
      PropTypes.shape({
        facilityId: PropTypes.string.isRequired,
        isCerner: PropTypes.bool.isRequired,
      }).isRequired,
    ),
    otherFacilities: PropTypes.arrayOf(
      PropTypes.shape({
        facilityId: PropTypes.string.isRequired,
        isCerner: PropTypes.bool.isRequired,
      }).isRequired,
    ),
    linksHeaderText: PropTypes.string.isRequired,
    myVAHealthLink: PropTypes.string.isRequired,
    myHealtheVetLink: PropTypes.string.isRequired,
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
    const { cernerFacilities, otherFacilities } = this.props;

    const facilities = [...cernerFacilities, ...otherFacilities];

    // Escape early if there are no facilities.
    if (isEmpty(facilities)) {
      Sentry.withScope(scope => {
        scope.setExtra('facilities', facilities);
        Sentry.captureMessage(`Facilities - unexpected empty facilities`);
      });
      return;
    }

    // Derive the list of facility IDs.
    const facilityIDs = map(
      facilities,
      facility => `vha_${facility.facilityId}`,
    );

    // Fetch cerner facilities.
    this.fetchFacilities(facilityIDs);
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

  onCTALinkClick = event => {
    const style = window.getComputedStyle(event.target);

    recordEvent({
      event: 'cta-button-click',
      'button-type': getButtonType(event.target.classList),
      'button-click-label': event.target.text,
      'button-background-color': style.getPropertyValue('background-color'),
    });
  };

  render() {
    const { onCTALinkClick } = this;
    const {
      cernerFacilities,
      linksHeaderText,
      myVAHealthLink,
      myHealtheVetLink,
    } = this.props;
    const { error, fetching, facilities } = this.state;

    // Escape early if we are fetching.
    if (fetching) {
      return (
        <div data-testid="cerner-cta-widget">
          <LoadingIndicator message="Loading your information..." />
        </div>
      );
    }

    // Escape early if there was an error fetching the Cerner facilities.
    if (error || isEmpty(facilities)) {
      // WARNING: Add sentry logging here if there is an error fetching Cerner facilities.
      Sentry.withScope(scope => {
        scope.setExtra('error', error);
        scope.setExtra('facilities', facilities);
        Sentry.captureMessage(
          `Facilities - unexpected empty facilities or error`,
        );
      });
      return (
        <div data-testid="cerner-cta-widget">
          <AlertBox
            headline="Something went wrong"
            content="We’re sorry. Something went wrong on our end. Please try again later."
            status="error"
          />
        </div>
      );
    }

    // Derive MyHealtheVet link text.
    const myHealtheVetLinkText =
      myHealtheVetLink === appointmentsToolLink
        ? 'Go to the VA appointments tool'
        : 'Go to My HealtheVet';

    return (
      <div
        className="usa-alert usa-alert-warning"
        data-testid="cerner-cta-widget"
      >
        <div className="usa-alert-body">
          <h3 className="usa-alert-heading">
            Your VA health care team may be using our new My VA Health portal
          </h3>
          <h4 className="vads-u-margin-y--3">
            Our records show that you&apos;re registered at:
          </h4>

          {/* List of user's facilities */}
          {map(facilities, facility => {
            // Derive facility properties.
            const id = facility?.id;
            const strippedID = replace(id, 'vha_', '');
            const name = facility?.attributes?.name;
            const isCerner = cernerFacilities?.some(
              cernerFacility => cernerFacility?.facilityId === strippedID,
            );

            return (
              <p className="usa-alert-text vads-u-margin-bottom--2" key={id}>
                <strong>{name}</strong>{' '}
                {isCerner
                  ? '(Now using My VA Health)'
                  : '(Using My HealtheVet)'}
              </p>
            );
          })}

          <p className="usa-alert-text">
            Please choose a health management portal below, depending on your
            provider&apos;s facility. You may need to disable your
            browser&apos;s pop-up blocker to open the portal. If you&apos;re
            prompted to sign in again, use the same account you used to sign in
            on VA.gov.
          </p>

          <h4 className="vads-u-margin-y--3">{linksHeaderText}</h4>

          {/* List of user's facility links */}
          {map(facilities, facility => {
            // Derive facility properties.
            const id = facility?.id;
            const strippedID = replace(id, 'vha_', '');
            const name = facility?.attributes?.name;
            const isCerner = cernerFacilities?.some(
              cernerFacility => cernerFacility?.facilityId === strippedID,
            );

            // Derive the link text/label.
            const linkText = isCerner
              ? 'Go to My VA Health'
              : myHealtheVetLinkText;

            return (
              <div key={`${id}-cta-link`}>
                <p className="vads-u-margin-bottom--1">
                  <strong>{name}</strong>
                </p>
                <a
                  className="usa-button vads-u-color--white vads-u-margin-top--0 vads-u-margin-bottom--4"
                  href={isCerner ? myVAHealthLink : myHealtheVetLink}
                  onClick={onCTALinkClick}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {linkText}
                </a>
              </div>
            );
          })}

          <div>
            <p className="vads-u-margin-bottom--1">
              <strong>Another VA health facility</strong>
            </p>
            <a
              className="usa-button usa-button-secondary vads-u-color--primary vads-u-margin-top--0 vads-u-margin-bottom--2"
              href={myHealtheVetLink}
              onClick={onCTALinkClick}
              rel="noreferrer noopener"
              target="_blank"
            >
              {myHealtheVetLinkText}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default CernerCallToAction;
