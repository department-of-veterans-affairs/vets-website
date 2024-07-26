import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as focusUtils from 'platform/utilities/ui/focus';
import CheckUploadWarning from '../../../../components/FormAlerts/CheckUploadWarning';

describe('CG <CheckUploadWarning>', () => {
  const subject = () => render(<CheckUploadWarning />);

  it('should render `va-alert` with status of `warning`', () => {
    const { container } = subject();
    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'warning');
  });

  it('should apply focus to the wrapper container', async () => {
    const focusSpy = sinon.spy(focusUtils, 'focusElement');
    subject();
    await waitFor(() => {
      expect(focusSpy.args[0][0]).to.eq('.caregivers-upload-warning');
      focusSpy.restore();
    });
  });
});
