import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BLUE_BACKGROUND,
  HEARING_AID_BATTERIES,
  WHITE_BACKGROUND,
} from '../constants';

class Batteries extends Component {
  handleChecked = (checked, batterySupply) => {
    const { selectedProducts, formData } = this.props;
    let updatedSelectedProducts;
    if (checked) {
      updatedSelectedProducts = [
        ...selectedProducts,
        { productId: batterySupply.productId },
      ];
    } else {
      updatedSelectedProducts = selectedProducts.filter(
        selectedProduct =>
          selectedProduct.productId !== batterySupply.productId,
      );
    }
    const updatedFormData = {
      ...formData,
      selectedProducts: updatedSelectedProducts,
    };
    return this.props.setData(updatedFormData);
  };

  render() {
    const { supplies, selectedProducts, eligibility } = this.props;
    const currentDate = moment();
    const batterySupplies = supplies.filter(
      batterySupply => batterySupply.productGroup === HEARING_AID_BATTERIES,
    );
    const areBatterySuppliesEligible = eligibility.batteries;
    const haveBatteriesBeenOrderedInLastFiveMonths =
      batterySupplies.length > 0 &&
      batterySupplies.every(
        battery => currentDate.diff(battery.lastOrderDate, 'months') <= 5,
      );
    if (!areBatterySuppliesEligible) {
      recordEvent({
        event: 'bam-error',
        'error-key': 'batteries_bam-ineligibility-no-prescription',
      });
    }

    return (
      <>
        {areBatterySuppliesEligible && (
          <>
            <h3 className="vads-u-font-size--h4">
              Select the hearing aids that need batteries
            </h3>
            <p>
              You&apos;ll be sent a 6-month supply of batteries for each device
              you choose below. You can only order batteries for each device
              once every 5 months.
            </p>
            <p>
              If you need unavailable batteries sooner, call the DLC Customer
              Service Station at{' '}
              <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
                303-273-6200
              </a>{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </>
        )}
        {haveBatteriesBeenOrderedInLastFiveMonths &&
          !areBatterySuppliesEligible && (
            <>
              <AlertBox
                headline="You can't add batteries to your order at this time"
                content={
                  <>
                    <p>
                      You can't add batteries for your hearing aids because:
                    </p>
                    <ul>
                      <li>
                        They don't require batteries,{' '}
                        <span className="vads-u-font-weight--bold">or</span>
                      </li>
                      <li>
                        You recently reordered batteries for this device. You
                        can only reorder batteries for each device once every 5
                        months.
                      </li>
                    </ul>
                    <p>
                      If you need unavailable batteries sooner, call the DLC
                      Customer Service Station at{' '}
                      <a
                        aria-label="3 0 3. 2 7 3. 6 2 0 0."
                        href="tel:303-273-6200"
                      >
                        303-273-6200
                      </a>{' '}
                      or email{' '}
                      <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                    </p>
                  </>
                }
                status="info"
                isVisible
              />
              <p className="vads-u-font-weight--bold">
                These are the hearing aids we have on file fo you:
              </p>
            </>
          )}
        {!haveBatteriesBeenOrderedInLastFiveMonths &&
          !areBatterySuppliesEligible && (
            <AlertBox
              headline="Your batteries aren't available for online ordering"
              content={
                <>
                  <p>You can't add batteries for your hearing aids because:</p>
                  <ul>
                    <li>
                      They don't require batteries,{' '}
                      <span className="vads-u-font-weight--bold">or</span>
                    </li>
                    <li>
                      You haven't placed an order for hearing aid batteries
                      within the past 2 years.
                    </li>
                  </ul>
                  <p>
                    If you need unavailable batteries sooner, call the DLC
                    Customer Service Station at{' '}
                    <a
                      aria-label="3 0 3. 2 7 3. 6 2 0 0."
                      href="tel:303-273-6200"
                    >
                      303-273-6200
                    </a>{' '}
                    or email{' '}
                    <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                  </p>
                </>
              }
              status="info"
              isVisible
            />
          )}
        {batterySupplies.length > 0 &&
          batterySupplies.map(batterySupply => (
            <div
              key={batterySupply.productId}
              className="vads-u-background-color--gray-lightest vads-u-padding-left--4 vads-u-padding-top--1 vads-u-padding-bottom--4 battery-page vads-u-margin-y--3"
            >
              <h4 className="vads-u-font-size--md vads-u-font-weight--bold">
                {batterySupply.deviceName}
              </h4>
              <p>
                Prescribed{' '}
                {moment(batterySupply.prescribedDate).format('MMMM DD, YYYY')}
              </p>
              <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
                <div className="usa-alert-body vads-u-padding-left--1">
                  <p className="vads-u-margin--1px vads-u-margin-y--1">
                    <span className="vads-u-font-weight--bold">Battery: </span>
                    {batterySupply.productId}
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
                <AlertBox
                  className="vads-u-color--black vads-u-background-color--white"
                  headline={`You can't reorder batteries for this device until ${moment(
                    batterySupply.nextAvailabilityDate,
                  ).format('MMMM D, YYYY')}`}
                  status="warning"
                />
              ) : (
                <div
                  className={
                    selectedProducts.find(
                      selectedProduct =>
                        selectedProduct.productId === batterySupply.productId,
                    )
                      ? BLUE_BACKGROUND
                      : WHITE_BACKGROUND
                  }
                >
                  <input
                    name={batterySupply.productId}
                    type="checkbox"
                    onChange={e =>
                      this.handleChecked(e.target.checked, batterySupply)
                    }
                    checked={
                      !!selectedProducts.find(
                        selectedProduct =>
                          selectedProduct.productId === batterySupply.productId,
                      )
                    }
                  />
                  <label htmlFor={batterySupply.productId} className="main">
                    Order batteries for this device
                  </label>
                </div>
              )}
            </div>
          ))}
        {batterySupplies.length > 0 && (
          <AdditionalInfo triggerText="What if I don't see my hearing aid?">
            <p>
              You'll need to call your audiologist to update your record with
              all your hearing devices.
            </p>
            <a
              href="https://www.va.gov/find-locations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find contact information for your local VA medical center
            </a>
          </AdditionalInfo>
        )}
      </>
    );
  }
}

Batteries.defaultProps = {
  formData: {},
  supplies: [],
  selectedProducts: [],
  eligibility: {},
};

Batteries.propTypes = {
  supplies: PropTypes.arrayOf(
    PropTypes.shape({
      deviceName: PropTypes.string,
      productName: PropTypes.string,
      productGroup: PropTypes.string.isRequired,
      productId: PropTypes.string.isRequired,
      availableForReorder: PropTypes.bool,
      lastOrderDate: PropTypes.string.isRequired,
      nextAvailabilityDate: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      size: PropTypes.string,
      prescribedDate: PropTypes.string,
    }),
  ),
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string,
    }),
  ),
  formData: PropTypes.object,
  eligibility: PropTypes.object,
};

const mapStateToProps = state => ({
  supplies: state.form?.data?.supplies,
  formData: state.form?.data,
  selectedProducts: state.form?.data?.selectedProducts,
  eligibility: state.form?.data?.eligibility,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Batteries);
