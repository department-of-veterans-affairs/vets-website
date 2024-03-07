import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import asyncLoader from '../../ui/asyncLoader';

describe('asyncLoader', () => {
  it('should display loading indicator while waiting', async () => {
    const content = 'Test loading content';
    const Component = asyncLoader(() => new Promise(f => f), content);

    const { container } = render(<Component />);

    await waitFor(() => {
      const loading = $('va-loading-indicator', container);
      expect(loading).to.exist;
      expect(loading.getAttribute('message')).to.eql(content);
    });
  });

  it('should display component returned from promise', async () => {
    const promise = Promise.resolve(() => <div id="test">Test component</div>);
    const Component = asyncLoader(() => promise, 'Test loading');

    const { container } = render(<Component />);

    await waitFor(() => {
      const component = $('#test', container);
      expect(component).to.exist;
      expect(component.textContent).to.eql('Test component');
    });
  });

  it('should unwrap default import if it exists', async () => {
    const promise = Promise.resolve({
      default: () => <div id="test-default">Test component default</div>,
    });
    const Component = asyncLoader(() => promise, 'Test loading');

    const { container } = render(<Component />);

    await waitFor(() => {
      const component = $('#test-default', container);
      expect(component).to.exist;
      expect(component.textContent).to.eql('Test component default');
    });
  });
});
