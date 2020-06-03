import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HEARING_AID_ACCESSORIES } from '../constants';

class Accessories extends Component {
  handleChecked = (checked, supply) => {
    const { selectedProducts, formData } = this.props;
    let updatedSelectedProducts;
    if (checked) {
      updatedSelectedProducts = [
        ...selectedProducts,
        { productId: supply.productId },
      ];
    } else {
      updatedSelectedProducts = selectedProducts.filter(
        selectedProduct => selectedProduct.productId !== supply.productId,
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
    const accessorySupplies = supplies.filter(
      supply => supply.productGroup === HEARING_AID_ACCESSORIES,
    );
    const areAccessorySuppliesEligible = eligibility.accessories;
    const haveAccessoriesBeenOrderedInLastFiveMonths =
      accessorySupplies.length > 0 &&
      accessorySupplies.every(
        accessory => currentDate.diff(accessory.lastOrderDate, 'months') <= 5,
      );
    const haveAccessoriesBeenOrderedInLastTwoYears =
      accessorySupplies.length > 0 &&
      accessorySupplies.every(
        accessory => currentDate.diff(accessory.lastOrderDate, 'years') <= 2,
      );
    const accessorySupplyAvailabilityDates = accessorySupplies.map(
      accessorySupply => accessorySupply.nextAvailabilityDate,
    );
    const earliestAvailabilityDate = accessorySupplyAvailabilityDates.sort()[0];

    if (!areAccessorySuppliesEligible) {
      recordEvent({
        event: 'bam-error',
        'error-key': 'accessories_bam-ineligibility-no-prescription',
      });
    }
    return (
      <div className="accessory-page">
        {areAccessorySuppliesEligible && (
          <>
            <h3 className="vads-u-font-size--h4">
              Select the hearing aid accessories you need
            </h3>
            <p>
              You'll be sent a 6-month supply for each accessory you choose
              below. You can only order each hearing aid accessory once every 5
              months.
            </p>
            <p>
              If you need unavailable items sooner, call the DLC Customer
              Service Station at{' '}
              <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
                303-273-6200
              </a>{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </>
        )}
        {!haveAccessoriesBeenOrderedInLastFiveMonths &&
          haveAccessoriesBeenOrderedInLastTwoYears &&
          !areAccessorySuppliesEligible && (
            <>
              <AlertBox
                headline="You can't add accessories to your order at this time"
                content={
                  <>
                    <p>
                      Our records show that your accessories aren't available
                      for reorder until{' '}
                      {moment(earliestAvailabilityDate).format('MMMM D, YYYY')}.
                      You can only order items once every 5 months.
                    </p>
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
                These are the hearing aid accessories we have on file fo you:
              </p>
            </>
          )}
        {!haveAccessoriesBeenOrderedInLastTwoYears &&
          !haveAccessoriesBeenOrderedInLastFiveMonths &&
          !areAccessorySuppliesEligible && (
            <AlertBox
              headline="You can't add accessories to your order at this time"
              content={
                <>
                  <p>
                    You can only order accessories that you've received in the
                    past 2 years.
                  </p>
                  <p>
                    If you need accessories like domes, wax guards, cleaning
                    supplies, or dessicant, call the DLC Customer Service
                    Station at{' '}
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
        {accessorySupplies.length > 0 &&
          haveAccessoriesBeenOrderedInLastTwoYears &&
          accessorySupplies.map(accessorySupply => (
            <div
              key={accessorySupply.productId}
              className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-y--3 accessory-page"
            >
              <h4 className="vads-u-font-size--md vads-u-margin-top--0">
                {accessorySupply.productName}
              </h4>
              <div className="vads-u-border-color--gray-lightest">
                <div className="usa-alert-body">
                  <p className="vads-u-margin-y--1p5">
                    <span className="vads-u-font-weight--bold">Quantity: </span>
                    {accessorySupply.quantity}
                  </p>
                  <p className="vads-u-margin-y--1p5">
                    <span className="vads-u-font-weight--bold">
                      Last order date:{' '}
                    </span>{' '}
                    {moment(accessorySupply.lastOrderDate).format('MM/DD/YYYY')}
                  </p>
                </div>
              </div>
              {currentDate.diff(accessorySupply.nextAvailabilityDate, 'days') <
              0 ? (
                <AlertBox
                  className="vads-u-color--black vads-u-background-color--white"
                  headline={`You can't order this accessory online until ${moment(
                    accessorySupply.nextAvailabilityDate,
                  ).format('MMMM D, YYYY')}`}
                  status="warning"
                />
              ) : (
                <div>
                  <input
                    id={accessorySupply.productId}
                    type="checkbox"
                    onChange={e =>
                      this.handleChecked(e.target.checked, accessorySupply)
                    }
                    checked={
                      !!selectedProducts.find(
                        selectedProduct =>
                          selectedProduct.productId ===
                          accessorySupply.productId,
                      )
                    }
                  />
                  <label
                    htmlFor={accessorySupply.productId}
                    className={`usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary ${
                      selectedProducts.find(
                        selectedProduct =>
                          selectedProduct.productId ===
                          accessorySupply.productId,
                      )
                        ? 'vads-u-color--white'
                        : 'vads-u-background-color--white vads-u-color--primary'
                    }`}
                  >
                    Order this accessory
                  </label>
                </div>
              )}
            </div>
          ))}
        {accessorySupplies.length > 0 && (
          <AdditionalInfo triggerText="What if I don't see the accessories I need?">
            <p>
              If you need a different accessory or an adjustment to an available
              item, call the DLC Customer Service Station at{' '}
              <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
                303-273-6200
              </a>{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
            </p>
          </AdditionalInfo>
        )}
      </div>
    );
  }
}

Accessories.defaultProps = {
  formData: {},
  supplies: [],
  selectedProducts: [],
  eligibility: {},
};

Accessories.propTypes = {
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
    }),
  ),
  selectedProducts: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.string,
    }),
  ),
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
)(Accessories);
