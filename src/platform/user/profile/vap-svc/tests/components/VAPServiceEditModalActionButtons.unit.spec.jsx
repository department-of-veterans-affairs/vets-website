import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';

import VAPServiceEditModalActionButtons from '../../components/base/VAPServiceEditModalActionButtons';

describe('<VAPServiceEditModalActionButtons/>', () => {
  let props = null;

  beforeEach(() => {
    props = {
      transactionRequest: {},
      onCancel() {},
      onDelete() {},
      title: 'TITLE_ATTRIBUTE',
      deleteEnabled: true,
    };
  });

  it('renders correctly when delete enabled', () => {
    const { container, unmount } = render(
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    expect(container.innerHTML, 'renders children components').to.contain(
      'Children',
    );

    expect(
      container.querySelectorAll('va-icon').length,
      'renders delete icon',
    ).to.equal(1);

    expect(
      container.querySelectorAll('.usa-button-secondary.button-link').length,
      'renders delete button',
    ).to.equal(1);
    unmount();
  });

  it('renders correctly when delete triggered', () => {
    const { container, unmount } = render(
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    // Click the delete button to trigger delete initiated state
    const deleteButton = container.querySelector(
      '.usa-button-secondary.button-link',
    );
    fireEvent.click(deleteButton);

    expect(container.innerHTML, 'renders alert contents').to.contain(
      'Are you sure?',
    );

    expect(
      container.innerHTML,
      'does not render children components after triggered',
    ).to.not.contain('Children');

    expect(
      container.querySelectorAll('va-icon').length,
      'hides delete icon correctly',
    ).to.equal(0);

    expect(
      container.querySelectorAll('.usa-button-secondary.button-link').length,
      'hide delete button',
    ).to.equal(0);
    unmount();
  });

  it('renders correctly when delete disabled', () => {
    const { container, rerender, unmount } = render(
      <VAPServiceEditModalActionButtons {...props}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    expect(container.innerHTML, 'renders children components').to.contain(
      'Children',
    );

    rerender(
      <VAPServiceEditModalActionButtons {...props} deleteEnabled={false}>
        <p>Children</p>
      </VAPServiceEditModalActionButtons>,
    );

    expect(
      container.querySelectorAll('.usa-button-secondary.button-link').length,
      'hide delete button',
    ).to.equal(0);
    unmount();
  });
});
