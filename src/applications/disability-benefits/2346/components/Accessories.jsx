import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import moment from 'moment';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
// FIXME: figure out why cypress doesn't like this import.
import recordEvent from 'platform/monitoring/record-event';

import { ACCESSORY, DLC_PHONE } from '../constants';

class Accessories extends Component {
  componentDidMount() {
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
      supply => supply.productGroup === ACCESSORY,
    );
    const areAccessorySuppliesEligible = eligibility.accessories;
    const haveAccessoriesBeenOrderedInLastTwoYears =
      accessorySupplies.length > 0 &&
      accessorySupplies.every(
        accessory => currentDate.diff(accessory.lastOrderDate, 'years') <= 2,
      );

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
        {!haveAccessoriesBeenOrderedInLastTwoYears &&
          !areAccessorySuppliesEligible && (
            <va-alert status="info" visible>
              <h3 slot="headline">
                You can’t add accessories to your order at this time
              </h3>
              <div className="accessories-two-year-alert-content">
                <p>
                  You can only order accessories that you’ve received in the
                  past 2 years.
                </p>
                <p>
                  If you need accessories like domes, wax guards, cleaning
                  supplies, or dessicant, call the DLC Customer Service Section
                  at <va-telephone contact={DLC_PHONE} /> or email{' '}
                  <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                </p>
              </div>
            </va-alert>
          )}
        {accessorySupplies.length > 0 &&
          haveAccessoriesBeenOrderedInLastTwoYears &&
          accessorySupplies.map(accessorySupply => (
            <div
              key={accessorySupply.productId}
              className={classnames({
                'vads-u-background-color--gray-lightest vads-u-margin-y--3': true,
                'vads-u-border-color--primary vads-u-border--3px vads-u-padding--21 dd-privacy-mask': isAccessorySelected(
                  accessorySupply.productId,
                ),
                'vads-u-padding--3 dd-privacy-mask': !isAccessorySelected(
                  accessorySupply.productId,
                ),
              })}
            >
              <h4 className="vads-u-font-size--md vads-u-margin-top--0 dd-privacy-mask">
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
                <div>
                  <input
                    id={accessorySupply.productId}
                    className="vads-u-margin-left--0"
                    type="checkbox"
                    onChange={e =>
                      this.handleChecked(e.target.checked, accessorySupply)
                    }
                    checked={isAccessorySelected(accessorySupply.productId)}
                  />
                  <label
                    htmlFor={accessorySupply.productId}
                    className={classnames({
                      'usa-button vads-u-font-weight--bold vads-u-border--2px vads-u-border-color--primary vads-u-text-align--left vads-u-padding-x--2': true,
                      'vads-u-color--white': isAccessorySelected(
                        accessorySupply.productId,
                      ),
                      'vads-u-background-color--white vads-u-color--primary': !isAccessorySelected(
                        accessorySupply.productId,
                      ),
                    })}
                  >
                    <span className="icon-wrap">
                      <va-icon icon="check" size={3} />
                    </span>
                    Order this hearing aid accessory
                  </label>
                </div>
              )}
            </div>
          ))}
        {accessorySupplies.length > 0 && (
          <va-additional-info
            trigger="What if the accessories I need aren’t listed here?"
            className="vads-u-margin-bottom--2"
          >
            <p>
              The accessories you need may not be listed here if you haven’t
              placed an order for resupply items within the last 2 years. If you
              need an accessory that hasn’t been ordered within the last 2
              years, call the DLC Customer Service Section at{' '}
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
          </va-additional-info>
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
    }),
  ),
};

const mapStateToProps = state => ({
  eligibility: state.form?.data?.eligibility,
  formData: state.form?.data,
  order: state.form?.data?.order,
  supplies: state.form?.data?.supplies,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Accessories);
