import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import {
  getDLCAccessoriesData,
  getDLCBatteryData,
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // getDLCSocksData,
  updateDLCData,
} from '../actions';

class OrderHistory extends Component {
  // NOTE: Using React state for checkboxes -@maharielrosario at 1/8/2020, 7:47:21 PM
  // When discussed with other devs, the concensus was to have a stateful
  // component to house our checkboxes' state. But all other state is in Redux.
  // Is there an easy way to house individual checkbox state in Redux?

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getDLCBatteryData();
    // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
    // this.props.getDLCSocksData();
    this.props.getDLCAccessoriesData();
  }

  createDLCUIData = dlcData => {
    const dlcUIData = dlcData.map(dlcDataObj => {
      let checkbox;
      if (dlcDataObj.productGroup === 'ACCESSORIES') {
        checkbox = (
          <ErrorableCheckbox
            className="vads-u-margin-left--4"
            onValueChange={value => value}
            id={dlcDataObj.id}
          />
        );
      } else {
        checkbox = (
          <ErrorableCheckbox
            className="vads-u-margin-left--2p5"
            onValueChange={value => value}
            id={dlcDataObj.id}
          />
        );
      }
      return {
        ...dlcDataObj,
        checkbox,
      };
    });
    return dlcUIData;
  };

  render() {
    const {
      firstName,
      lastName,
      dlcBatteryData,
      // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
      // dlcSocksData,
      dlcAccessoriesData,
      address,
      city,
      state,
      zip,
    } = this.props;

    // NOTE: Only run the following code when the DLC's dlcData
    // has been received to improve performance
    let dlcUIBatteryData = [];
    if (dlcBatteryData.length > 0) {
      const returnedData = this.createDLCUIData(dlcBatteryData);
      dlcUIBatteryData = returnedData;
    }
    // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
    // let dlcUISocksData = [];
    // if (dlcSocksData.length > 0) {
    //   const returnedData = this.createDLCUIData(dlcSocksData);
    //   dlcUISocksData = returnedData;
    // }

    let dlcUIAccessoriesData = [];
    if (dlcAccessoriesData.length > 0) {
      const returnedData = this.createDLCUIData(dlcAccessoriesData);
      dlcUIAccessoriesData = returnedData;
    }

    return (
      <div className="form2346">
        {dlcUIBatteryData.length > 0 &&
          // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
          // dlcUISocksData.length > 0 &&

          dlcUIAccessoriesData.length > 0 && (
            <>
              <h2>
                <strong>Name:</strong> {firstName} {lastName}
              </h2>
              <h2>
                <strong>Address:</strong> {address} {city} {state} {zip}{' '}
              </h2>
              <table id="batteriesTable" className="form2346 vads-c-table">
                <tbody>
                  <tr>
                    <th className="form2346 vads-c-table__th">
                      Date Processed
                    </th>
                    <th className="form2346 vads-c-table__th">Product Type</th>
                    <th className="form2346 vads-c-table__th">Model</th>
                    <th className="form2346 vads-c-table__th">Serial Number</th>
                    <th className="form2346 vads-c-table__th">Order Method</th>
                    <th className="form2346 vads-c-table__th--narrow vads-u-text-align--center">
                      Check to Order Batteries
                    </th>
                  </tr>
                  {dlcUIBatteryData.map(dlcUIObj => (
                    <tr key={dlcUIObj.id}>
                      <td>{dlcUIObj.dateProcessed}</td>
                      <td>{dlcUIObj.productGroup}</td>
                      <td>{dlcUIObj.product}</td>
                      <td>{dlcUIObj.id}</td>
                      <td>{dlcUIObj.orderIntakeMethod}</td>
                      <td>{dlcUIObj.checkbox} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {
                // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
                /* <table id="socksTable" className="form2346 vads-c-table">
                <tbody>
                  <tr>
                    <th className="form2346 vads-c-table__th">
                      Date Processed
                    </th>
                    <th className="form2346 vads-c-table__th">Product Type</th>
                    <th className="form2346 vads-c-table__th">Model</th>
                    <th className="form2346 vads-c-table__th">Serial Number</th>
                    <th className="form2346 vads-c-table__th">Order Method</th>
                    <th className="form2346 vads-c-table__th--narrow vads-u-text-align--center">
                      Check to Order Socks
                    </th>
                  </tr>
                  {dlcUISocksData.map(dlcUIObj => (
                    <tr key={dlcUIObj.id}>
                      <td>{dlcUIObj.dateProcessed}</td>
                      <td>{dlcUIObj.productGroup}</td>
                      <td>{dlcUIObj.product}</td>
                      <td>{dlcUIObj.id}</td>
                      <td>{dlcUIObj.orderIntakeMethod}</td>
                      <td>{dlcUIObj.checkbox} </td>
                    </tr>
                  ))}
                </tbody>
              </table> */
              }
              <table id="accessoriesTable" className="form2346 vads-c-table">
                <tbody>
                  <tr>
                    <th className="form2346 vads-c-table__th">
                      Date Processed
                    </th>
                    <th className="form2346 vads-c-table__th">Product Type</th>
                    <th className="form2346 vads-c-table__th">Model</th>
                    <th className="form2346 vads-c-table__th">Serial Number</th>
                    <th className="form2346 vads-c-table__th">Order Method</th>
                    <th className="form2346 vads-c-table__th--narrow vads-u-text-align--center">
                      Check to Order Accessories
                    </th>
                  </tr>
                  {dlcUIAccessoriesData.map(dlcUIObj => (
                    <tr key={dlcUIObj.id}>
                      <td>{dlcUIObj.dateProcessed}</td>
                      <td>{dlcUIObj.productGroup}</td>
                      <td>{dlcUIObj.product}</td>
                      <td>{dlcUIObj.id}</td>
                      <td>{dlcUIObj.orderIntakeMethod}</td>
                      <td>{dlcUIObj.checkbox} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              ={' '}
              {/* <button
                type="button"
                className="usa-button-primary va-button-primary"
              >
                Back
              </button>
              <button
                type="button"
                className="usa-button-primary va-button-primary"
              >
                Submit
              </button> */}
            </>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dlcBatteryData: state?.form2346Reducer?.dlcBatteryData || '',
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // dlcSocksData: state?.form2346Reducer?.dlcSocksData || '',
  dlcAccessoriesData: state?.form2346Reducer?.dlcAccessoriesData || '',
  firstName: state?.user?.profile?.userFullName?.first || '',
  lastName: state?.user?.profile?.userFullName?.last || '',
  address: state?.user?.profile?.vet360?.mailingAddress?.addressLine1 || '',
  city: state?.user?.profile?.vet360?.mailingAddress?.city || '',
  state: state?.user?.profile?.vet360?.mailingAddress?.stateCode || '',
  zip: state?.user?.profile?.vet360?.mailingAddress?.zipCode || '',
});

const mapDispatchToProps = {
  getDLCBatteryData,
  // NOTE: Decision was to take socks out of MVP -@maharielrosario at 1/28/2020, 9:49:20 AM
  // getDLCSocksData,
  getDLCAccessoriesData,
  updateDLCData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderHistory);
