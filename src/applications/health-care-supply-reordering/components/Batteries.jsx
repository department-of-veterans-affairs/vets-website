import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import classnames from 'classnames';
import moment from 'moment';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
// FIXME: figure out why cypress doesn't like this import.
import recordEvent from 'platform/monitoring/record-event';

import { BATTERY, DLC_PHONE } from '../constants';

class Batteries extends Component {
  componentDidMount() {
    const areBatterySuppliesEligible = this.props.eligibility?.batteries;
    if (!areBatterySuppliesEligible) {
      recordEvent({
        event: 'bam-error',
        'error-key': 'batteries_bam-ineligibility-no-prescription',
      });
    }
  }

  handleChecked = (checked, batterySupply) => {
    const { order, formData } = this.props;
    let updatedOrder;
    const isSupplyChecked = checked ? 'yes' : 'no';
    recordEvent({
      event: 'bam-form-change',
      'bam-form-field': 'batteries-for-this-device',
      'bam-product-selected': isSupplyChecked,
      'device-name': batterySupply.deviceName,
      'product-name': batterySupply.productName,
      'product-id': batterySupply.productId,
    });
    if (checked) {
      updatedOrder = [...order, { productId: batterySupply.productId }];
    } else {
      updatedOrder = order.filter(
        selectedProduct =>
          selectedProduct.productId !== batterySupply.productId,
      );
    }
    const updatedFormData = {
      ...formData,
      order: updatedOrder,
    };
    return this.props.setData(updatedFormData);
  };

  render() {
    const { supplies, order, eligibility } = this.props;
    const currentDate = moment();
    const batterySupplies = supplies.filter(
      batterySupply => batterySupply.productGroup === BATTERY,
    );
    const areBatterySuppliesEligible = eligibility.batteries;
    const haveBatteriesBeenOrderedInLastTwoYears =
      batterySupplies.length > 0 &&
      batterySupplies.every(
        battery => currentDate.diff(battery.lastOrderDate, 'years') <= 2,
      );
    const isBatterySelected = batteryProductId => {
      const selectedProductIds = order.map(
        selectedProduct => selectedProduct.productId,
      );
      return selectedProductIds.includes(batteryProductId);
    };

    return (
      <div className="battery-page">
        {batterySupplies.length > 0 && (
          <h3 className="vads-u-font-size--h4 vads-u-margin-bottom--2p5">
            Select the hearing aids that need batteries
          </h3>
        )}
        {!haveBatteriesBeenOrderedInLastTwoYears &&
          !areBatterySuppliesEligible && (
            <va-alert status="info" visible>
              <h3 slot="headline">
                Your batteries aren’t available for online ordering
              </h3>
              <div className="batteries-two-year-alert-content">
                <p>You can’t add batteries for your hearing aids because:</p>
                <ul>
                  <li>
                    They don’t require batteries,{' '}
                    <span className="vads-u-font-weight--bold">or</span>
                  </li>
                  <li>
                    You haven’t placed an order for hearing aid batteries within
                    the past 2 years.
                  </li>
                </ul>
                <p>
                  If you need unavailable batteries sooner, call the DLC
                  Customer Service Section at{' '}
                  <va-telephone contact={DLC_PHONE} /> or email{' '}
                  <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                </p>
              </div>
            </va-alert>
          )}
        {batterySupplies.length > 0 &&
          haveBatteriesBeenOrderedInLastTwoYears &&
          batterySupplies.map(batterySupply => (
            <div
              key={batterySupply.productId}
              className={classnames({
                'vads-u-background-color--gray-lightest vads-u-margin-bottom--2 vads-u-margin-top--3': true,
                'vads-u-border-color--primary vads-u-border--3px vads-u-padding--21 dd-privacy-mask': isBatterySelected(
                  batterySupply.productId,
                ),
                'vads-u-padding--3 dd-privacy-mask': !isBatterySelected(
                  batterySupply.productId,
                ),
              })}
            >
              <h4 className="vads-u-margin-top--0 dd-privacy-mask">
                {batterySupply.deviceName}
              </h4>
              <p>
                Prescribed{' '}
                {moment(batterySupply.prescribedDate).format('MMMM DD, YYYY')}
              </p>
              <div className="vads-u-border-left--10px vads-u-border-color--primary-alt vads-u-margin-bottom--2">
                <div className="usa-alert-body vads-u-padding-left--1">
                  <p className="vads-u-margin--1px vads-u-margin-y--1">
                    <span className="vads-u-font-weight--bold dd-privacy-mask">
                      Battery:{' '}
                    </span>
                    {batterySupply.productName}
                  </p>
                  <p className="vads-u-margin--1px vads-u-margin-y--1">
                    <span className="vads-u-font-weight--bold">Quantity: </span>
                    {batterySupply.quantity}
                  </p>
                  <p className="vads-u-margin--1px vads-u-margin-y--1">
                    <span className="vads-u-font-weight--bold">
                      Last order date:{' '}
                    </span>{' '}
                    {moment(batterySupply.lastOrderDate).format('MM/DD/YYYY')}
                  </p>
                </div>
              </div>
              {currentDate.diff(batterySupply.nextAvailabilityDate, 'days') <
              0 ? (
                <va-alert status="warning">
                  <h3 className="usa-alert-heading vads-u-font-family--sans">
                    You can't reorder batteries for this device until{' '}
                    {moment(batterySupply.nextAvailabilityDate).format(
                      'MMMM D, YYYY',
                    )}
                  </h3>
                </va-alert>
              ) : (
                <div>
                  <VaCheckbox
                    id={batterySupply.productId}
                    className="vads-u-margin-left--0"
                    onVaChange={e =>
                      this.handleChecked(e.target.checked, batterySupply)
                    }
                    checked={isBatterySelected(batterySupply.productId)}
                    label="Order batteries for this device"
                  />
                </div>
              )}
            </div>
          ))}
        {batterySupplies.length > 0 && (
          <va-additional-info trigger="What if my device isn’t listed here?">
            <p>
              Your hearing aid device may not be listed here if you haven’t
              placed an order for resupply items within the last 2 years. If you
              need to order batteries, call the DLC Customer Service Section at
              <va-telephone
                contact={DLC_PHONE}
                className="vads-u-margin--0p5"
              />
              or email
              <a
                href="mailto:dalc.css@va.gov"
                className="vads-u-margin-left--0p5"
              >
                dalc.css@va.gov
              </a>
              .
            </p>
            <p>
              If you need a new hearing aid device, you'll need to call your
              audiologist.
            </p>
            <a
              href="https://www.va.gov/find-locations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find contact information for your local VA medical center.
            </a>
          </va-additional-info>
        )}
      </div>
    );
  }
}

Batteries.defaultProps = {
  formData: {},
  supplies: [],
  order: [],
  eligibility: {},
};

Batteries.propTypes = {
  eligibility: PropTypes.object,
  formData: PropTypes.object,
  order: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number,
    }),
  ),
  setData: PropTypes.func,
  supplies: PropTypes.arrayOf(
    PropTypes.shape({
      deviceName: PropTypes.string,
      productName: PropTypes.string,
      productGroup: PropTypes.string.isRequired,
      productId: PropTypes.number.isRequired,
      availableForReorder: PropTypes.bool,
      lastOrderDate: PropTypes.string.isRequired,
      nextAvailabilityDate: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      size: PropTypes.string,
      prescribedDate: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  supplies: state.form?.data?.supplies,
  formData: state.form?.data,
  order: state.form?.data?.order,
  eligibility: state.form?.data?.eligibility,
  setData: PropTypes.func,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Batteries);
