import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReOrderBatteryAndAccessoriesInformationData } from '../actions';
// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsWidget extends React.Component {
  state = {
    isChecked: false,
  };
  componentDidMount() {
    this.props.getReOrderBatteryAndAccessoriesInformationData();
  }

  handleChecked = () => {
    this.setState({ isChecked: !this.state.isChecked });
  };

  render() {
    const { supplies } = this.props;
    const { isChecked } = this.state;

    return supplies.map(supply => (
      <div key={supply.productId} className="order-background">
        <p className="vads-u-font-size--md vads-u-font-weight--bold">
          {supply.productName}
        </p>
        <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
          <div className="usa-alert-body mdot-alert-body">
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">Battery: </span>
              {supply.productId}
            </p>
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">Quantity: </span>
              {supply.quantity} <br />
              Approximately {supply.quantity} months supply
            </p>
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">
                Last order date:{' '}
              </span>{' '}
              {moment(supply.lastOrderDate).format('MM/DD/YYYY')}
            </p>
          </div>
        </div>
        <div
          className={
            !isChecked
              ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
              : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
          }
        >
          <input
            name="product-id-1"
            type="checkbox"
            onChange={this.handleChecked}
          />
          <label htmlFor={supply.productId} className="main">
            Order batteries for this device
          </label>
        </div>
      </div>
    ));
  }
}

SelectArrayItemsWidget.propTypes = {
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
const mapDispatchToProps = {
  getReOrderBatteryAndAccessoriesInformationData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsWidget);
