import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

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
});
