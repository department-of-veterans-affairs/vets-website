import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import moment from 'moment';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BLUE_BACKGROUND,
  HEARING_AID_ACCESSORIES,
  WHITE_BACKGROUND,
} from '../constants';

class SelectArrayItemsAccessoriesWidget extends Component {
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
    const { supplies, selectedProducts } = this.props;
    const currentDate = moment();
    const accessorySupplies = supplies.filter(
      supply => supply.productGroup === HEARING_AID_ACCESSORIES,
    );
    const areAccessorySuppliesIneligible = accessorySupplies.every(
      accessorySupply => accessorySupply.availableForReorder === false,
    );

    const noAccessoriesContent = (
      <>
        <p>
          You can only order accessories online that you have received in the
          past two years.
        </p>
        <p>
          If you need accessories like domes, wax guards, cleaning supplies, or
          desiccant, call the DLC Customer Service Station at{' '}
          <a aria-label="3 0 3. 2 7 3. 6 2 0 0." href="tel:303-273-6200">
            303-273-6200
          </a>{' '}
          or email <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
        </p>
      </>
    );
    return (
      <>
        {!areAccessorySuppliesIneligible && (
          <>
            <h3 className="vads-u-font-size--h4">
              Select the hearing aid accessories you need
            </h3>
            <p>
              You'll be sent a 6-month supply for each accessory you choose
              below. You can only order each hearing aid accessory once every 5
              months.
            </p>
          </>
        )}
        {accessorySupplies.map(supply => (
          <div
            key={supply.productId}
            className="vads-u-background-color--gray-lightest vads-u-padding--3 vads-u-margin-y--3 accessory-page"
          >
            <h4 className="vads-u-font-size--md vads-u-margin-top--0">
              {supply.productName}
            </h4>
            <div className="vads-u-border-color--gray-lightest">
              <div className="usa-alert-body">
                <p className="vads-u-margin-y--1p5">
                  <span className="vads-u-font-weight--bold">Quantity: </span>
                  {supply.quantity}
                </p>
                <p className="vads-u-margin-y--1p5">
                  <span className="vads-u-font-weight--bold">
                    Last order date:{' '}
                  </span>{' '}
                  {moment(supply.lastOrderDate).format('MM/DD/YYYY')}
                </p>
              </div>
            </div>
            {currentDate.diff(supply.nextAvailabilityDate, 'days') < 0 ? (
              <AlertBox
                className="vads-u-color--black vads-u-background-color--white"
                headline={`You can't reorder this item online until ${moment(
                  supply.nextAvailabilityDate,
                ).format('MMMM D, YYYY')}`}
                content={
                  <>
                    <p>
                      You can only order a hearing aid accessory once every 5
                      months. Each order comes with enough items for
                      approximately 6-months.
                    </p>
                    <p>
                      If you need an item sooner, call the DLC Customer Service
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
                status="warning"
              />
            ) : (
              <div
                className={
                  selectedProducts.find(
                    selectedProduct =>
                      selectedProduct.productId === supply.productId,
                  )
                    ? `${BLUE_BACKGROUND} accessory-page-order-btns accessory-page`
                    : `${WHITE_BACKGROUND} accessory-page-order-btns`
                }
              >
                <input
                  id={supply.productId}
                  type="checkbox"
                  onChange={e => this.handleChecked(e.target.checked, supply)}
                  checked={
                    !!selectedProducts.find(
                      selectedProduct =>
                        selectedProduct.productId === supply.productId,
                    )
                  }
                />
                <label htmlFor={supply.productId} className="main">
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
        {accessorySupplies.length <= 0 && (
          <AlertBox
            headline="You're hearing accessories aren't available for online ordering"
            content={noAccessoriesContent}
            status="info"
            isVisible
          />
        )}
      </>
    );
  }
}

SelectArrayItemsAccessoriesWidget.defaultProps = {
  formData: {},
  supplies: [],
  selectedProducts: [],
};

SelectArrayItemsAccessoriesWidget.propTypes = {
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
};

const mapStateToProps = state => ({
  supplies: state.form?.data?.supplies,
  formData: state.form?.data,
  selectedProducts: state.form?.data?.selectedProducts,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsAccessoriesWidget);
