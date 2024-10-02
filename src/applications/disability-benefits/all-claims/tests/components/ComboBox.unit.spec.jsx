import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import React from 'react';
import sinon from 'sinon';

import ComboBox from '../../components/ComboBoxFunctional';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';

const items = Object.values(disabilityLabelsRevised);

const simulateInputChange = (selector, value) => {
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

describe('ComboBox Component', () => {
  let props = {};

  beforeEach(() => {
    props = {
      formData: '',
      uiSchema: {
        'ui:title': 'Test label',
        'ui:options': {
          listItems: items,
        },
      },
      idSchema: { $id: '1' },
      onChange: sinon.spy(),
    };
  });

  describe('Default Rendering', () => {
    it('should render with label and input', () => {
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input).to.have.attribute('label', 'Test label');
      expect(input).to.be.visible;
    });

    it('should render required', () => {
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input).to.have.attribute('required');
    });

    it('should render with no value', () => {
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input).to.have.value('');
    });

    it('should render with listbox with no items', () => {
      const { getByRole } = render(<ComboBox {...props} />);

      const listbox = getByRole('listbox');

      expect(listbox).to.have.length(0);
    });
  });

  describe('Updating State', () => {
    it('should render with value when there is initial formData', () => {
      props.formData = 'initial value';
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input).to.have.value('initial value');
    });

    it('should call onChange with searchTerm when input changes', () => {
      const searchTerm = 'a';
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      expect(props.onChange.calledWith(searchTerm)).to.be.true;
    });

    it('should render listbox with max of 21 items', async () => {
      const searchTerm = 'a';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listboxItemsCount = getAllByRole('option').length;

        expect(listboxItemsCount).to.eq(21);
      });
    });

    it('should render listbox items in alignment with string similarity search', async () => {
      const searchTerm = 'b';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsCount = searchResults.length + 1;
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listboxItems = getAllByRole('option');
        const listboxItemsCount = listboxItems.length;

        expect(listboxItemsCount).to.eq(freeTextAndFilteredItemsCount);
        listboxItems.forEach((item, index) => {
          if (index === 0) {
            expect(item.textContent).to.eq(
              `Enter your condition as "${searchTerm}"`,
            );
          } else {
            const searchResult = searchResults[index - 1];
            expect(item.textContent).to.eq(searchResult);
          }
        });
      });
    });
  });

  describe('Mouse Interactions', () => {
    it('should highlight listbox items on mouse enter', async () => {
      const searchTerm = 'c';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const listboxItems = getAllByRole('option');
        fireEvent.mouseEnter(listboxItems[0]);

        expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
        expect(listboxItems[0]).to.have.attribute('aria-selected', 'true');

        fireEvent.mouseEnter(listboxItems[1]);

        expect(listboxItems[0]).not.to.have.class(
          'cc-combobox__option--active',
        );
        expect(listboxItems[0]).not.to.have.attribute('aria-selected', 'true');
        expect(listboxItems[1]).to.have.class('cc-combobox__option--active');
        expect(listboxItems[1]).to.have.attribute('aria-selected', 'true');
      });
    });

    it('should select free-text item from the listbox on click and make listbox empty', () => {
      const searchTerm = 'free text';
      const { getAllByRole, getByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      let listbox = getByRole('listbox');
      const listboxItems = getAllByRole('option');

      expect(listbox).to.have.length(1);

      fireEvent.click(listboxItems[0]);
      listbox = getByRole('listbox');

      expect(input).to.have.value(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should select an item from the list on click and make listbox empty', async () => {
      const searchTerm = 'd';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getAllByRole, getByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        const listboxItems = getAllByRole('option');

        expect(listbox).to.have.length(21);

        fireEvent.click(listboxItems[1]);

        expect(input).to.have.value(searchResults[0]);
        expect(listbox).to.have.length(0);
      });
    });

    it('should retain input value and make listbox empty when click outside', async () => {
      const searchTerm = 'f';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        expect(listbox).to.have.length(21);
      });

      fireEvent.click(document);

      await waitFor(() => {
        // expect(input).to.have.value(searchTerm); TODO: fix this
        expect(listbox).to.have.length(0);
      });
    });
  });

  describe('Keyboard Interactions', () => {
    it('should highlight listbox items down the list on ArrowDown', async () => {
      const searchTerm = 'g';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const listboxItems = getAllByRole('option');

      expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[0]).to.have.attribute('aria-selected', 'true');

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(listboxItems[1]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[1]).to.have.attribute('aria-selected', 'true');
    });

    it('should stop at the last item in the listbox on repeated ArrowDown', () => {
      const searchTerm = 'h';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      for (let i = 0; i < 24; i++) {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      }

      const listboxItems = getAllByRole('option');

      expect(listboxItems[20]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[20]).to.have.attribute('aria-selected', 'true');
    });

    it('should highlight listbox items up the list on ArrowUp', () => {
      const searchTerm = 'i';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const listboxItems = getAllByRole('option');

      expect(listboxItems[1]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[1]).to.have.attribute('aria-selected', 'true');

      fireEvent.keyDown(input, { key: 'ArrowUp' });

      expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[0]).to.have.attribute('aria-selected', 'true');
    });

    it('should select free-text item using Enter and make listbox empty', async () => {
      const searchTerm = 'k';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        expect(listbox).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).to.have.value(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should select item using Enter and make listbox empty', async () => {
      const searchTerm = 'k';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        expect(listbox).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).to.have.value(searchResults[0]);
      expect(listbox).to.have.length(0);
    });

    it('should close the list and retain input on Tab', async () => {
      const searchTerm = 'l';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        expect(listbox).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Tab' });

      expect(input).to.have.value(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should close the list and retain input on Escape', async () => {
      const searchTerm = 'm';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      const listbox = getByRole('listbox');

      await waitFor(() => {
        expect(listbox).to.have.length(21);
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(input).to.have.value(searchTerm);
      expect(listbox).to.have.length(0);
    });
  });

  describe('Accessibility', () => {
    it('should have combobox with message-aria-describedby', () => {
      const { getByTestId } = render(<ComboBox {...props} />);

      const combobox = getByTestId('combobox-input');

      expect(combobox).to.have.attribute(
        'message-aria-describedby',
        'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.',
      );
    });

    it('should have listbox with role and aria-label', () => {
      const { getByRole } = render(<ComboBox {...props} />);

      const listbox = getByRole('listbox');

      expect(listbox).to.have.attribute('role', 'listbox');
      expect(listbox).to.have.attribute(
        'aria-label',
        'List of matching conditions',
      );
    });

    it('should apply aria-activedescendant correctly when navigating the list', () => {
      const searchTerm = 'u';
      const { getByTestId, getByRole } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      const listbox = getByRole('listbox');

      expect(listbox).to.have.attribute('aria-activedescendant', 'option-0');
    });

    it('should provide correct screen reader feedback (aria-live regions)', async () => {
      const searchTerm = 's';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsCount = searchResults.length + 1;
      const { getByTestId, getByText } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      simulateInputChange(input, searchTerm);

      await waitFor(() => {
        const screenReaderMessage = getByText(
          `${freeTextAndFilteredItemsCount} results available.`,
        );

        expect(screenReaderMessage).to.exist;
        expect(screenReaderMessage).to.have.attribute('role', 'alert');
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('should remove event listeners when the component unmounts', () => {
      const { unmount } = render(<ComboBox {...props} />);
      const spy = sinon.spy(document, 'removeEventListener');
      unmount();

      expect(spy.called).to.be.true;
    });
  });
});
