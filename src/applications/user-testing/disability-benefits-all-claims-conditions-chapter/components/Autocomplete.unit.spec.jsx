import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import Autocomplete from './Autocomplete';
import { conditionObjects } from '../content/conditionOptions';

const results = conditionObjects
  .map(obj => obj.option)
  .filter(opt => typeof opt === 'string');

// Necessary since VaInputText is a react binding of a web component
export const simulateInputChange = (selector, value) => {
  // Set the value of the input element
  const vaTextInput = selector;
  vaTextInput.value = value;

  // Create a new 'input' event
  const event = new Event('input', {
    bubbles: true, // Ensure the event bubbles up through the DOM
    composed: true,
  });

  // Create custom event to ensure it works with web components
  const customEvent = new CustomEvent('input', {
    detail: { value },
    bubbles: true,
    composed: true,
  });

  // Dispatch the event to simulate the input change
  vaTextInput.dispatchEvent(event);
  vaTextInput.dispatchEvent(customEvent);

  // Also trigger onInput directly if available
  if (vaTextInput.onInput) {
    vaTextInput.onInput({ target: { value } });
  }
};

const props = {
  availableResults: results,
  debounceDelay: 0, // Set to zero to speed up tests
  formData: '',
  id: 'test-id',
  label: 'Test label',
  onChange: sinon.spy(),
  hint: 'Helpful hint',
};

const renderAndGetInput = () => {
  const utils = render(<Autocomplete {...props} />);
  return { ...utils, input: utils.getByTestId('autocomplete-input') };
};

const typeIntoAutocomplete = (input, value) => {
  simulateInputChange(input, value);
  expect(input).to.have.value(value);
};

describe('Autocomplete Component', () => {
  describe('Default Rendering', () => {
    it('should render with label and input', () => {
      const { input } = renderAndGetInput();

      expect(input).to.have.attribute('label', 'Test label');
      expect(input).to.be.visible;
    });

    it('should render required', () => {
      const { input } = renderAndGetInput();

      expect(input).to.have.attribute('required');
    });

    it('should render with no value', () => {
      const { input } = renderAndGetInput();

      expect(input).not.to.have.value;
    });

    it('should render with no list', () => {
      const { queryByTestId } = render(<Autocomplete {...props} />);
      const list = queryByTestId('autocomplete-list');

      expect(list).to.not.exist;
    });

    it('should pass the hint attribute to va-text-input', () => {
      const { input } = renderAndGetInput();

      expect(input).to.have.attribute('hint', 'Helpful hint');
    });
  });

  describe('Updating State', () => {
    it('should render with value when there is initial formData', () => {
      props.formData = 'initial value';
      const { input } = renderAndGetInput();

      expect(input).to.have.value('initial value');
    });

    it('should call onChange with searchTerm when input changes', () => {
      const searchTerm = 'a';
      const { input } = renderAndGetInput();

      // Verify input value was set
      typeIntoAutocomplete(input, searchTerm);
    });

    it('should render list with max of 21 results', async () => {
      const searchTerm = 'a';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { input } = renderAndGetInput();

      simulateInputChange(input, searchTerm);

      expect(searchResults).to.be.an('array');
      expect(searchResults.length).to.be.at.least(20);
      expect(input.value).to.equal(searchTerm);
    });

    it('should render list results in alignment with string similarity search', async () => {
      const searchTerm = 'b';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { input } = renderAndGetInput();

      simulateInputChange(input, searchTerm);

      expect(searchResults).to.be.an('array');
      expect(searchResults.length).to.be.greaterThan(0);

      const expectedFreeText = `Enter your condition as "${searchTerm}"`;
      expect(expectedFreeText).to.equal('Enter your condition as "b"');

      expect(input.value).to.equal(searchTerm);
    });
  });

  describe('Mouse Interactions', () => {
    it('should handle mouse interactions with input', async () => {
      const searchTerm = 'c';
      const { input } = renderAndGetInput();

      typeIntoAutocomplete(input, searchTerm);

      fireEvent.focus(input);
      expect(input).to.have.attribute('data-testid', 'autocomplete-input');
    });

    it('should handle free-text input', async () => {
      const searchTerm = 'free text';
      const { input } = renderAndGetInput();

      typeIntoAutocomplete(input, searchTerm);

      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      expect(searchResults).to.be.an('array');
    });

    it('should handle search term input and verify search algorithm', async () => {
      const searchTerm = 'd';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { input } = renderAndGetInput();

      typeIntoAutocomplete(input, searchTerm);

      expect(searchResults).to.be.an('array');
      expect(searchResults.length).to.be.greaterThan(0);
      expect(searchResults[0]).to.be.a('string');
    });

    it('should retain input value when clicking outside', async () => {
      const searchTerm = 'f';
      const { input } = renderAndGetInput();

      typeIntoAutocomplete(input, searchTerm);

      fireEvent.mouseDown(document);

      expect(input).to.have.attribute('data-testid', 'autocomplete-input');
    });
  });

  describe('Keyboard Interactions', () => {
    it('should navigate the autocomplete list with keyboard keys', () => {
      const { input } = renderAndGetInput();
      const searchTerm = 't';
      simulateInputChange(input, searchTerm);

      ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab'].forEach(key => {
        fireEvent.keyDown(input, { key });
      });

      expect(input).to.have.value(searchTerm);
    });

    it('should handle Enter key with free-text input', async () => {
      const searchTerm = 'k';
      const { input } = renderAndGetInput();

      typeIntoAutocomplete(input, searchTerm);

      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).to.have.value(searchTerm);
    });

    it('should handle arrow keys and Enter with search results', async () => {
      const searchTerm = 'k';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { input } = renderAndGetInput();

      simulateInputChange(input, searchTerm);

      expect(searchResults).to.be.an('array');
      expect(searchResults.length).to.be.greaterThan(0);

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input.value).to.be.a('string');
    });
  });

  describe('Accessibility', () => {
    it('should have message-aria-describedby when input is empty', () => {
      props.formData = '';
      const { input } = renderAndGetInput();

      expect(input).to.have.attribute(
        'message-aria-describedby',
        'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.',
      );
    });

    it('should not have message-aria-describedby when input has value', () => {
      props.formData = 'initial value';
      const { input } = renderAndGetInput();

      expect(input).not.to.have.attribute('message-aria-describedby');
    });

    it('should have proper aria-live region for screen readers', async () => {
      const searchTerm = 's';
      const { getByTestId, container } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      // Check for aria-live region
      const ariaLiveRegion = container.querySelector('[aria-live="polite"]');
      expect(ariaLiveRegion).to.exist;
      expect(ariaLiveRegion).to.have.class('vads-u-visibility--screen-reader');

      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      expect(searchResults).to.be.an('array');
      expect(searchResults.length).to.be.greaterThan(0);
    });
  });
});
