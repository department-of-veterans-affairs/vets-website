import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { Provider } from 'react-redux';

// <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/uswds/2.12.2/css/uswds.min.css" />
import { store } from '../components/combobox/reducer';
import { ComboBoxApp } from '../components/combobox/ComboBox';
//import BasicCombobox from '../components/combobox/BasicCombobox';
// import { reducerfrom '../components/combobox/reducer';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;

    return (
      <article className="schemaform-intro">
        <FormTitle
          title="combobox prototype"
          subtitle="Equal to VA Form  (combobox prototype)"
        />
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for benefits.
        </h2>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
            <h4>To fill out this application, you’ll need your:</h4>
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
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this benefits form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </va-process-list>
        {/* <BasicCombobox /> */}
        <va-additional-info class="vads-u-margin-top--3 vads-u-margin-bottom--6" trigger="Most commonly claimed conditions" uswds>
          <div>Here are some frequently claimed conditions</div>
          <ul>
            <li>tinnitus</li>
            <li>PTSD</li>
            <li>hearing loss</li>
            <li>neck strain</li>
            <li>lower back strain</li>
            <li>non-diabetic peripheral neuropathy</li>
            <li>migraines</li>
            <li>scars</li>
            <li>hypertension</li>
            <li>chronic rhinitis</li>
          </ul>
        </va-additional-info>
        <Provider store={store}>
          <ComboBoxApp />
        </Provider>
        <p />
      </article>
    );
  }
}

export default IntroductionPage;
