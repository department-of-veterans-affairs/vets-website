import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import moment from 'moment';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { setData } from '@department-of-veterans-affairs/platform-forms-system/actions';
// import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
// FIXME: figure out why cypress doesn't like this import.
import recordEvent from 'platform/monitoring/record-event';

import { APNEA, DLC_PHONE } from '../constants';

class ApneaSupplies extends Component {
  componentDidMount() {
    const areApneaSuppliesEligible = this.props.eligibility?.apneas;
    if (!areApneaSuppliesEligible) {
      recordEvent({
        event: 'bam-error',
        'error-key': 'apnea-supplies_bam-ineligibility-no-prescription',
      });
    }
  }

  handleChecked = (checked, apneaSupply) => {
    const { order, formData } = this.props;
    let updatedOrder;
    const isSupplyChecked = checked ? 'yes' : 'no';
    recordEvent({
      event: 'bam-form-change',
      'bam-form-field': 'apnea-supplies-for-this-device',
      'bam-product-selected': isSupplyChecked,
      'product-name': apneaSupply.productName,
      'product-id': apneaSupply.productId,
    });
    if (checked) {
      updatedOrder = [...order, { productId: apneaSupply.productId }];
    } else {
      updatedOrder = order.filter(
        selectedProduct => selectedProduct.productId !== apneaSupply.productId,
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
    const apneaSupplies = supplies.filter(
      supply => supply.productGroup === APNEA,
    );
    const areApneaSuppliesEligible = eligibility.apneas;
    const haveApneaSuppliesBeenOrderedInLastTwoYears =
      apneaSupplies.length > 0 &&
      apneaSupplies.every(
        apneaSupply =>
          currentDate.diff(apneaSupply.lastOrderDate, 'years') <= 2,
      );

    const isApneaSupplySelected = apneaProductId => {
      const selectedProductIds = order.map(
        selectedProduct => selectedProduct.productId,
      );
      return selectedProductIds.includes(apneaProductId);
    };
    return (
      <div className="apnea-supplies-page">
        {apneaSupplies.length > 0 && (
          <h3 className="vads-u-font-size--h4 vads-u-margin-top--5">
            Select the CPAP supplies you need
          </h3>
        )}
        {!haveApneaSuppliesBeenOrderedInLastTwoYears &&
          !areApneaSuppliesEligible && (
            <va-alert status="info" visible>
              <h3 slot="headline">
                You can’t add CPAP supplies to your order at this time
              </h3>
              <div className="apnea-supplies-two-year-alert-content">
                <p>
                  You can only order CPAP supplies that you’ve received in the
                  past 2 years.
                </p>
                <p>
                  If you need a CPAP supply that is not listed here, call the
                  DLC Customer Service Section at{' '}
                  <va-telephone contact={DLC_PHONE} /> or email{' '}
                  <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
                </p>
              </div>
            </va-alert>
          )}
        {apneaSupplies.length > 0 &&
          haveApneaSuppliesBeenOrderedInLastTwoYears &&
          apneaSupplies.map(apneaSupply => (
            <div
              key={apneaSupply.productId}
              className={classnames({
                'vads-u-background-color--gray-lightest vads-u-margin-y--3': true,
                'vads-u-border-color--primary vads-u-border--3px vads-u-padding--21': isApneaSupplySelected(
                  apneaSupply.productId,
                ),
                'vads-u-padding--3 dd-privacy-mask': !isApneaSupplySelected(
                  apneaSupply.productId,
                ),
              })}
            >
              <h4 className="vads-u-font-size--md vads-u-margin-top--0 dd-privacy-mask">
                {apneaSupply.productName}
              </h4>
              <div className="vads-u-border-color--gray-lightest">
                <div className="usa-alert-body">
                  <p className="vads-u-margin-y--1p5">
                    <span className="vads-u-font-weight--bold">Quantity: </span>
                    {apneaSupply.quantity}
                  </p>
                  <p className="vads-u-margin-y--1p5">
                    <span className="vads-u-font-weight--bold">
                      Last order date:{' '}
                    </span>{' '}
                    {moment(apneaSupply.lastOrderDate).format('MM/DD/YYYY')}
                  </p>
                </div>
              </div>
              {apneaSupply.availableForReorder ? (
                <div>
                  {currentDate.diff(apneaSupply.nextAvailabilityDate, 'days') <
                    0 && apneaSupply.availableForReorder ? (
                    <va-alert status="warning">
                      <h3 className="usa-alert-heading vads-u-font-family--sans">
                        You can't order this CPAP supply online until{' '}
                        {moment(apneaSupply.nextAvailabilityDate).format(
                          'MMMM D, YYYY',
                        )}
                      </h3>
                    </va-alert>
                  ) : (
                    <div>
                      <VaCheckbox
                        id={apneaSupply.productId}
                        className="vads-u-margin-left--0"
                        onVaChange={e =>
                          this.handleChecked(e.target.checked, apneaSupply)
                        }
                        checked={isApneaSupplySelected(apneaSupply.productId)}
                        label="Order this CPAP supply"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="usa-alert usa-alert-warning vads-u-background-color--white vads-u-padding-x--2p5 vads-u-padding-y--2 vads-u-width--full">
                    <div className="usa-alert-body">
                      <h3 className="usa-alert-heading vads-u-font-family--sans">
                        This item is not available for online reordering. To
                        reorder, please contact your VA health care provider.
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {apneaSupplies.length > 0 && (
          <va-additional-info
            trigger="What if the CPAP supplies I need aren’t listed here?"
            className="vads-u-margin-bottom--2"
          >
            <p>
              The CPAP supplies you need may not be listed here if you haven’t
              placed an order for resupply items within the last 2 years. If you
              need a CPAP supply that hasn’t been ordered within the last 2
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
          </va-additional-info>
        )}
      </div>
    );
  }
}

ApneaSupplies.defaultProps = {
  formData: {},
  supplies: [],
  order: [],
  eligibility: {},
};

ApneaSupplies.propTypes = {
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
)(ApneaSupplies);
