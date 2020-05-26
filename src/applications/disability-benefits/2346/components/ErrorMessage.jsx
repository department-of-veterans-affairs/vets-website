import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';

const ErrorMessage = ({ errorCode, nextAvailabilityDate }) => {
  let content;
  switch (errorCode) {
    case 'MDOT_SUPPLIES_INELIGIBLE':
      content = (
        <AlertBox
          status="warning"
          headline="You can't reorder your items at this time"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              Our records show that your items aren't available for reorder
              until {moment(nextAvailabilityDate).format('MMMM DD, YYYY')}. You
              can only order items once every 5 months.
            </span>
            <span className="vads-u-margin-top--1">
              If you need an item sooner, call the DLC Customer Service Section
              at <a href="tel:303-273-6200">303-273-6200</a> or email{' '}
              <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </span>
          </div>
        </AlertBox>
      );
      break;
    case 'MDOT_VETERAN_NOT_FOUND':
      content = (
        <AlertBox
          status="warning"
          headline="We can't find your records in our system"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              You can't order hearing aid batteries or accessories at this time
              because we can't find your records in our system or we're missing
              some information needed for you to order.
            </span>

            <span className="vads-u-margin-top--1">
              If you think this is incorrect, call your audiologist to update
              your record.{' '}
              <a
                href="https://www.va.gov/find-locations/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find contact information for your local medical center.
              </a>
            </span>
          </div>
        </AlertBox>
      );
      break;
    case 'MDOT_SUPPLIES_NOT_FOUND':
      content = (
        <AlertBox
          status="warning"
          headline="You can't reorder your items at this time"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>
              You can't order hearing aid batteries or accessories online at
              this time because you haven't placed an order within the past two
              years
            </span>

            <span className="vads-u-margin-top--1">
              If you need to place an order, call the DLC Customer Service
              Section at <a href="tel:303-273-6200">303-273-6200</a> or email{' '}
              <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </span>
          </div>
        </AlertBox>
      );
      break;
    case 'MDOT_DECEASED_VETERAN':
      content = (
        <AlertBox
          status="warning"
          headline="Our records show that this Veteran is deceased"
        >
          <div className="vads-u-display--flex vads-u-flex-direction--column">
            <span>We can't fulfill an order for this Veteran</span>
            <span className="vads-u-margin-top--1">
              If this information is incorrect, please call Veterans Benefits
              Assistance at <a href="tel:800-827-1000">800-827-1000</a>, Monday
              through Friday, 8:00 a.m. to 9:00 p.m. E.T.
            </span>
          </div>
        </AlertBox>
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
