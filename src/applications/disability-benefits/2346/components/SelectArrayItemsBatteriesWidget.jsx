import moment from 'moment';
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
  state = {
    selectedItems: [],
  };

  handleChecked = e => {
    e.persist();
    if (e.target.checked) {
      this.setState(prevState => ({
        selectedItems: prevState.selectedItems.concat(e.target.name),
      }));
    } else {
      this.setState(prevState => ({
        selectedItems: prevState.selectedItems.filter(i => i !== e.target.name),
      }));
    }
  };

  render() {
    const { supplies } = this.props;
    const { selectedItems } = this.state;

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
                    selectedItems.includes(supply.productId)
                      ? BLUE_BACKGROUND
                      : WHITE_BACKGROUND
                  }
                >
                  <input
                    name={supply.productId}
                    type="checkbox"
                    onChange={this.handleChecked}
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
});

export default connect(mapStateToProps)(SelectArrayItemsBatteriesWidget);
