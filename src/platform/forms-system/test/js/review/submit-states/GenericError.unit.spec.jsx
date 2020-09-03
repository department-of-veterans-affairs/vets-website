import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

// import PreSubmitSection from '../../../../../forms/components/review/PreSubmitSection';
import GenericError from 'platform/forms-system/src/js/review/submit-states/GenericError';

describe('Schemaform review: <GenericError />', () => {
  const formConfig = {};
  const onSubmit = _event => {
    // no-op
  };
  const subject = SkinDeep.shallowRender(
    <GenericError
      appType="Dummy"
      formConfig={formConfig}
      onSubmit={onSubmit}
    />,
  );

  // it('has a pre-submit section', () => {
  //   const presubmit = subject.everySubTree('PreSubmitSection')[0];
  //   expect(presubmit.type).to.equal(PreSubmitSection);
  //   expect(presubmit.props.formConfig).to.equal(formConfig);
  // });

  it('has the expected error in dev mode', () => {
    expect(subject.everySubTree('ErrorMessage')[0].props.message).to.contain(
      'start over',
    );
    expect(subject.everySubTree('Column', { role: 'alert' })).not.to.be.empty;
    const links = subject.everySubTree('a');
    expect(links[0].text()).to.contain('Back to VA.gov');
    expect(links[1].text()).to.contain('Submit again');
    expect(links[1].props.onClick).to.equal(onSubmit);
  });

  it('has the expected error in prod mode', () => {
    const buildtype = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    expect(subject.everySubTree('ErrorMessage')[0].props.message).to.contain(
      'start over',
    );
    expect(subject.everySubTree('Column', { role: 'alert' })).not.to.be.empty;
    expect(subject.everySubTree('a')[0].text()).to.contain('Back to VA.gov');

    // Reset buildtype
    process.env.NODE_ENV = buildtype;
  });

  it('renders custom error element', () => {
    const renderErrorMessage = () => {
      return <span className="message">Error message</span>;
    };
    const tree = SkinDeep.shallowRender(
      <GenericError
        appType="Dummy"
        formConfig={formConfig}
        onSubmit={onSubmit}
        renderErrorMessage={renderErrorMessage}
      />,
    );

    expect(tree.everySubTree('.message')[0].text()).to.equal('Error message');
  });
});
