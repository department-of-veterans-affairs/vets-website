import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SubmitButtons from '../../../../src/js/common/schemaform/review/SubmitButtons';

describe('Schemaform review: <SubmitButtons>', () => {
  it('should render', () => {
    const submission = {
      status: false
    };
    const tree = SkinDeep.shallowRender(
      <SubmitButtons
          submission={submission}/>
    );

    expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal('Back');
    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Submit Application');
  });
  it('should render pending', () => {
    const submission = {
      status: 'submitPending'
    };
    const tree = SkinDeep.shallowRender(
      <SubmitButtons
          submission={submission}/>
    );

    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Sending...');
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;
  });
  it('should render submitted', () => {
    const submission = {
      status: 'applicationSubmitted'
    };
    const tree = SkinDeep.shallowRender(
      <SubmitButtons
          submission={submission}/>
    );

    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Submitted');
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;
  });
  it('should render error', () => {
    const submission = {
      status: 'error'
    };
    const tree = SkinDeep.shallowRender(
      <SubmitButtons
          submission={submission}/>
    );

    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal('Send Failed');
    // In development, the button shouldn't be disabled
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.false;
    expect(tree.everySubTree('.usa-alert-error')).not.to.be.empty;

    // In production, the button should be disabled
    const buildtype = __BUILDTYPE__;
    __BUILDTYPE__ = 'production';

    const prodTree = SkinDeep.shallowRender(
      <SubmitButtons
          submission={submission}/>
    );
    expect(prodTree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;

    // Reset buildtype
    __BUILDTYPE__ = buildtype;
  });
});
