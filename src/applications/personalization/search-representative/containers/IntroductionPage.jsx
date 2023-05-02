import React from 'react';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormFooter from 'platform/forms/components/FormFooter';
import formConfig from '../config/form';

const IntroductionPage = props => {
  return (
    <div className="schemaform-intro">
      <FormTitle title="Find an accredited representative" />
      <p className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--normal vads-u-padding-bottom--1">
        An accredited attorney, claims agent, or Veterans Service Officer (VSO)
        can help you file VA claims and appeals.
      </p>
      <h2>Search for a representative</h2>
      <p>
        Click the link below and follow the steps to find a representative near
        you.
      </p>
      <SaveInProgressIntro
        buttonOnly
        unauthStartText="Sign in and search for a representative"
        prefillEnabled={formConfig.prefillEnabled}
        messages={formConfig.savedFormMessages}
        formConfig={formConfig}
        pageList={props.route.pageList}
        downtime={formConfig.downtime}
      />
      <h3>Learn more about accredited representatives</h3>
      <p>
        If you’re not ready to look for an accredited representative, you can
        find out more about how a representative can help with your VA claims
        and appeals
      </p>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a href="#">Get help filing your claim or appeal</a>
      <FormFooter formConfig={formConfig} />
    </div>
  );
};

export default IntroductionPage;
