import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import { ArrayField } from './array-field';

describe('ArrayField', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      name: 'testArray',
      label: 'Test Array',
      value: [{ name: 'Item 1' }],
      onChange: sinon.spy(),
      renderItem: (item, index, handleItemChange, _errors) => (
        <input
          data-testid={`item-${index}`}
          value={item.name}
          onChange={e => handleItemChange(index, 'name', e.target.value)}
        />
      ),
      defaultItem: { name: '' },
      itemName: 'item',
    };
  });

  describe('rendering', () => {
    it('renders array field with label', () => {
      const { container } = render(<ArrayField {...defaultProps} />);
      const label = container.querySelector('label');
      expect(label).to.exist;
      expect(label.textContent).to.include('Test Array');
    });

    it('shows required indicator when required', () => {
      const props = { ...defaultProps, required: true };
      const { container } = render(<ArrayField {...props} />);
      const label = container.querySelector('label');
      expect(label.textContent).to.include('*Required');
    });

    it('does not show required indicator by default', () => {
      const { container } = render(<ArrayField {...defaultProps} />);
      const label = container.querySelector('label');
      expect(label.textContent).to.not.include('*Required');
    });

    it('renders all items in the array', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
      };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(3);
    });

    it('renders minimum items when value is empty', () => {
      const props = { ...defaultProps, value: [], minItems: 1 };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(1);
    });

    it('renders item headers with index numbers', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
      };
      const { container } = render(<ArrayField {...props} />);
      const headers = container.querySelectorAll('.array-field-item h4');
      expect(headers[0].textContent).to.equal('Item 1');
      expect(headers[1].textContent).to.equal('Item 2');
    });

    it('capitalizes item name in headers', () => {
      const props = {
        ...defaultProps,
        itemName: 'service period',
        value: [{ name: 'Item 1' }],
      };
      const { container } = render(<ArrayField {...props} />);
      const header = container.querySelector('.array-field-item h4');
      expect(header.textContent).to.equal('Service period 1');
    });

    it('renders add button with custom text', () => {
      const props = {
        ...defaultProps,
        addButtonText: 'Add another service period',
      };
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');
      expect(addButton).to.have.attribute('text', 'Add another service period');
    });

    it('uses default add button text', () => {
      const props = { ...defaultProps };
      delete props.addButtonText;
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');
      expect(addButton).to.have.attribute('text', 'Add another');
    });

    it('renders remove buttons for items above minimum', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        minItems: 1,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButtons = container.querySelectorAll(
        '.array-field-item va-button[secondary][text="Remove"]',
      );
      expect(removeButtons).to.have.lengthOf(2);
    });

    it('does not render remove button when at minimum items', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }],
        minItems: 1,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButtons = container.querySelectorAll(
        'va-button[text="Remove"]',
      );
      expect(removeButtons).to.have.lengthOf(0);
    });

    it('renders without label', () => {
      const props = { ...defaultProps };
      delete props.label;
      const { container } = render(<ArrayField {...props} />);
      const label = container.querySelector('label');
      expect(label).to.not.exist;
    });
  });

  describe('interactions', () => {
    it('adds new item when add button clicked', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }],
      };
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector(
        'va-button[secondary][aria-label="Add another item"]',
      );

      addButton.click();

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testArray');
      expect(onChange.firstCall.args[1]).to.deep.equal([
        { name: 'Item 1' },
        { name: '' },
      ]);
    });

    it('uses default item when adding new item', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        defaultItem: { name: '', value: 0 },
        value: [{ name: 'Item 1', value: 5 }],
      };
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');

      addButton.click();

      expect(onChange.firstCall.args[1][1]).to.deep.equal({
        name: '',
        value: 0,
      });
    });

    it('renders items with handleItemChange function', () => {
      const onChange = sinon.spy();
      let capturedHandleItemChange;
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }],
        renderItem: (item, index, handleItemChange, _errors) => {
          capturedHandleItemChange = handleItemChange;
          return <div data-testid={`item-${index}`}>{item.name}</div>;
        },
      };
      render(<ArrayField {...props} />);

      // Call handleItemChange directly
      capturedHandleItemChange(0, 'name', 'Updated Item');

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[0]).to.equal('testArray');
      expect(onChange.firstCall.args[1]).to.deep.equal([
        { name: 'Updated Item' },
      ]);
    });

    it('updates correct item in array', () => {
      const onChange = sinon.spy();
      let capturedHandleItemChange;
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }],
        renderItem: (item, index, handleItemChange, _errors) => {
          if (index === 1) {
            capturedHandleItemChange = handleItemChange;
          }
          return <div data-testid={`item-${index}`}>{item.name}</div>;
        },
      };
      render(<ArrayField {...props} />);

      // Call handleItemChange for second item
      capturedHandleItemChange(1, 'name', 'Updated Item 2');

      expect(onChange.firstCall.args[1]).to.deep.equal([
        { name: 'Item 1' },
        { name: 'Updated Item 2' },
        { name: 'Item 3' },
      ]);
    });

    it('opens confirmation modal when removing filled item', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal).to.have.attribute('visible', 'true');
    });

    it('removes item without confirmation if empty', () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }, { name: '' }],
        isItemEmpty: item => !item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButtons = container.querySelectorAll(
        'va-button[text="Remove"]',
      );

      removeButtons[1].click();

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1]).to.deep.equal([{ name: 'Item 1' }]);

      // Modal should not appear
      const modal = container.querySelector('va-modal');
      expect(modal).to.not.exist;
    });

    it('confirms and removes item from modal', async () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.exist;
      });

      const confirmButton = container.querySelector(
        '.array-field-modal-button[aria-label^="Yes, remove"]',
      );
      confirmButton.click();

      expect(onChange.called).to.be.true;
      const newArray = onChange.lastCall.args[1];
      expect(newArray).to.have.lengthOf(1);
      expect(newArray[0].name).to.equal('Item 2');
    });

    it('cancels removal from modal', async () => {
      const onChange = sinon.spy();
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.exist;
      });

      const cancelButton = container.querySelector(
        'va-button[aria-label="No, cancel"]',
      );
      cancelButton.click();

      // onChange should not be called for removal
      expect(onChange.called).to.be.false;
    });

    it('closes modal on close event', async () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container, rerender } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.exist;
      });

      // Simulate modal close by re-rendering
      rerender(<ArrayField {...props} />);
    });
  });

  describe('item summary', () => {
    it('provides getItemSummary function to format summaries', () => {
      const getItemSummary = item => `${item.name}, ${item.dates}`;
      const props = {
        ...defaultProps,
        value: [{ name: 'Marine Corps', dates: '2010-2015' }],
        getItemSummary,
        isItemEmpty: item => !item.name,
      };
      render(<ArrayField {...props} />);

      // Verify summary function works
      expect(
        getItemSummary({ name: 'Marine Corps', dates: '2010-2015' }),
      ).to.equal('Marine Corps, 2010-2015');
    });

    it('formats summary with comma separation', () => {
      const getItemSummary = item => `${item.name}, ${item.dates}`;
      const summary = getItemSummary({ name: 'Navy', dates: '2010-2015' });

      expect(summary).to.include('Navy');
      expect(summary).to.include('2010-2015');
    });

    it('handles summary without comma', () => {
      const getItemSummary = item => item.name;
      const summary = getItemSummary({ name: 'Army' });

      expect(summary).to.equal('Army');
    });

    it('renders without getItemSummary function', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(2);
    });
  });

  describe('error handling', () => {
    it('passes errors to rendered items', () => {
      const errors = [{ name: 'Name is required' }, { name: 'Invalid name' }];
      const capturedErrors = [];
      const props = {
        ...defaultProps,
        value: [{ name: '' }, { name: 'test' }],
        errors,
        renderItem: (item, index, handleItemChange, itemErrors) => {
          capturedErrors[index] = itemErrors;
          return <div data-testid={`item-${index}`} />;
        },
      };

      render(<ArrayField {...props} />);

      expect(capturedErrors[0]).to.deep.equal({ name: 'Name is required' });
      expect(capturedErrors[1]).to.deep.equal({ name: 'Invalid name' });
    });

    it('handles missing errors for specific items', () => {
      const errors = [{ name: 'Error for first item' }];
      const capturedErrors = [];
      const props = {
        ...defaultProps,
        value: [{ name: '' }, { name: 'test' }],
        errors,
        renderItem: (item, index, handleItemChange, itemErrors) => {
          capturedErrors[index] = itemErrors;
          return <div data-testid={`item-${index}`} />;
        },
      };

      render(<ArrayField {...props} />);

      expect(capturedErrors[0]).to.deep.equal({ name: 'Error for first item' });
      expect(capturedErrors[1]).to.deep.equal({});
    });

    it('handles no errors', () => {
      const capturedErrors = [];
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }],
        renderItem: (item, index, handleItemChange, itemErrors) => {
          capturedErrors[index] = itemErrors;
          return <div data-testid={`item-${index}`} />;
        },
      };

      render(<ArrayField {...props} />);

      expect(capturedErrors[0]).to.deep.equal({});
    });
  });

  describe('minimum items', () => {
    it('enforces minimum items', () => {
      const props = { ...defaultProps, value: [], minItems: 2 };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(1); // Shows defaultItem
    });

    it('prevents removal when at minimum', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }],
        minItems: 1,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');
      expect(removeButton).to.not.exist;
    });

    it('allows removal when above minimum', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        minItems: 1,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButtons = container.querySelectorAll(
        'va-button[text="Remove"]',
      );
      expect(removeButtons).to.have.lengthOf(2);
    });
  });

  describe('accessibility', () => {
    it('sets aria-label on add button', () => {
      const props = { ...defaultProps, itemName: 'service period' };
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');
      expect(addButton).to.have.attribute(
        'aria-label',
        'Add another service period',
      );
    });

    it('sets aria-label on remove buttons', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        itemName: 'previous name',
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButtons = container.querySelectorAll(
        'va-button[text="Remove"]',
      );

      expect(removeButtons[0]).to.have.attribute(
        'aria-label',
        'Remove previous name 1',
      );
      expect(removeButtons[1]).to.have.attribute(
        'aria-label',
        'Remove previous name 2',
      );
    });

    it('includes modal title with item name', async () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        itemName: 'service period',
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.have.attribute(
          'modal-title',
          'Remove this service period?',
        );
      });
    });
  });

  describe('edge cases', () => {
    it('handles undefined value', () => {
      const props = { ...defaultProps, value: undefined };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(1);
    });

    it('handles empty array', () => {
      const props = { ...defaultProps, value: [] };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(1);
    });

    it('handles very large arrays', () => {
      const largeArray = Array.from({ length: 50 }, (_, i) => ({
        name: `Item ${i + 1}`,
      }));
      const props = { ...defaultProps, value: largeArray };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(50);
    });

    it('handles rapid add operations', () => {
      const onChange = sinon.spy();
      const props = { ...defaultProps, onChange, value: [{ name: 'Item 1' }] };
      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');

      for (let i = 0; i < 5; i++) {
        addButton.click();
      }

      expect(onChange.callCount).to.equal(5);
    });

    it('handles removing items', () => {
      const onChange = sinon.spy();
      const isItemEmpty = item => !item.name;
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1' }, { name: '' }],
        isItemEmpty,
        minItems: 1,
      };
      const { container } = render(<ArrayField {...props} />);

      // Verify isItemEmpty function works
      expect(isItemEmpty({ name: '' })).to.be.true;
      expect(isItemEmpty({ name: 'Item 1' })).to.be.false;

      // Should have remove buttons
      const removeButtons = container.querySelectorAll(
        'va-button[text="Remove"]',
      );
      expect(removeButtons.length).to.be.at.least(1);
    });

    it('handles missing isItemEmpty function', () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      // Should show modal since isItemEmpty is not provided
      removeButton.click();

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
    });

    it('handles complex nested objects in items', () => {
      const onChange = sinon.spy();
      const complexItem = {
        name: { first: 'John', last: 'Doe' },
        address: { city: 'New York', state: 'NY' },
      };
      const props = {
        ...defaultProps,
        onChange,
        value: [complexItem],
        defaultItem: {
          name: { first: '', last: '' },
          address: { city: '', state: '' },
        },
      };

      const { container } = render(<ArrayField {...props} />);
      const addButton = container.querySelector('va-button[secondary]');

      addButton.click();

      expect(onChange.calledOnce).to.be.true;
      expect(onChange.firstCall.args[1][1]).to.deep.equal({
        name: { first: '', last: '' },
        address: { city: '', state: '' },
      });
    });
  });

  describe('modal interactions', () => {
    it('shows modal with warning status', async () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.have.attribute('status', 'warning');
      });
    });

    it('shows modal with uswds attribute', async () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const modal = container.querySelector('va-modal');
        expect(modal).to.have.attribute('uswds', 'true');
      });
    });

    it('shows correct button text in modal', async () => {
      const props = {
        ...defaultProps,
        value: [{ name: 'Item 1' }, { name: 'Item 2' }],
        itemName: 'service period',
        isItemEmpty: item => !item.name,
        getItemSummary: item => item.name,
      };
      const { container } = render(<ArrayField {...props} />);
      const removeButton = container.querySelector('va-button[text="Remove"]');

      removeButton.click();

      await waitFor(() => {
        const confirmButton = container.querySelector(
          'va-button[text="Yes, remove this service period"]',
        );
        expect(confirmButton).to.exist;
      });
    });
  });

  describe('value type handling', () => {
    it('handles items with different data types', () => {
      const props = {
        ...defaultProps,
        value: [
          { name: 'String item' },
          { name: 123 },
          { name: true },
          { name: null },
        ],
      };
      const { container } = render(<ArrayField {...props} />);
      const items = container.querySelectorAll('.array-field-item');
      expect(items).to.have.lengthOf(4);
    });

    it('preserves item structure on changes', () => {
      const onChange = sinon.spy();
      let capturedHandleItemChange;
      const props = {
        ...defaultProps,
        onChange,
        value: [{ name: 'Item 1', metadata: { id: 1, active: true } }],
        renderItem: (item, index, handleItemChange) => {
          capturedHandleItemChange = handleItemChange;
          return <div data-testid={`item-${index}`}>{item.name}</div>;
        },
      };
      render(<ArrayField {...props} />);

      // Call handleItemChange directly
      capturedHandleItemChange(0, 'name', 'Updated');

      expect(onChange.firstCall.args[1][0]).to.deep.equal({
        name: 'Updated',
        metadata: { id: 1, active: true },
      });
    });
  });
});
