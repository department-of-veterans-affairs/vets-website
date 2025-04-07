import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  generateTransition,
  generateTitle,
  CancelButton,
} from '../../config/helpers';

describe('generateTransition and generateTitle', () => {
  it('renders a transition element with the correct class and text', () => {
    const text = 'Transition text';
    const { container } = render(generateTransition(text));

    const pElement = container.querySelector('p');
    expect(pElement).to.not.be.null;
    expect(pElement.textContent).to.equal(text);
    expect(pElement.classList.contains('vads-u-margin-y--6')).to.be.true;
  });

  it('renders a transition element with a custom class if provided', () => {
    const text = 'Custom class text';
    const customClass = 'custom-class';
    const { container } = render(generateTransition(text, customClass));

    const pElement = container.querySelector('p');
    expect(pElement).to.not.be.null;
    expect(pElement.textContent).to.equal(text);
    expect(pElement.classList.contains(customClass)).to.be.true;
  });

  it('renders a title element with the correct class and text', () => {
    const text = 'Title text';
    const { container } = render(generateTitle(text));

    const h3Element = container.querySelector('h3');
    expect(h3Element).to.not.be.null;
    expect(h3Element.textContent).to.equal(text);
    expect(h3Element.classList.contains('vads-u-margin-top--0')).to.be.true;
    expect(h3Element.classList.contains('vads-u-color--base')).to.be.true;
  });
});

describe('CancelButton Component (Web Components)', () => {
  const setup = (props = {}) => {
    const mockRouter = { push: sinon.spy() };

    const utils = render(
      <MemoryRouter>
        <CancelButton router={mockRouter} {...props} />
      </MemoryRouter>,
    );

    return { ...utils, mockRouter };
  };

  it('should render the cancel button', () => {
    const { getByTestId } = setup();
    const cancelBtn = getByTestId('cancel-btn');
    expect(cancelBtn).to.not.be.null;
  });

  it('should show the correct modal title for add flow', async () => {
    const { getByTestId } = setup({
      isAddChapter: true,
      dependentType: 'spouse',
    });

    fireEvent.click(getByTestId('cancel-btn'));

    await waitFor(() => {
      const modal = getByTestId('cancel-modal');
      expect(modal.getAttribute('modal-title')).to.include(
        'Would you like to cancel adding your spouse?',
      );
    });
  });

  it('should show the correct modal title for remove flow', async () => {
    const { getByTestId } = setup({
      isAddChapter: false,
      dependentType: 'spouse',
    });

    fireEvent.click(getByTestId('cancel-btn'));

    await waitFor(() => {
      const modal = getByTestId('cancel-modal');
      expect(modal.getAttribute('modal-title')).to.include(
        'Would you like to cancel removing your spouse?',
      );
    });
  });
});
