import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import './dom-extensions';

export const inputVaSearchInput = ({
  container,
  query = '',
  submit = true,
  selector = 'va-search-input',
}) => {
  const vaSearchInput = container.querySelector(selector);
  if (!vaSearchInput) throw new Error(`Element not found: ${selector}`);

  // set the value on the component instance
  vaSearchInput.value = query;

  // create and dispatch a native 'input' event
  const inputEvent = new container.ownerDocument.defaultView.InputEvent(
    'input',
    {
      bubbles: true,
      composed: true,
      data: query,
    },
  );
  vaSearchInput.dispatchEvent(inputEvent);

  if (submit) {
    const submitEvent = new CustomEvent('submit', {
      bubbles: true,
      composed: true,
    });
    vaSearchInput.dispatchEvent(submitEvent);
  }
};

export const runSearch = async ({ container, query = '' }) => {
  inputVaSearchInput({ container, query });
  await waitFor(
    () => expect(container.querySelector('va-loading-indicator')).to.exist,
  );
};
