import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/web-components/react-bindings';

/**
 * ArrayField molecule component for managing arrays of form data.
 * Provides add/remove operations with confirmation modal for deletions.
 * Uses render props pattern for flexible item rendering.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Field name for the array
 * @param {string} [props.label] - Label for the array field
 * @param {Array} props.value - Current array value
 * @param {Function} props.onChange - Change handler (name, newArray)
 * @param {Function} props.renderItem - Render prop for individual items (item, index, handleItemChange, errors)
 * @param {Function} [props.getItemSummary] - Function to get summary text for confirmation modal (item, index)
 * @param {Function} [props.isItemEmpty] - Function to check if an item is empty (item) - skips confirmation if true
 * @param {Object} [props.defaultItem] - Default values for new items
 * @param {string} [props.addButtonText='Add another'] - Text for add button
 * @param {string} [props.itemName='item'] - Singular name for items (e.g., 'service period')
 * @param {number} [props.minItems=1] - Minimum number of items required
 * @param {Object} [props.errors] - Validation errors for array items
 * @param {boolean} [props.required] - Whether the field is required
 * @returns {JSX.Element} Array field component
 *
 * @example
 * ```jsx
 * <ArrayField
 *   name="servicePeriods"
 *   label="Service periods"
 *   value={localData.servicePeriods}
 *   onChange={handleFieldChange}
 *   defaultItem={{ branchOfService: '', dateFrom: '', dateTo: '' }}
 *   itemName="service period"
 *   addButtonText="Add another service period"
 *   getItemSummary={(item) => `${item.branchOfService}, ${item.dateFrom} to ${item.dateTo}`}
 *   renderItem={(item, index, handleItemChange, errors) => (
 *     <div>
 *       <SelectField name="branchOfService" value={item.branchOfService} onChange={(name, val) => handleItemChange(index, name, val)} />
 *       <MemorableDateField name="dateFrom" value={item.dateFrom} onChange={(name, val) => handleItemChange(index, name, val)} />
 *       <MemorableDateField name="dateTo" value={item.dateTo} onChange={(name, val) => handleItemChange(index, name, val)} />
 *     </div>
 *   )}
 * />
 * ```
 */
export const ArrayField = ({
  name,
  label,
  value = [],
  onChange,
  renderItem,
  getItemSummary,
  isItemEmpty,
  defaultItem = {},
  addButtonText = 'Add another',
  itemName = 'item',
  minItems = 1,
  errors = {},
  required = false,
}) => {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Ensure we always have at least minItems and filter out any undefined/null values
  // Also ensure value is an array before filtering
  const inputValue = Array.isArray(value) ? value : [];
  const validItems = inputValue.filter(
    item => item !== null && item !== undefined,
  );
  const items =
    validItems.length >= minItems ? validItems : [{ ...defaultItem }];

  /**
   * Handles adding a new item to the array
   */
  const handleAdd = () => {
    const newItems = [...items, { ...defaultItem }];
    onChange(name, newItems);
  };

  /**
   * Opens the confirmation modal for item removal
   * If the item is empty (not filled out), skip confirmation and remove directly
   * @param {number} index - Index of item to remove
   */
  const handleRemoveClick = index => {
    // If item is empty, remove without confirmation
    if (isItemEmpty && isItemEmpty(items[index])) {
      const newItems = items.filter((_, idx) => idx !== index);
      onChange(name, newItems);
      return;
    }

    // Otherwise show confirmation modal
    setItemToRemove(index);
    setShowRemoveModal(true);
  };

  /**
   * Confirms and removes the item from the array
   */
  const confirmRemove = () => {
    if (itemToRemove !== null) {
      const newItems = items.filter((_, idx) => idx !== itemToRemove);
      onChange(name, newItems);
    }
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  /**
   * Cancels the removal operation
   */
  const cancelRemove = () => {
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  /**
   * Handles changes to individual item fields
   * @param {number} index - Index of the item
   * @param {string} fieldName - Name of the field within the item
   * @param {*} fieldValue - New value for the field
   */
  const handleItemChange = (index, fieldName, fieldValue) => {
    const newItems = items.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          [fieldName]: fieldValue,
        };
      }
      return item;
    });
    onChange(name, newItems);
  };

  /**
   * Gets summary text for the item being removed
   * @returns {string} Formatted summary of the item
   */
  const getRemovalSummary = () => {
    if (itemToRemove === null || !getItemSummary) {
      return '';
    }
    return getItemSummary(items[itemToRemove], itemToRemove);
  };

  /**
   * Component to render the removal summary with the first part (before comma) bolded.
   * Used in the confirmation modal to highlight the key identifier.
   * @param {Object} props - Component props
   * @param {string} props.summary - The summary text to format
   * @returns {JSX.Element|null} Formatted summary with bolded first part or null if no summary
   */
  const RemovalSummary = ({ summary }) => {
    if (!summary) return null;

    // Split at first comma to separate primary identifier from additional details
    const commaIndex = summary.indexOf(',');
    if (commaIndex === -1) {
      // No comma, just bold the whole thing
      return <strong>{summary}</strong>;
    }

    const primaryText = summary.substring(0, commaIndex);
    const additionalDetails = summary.substring(commaIndex);

    return (
      <>
        <strong>{primaryText}</strong>
        {additionalDetails}
      </>
    );
  };

  RemovalSummary.propTypes = {
    summary: PropTypes.string,
  };

  return (
    <div className="array-field">
      {label && (
        <label className="vads-u-margin-top--0">
          {label}
          {required && (
            <span className="vads-u-color--secondary-dark"> (*Required)</span>
          )}
        </label>
      )}

      <div className="array-field-items">
        {items.map((item, index) => {
          // Ensure item exists before rendering
          const safeItem = item || { ...defaultItem };

          return (
            <div
              key={index}
              className="array-field-item vads-u-border--1px vads-u-border-color--gray-lighter vads-u-padding--3 vads-u-margin-bottom--2"
            >
              <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--2">
                <h4 className="vads-u-margin--0">
                  {itemName.charAt(0).toUpperCase() + itemName.slice(1)}{' '}
                  {index + 1}
                </h4>
                {items.length > minItems && (
                  <va-button
                    secondary
                    text="Remove"
                    onClick={() => handleRemoveClick(index)}
                    aria-label={`Remove ${itemName} ${index + 1}`}
                  />
                )}
              </div>

              <div className="array-field-item-content">
                {renderItem(
                  safeItem,
                  index,
                  handleItemChange,
                  errors[index] || {},
                )}
              </div>
            </div>
          );
        })}
      </div>

      <va-button
        secondary
        text={addButtonText}
        onClick={handleAdd}
        aria-label={`Add another ${itemName}`}
      />

      {/* Removal confirmation modal */}
      {showRemoveModal &&
        (() => {
          const summary = getRemovalSummary();
          return (
            <VaModal
              modalTitle={`Remove this ${itemName}?`}
              status="warning"
              visible={showRemoveModal}
              onCloseEvent={cancelRemove}
              uswds
            >
              <p>
                This will remove the {itemName} information
                {summary && (
                  <>
                    {' '}
                    for <RemovalSummary summary={summary} />
                  </>
                )}
                .
              </p>
              <va-button
                onClick={confirmRemove}
                text={`Yes, remove this ${itemName}`}
                aria-label={`Yes, remove this ${itemName}`}
                class="array-field-modal-button"
              />
              <va-button
                secondary
                onClick={cancelRemove}
                text="No, cancel"
                aria-label="No, cancel"
                class="array-field-modal-button"
              />
            </VaModal>
          );
        })()}
    </div>
  );
};

ArrayField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  addButtonText: PropTypes.string,
  defaultItem: PropTypes.object,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  itemName: PropTypes.string,
  label: PropTypes.string,
  minItems: PropTypes.number,
  required: PropTypes.bool,
  value: PropTypes.array,
  getItemSummary: PropTypes.func,
  isItemEmpty: PropTypes.func,
};
