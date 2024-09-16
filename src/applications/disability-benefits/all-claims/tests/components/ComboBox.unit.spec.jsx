import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { fullStringSimilaritySearch } from 'platform/forms-system/src/js/utilities/addDisabilitiesStringSearch';
import React from 'react';
import sinon from 'sinon';

import { ComboBox } from '../../components/ComboBox';
import disabilityLabelsRevised from '../../content/disabilityLabelsRevised';

const items = Object.values(disabilityLabelsRevised);

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
    it('should render listbox with no items by default', () => {
      const { getByRole } = render(<ComboBox {...props} />);

      const listbox = getByRole('listbox');

      expect(listbox).to.have.length(0);
    });

    it('should render with initial formData', () => {
      props.formData = 'initial value';
      const { getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');

      expect(input.value).to.eq('initial value');
    });

    it('should render listbox items when input has a value', () => {
      const searchTerm = 'acl';
      const { getByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      const listbox = getByRole('listbox');

      inputVaTextInput(input, searchTerm);

      const filteredItems = fullStringSimilaritySearch(searchTerm, items);
      const freeTextAndFilteredItemsLength = filteredItems.length + 1;

      expect(listbox).to.have.length(freeTextAndFilteredItemsLength);
    });

    it('should render listbox items in alignment with string similarity search', () => {
      const searchTerm = 'PT';
      const searchResults = fullStringSimilaritySearch(searchTerm, items);

      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);

      const listboxItems = getAllByRole('option');

      listboxItems.forEach((item, index) => {
        if (index === 0) {
          expect(item).to.contain.text(
            `Enter your condition as "${searchTerm}"`,
          );
        } else {
          expect(item).to.contain.text(searchResults[index - 1]);
        }
      });
    });
  });

  describe('User interactions', () => {
    it('should highlight listbox item on mouse enter', () => {
      const searchTerm = 'PT';
      const { getAllByRole, getByTestId } = render(<ComboBox {...props} />);
      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);

      const listboxItems = getAllByRole('option');
      fireEvent.mouseEnter(listboxItems[0]);

      expect(listboxItems[0]).to.have.class('cc-combobox__option--active');
    });

    it('should select listbox free text item on click and then listbox empty', () => {
      const searchTerm = 'PT';
      const { getAllByRole, getByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);

      const listboxItems = getAllByRole('option');
      fireEvent.click(listboxItems[0]);

      expect(input.value).to.eq(searchTerm);

      const listbox = getByRole('listbox');
      expect(listbox).to.have.length(0);
    });

    it('should select listbox item on click and then listbox empty', () => {
      const searchTerm = 'Hear';
      const { getByRole, getAllByRole, getByTestId } = render(
        <ComboBox {...props} />,
      );

      const input = getByTestId('combobox-input');
      inputVaTextInput(input, searchTerm);

      const listboxItems = getAllByRole('option');
      fireEvent.click(listboxItems[1]);

      const filteredItems = fullStringSimilaritySearch(searchTerm, items);

      expect(input.value).to.eq(filteredItems[0]);

      const listbox = getByRole('listbox');
      expect(listbox).to.have.length(0);
    });
  });
});
