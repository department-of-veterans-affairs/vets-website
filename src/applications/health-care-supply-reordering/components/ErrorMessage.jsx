import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

const ErrorMessage = ({ errorCode, nextAvailabilityDate }) => {
  const supplyDescription = 'hearing aid or CPAP supplies';

  let content;
  switch (errorCode) {
    case 'MDOT_SUPPLIES_INELIGIBLE':
      content = (
        <va-alert status="warning">
          <h3 slot="headline">You can’t reorder your items at this time</h3>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              Our records show that your items aren’t available for reorder
              until {moment(nextAvailabilityDate).format('MMMM DD, YYYY')}. You
              can only order items once every 5 months.
            </span>
            <span className="vads-u-margin-top--1">
              If you need an item sooner, call the DLC Customer Service Section
              at <va-telephone contact="3032736200" /> or email{' '}
              <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </span>
          </div>
        </va-alert>
      );
      break;
    case 'MDOT_INVALID':
      content = (
        <va-alert status="warning">
          <h3 slot="headline">We can’t find your records in our system</h3>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              You can’t order {supplyDescription} at this time because we can’t
              find your records in our system or we’re missing some information
              needed for you to order.
            </span>

            <span className="vads-u-margin-top--1">
              If you think this is incorrect, call your health care provider to
              update your record.{' '}
              <a
                href="https://www.va.gov/find-locations/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find contact information for your local medical center.
              </a>
            </span>
          </div>
        </va-alert>
      );
      break;
    case 'MDOT_SUPPLIES_NOT_FOUND':
      content = (
        <va-alert status="warning">
          <h3 slot="headline">You can’t reorder your items at this time</h3>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              You can’t order {supplyDescription} online at this time because
              you haven’t placed an order within the past two years
            </span>

            <span className="vads-u-margin-top--1">
              If you need to place an order, call the DLC Customer Service
              Section at <va-telephone contact="3032736200" /> or email{' '}
              <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </span>
          </div>
        </va-alert>
      );
      break;
    case 'MDOT_DECEASED':
      content = (
        <va-alert status="warning">
          <h3 slot="headline">
            Our records show that this Veteran is deceased
          </h3>
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>We can’t fulfill an order for this Veteran</span>
            <span className="vads-u-margin-top--1">
              If this information is incorrect, please call Veterans Benefits
              Assistance at <va-telephone contact="8008271000" />, Monday
              through Friday, 8:00 a.m. to 9:00 p.m. E.T.
            </span>
          </div>
        </va-alert>
      );
      break;
    case 'MDOT_SERVICE_UNAVAILABLE':
    case 'MDOT_SERVER_ERROR':
      content = (
        <va-alert status="warning">
          <h3 slot="headline">This application is down for maintenance.</h3>
          <div className="mdot-server-error-alert">
            <p>
              We’re making some updates to this tool. We’re sorry it’s not
              working right now. Please check back soon."
            </p>
          </div>
        </va-alert>
      );
      break;
    default:
      break;
  }
  return content;
};

const mapStateToProps = state => ({
  errorCode: state.mdot.errorCode,
  nextAvailabilityDate: state.mdot.nextAvailabilityDate,
});
export default connect(mapStateToProps)(ErrorMessage);
