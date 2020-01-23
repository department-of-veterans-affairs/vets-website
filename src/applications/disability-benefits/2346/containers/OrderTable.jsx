import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { focusElement } from '../../../../platform/utilities/ui';
import { getDLCData, updateDLCData } from '../actions';

class OrderHistory extends Component {
  // NOTE: Using React state for checkboxes -@maharielrosario at 1/8/2020, 7:47:21 PM
  // When discussed with other devs, the concensus was to have a stateful
  // component to house our checkboxes' state. But all other state is in Redux.
  // Is there an easy way to house individual checkbox state in Redux?

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getDLCData();
  }

  createDLCUIData = dlcData => {
    const dlcUIData = dlcData.map(dlcDataObj => {
      const checkbox = (
        <ErrorableCheckbox
          className="vads-u-margin-left--2p5"
          onValueChange={value => value}
          id={dlcDataObj.id}
        />
      );
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
      dlcData,
      address,
      city,
      state,
      zip,
    } = this.props;

    // NOTE: Only run the following code when the DLC's dlcData
    // has been received to improve performance
    let dlcUIData = [];
    if (dlcData.length > 0) {
      const returnedData = this.createDLCUIData(dlcData);
      dlcUIData = returnedData;
    }

    return (
      <div className="form2346">
        {dlcUIData.length > 0 && (
          <>
            <h2>
              <strong>Name:</strong> {firstName} {lastName}
            </h2>
            <h2>
              <strong>Address:</strong> {address} <br /> {city} {state} {zip}{' '}
            </h2>
            <table className="form2346 vads-c-table">
              <tbody>
                <tr>
                  <th className="form2346 vads-c-table__th">Date Processed</th>
                  <th className="form2346 vads-c-table__th">Model</th>
                  <th className="form2346 vads-c-table__th">Serial Number</th>
                  <th className="form2346 vads-c-table__th">Order Method</th>
                  <th className="form2346 vads-c-table__th--narrow vads-u-text-align--center">
                    Check to Order Batteries
                  </th>
                </tr>
                {dlcUIData.map(dlcUIObj => (
                  <tr key={dlcUIObj.id}>
                    <td>{dlcUIObj.dateProcessed}</td>
                    <td>{dlcUIObj.product}</td>
                    <td>{dlcUIObj.id}</td>
                    <td>{dlcUIObj.orderIntakeMethod}</td>
                    <td>{dlcUIObj.checkbox} </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="usa-button-primary va-button-primary"
            >
              Submit Your Order
            </button>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dlcData: state?.form2346Reducer?.dlcData || '',
  firstName: state?.user?.profile?.userFullName?.first || '',
  lastName: state?.user?.profile?.userFullName?.last || '',
  address: state?.user?.profile?.vet360?.mailingAddress?.addressLine1 || '',
  city: state?.user?.profile?.vet360?.mailingAddress?.city || '',
  state: state?.user?.profile?.vet360?.mailingAddress?.stateCode || '',
  zip: state?.user?.profile?.vet360?.mailingAddress?.zipCode || '',
});

const mapDispatchToProps = {
  getDLCData,
  updateDLCData,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
