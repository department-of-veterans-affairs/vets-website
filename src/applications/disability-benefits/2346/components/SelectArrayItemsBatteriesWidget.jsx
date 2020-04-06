import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getReOrderBatteryAndAccessoriesInformationData } from '../actions';
import {
  HEARING_AID_BATTERIES,
  BLUE_BACKGROUND,
  WHITE_BACKGROUND,
} from '../constants';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
// TODO: Safety checks for `selected` callback and `label` element

class SelectArrayItemsBatteriesWidget extends React.Component {
  componentDidMount() {
    this.props.getReOrderBatteryAndAccessoriesInformationData();
  }

  handleChecked = (index, checked) => {
    const supplies = set(
      `[${index}].${this.props.options.selectedPropName}`,
      checked,
      this.props.value || this.props.supplies,
    );
    this.props.onChange(supplies);
  };

  render() {
    const { value, supplies, options, formContext } = this.props;
    return (value || supplies).map((supply, index) => {
      const selected = get(options.selectedPropName, supply);
      if (!selected && formContext.onReviewPage) return null;
      return supply.productGroup === HEARING_AID_BATTERIES ? (
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
          <div className={selected ? BLUE_BACKGROUND : WHITE_BACKGROUND}>
            <input
              id={supply.productId}
              name={supply.productId}
              type="checkbox"
              onChange={e => this.handleChecked(index, e.target.checked)}
              checked={selected}
            />
            <label htmlFor={supply.productId} className="main">
              Order batteries for this device
            </label>
          </div>
        </div>
      ) : (
        ''
      );
    });
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
  supplies: state.form?.loadedData?.formData?.supplies || [],
});
const mapDispatchToProps = {
  getReOrderBatteryAndAccessoriesInformationData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectArrayItemsBatteriesWidget);
