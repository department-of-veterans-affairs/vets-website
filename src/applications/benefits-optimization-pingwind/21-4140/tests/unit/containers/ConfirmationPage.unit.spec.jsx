import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { ConfirmationPage } from '../../../containers/ConfirmationPage';

describe('21-4140 container/ConfirmationPage', () => {
  let sandbox;

  const defaultRoute = {
    formConfig: {
      title: 'Employment Questionnaire',
    },
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('exports ConfirmationPage component', () => {
    expect(ConfirmationPage).to.exist;
    expect(typeof ConfirmationPage).to.equal('function');
  });
});
