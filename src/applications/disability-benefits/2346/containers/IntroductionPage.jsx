import React from 'react';

import { focusElement } from '../../../../platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from '../../../../platform/forms/save-in-progress/SaveInProgressIntro';
import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <h2><strong>Name:</strong> Hector Smith</h2>
        <h2><strong>Address:</strong> 1234 First Street</h2>
        <SortableTable
          className="va-table"
          currentSort={{
            value: 'String',
            order: 'ASC',
          }}
          fields={[
            {
              label: 'Issue Date',
              value: 'issuedate',
            },
            {
              label: 'Battery',
              value: 'battery',
            },
            {
              label: 'Make',
              value: 'make',
            },{
              label: 'Model',
              value: 'model',
            },
            {
              label: 'Serial Number',
              value: 'serial',
            },
            {
              label: 'Date Last Ordered',
              value: 'lastordered',
            },{
              label: 'Check to Order Batteries',
              value: 'checkmark',
            },
          ]}
          data={[
            {
              issuedate: '11/03/2011',
              battery: 'Z4A2O3',
              make: 'BERNAFON',
              model: 'RESOUND QUATTRO 3110',
              serial: 'W6G0L6',
              lastordered: '08/28/2018',
              checkmark: 'Checkbox goes here',
            }
          ]}
        />
        <button>Submit Your Order</button>
      </div>
    );
  }
}

export default IntroductionPage;
