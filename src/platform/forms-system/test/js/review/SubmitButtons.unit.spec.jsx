import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SubmitButtons from '../../../src/js/review/SubmitButtons';
import ClientError from '../../../src/js/review/submit-states/ClientError';
import Default from '../../../src/js/review/submit-states/Default';
import GenericError from '../../../src/js/review/submit-states/GenericError';
import Pending from '../../../src/js/review/submit-states/Pending';
import Submitted from '../../../src/js/review/submit-states/Submitted';
import ThrottledError from '../../../src/js/review/submit-states/ThrottledError';

describe('Schemaform review: <SubmitButtons>', () => {
  let formConfig;
  beforeEach(() => {
    formConfig = {};
  });

  it('renders default state', () => {
    const submission = {
      status: false,
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('Default')[0].type).to.equal(Default);
  });

  it('renders pending state', () => {
    const submission = {
      status: 'submitPending',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('Pending')[0].type).to.equal(Pending);
  });

  it('renders submitted state', () => {
    const submission = {
      status: 'applicationSubmitted',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('Submitted')[0].type).to.equal(Submitted);
  });

  it('renders generic error', () => {
    const submission = {
      status: 'error',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('GenericError')[0].type).to.equal(GenericError);
  });

  it('renders validation error', () => {
    const submission = {
      status: 'validationError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ValidationError')[0].type).to.exist;
  });

  it('renders throttled error', () => {
    const submission = {
      status: 'throttledError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ThrottledError')[0].type).to.equal(
      ThrottledError,
    );
  });

  it('renders client error', () => {
    const submission = {
      status: 'clientError',
    };

    const tree = SkinDeep.shallowRender(
      <SubmitButtons submission={submission} formConfig={formConfig} />,
    );

    expect(tree.everySubTree('ClientError')[0].type).to.equal(ClientError);
  });
});
