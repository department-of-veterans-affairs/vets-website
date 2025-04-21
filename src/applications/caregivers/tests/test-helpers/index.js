import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import './dom-extensions';

export const inputVaSearchInput = ({
  container,
  query = '',
  submit = true,
  selector = 'va-search-input',
}) => {
  const vaSearchInput = container.querySelector(selector);
  vaSearchInput.value = query;

  const event = new CustomEvent('input', {
    bubbles: true,
    detail: { value: query },
  });
  vaSearchInput.dispatchEvent(event);

  if (submit) {
    const submitEvent = new CustomEvent('submit', { bubbles: true });
    fireEvent(vaSearchInput, submitEvent);
  }
};

export const runSearch = async ({ container, query = '' }) => {
  inputVaSearchInput({ container, query });
  await waitFor(
    () => expect(container.querySelector('va-loading-indicator')).to.exist,
  );
};
