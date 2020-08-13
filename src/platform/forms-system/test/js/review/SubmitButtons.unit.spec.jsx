import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SubmitButtons from '../../../src/js/review/SubmitButtons';

describe('Schemaform review: <SubmitButtons>', () => {
  let formConfig;
  beforeEach(() => {
    formConfig = {};
  });
  it('should render', () => {
    const submission = {
      status: false,
    };
    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ProgressButton')[0].props.buttonText).to.equal(
      'Back',
    );
    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal(
      'Submit application',
    );
  });
  it('should render pending', () => {
    const submission = {
      status: 'submitPending',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal(
      'Sending...',
    );
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;
  });
  it('should render submitted', () => {
    const submission = {
      status: 'applicationSubmitted',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ProgressButton')[1].props.buttonText).to.equal(
      'Submitted',
    );
    expect(tree.everySubTree('ProgressButton')[1].props.disabled).to.be.true;
  });
  it('should render error in dev mode', () => {
    const submission = {
      status: 'error',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('.usa-alert-error')).not.to.be.empty;
    expect(tree.everySubTree('div', { role: 'alert' })).not.to.be.empty;
    expect(tree.everySubTree('a').length).to.equal(2);
  });
  it('should render validation error', () => {
    const submission = {
      status: 'validationError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    // Make sure it displays an error--and the right one
    expect(tree.everySubTree('.usa-alert-error')[0].text()).to.contain(
      'Some information in your application is missing or not valid',
    );
    expect(tree.everySubTree('div', { role: 'alert' })).not.to.be.empty;
    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
  it('should render error in prod mode', () => {
    const submission = {
      status: 'error',
    };
    const buildtype = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('.usa-alert-error')).not.to.be.empty;
    expect(tree.everySubTree('div', { role: 'alert' })).not.to.be.empty;
    expect(tree.everySubTree('a').length).to.equal(1);

    // Reset buildtype
    process.env.NODE_ENV = buildtype;
  });
  it('should render error prop', () => {
    const submission = {
      status: 'error',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons
        renderErrorMessage={() => (
          <span className="message">Error message</span>
        )}
        submission={submission}
        formConfig={formConfig}
      />,
    );

    expect(tree.subTree('.message').text()).to.equal('Error message');
  });
  it('should render throttled error', () => {
    const submission = {
      status: 'throttledError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    // Make sure it displays an error--and the right one
    expect(tree.everySubTree('.usa-alert-error')[0].text()).to.contain(
      'too many requests',
    );
    expect(tree.everySubTree('div', { role: 'alert' })).not.to.be.empty;
    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
  it('should render client error', () => {
    const submission = {
      status: 'clientError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    // Make sure it displays an error--and the right one
    expect(tree.everySubTree('.usa-alert-error')[0].text()).to.contain(
      'Internet connection',
    );
    expect(tree.everySubTree('div', { role: 'alert' })).not.to.be.empty;
    expect(tree.everySubTree('ProgressButton').length).to.equal(2);
  });
});
