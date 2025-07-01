import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as focusUtils from 'platform/utilities/ui/focus';
import CheckUploadWarning from '../../../../components/FormAlerts/CheckUploadWarning';

describe('CG <CheckUploadWarning>', () => {
  const subject = () => render(<CheckUploadWarning />);
  let focusStub;

  beforeEach(() => {
    focusStub = sinon.stub(focusUtils, 'focusElement');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should render `va-alert` with status of `warning`', () => {
    const { container } = subject();
    const selector = container.querySelector('va-alert');
    expect(selector).to.have.attr('status', 'warning');
  });

  it('should apply focus to the wrapper container', () => {
    subject();
    sinon.assert.calledOnceWithExactly(focusStub, 'va-alert[status="warning"]');
  });
});
