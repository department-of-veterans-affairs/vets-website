// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map, replace } from 'lodash';
import * as Sentry from '@sentry/browser';
// Relative imports.
import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';
import { getButtonType } from 'applications/static-pages/analytics/addButtonLinkListeners';
import { getVamcSystemNameFromVhaId } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { toggleValues } from '~/platform/site-wide/feature-toggles/selectors';

import {
  cernerFacilitiesPropType,
  ehrDataByVhaIdPropType,
  otherFacilitiesPropType,
} from '../../propTypes';
import widgetTypes from '../../../widgetTypes';

function ListItem({ facilities, ehrDataByVhaId }) {
  return facilities.map(facility => {
    // Derive facility properties.
    const id = facility?.facilityId;
    const systemName = getVamcSystemNameFromVhaId(ehrDataByVhaId, id);

    return <li key={id}>{systemName}</li>;
  });
}

export class CernerCallToAction extends Component {
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
      let response = null;
      response = await apiRequest('/va', {
        apiVersion: 'facilities_api/v2',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: facilityIDs.join(',') }),
      });

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

  getFillins = widgetType => {
    if (widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE === widgetType) {
      return {
        cta1: 'manage appointments at',
        cta2: 'appointments',
        featureLocation: 'VA.gov',
      };
    }
    if (widgetTypes.REFILL_TRACK_PRESCRIPTIONS_PAGE === widgetType) {
      return {
        cta1: 'refill prescriptions from',
        cta2: 'medications',
        featureLocation: 'My HealtheVet',
      };
    }
    if (widgetTypes.SECURE_MESSAGING_PAGE === widgetType) {
      return {
        cta1: 'send a secure message to a provider at',
        cta2: 'messages',
        featureLocation: 'My HealtheVet',
      };
    }
    if (widgetTypes.GET_MEDICAL_RECORDS_PAGE === widgetType) {
      return {
        cta1: 'get your medical records from',
        cta2: 'health records',
        featureLocation: 'HealtheVet',
      };
    }
    if (widgetTypes.VIEW_TEST_AND_LAB_RESULTS_PAGE === widgetType) {
      return {
        cta1: 'view lab and test results from',
        cta2: 'health records',
        featureLocation: 'HealtheVet',
      };
    }

    return {
      cta1: '',
      cta2: '',
      featureLocation: '',
    };
  };

  render() {
    const { onCTALinkClick } = this;
    const {
      ehrDataByVhaId,
      cernerFacilities,
      linksHeaderText,
      myVAHealthLink,
      myHealtheVetLink,
      featureStaticLandingPage = false,
      widgetType,
    } = this.props;
    const { error, fetching, facilities } = this.state;

    // Escape early if we are fetching.
    if (fetching) {
      return (
        <div data-testid="cerner-cta-widget">
          <va-loading-indicator message="Loading your information..." />
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
          <va-alert status="error">
            <h3 slot="headline">Something went wrong</h3>
            <p className="vads-u-margin-y--0">
              We’re sorry. Something went wrong on our end. Please try again
              later.
            </p>
          </va-alert>
        </div>
      );
    }

    // Derive MyHealtheVet link text.
    const myHealtheVetLinkText = myHealtheVetLink?.includes('appointments')
      ? 'Go to the VA appointments tool'
      : 'Go to My HealtheVet';

    const fillins = this.getFillins(widgetType);
    return (
      <div
        className={classNames('usa-alert', 'usa-alert-warning', {
          'vads-u-padding-right--0':
            featureStaticLandingPage &&
            widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE === widgetType,
        })}
        data-testid="cerner-cta-widget"
      >
        <div className="usa-alert-body">
          {featureStaticLandingPage &&
            widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE === widgetType && (
              <>
                <h3 className="usa-alert-heading">
                  Choose the right health portal
                </h3>
                <p className="vads-u-font-weight--bold">
                  {`To ${fillins.cta1} ${
                    cernerFacilities.length === 1
                      ? 'this facility'
                      : 'these facilities'
                  }, go to My VA Health:`}
                </p>
                <div className="vads-u-margin-y--1">
                  <ul className="vads-u-margin-left--1p5 vads-u-margin-bottom--1">
                    <ListItem
                      facilities={cernerFacilities}
                      ehrDataByVhaId={ehrDataByVhaId}
                    />
                  </ul>
                  <a
                    className="vads-c-action-link--blue"
                    href={myVAHealthLink}
                    onClick={() => {
                      recordEvent({
                        event: `vaos-cerner-redirect-static-landing-page`,
                      });
                      onCTALinkClick();
                    }}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Go to My VA Health
                  </a>
                </div>
                <va-additional-info trigger="Having trouble opening My VA health?">
                  Try these steps:
                  <ul className="vads-u-margin-left--1p5">
                    <li>Disable your browser's pop-up blocker</li>
                    <li>
                      Sign in to My VA health with the same account you used to
                      sign in to VA.gov
                    </li>
                  </ul>
                </va-additional-info>
                <p className="vads-u-font-weight--bold">
                  {`For any other facility, go to ${fillins.cta2} on ${
                    fillins.featureLocation
                  }.`}
                </p>
                <a
                  className="vads-c-action-link--blue"
                  href={myHealtheVetLink}
                  onClick={onCTALinkClick}
                >
                  {`Go to ${fillins.cta2} on VA.gov`}
                </a>
              </>
            )}
          {((featureStaticLandingPage &&
            widgetTypes.SCHEDULE_VIEW_VA_APPOINTMENTS_PAGE !== widgetType) ||
            featureStaticLandingPage === false) && (
            <>
              <h3 className="usa-alert-heading">
                Your VA health care team may be using our My VA Health portal
              </h3>
              <h4 className="vads-u-margin-y--3">
                Our records show that you&apos;re registered at:
              </h4>

              {/* List of user's facilities */}
              {map(facilities, facility => {
                // Derive facility properties.
                const id = facility?.id;
                const strippedID = replace(id, 'vha_', '');
                const facilityName = facility?.attributes?.name;
                const systemName = getVamcSystemNameFromVhaId(
                  ehrDataByVhaId,
                  strippedID,
                );
                const isCerner = cernerFacilities?.some(
                  cernerFacility => cernerFacility?.facilityId === strippedID,
                );

                return (
                  <p
                    className="usa-alert-text vads-u-margin-bottom--2"
                    key={id}
                  >
                    <strong>{systemName || facilityName}</strong>{' '}
                    {isCerner
                      ? '(Now using My VA Health)'
                      : '(Using My HealtheVet)'}
                  </p>
                );
              })}

              <p className="usa-alert-text">
                Choose a health management portal, depending on your
                provider&apos;s facility. You may need to disable your
                browser&apos;s pop-up blocker to open the portal. If you&apos;re
                prompted to sign in again, use the same account you used to sign
                in on VA.gov.
              </p>

              <h4 className="vads-u-margin-y--3">{linksHeaderText}</h4>

              {/* List of user's facility links */}
              {map(facilities, facility => {
                // Derive facility properties.
                const id = facility?.id;
                const strippedID = replace(id, 'vha_', '');
                const facilityName = facility?.attributes?.name;
                const systemName = getVamcSystemNameFromVhaId(
                  ehrDataByVhaId,
                  strippedID,
                );
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
                      <strong>{systemName || facilityName}</strong>
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
            </>
          )}
        </div>
      </div>
    );
  }
}

CernerCallToAction.defaultProps = {
  ehrDataByVhaId: {},
  cernerFacilities: [],
  otherFacilities: [],
};

CernerCallToAction.propTypes = {
  linksHeaderText: PropTypes.string.isRequired,
  myHealtheVetLink: PropTypes.string.isRequired,
  myVAHealthLink: PropTypes.string.isRequired,
  widgetType: PropTypes.string.isRequired,
  cernerFacilities: cernerFacilitiesPropType,
  ehrDataByVhaId: ehrDataByVhaIdPropType,
  featureStaticLandingPage: PropTypes.bool,
  otherFacilities: otherFacilitiesPropType,
};

const mapStateToProps = state => {
  const featureStaticLandingPage = toggleValues(state)
    .vaOnlineSchedulingStaticLandingPage;
  return { featureStaticLandingPage };
};

export default connect(mapStateToProps)(CernerCallToAction);
