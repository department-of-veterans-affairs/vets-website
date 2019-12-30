import React from 'react';
import {connect} from 'react-redux';
import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import {getDLCData, updateDLCData, updateCheckboxState} from '../actions'
import {isEmpty} from 'lodash';
import CheckboxWidget from '../../../../platform/forms-system/src/js/widgets/CheckboxWidget'

class IntroductionPage extends React.Component {

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getDLCData();
  }

  handleCheckbox() {
    this.props.updateCheckboxState();
  }

  render() {
    return (
      <div className="schemaform-intro disability-container">
        <h2><strong>Name:</strong> Hector Smith</h2>
        <h2><strong>Address:</strong> 1234 First Street</h2>
        {!isEmpty(this.props.data) && (
          <>
          {
            this.props.data.map(dlcObj => {
              dlcObj.checkbox = (
                // BUG: Checkbox state defects -@maharielrosario at 12/30/2019, 5:58:40 PM
                // Checkbox state overwrites DLC API data
                <input type="checkbox" className="checkbox" onChange={this.handleCheckbox.bind(this)}/>
              );
            })
          }
            <SortableTable
              className="va-table"
              currentSort={{
              value: 'String',
              order: 'ASC',
              }}
              fields={[
                {
                  label: 'Date Processed',
                  value: 'dateProcessed',
                },
                {
                  label: 'Recipient',
                  value: 'recipient',
                },
                {
                  label: 'Age',
                  value: 'age',
                },
                {
                  label: 'Product',
                  value: 'product',
                },
                {
                  label: 'Product Group',
                  value: 'productGroup',
                },
                {
                  label: 'Deliver To State',
                  value: 'delToState',
                },
                {
                  label: 'Order Intake Method',
                  value: 'orderIntakeMethod'
                },
                {
                  label: 'Check to Order Batteries',
                  value: 'checkbox'
                }
              ]}
              data={this.props.data}
              // TODO: Apply unique id to key for each DLC API object -@maharielrosario at 12/30/2019, 6:04:02 PM
              //key={this.props.data.map(obj => obj.recipient)}
            />
            <button>Submit Your Order</button>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
    data: state.form2346Reducer.data,
});

const mapDispatchToProps = {
  getDLCData,
  updateDLCData,
  updateCheckboxState
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroductionPage);
