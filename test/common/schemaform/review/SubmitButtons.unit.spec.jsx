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
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;
    expect(tree.everySubTree('.usa-alert-error')).not.to.be.empty;
  });
});
