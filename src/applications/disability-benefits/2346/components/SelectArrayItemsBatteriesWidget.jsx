import moment from 'moment';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BLUE_BACKGROUND,
  HEARING_AID_BATTERIES,
  WHITE_BACKGROUND,
} from '../constants';

// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsBatteriesWidget extends Component {
  handleChecked = (productId, checked) => {
    const { selectedBatteries, formData } = this.props;
    let updatedSelectedBatteries;
    if (checked) {
      updatedSelectedBatteries = [...selectedBatteries, productId];
    } else {
      updatedSelectedBatteries = selectedBatteries.filter(
        selectedBattery => selectedBattery !== productId,
      );
    }
    const updatedFormData = {
      ...formData,
      selectedBatteries: updatedSelectedBatteries,
    };

    // const newSupplyData = set(key, value, supply);
    // const newSupplies = set(  ,newSupplyData, this.props.supplies)
    // const newFormData = {
    //   ...this.props.formData,
    //   newSupplyData,
    // };
    return this.props.setData(updatedFormData);
  };

  render() {
    const { supplies, selectedBatteries } = this.props;

    return (
      <>
        <h4>Select the hearing aids that need batteries</h4>
        <p>
          You'll be sent a 6-month supply of batteries for each device you
          choose below.
        </p>
        {supplies.map(
          supply =>
            supply.productGroup === HEARING_AID_BATTERIES ? (
              <div
                key={supply.productId}
                className="vads-u-background-color--gray-lightest vads-u-padding-left--4 vads-u-padding-top--1 vads-u-padding-bottom--4"
              >
                <h4 className="vads-u-font-size--md vads-u-font-weight--bold">
                  {supply.productName}
                </h4>
                <p>Prescribed 1/18/2018</p>
                <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
                  <div className="usa-alert-body vads-u-padding-left--1">
                    <p className="vads-u-margin--1px vads-u-margin-y--1">
                      <span className="vads-u-font-weight--bold">
                        Battery:{' '}
                      </span>
                      {supply.productId}
                    </p>
                    <p className="vads-u-margin--1px vads-u-margin-y--1">
                      <span className="vads-u-font-weight--bold">
                        Quantity:{' '}
                      </span>
                      {supply.quantity}
                    </p>
                    <p className="vads-u-margin--1px vads-u-margin-y--1">
                      <span className="vads-u-font-weight--bold">
                        Last order date:{' '}
                      </span>{' '}
                      {moment(supply.lastOrderDate).format('MM/DD/YYYY')}
                    </p>
                  </div>
                </div>
                <div
                  className={
                    supply.selected ? BLUE_BACKGROUND : WHITE_BACKGROUND
                  }
                >
                  <input
                    id={supply.productId}
                    type="checkbox"
                    onChange={e => {
                      this.handleChecked(supply.productId, e.target.checked);
                    }}
                    checked={selectedBatteries.includes(supply.productId)}
                  />
                  <label htmlFor={supply.productId} className="main">
                    Order batteries for this device
                  </label>
                </div>
              </div>
            ) : (
              ''
            ),
        )}
      </>
    );
  }
}

SelectArrayItemsBatteriesWidget.defaultProps = {
  formData: {},
  supplies: [],
  selectedBatteries: [],
};

SelectArrayItemsBatteriesWidget.propTypes = {
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
};

const mapStateToProps = state => ({
  supplies: state.form?.loadedData?.formData?.supplies,
  formData: state.form?.data,
  selectedBatteries: state.form?.data?.selectedBatteries,
});

const mapDispatchToProps = {
  setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsBatteriesWidget);
