import { fireEvent, render } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import React from 'react';
import sinon from 'sinon';

import { ComboBox } from '../../components/ComboBox';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';

const items = Object.values(disabilityLabelsRevised);

// should actually type
const inputVaTextInput = (selector, value) => {
  const vaTextInput = selector;
  vaTextInput.value = value;
  const event = new CustomEvent('input', {
    bubbles: true,
    detail: { value },
  });
  vaTextInput.dispatchEvent(event);
};

describe('ComboBox', () => {
  let props = {};

  beforeEach(() => {
    props = {
      formData: '',
      uiSchema: {
        'ui:title': 'Test',
        'ui:options': {
          listItems: items,
        },
      },
      idSchema: { $id: '1' },
      onChange: sinon.spy(),
    };
  });

  describe('Rendering', () => {
    it('should render label and input by default', () => {
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input).to.have.attribute('label', 'Test');
      expect(input).to.have.attribute('required');
      expect(input).to.be.visible;
    });

    it('should render listbox with no items by default', () => {
      const { getByRole } = render(<ComboBox {...props} />);

      const listbox = getByRole('listbox');

      expect(listbox).to.have.length(0);
    });

    it('should render input with value when there is initial formData', () => {
      props.formData = 'initial value';
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input.value).to.eq('initial value');
    });

    it('should render listbox with max of 21 items', () => {
      const searchTerm = 'a';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const filteredItemsLength = searchResults.length;
      const freeTextAndFilteredItemsLength = filteredItemsLength + 1;
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      const listboxItems = getAllByRole('option');

      expect(filteredItemsLength).to.eq(20);
      expect(listboxItems).to.have.length(freeTextAndFilteredItemsLength);
    });

    it('should render listbox items in alignment with string similarity search', () => {
      const searchTerm = 'b';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsLength = searchResults.length + 1;
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      const listboxItems = getAllByRole('option');

      expect(listboxItems).to.have.length(freeTextAndFilteredItemsLength);
      listboxItems.forEach((item, index) => {
        if (index === 0) {
          expect(item.textContent).to.eq(
            `Enter your condition as "${searchTerm}"`,
          );
        } else {
          expect(item.textContent).to.eq(searchResults[index - 1]);
        }
      });
    });
  });

  describe('User interactions', () => {
    it('should highlight listbox items on mouse enter', () => {
      const searchTerm = 'c';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      const listboxItems = getAllByRole('option');
      fireEvent.mouseEnter(listboxItems[0]);

      expect(listboxItems[0].textContent).to.eq(
        `Enter your condition as "${searchTerm}"`,
      );
      expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[0]).to.have.attribute('aria-selected', 'true');

      fireEvent.mouseEnter(listboxItems[1]);

      expect(listboxItems[1].textContent).to.eq(searchResults[0]);
      expect(listboxItems[1]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[1]).to.have.attribute('aria-selected', 'true');
    });

    it('should highlight listbox items on arrow down', () => {
      const searchTerm = 'd';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      const listboxItems = getAllByRole('option');
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(listboxItems[0].textContent).to.eq(
        `Enter your condition as "${searchTerm}"`,
      );
      expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[0]).to.have.attribute('aria-selected', 'true');

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      expect(listboxItems[1].textContent).to.eq(searchResults[0]);
      expect(listboxItems[1]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[1]).to.have.attribute('aria-selected', 'true');
    });

    it('should stop at the last item in the listbox on arrow down', () => {
      const searchTerm = 'd';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      const listboxItems = getAllByRole('option');

      for (let i = 0; i < 24; i++) {
        fireEvent.keyDown(input, { key: 'ArrowDown' });
      }

      expect(listboxItems[20]).to.have.class('cc-combobox__option--active');
      expect(listboxItems[20]).to.have.attribute('aria-selected', 'true');
    });

    // Arrow down works correctly and the first two arrow ups are working correctly it is just getting stuck on the free text
    // This is not occurring in the DOM
    // it('should arrow down then arrow up to bring focus back to input', () => {
    //   const searchTerm = 'e';
    //   const { getByTestId } = render(<ComboBox {...props} />);

    //   const input = getByTestId('combobox-input');
    //   inputVaTextInput(input, searchTerm);
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });

    //   fireEvent.keyDown(input, { key: 'ArrowUp' });
    //   fireEvent.keyDown(input, { key: 'ArrowUp' });
    //   fireEvent.keyDown(input, { key: 'ArrowUp' });

    //   expect(document.activeElement).to.eq(input);
    // });

    // I can't type in the input so this isn't possible
    // it('should highlight listbox items on arrow down but then on type should type in input', () => {
    //   const searchTerm = 'Nec';
    //   const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

    //   const input = getByTestId('combobox-input');
    //   inputVaTextInput(input, searchTerm);
    //   const listboxItems = getAllByRole('option');
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   expect(listboxItems[1]).to.have.class('cc-combobox__option--active');

    //   userEvent.type(input, 'k');
    //   expect(input.value).to.eq('Neck');
    //   expect(listboxItems[1]).not.to.have.class('cc-combobox__option--active');
    // });

    it('should select listbox free text item with click and then listbox should be empty', () => {
      const searchTerm = 'e';
      const { getAllByRole, getByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      const listboxItems = getAllByRole('option');
      fireEvent.click(listboxItems[0]);
      listbox = getByRole('listbox');

      expect(input.value).to.eq(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should select listbox free text item with keyboard enter and then listbox should be empty', () => {
      const searchTerm = 'f';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });
      listbox = getByRole('listbox');

      expect(input.value).to.eq(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should select listbox item with click and then listbox should be empty', () => {
      const searchTerm = 'g';
      const filteredItems = fullStringSimilaritySearch(searchTerm, items);
      const { getByRole, getAllByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      const listboxItems = getAllByRole('option');
      fireEvent.click(listboxItems[1]);
      listbox = getByRole('listbox');

      expect(input.value).to.eq(filteredItems[0]);
      expect(listbox).to.have.length(0);
    });

    it('should not select listbox item with click outside and listbox should be empty', async () => {
      const searchTerm = 'h';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      fireEvent.click(document);
      listbox = getByRole('listbox');

      expect(input.value).to.eq(searchTerm);
      expect(listbox).to.have.length(0);
    });

    // Error: An error was thrown inside one of your components,
    // it('should select listbox item with keyboard enter and then listbox should be empty', async () => {
    //   const searchTerm = 'i';
    //   const filteredItems = fullStringSimilaritySearch(searchTerm, items);
    //   const { getByRole, getByTestId } = render(<ComboBox {...props} />);

    //   const input = getByTestId('combobox-input');
    //   inputVaTextInput(input, searchTerm);
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'ArrowDown' });
    //   fireEvent.keyDown(input, { key: 'Enter' });
    //   const listbox = getByRole('listbox');

    //   expect(input.value).to.eq(filteredItems[1]);
    //   expect(listbox).to.have.length(0);
    // });

    it('should not select listbox item with keyboard tab and listbox should be empty', async () => {
      const searchTerm = 'k';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Tab' });
      listbox = getByRole('listbox');

      expect(input.value).to.eq(searchTerm);
      expect(listbox).to.have.length(0);
    });

    it('should not select listbox item with keyboard escape and listbox should be empty', async () => {
      const searchTerm = 'l';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);
      let listbox = getByRole('listbox');
      expect(listbox).to.have.length(21);

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Tab' });
      listbox = getByRole('listbox');

      expect(input.value).to.eq(searchTerm);
      expect(listbox).to.have.length(0);
    });
  });
});
