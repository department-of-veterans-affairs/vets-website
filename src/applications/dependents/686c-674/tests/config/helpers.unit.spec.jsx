import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as focusUtils from 'platform/utilities/ui/focus';

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
  let focusElementSpy;
  beforeEach(() => {
    focusElementSpy = sinon.stub(focusUtils, 'focusElement');
  });
  afterEach(() => {
    focusElementSpy.restore();
  });

  it('should render the cancel button', () => {
    const { getByTestId } = render(<CancelButton />);
    const cancelBtn = getByTestId('cancel-btn');
    expect(cancelBtn).to.not.be.null;
  });

  it('should close the modal', async () => {
    const pushSpy = sinon.spy();
    const props = { router: { push: pushSpy } };
    const { getByTestId } = render(<CancelButton {...props} />);

    fireEvent.click(getByTestId('cancel-btn'));
    const modal = getByTestId('cancel-modal');
    expect(modal.getAttribute('visible')).to.eql('true');
    modal.__events.closeEvent();

    await waitFor(() => {
      expect(modal.getAttribute('visible')).to.eql('false');
      expect(focusElementSpy.called).to.be.true;
      expect(focusElementSpy.args[0][0]).to.eq('button');
    });
  });

  [false, true].forEach(isAddChapter => {
    it(`should show the correct modal title when add flow is: ${isAddChapter}`, async () => {
      const addOrRemove = isAddChapter === false ? `removing` : `adding`;
      const expectedString = `Cancel ${addOrRemove} spouse?`;
      const props = {
        isAddChapter,
        dependentType: 'spouse',
      };
      const { getByTestId } = render(<CancelButton {...props} />);

      fireEvent.click(getByTestId('cancel-btn'));
      await waitFor(() => {
        const modal = getByTestId('cancel-modal');
        expect(modal.getAttribute('modal-title')).to.include(expectedString);
        expect(modal.getAttribute('primary-button-text')).to.equal(
          'Yes, cancel',
        );
        expect(modal.getAttribute('secondary-button-text')).to.include(
          `No, continue ${addOrRemove} spouse`,
        );
      });
    });

    it(`should navigate away to the proper location in the form when clicking cancel`, async () => {
      const pushSpy = sinon.spy();
      const expectedRoute = isAddChapter
        ? '/options-selection/add-dependents'
        : '/options-selection/remove-dependents';
      const props = {
        isAddChapter,
        dependentType: 'children who got married',
        dependentButtonType: 'children',
        router: { push: pushSpy },
      };
      const { getByTestId } = render(<CancelButton {...props} />);

      fireEvent.click(getByTestId('cancel-btn'));
      const modal = getByTestId('cancel-modal');

      expect(modal.getAttribute('modal-title')).to.include(
        `Cancel ${isAddChapter ? 'adding' : 'removing'} ${
          props.dependentType
        }?`,
      );
      expect(modal.getAttribute('primary-button-text')).to.equal('Yes, cancel');
      expect(modal.getAttribute('secondary-button-text')).to.include(
        `No, continue ${isAddChapter ? 'adding' : 'removing'} ${
          props.dependentButtonType
        }`,
      );

      modal.__events.primaryButtonClick();

      await waitFor(() => {
        expect(pushSpy.called).to.be.true;
        expect(pushSpy.calledWith(expectedRoute));
      });
    });
  });

  it(`should navigate to the removePath location passed into the component when clicking cancel`, async () => {
    const pushSpy = sinon.spy();
    const removePath = '/test-path';
    const props = {
      dependentType: 'children who got married',
      dependentButtonType: 'children',
      removePath,
      router: { push: pushSpy },
    };
    const { getByTestId } = render(<CancelButton {...props} />);

    fireEvent.click(getByTestId('cancel-btn'));
    const modal = getByTestId('cancel-modal');

    expect(modal.getAttribute('modal-title')).to.include(
      `Cancel removing ${props.dependentType}?`,
    );
    expect(modal.getAttribute('primary-button-text')).to.equal('Yes, cancel');
    expect(modal.getAttribute('secondary-button-text')).to.include(
      `No, continue removing ${props.dependentButtonType}`,
    );

    modal.__events.primaryButtonClick();

    await waitFor(() => {
      expect(pushSpy.called).to.be.true;
      expect(pushSpy.calledWith(removePath));
    });
  });
});
