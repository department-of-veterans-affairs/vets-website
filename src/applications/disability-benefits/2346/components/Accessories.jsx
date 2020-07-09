import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import classnames from 'classnames';
import moment from 'moment';
import { setData } from 'platform/forms-system/src/js/actions';
import recordEvent from 'platform/monitoring/record-event';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ACCESSORIES } from '../constants';

class Accessories extends Component {
  componentDidMount(props) {
    const areAccessorySuppliesEligible = this.props.eligibility?.accessories;
    if (!areAccessorySuppliesEligible) {
      recordEvent({
        event: 'bam-error',
        'error-key': 'accessories_bam-ineligibility-no-prescription',
      });
    }
  }

  handleChecked = (checked, accessorySupply) => {
    const { order, formData } = this.props;
    let updatedOrder;
    const isSupplyChecked = checked ? 'yes' : 'no';
    recordEvent({
      event: 'bam-form-change',
      'bam-form-field': 'accessories-for-this-device',
      'bam-product-selected': isSupplyChecked,
      'product-name': accessorySupply.productName,
      'product-id': accessorySupply.productId,
    });
    if (checked) {
      updatedOrder = [...order, { productId: accessorySupply.productId }];
    } else {
      updatedOrder = order.filter(
        selectedProduct =>
          selectedProduct.productId !== accessorySupply.productId,
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
    const accessorySupplies = supplies.filter(
      supply => supply.productGroup === ACCESSORIES,
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
    const earliestAvailableDateForReordering = accessorySupplyAvailabilityDates.sort()[0];

    const isAccessorySelected = accessoryProductId => {
      const selectedProductIds = order.map(
        selectedProduct => selectedProduct.productId,
      );
      return selectedProductIds.includes(accessoryProductId);
    };
    return (
      <div className="accessory-page">
        {accessorySupplies.length > 0 && (
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--5">
            Select the hearing aid accessories you need
          </h3>
        )}
        {!haveAccessoriesBeenOrderedInLastFiveMonths &&
          haveAccessoriesBeenOrderedInLastTwoYears &&
          !areAccessorySuppliesEligible &&
          accessorySupplies.length === 0 && (
            <>
              <AlertBox
                headline="You can't add accessories to your order at this time"
                content={
                  <>
                    <p>
                      Our records show that your accessories aren't available
                      for reorder until{' '}
                      {moment(earliestAvailableDateForReordering).format(
                        'MMMM D, YYYY',
                      )}
                      . You can only order items once every 5 months.
                    </p>
                    <p>
                      If you need unavailable batteries sooner, call the DLC
                      Customer Service Section at{' '}
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
                    Section at{' '}
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
              className={classnames({
                'vads-u-background-color--gray-lightest vads-u-margin-y--3': true,
                'vads-u-border-color--primary vads-u-border--3px vads-u-padding--21': isAccessorySelected(
                  accessorySupply.productId,
                ),
                'vads-u-padding--3': !isAccessorySelected(
                  accessorySupply.productId,
                ),
              })}
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
                <div className="usa-alert usa-alert-warning vads-u-background-color--white vads-u-padding-x--2p5 vads-u-padding-y--2 vads-u-width--full">
                  <div className="usa-alert-body">
                    <h3 className="usa-alert-heading vads-u-font-family--sans">
                      You can't order this accessory online until{' '}
                      {moment(accessorySupply.nextAvailabilityDate).format(
                        'MMMM D, YYYY',
                      )}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="vads-u-max-width--226">
                  <input
                    id={accessorySupply.productId}
                    className="vads-u-margin-left--0 vads-u-max-width--226"
                    type="checkbox"
                    onChange={e =>
                      this.handleChecked(e.target.checked, accessorySupply)
                    }
                    checked={isAccessorySelected(accessorySupply.productId)}
                  />
                  <label
                    htmlFor={accessorySupply.productId}
                    className={classnames({
                      'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary': true,
                      'vads-u-color--white': isAccessorySelected(
                        accessorySupply.productId,
                      ),
                      'vads-u-background-color--white vads-u-color--primary': !isAccessorySelected(
                        accessorySupply.productId,
                      ),
                    })}
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
              You may not see the accessories you need if you haven't placed an
              order for resupply items within the last 2 years. If you need an
              accessory that hasn't been ordered within the last 2 years, call
              the DLC Customer Service Section at{' '}
              <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
                303-273-6200
              </a>{' '}
              or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov.</a>
            </p>
            <p>
              If you need a smaller dome for your hearing aid, you'll need to
              call your audiologist.
            </p>
            <a
              href="https://www.va.gov/find-locations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Find contact information for your local VA medical center.
            </a>
          </AdditionalInfo>
        )}
      </div>
    );
  }
}

Accessories.defaultProps = {
  formData: {},
  supplies: [],
  order: [],
  eligibility: {},
};

Accessories.propTypes = {
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
    }),
  ),
  order: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number,
    }),
  ),
  eligibility: PropTypes.object,
};

const mapStateToProps = state => ({
  supplies: state.form?.data?.supplies,
  formData: state.form?.data,
  order: state.form?.data?.order,
  eligibility: state.form?.data?.eligibility,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Accessories);
