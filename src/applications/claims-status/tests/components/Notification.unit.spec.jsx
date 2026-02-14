import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { setFocus } from '../../utils/page';

import Notification from '../../components/Notification';

describe('<Notification>', () => {
  const title = 'Testing title';
  const body = 'Testing body';

  it('should render success class', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'success');
    getByText(title);
    getByText(body);
  });

  it('should render error class', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} type="error" />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('status', 'error');
    getByText(title);
    getByText(body);
  });

  it('should render alert thats closeable', () => {
    const { container, getByText } = render(
      <Notification title={title} body={body} onClose={() => true} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('closeable', 'true');
    getByText(title);
    getByText(body);
  });

  it('should render alert and focus', async () => {
    const setAlertFocus = () => {
      setFocus('.claims-alert');
    };

    const { container } = render(
      <Notification title={title} body={body} onSetFocus={setAlertFocus} />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    await waitFor(() => {
      expect(document.activeElement).to.equal(selector);
    });
  });

  it('should pass role prop to va-alert', () => {
    const { container } = render(
      <Notification title={title} body={body} role="alert" type="error" />,
    );

    const selector = container.querySelector('va-alert');
    expect(selector).to.exist;
    expect(selector).to.have.attr('role', 'alert');
  });
});
