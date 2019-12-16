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
              label: 'Check To Order Batteries',
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
              checkmark: <input type="checkbox" />,
            }
          ]}
        />
        <table>
  <caption>Bordered table</caption>
  <thead>
    <tr>
      <th scope="col">Document title</th>
      <th scope="col">Description</th>
      <th scope="col">Year</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Declaration of Independence</th>
      <td>Statement adopted by the Continental Congress declaring independence from the British Empire.</td>
      <div><input type='checkbox' /></div>
    </tr>
    <tr>
      <th scope="row">Bill of Rights</th>
      <td>The first ten amendments of the U.S. Constitution guaranteeing rights and freedoms.</td>
      <td>1791</td>
    </tr>
    <tr>
      <th scope="row">Declaration of Sentiments</th>
      <td>A document written during the Seneca Falls Convention outlining the rights that American women should be entitled to as citizens.</td>
      <td>1848</td>
    </tr>
    <tr>
      <th scope="row">Emancipation Proclamation</th>
      <td>An executive order granting freedom to slaves in designated southern states.</td>
      <td>1863</td>
    </tr>
  </tbody>
</table>
        <FormTitle title="Form-2346" />
        <p>Equal to VA Form 2346 (Form-2346).</p>
        <input type="checkbox" id="horns" name="horns"></input>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        >
          Please complete the 2346 form to apply for 2346 Benefits.
        </SaveInProgressIntro>
        <h4>Follow the steps below to apply for 2346 Benefits.</h4>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h5>Prepare</h5>
              <h6>To fill out this application, you’ll need your:</h6>
              <ul>
                <li>Social Security number (required)</li>
              </ul>
              <p>
                <strong>What if I need help filling out my application?</strong>{' '}
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.{' '}
                <a href="/disability-benefits/apply/help/index.html">
                  Get help filing your claim
                </a>
                .
              </p>
            </li>
            <li className="process-step list-two">
              <h5>Apply</h5>
              <p>Complete this 2346 Benefits form.</p>
              <p>
                After submitting the form, you’ll get a confirmation message.
                You can print this for your records.
              </p>
            </li>
            <li className="process-step list-three">
              <h5>VA Review</h5>
              <p>
                We process claims within a week. If more than a week has passed
                since you submitted your application and you haven’t heard back,
                please don’t apply again. Call us at.
              </p>
            </li>
            <li className="process-step list-four">
              <h5>Decision</h5>
              <p>
                Once we’ve processed your claim, you’ll get a notice in the mail
                with our decision.
              </p>
            </li>
          </ol>
        </div>
        <SaveInProgressIntro
          buttonOnly
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the Application"
        />
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <OMBInfo resBurden={30} ombNumber="XX3344" expDate="12/31/2020" />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
