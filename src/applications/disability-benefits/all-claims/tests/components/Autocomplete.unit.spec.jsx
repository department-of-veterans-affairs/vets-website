import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import React from 'react';
import sinon from 'sinon';

import Autocomplete from '../../components/Autocomplete';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';

const results = Object.values(disabilityLabelsRevised);

// Necessary since VaInputText is a react binding of a web component
export const simulateInputChange = (selector, value) => {
  // Set the value of the input element
  const vaTextInput = selector;
  vaTextInput.value = value;

  // Create a new 'input' event
  const event = new Event('input', {
    bubbles: true, // Ensure the event bubbles up through the DOM
  });

  // Dispatch the event to simulate the input change
  vaTextInput.dispatchEvent(event);
};

describe('Autocomplete Component', () => {
  let props = {};

  beforeEach(() => {
    props = {
      availableResults: results,
      debounceDelay: 0, // Decreased from 200ms to speed up tests
      formData: '',
      id: 'test-id',
      label: 'Test label',
      onChange: sinon.spy(),
    };
  });

  describe('Default Rendering', () => {
    it('should render with label and input', () => {
      const { getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');

      expect(input).to.have.attribute('label', 'Test label');
      expect(input).to.be.visible;
    });

    it('should render required', () => {
      const { getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');

      expect(input).to.have.attribute('required');
    });

    it('should render with no value', () => {
      const { getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');

      expect(input).not.to.have.value;
    });

    it('should render with no list', () => {
      const { queryByTestId } = render(<Autocomplete {...props} />);

      const list = queryByTestId('autocomplete-list');

      expect(list).to.not.exist;
    });
  });

  describe('Updating State', () => {
    it('should render with value when there is initial formData', () => {
      props.formData = 'initial value';
      const { getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');

      expect(input).to.have.value('initial value');
    });

    it('should call onChange with searchTerm when input changes', () => {
      const searchTerm = 'a';
      const { getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      expect(props.onChange.calledWith(searchTerm)).to.be.true;
    });

    it('should render list with max of 21 results', async () => {
      const searchTerm = 'a';
      const { getAllByRole, getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listResultsCount = getAllByRole('option').length;

        expect(listResultsCount).to.eq(21);
      });
    });

    it('should render list results in alignment with string similarity search', async () => {
      const searchTerm = 'b';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const freeTextAndFilteredResultsCount = searchResults.length + 1;
      const { getAllByRole, getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listResults = getAllByRole('option');
        const listResultsCount = listResults.length;

        expect(listResultsCount).to.eq(freeTextAndFilteredResultsCount);
        listResults.forEach((result, index) => {
          if (index === 0) {
            expect(result.textContent).to.eq(
              `Enter your condition as "${searchTerm}"`,
            );
          } else {
            const searchResult = searchResults[index - 1];
            expect(result.textContent).to.eq(searchResult);
          }
        });
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('should highlight list results on mouse enter', async () => {
      const searchTerm = 'c';
      const { getAllByRole, getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listResults = getAllByRole('option');
        fireEvent.mouseMove(listResults[0]);

        expect(listResults[0]).to.have.class('cc-autocomplete__option--active');
        expect(listResults[0]).to.have.attribute('aria-selected', 'true');

        fireEvent.mouseMove(listResults[1]);

        expect(listResults[0]).not.to.have.class(
          'cc-autocomplete__option--active',
        );
        expect(listResults[0]).not.to.have.attribute('aria-selected', 'true');
        expect(listResults[1]).to.have.class('cc-autocomplete__option--active');
        expect(listResults[1]).to.have.attribute('aria-selected', 'true');
      });
    });

    it('should select free-text result from the list on click and make list empty', async () => {
      const searchTerm = 'free text';
      const { getAllByRole, getByTestId, queryByTestId } = render(
        <Autocomplete {...props} />,
      );

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);
      let list;

      await waitFor(() => {
        list = getByTestId('autocomplete-list');
      });
      const listResults = getAllByRole('option');

      expect(list).to.have.length(1);

      fireEvent.click(listResults[0]);
      list = queryByTestId('autocomplete-list');

      expect(input).to.have.value(searchTerm);
      expect(list).to.not.exist;
    });

    it('should select an result from the list on click and make list empty', async () => {
      const searchTerm = 'd';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { getAllByRole, getByTestId, queryByTestId } = render(
        <Autocomplete {...props} />,
      );

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        let list;
        list = getByTestId('autocomplete-list');
        const listResults = getAllByRole('option');

        expect(list).to.have.length(21);

        fireEvent.click(listResults[1]);

        expect(input).to.have.value(searchResults[0]);

        list = queryByTestId('autocomplete-list');
        expect(list).to.not.exist;
      });
    });

    it('should retain input value and make list empty when click outside', async () => {
      const searchTerm = 'f';
      const { getByTestId, queryByTestId } = render(
        <Autocomplete {...props} />,
      );

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);
      let list;

      await waitFor(() => {
        list = getByTestId('autocomplete-list');
        expect(list).to.have.length(21);
      });

      fireEvent.mouseDown(document);

      await waitFor(() => {
        list = queryByTestId('autocomplete-list');
        expect(input).to.have.value(searchTerm);
        expect(list).to.not.exist;
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should highlight list results down the list on ArrowDown', async () => {
      const searchTerm = 'g';
      const { getAllByRole, getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        const listResults = getAllByRole('option');

        expect(listResults[0]).to.have.class('cc-autocomplete__option--active');
        expect(listResults[0]).to.have.attribute('aria-selected', 'true');

        fireEvent.keyDown(input, { key: 'ArrowDown' });

        expect(listResults[1]).to.have.class('cc-autocomplete__option--active');
        expect(listResults[1]).to.have.attribute('aria-selected', 'true');
      });
    });

    it('should stop at the last result in the list on repeated ArrowDown', async () => {
      const searchTerm = 'h';
      const { getAllByRole, getByTestId } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        for (let i = 0; i < 24; i++) {
          fireEvent.keyDown(input, { key: 'ArrowDown' });
        }

        const listResults = getAllByRole('option');

        expect(listResults[20]).to.have.class(
          'cc-autocomplete__option--active',
        );
        expect(listResults[20]).to.have.attribute('aria-selected', 'true');
      });
    });

    it('should select free-text result using Enter and make list empty', async () => {
      const searchTerm = 'k';
      const { getByTestId, queryByTestId } = render(
        <Autocomplete {...props} />,
      );

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);
      let list;

      await waitFor(() => {
        list = getByTestId('autocomplete-list');
        expect(list).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'Enter' });

      list = queryByTestId('autocomplete-list');
      expect(input).to.have.value(searchTerm);
      expect(list).to.not.exist;
    });

    it('should select result using Enter and make list empty', async () => {
      const searchTerm = 'k';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const { getByTestId, queryByTestId } = render(
        <Autocomplete {...props} />,
      );

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);
      let list;

      await waitFor(() => {
        list = getByTestId('autocomplete-list');
        expect(list).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      list = queryByTestId('autocomplete-list');
      expect(input).to.have.value(searchResults[0]);
      expect(list).to.not.exist;
    });
  });

  describe('Accessibility', () => {
    it('should have autocomplete with message-aria-describedby', () => {
      const { getByTestId } = render(<Autocomplete {...props} />);

      const autocomplete = getByTestId('autocomplete-input');

      expect(autocomplete).to.have.attribute(
        'message-aria-describedby',
        'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.',
      );
    });

    it('should provide correct screen reader feedback (aria-live regions)', async () => {
      const searchTerm = 's';
      const searchResults = fullStringSimilaritySearch(searchTerm, results);
      const resultCount = searchResults.length + 1;
      const { getByTestId, getByText } = render(<Autocomplete {...props} />);

      const input = getByTestId('autocomplete-input');
      simulateInputChange(input, searchTerm);

      await waitFor(
        () => {
          const screenReaderMessage = getByText(
            `${resultCount} results. ${searchTerm}, (1 of ${resultCount})`,
          );

          expect(screenReaderMessage).to.exist;
          expect(screenReaderMessage).to.have.attribute('aria-live', 'polite');
        },
        { timeout: 1600 },
      );
    });
  });
});
