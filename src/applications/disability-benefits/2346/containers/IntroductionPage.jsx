import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import React from 'react';
import { connect } from 'react-redux';
import { focusElement } from '../../../../platform/utilities/ui';
import { getDLCData, updateDLCData } from '../actions';

class IntroductionPage extends React.Component {
  // NOTE: Using React state for checkboxes -@maharielrosario at 1/8/2020, 7:47:21 PM
  // When discussed with other devs, the concensus was to have a stateful
  // component to house our checkboxes' state. But all other state is in Redux.
  // Is there an easy way to house individual checkbox state in Redux?

  constructor(props) {
    super(props);
    this.createDlcUIData =      this.createDlcUIData.bind(this);
  }

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getDLCData()  ;
  }

  createDlcUIData(initDataObjs) {
    let UIDataObjs =   initDataObjs;

    (function removeNonUIProps() {
      for (const UIDataObj of UIDataObjs) {
        Object.keys(UIDataObj).filter(() => {
          delete UIDataObj.productGroup;
          delete UIDataObj.recipient;
          delete UIDataObj.age;
          delete UIDataObj.delToState;
          return UIDataObj;
        });
      }
    })();

    (function createCheckboxProp() {
      UIDataObjs = UIDataObjs.map(UIDataObj => {
        const checkbox = (
          <ErrorableCheckbox
            className="vads-u-margin-left--2p5"
            onValueChange={value => value}
            id={UIDataObj.id}
          />
        );

        return {
          ...UIDataObj  ,
          checkbox   ,
        };
      });
    })();

    const UITableHeaders = Object.keys(UIDataObjs[0]).map(UIDataObjKey => {
      switch (UIDataObjKey) {
        case 'dateProcessed':
          return (
            <th className="form2346 vads-c-table__th" key={UIDataObjKey}>
              Date Processed
            </th>
          );
        case 'product':
          return (
            <th className="form2346 vads-c-table__th" key={UIDataObjKey}>
              Model
            </th>
          );
        case 'id':
          return (
            <th className="form2346 vads-c-table__th" key={UIDataObjKey}>
              Serial Number
            </th>
          );
        case 'orderIntakeMethod':
          return (
            <th className="form2346 vads-c-table__th" key={UIDataObjKey}>
              Order Method
            </th>
          );
        case 'checkbox':
          return (
            <th
              className="form2346 vads-c-table__th--narrow vads-u-text-align--center"
              key={UIDataObjKey}
            >
              Check to Order Batteries
            </th>
          );
        default:
      }
      return UIDataObjKey;
    });

    const UITableRowsAndData = UIDataObjs.map(UIDataObj => {
      const UIDataObjValues = Object.values(UIDataObj);

      return (
        <tr key={UIDataObj.id}>
          {UIDataObjValues.map(UIDataObjValue => (
            <td key={UIDataObjValue}>{UIDataObjValue}</td>
          ))}
        </tr>
      );
    });

    return {
      UITableHeaders,
      UITableRowsAndData,
    };
  }

  render() {
    const { firstName, lastName, data, address, city, state, zip } = this.props;
    let dlcTableHeaders;
    let dlcTableRowsAndData;
    // NOTE: Only run the following code when the DLC's data
    // has been received to improve performance
    if (data.length > 0) {
      const { UITableHeaders, UITableRowsAndData } = this.createDlcUIData(data);
      dlcTableHeaders = UITableHeaders;
      dlcTableRowsAndData = UITableRowsAndData;
    }
    return (
      <div className="vads-c-form2346">
        {data.length > 0 && (
          <>
            <h2>
              <strong>Name:</strong> {firstName} {lastName}
            </h2>
            <h2>
              <strong>Address:</strong> {address} <br /> {city} {state} {zip}{' '}
            </h2>
            <table className="form2346 vads-c-table">
              <tbody>
                <tr>{dlcTableHeaders}</tr>
                {dlcTableRowsAndData}
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
  data: state.form2346Reducer.data == null ? '' : state.form2346Reducer.data,
  firstName:
    state.user.profile.userFullName.first == null
      ? ''
      : state.user.profile.userFullName.first,
  lastName:
    state.user.profile.userFullName.last == null
      ? ''
      : state.user.profile.userFullName.last,
  address:
    state.user.profile.vet360.mailingAddress == null
      ? ''
      : state.user.profile.vet360.mailingAddress.addressLine1,
  city:
    state.user.profile.vet360.mailingAddress == null
      ? ''
      : state.user.profile.vet360.mailingAddress.city,
  state:
    state.user.profile.vet360.mailingAddress == null
      ? ''
      : state.user.profile.vet360.mailingAddress.stateCode,
  zip:
    state.user.profile.vet360.mailingAddress == null
      ? ''
      : state.user.profile.vet360.mailingAddress.zipCode,
});

const mapDispatchToProps = {
  getDLCData,
  updateDLCData,
};

export default connect(mapStateToProps, mapDispatchToProps)(IntroductionPage);
