import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

// import PreSubmitSection from '../../../../../forms/components/review/PreSubmitSection';
import Back from '../../../../src/js/review/submit-states/Back';
import Pending from '../../../../src/js/review/submit-states/Pending';

describe('Schemaform review: <Pending />', () => {
  const formConfig = {};
  const onBack = _event => {
    // no-op
  };
  const onSubmit = _event => {
    // no-op
  };
  const subject = SkinDeep.shallowRender(
    <Pending formConfig={formConfig} onBack={onBack} onSubmit={onSubmit} />,
  );

  it('has a back button', () => {
    const button = subject.everySubTree('Back')[0];
    expect(button.type).to.equal(Back);
    expect(button.props.onButtonClick).to.equal(onBack);
  });

  // it('has a pre-submit section', () => {
  //   const presubmit = subject.everySubTree('PreSubmitSection')[0];
  //   expect(presubmit.type).to.equal(PreSubmitSection);
  //   expect(presubmit.props.formConfig).to.equal(formConfig);
  // });

  it('has a disabled in-progress submit button', () => {
    const button = subject.everySubTree('ProgressButton')[0];
    const label = 'Sending...';
    const buttonClass = 'usa-button-disabled';
    expect(button.props.buttonText).to.equal(label);
    expect(button.props.disabled).to.be.true;
    expect(button.props.onButtonClick).to.equal(onSubmit);
    expect(button.props.buttonClass).to.equal(buttonClass);
  });
});
