import React from 'react';
import {connect} from 'react-redux';

import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import {getDLCData, updateDLCData} from '../actions'
import {isEmpty} from 'lodash';

class IntroductionPage extends React.Component {

  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
    this.props.getDLCData();
  }

  render() {
    return (
      <div className="schemaform-intro">
        <h2><strong>Name:</strong> Hector Smith</h2>
        <h2><strong>Address:</strong> 1234 First Street</h2>
        {!isEmpty(this.props.data) && (
          <>
            <SortableTable
            className="va-table"
            currentSort={{
              value: 'String',
              order: 'ASC',
            }}
            fields={[
              {
                label: 'Issue Date',
                value: 'issueDate',
              },
              {
                label: 'Battery',
                value: 'battery',
              },
              {
                label: 'Make',
                value: 'make',
              },
              {
                label: 'Model',
                value: 'model',
              },
              {
                label: 'Serial Number',
                value: 'serialNumber',
              },
              {
                label: 'Date Last Ordered',
                value: 'lastOrderedDate',
              },
              {
                label: 'Check to Order Batteries',
                value: 'insert checkmark jsx',
              }
            ]}
            data={this.props.data}
            />
            <button>Submit Your Order</button>
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.form2346Reducer.data
});

const mapDispatchToProps = {
  getDLCData
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroductionPage);
