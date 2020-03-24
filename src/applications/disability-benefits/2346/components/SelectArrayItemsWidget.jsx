import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReOrderBatteryAndAccessoriesInformationData } from '../actions';
import set from 'platform/utilities/data/set';
// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsWidget extends React.Component {
  componentDidMount() {
    this.props.getReOrderBatteryAndAccessoriesInformationData();
  }

  onChange = (index, checked) => {
    const items = set(
      `[${index}].${this.props.options.selectedPropName ||
        this.defaultSelectedPropName}`,
      checked,
      this.props.value,
    );
    this.props.onChange(items);
  };

  defaultSelectedPropName = 'view:selected';

  render() {
    const { supplies } = this.props;
    return supplies.map((item, index) => (
      <div key={item.productId} className="order-background">
        <p className="vads-u-font-size--md vads-u-font-weight--bold">
          {item.deviceName}
        </p>
        <div className="vads-u-border-left--10px vads-u-border-color--primary-alt">
          <div className="usa-alert-body mdot-alert-body">
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">Battery:</span>
              {item.productId}
            </p>
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">Quantity:</span>
              {item.quantity}
              (Approximately 6 months supply)
            </p>
            <p className="vads-u-margin--1px">
              <span className="vads-u-font-weight--bold">Last order date:</span>{' '}
              {moment(item.lastOrderDate).format('MM/DD/YYYY')}
            </p>
          </div>
        </div>
        <div
          className={
            !item.selected
              ? 'vads-u-background-color--white vads-u-color--link-default button-dimensions vads-u-border-color--primary vads-u-border--2px'
              : 'vads-u-background-color--primary button-dimensions vads-u-color--white vads-u-border-color--primary vads-u-border--2px'
          }
        >
          <input
            name="product-id-1"
            type="checkbox"
            onClick={this.handleChange}
            checked={
              typeof itemIsSelected === 'undefined' ? false : item.selected
            }
            onChange={event => this.onChange(index, event.target.checked)}
          />
          <label htmlFor="product-id-1" className="main">
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
