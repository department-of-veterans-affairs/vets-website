import React from 'react';
import manifest from '../manifest.json';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import formConfig from '../config/form';
import FormFooter from 'platform/forms/components/FormFooter';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Find an accredited representative" />
        <p className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--normal vads-u-padding-bottom--1">
          An accredited attorney, claims agent, or Veterans Service Officer
          (VSO) can help you file VA claims and appeals.
        </p>
        <h2>Search for a representative</h2>
        <p>
          Click the link below and follow the steps to find a representative
          near you.
        </p>
        <a
          className="vads-c-action-link--green"
          href={`${manifest.rootUrl}/representstive-type`}
        >
          Search for a representative
        </a>

        <h3>Learn more about accredited representatives</h3>
        <p>
          If you're not ready to look for an accredited representative, you can
          find out more about how a representative can help with your VA claims
          and appeals
        </p>
        <a href="#">Get help filing your claim or appeal</a>
        <FormFooter formConfig={formConfig} />
      </div>
    );
  }
}

export default IntroductionPage;
