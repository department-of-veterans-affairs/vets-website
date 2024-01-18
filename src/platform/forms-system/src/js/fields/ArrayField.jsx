import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import Scroll from 'react-scroll';

import {
  toIdSchema,
  getDefaultFormState,
  deepEquals,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import scrollTo from 'platform/utilities/ui/scrollTo';
import set from 'platform/utilities/data/set';
import {
  scrollToFirstError,
  focusElement,
  getFocusableElements,
} from '../utilities/ui';
import { setArrayRecordTouched } from '../helpers';
import { errorSchemaIsValid } from '../validation';
import { getScrollOptions, isReactComponent } from '../../../../utilities/ui';

const { Element } = Scroll;

/* Non-review growable table (array) field */
export default class ArrayField extends React.Component {
  constructor(props) {
    super(props);

    // Throw an error if there’s no viewField (should be React component)
    if (!isReactComponent(this.props.uiSchema['ui:options'].viewField)) {
      throw new Error(
        `No viewField found in uiSchema for ArrayField ${
          this.props.idSchema.$id
        }.`,
      );
    }

    /*
     * We’re keeping the editing state in local state because it’s easier to manage and
     * doesn’t need to persist from page to page
     */

    this.state = {
      editing: props.formData
        ? props.formData.map(
            (item, index) => !errorSchemaIsValid(props.errorSchema[index]),
          )
        : [true],
      removing: props.formData ? props.formData.map(() => false) : [false],
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleRemoveModal = this.handleRemoveModal.bind(this);
    this.closeRemoveModal = this.closeRemoveModal.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.focusOnFirstFocusableElement = this.focusOnFirstFocusableElement.bind(
      this,
    );
  }

  // This fills in an empty item in the array if it has minItems set
  // so that schema validation runs against the fields in the first item
  // in the array. This shouldn’t be necessary, but there’s a fix in rjsf
  // that has not been released yet
  componentDidMount() {
    const { schema, formData = [], registry } = this.props;
    if (schema.minItems > 0 && formData.length === 0) {
      this.props.onChange(
        Array(schema.minItems).fill(
          getDefaultFormState(
            schema.additionalItems,
            undefined,
            registry.definitions,
          ),
        ),
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || nextState !== this.state;
  }

  /**
   * Clicking edit on an item that’s not last and so is in view mode
   * @param {number} index - The index of the item to edit
   * @param {boolean} status - The editing status of the item to edit
   */
  handleEdit(index, status = true) {
    this.setState(set(['editing', index], status, this.state), () => {
      this.scrollToRow(`${this.props.idSchema.$id}_${index}`);
      this.focusOnFirstFocusableElement(index);
    });
  }

  /**
   * Clicking Update on an item that’s not last and is in edit mode
   * @param {number} index - The index of the item to update
   */
  handleUpdate(index) {
    const id = this.props.name;

    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(set(['editing', index], false, this.state), () => {
        this.scrollToTop();
        this.focusOnFirstFocusableElement(index, id);
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(this.props.idSchema.$id, index);
      this.props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  }

  /*
   * Clicking Add another
   */
  handleAdd() {
    const numberOfItems = this.props.formData.length;
    const lastIndex = numberOfItems - 1;

    if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
      // When we add another, we want to change the editing state of the currently
      // last item, but not ones above it
      const newEditing = this.state.editing.map(
        (val, index) => (index + 1 === this.state.editing.length ? false : val),
      );
      const editingState = this.props.uiSchema['ui:options'].reviewMode;
      const newState = {
        ...this.state,
        editing: newEditing.concat(!!editingState),
      };
      this.setState(newState, () => {
        const newFormData = this.props.formData.concat(
          getDefaultFormState(
            this.props.schema.additionalItems,
            undefined,
            this.props.registry.definitions,
          ) || {},
        );
        this.props.onChange(newFormData);
        this.scrollToRow(`${this.props.idSchema.$id}_${lastIndex + 1}`);
        this.focusOnFirstFocusableElement(numberOfItems);
      });
    } else {
      const touched = setArrayRecordTouched(this.props.idSchema.$id, lastIndex);
      this.props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  }

  /**
   * Clicking Remove on an item in edit mode
   * @param {number} indexToRemove - The index of the item to remove
   * @param {boolean} confirmRemove - If true, will open a modal to confirm remove
   */
  handleRemove(indexToRemove, confirmRemove) {
    if (confirmRemove) {
      this.setState(set(['removing', indexToRemove], true, this.state));
    } else {
      const newItems = this.props.formData.filter(
        (val, index) => index !== indexToRemove,
      );
      const newState = {
        ...this.state,
        editing: this.state.editing.filter(
          (val, index) => index !== indexToRemove,
        ),
      };
      this.props.onChange(newItems);
      this.setState(newState, () => {
        this.scrollToTop();
        // Focus on "Add Another xyz" button after removing
        focusElement('.va-growable-add-btn');
      });
    }
  }

  /**
   * Clicking Yes in the remove item modal
   * @param {number} indexToRemove - The index of the item to remove
   */
  handleRemoveModal(indexToRemove) {
    const newItems = this.props.formData.filter(
      (val, index) => index !== indexToRemove,
    );
    const newState = {
      ...this.state,
      editing: this.state.editing.filter(
        (val, index) => index !== indexToRemove,
      ),
      removing: this.state.removing.filter(
        (val, index) => index !== indexToRemove,
      ),
    };
    this.props.onChange(newItems);
    this.setState(newState, () => {
      this.scrollToTop();
      // Focus on "Add Another xyz" button after removing
      focusElement('.va-growable-add-btn');
    });
  }

  /**
   * Clicking No or outside the modal in the remove item modal
   * @param {number} indexToRemove - Close the remove modal for this item index
   */
  closeRemoveModal(indexToRemove) {
    const newState = {
      ...this.state,
      removing: this.state.removing.filter(
        (val, index) => index !== indexToRemove,
      ),
    };
    this.setState(newState);
  }

  /**
   * onChange handler for the SchemaField
   * @param {number} indexToChange - The index of the item to change
   * @param {string} value - The value to set for the item
   */
  onItemChange(indexToChange, value) {
    const newItems = set(indexToChange, value, this.props.formData || []);
    this.props.onChange(newItems);
  }

  /**
   * gets the item schema
   * @param {number} index - The index of the item to get
   */
  getItemSchema(index) {
    const { schema } = this.props;
    if (schema.items.length > index) {
      return schema.items[index];
    }

    return schema.additionalItems;
  }

  /**
   * scrolls to the top of the item
   */
  scrollToTop() {
    setTimeout(() => {
      scrollTo(
        `topOfTable_${this.props.idSchema.$id}`,
        window.Forms?.scroll || getScrollOptions({ offset: -60 }),
      );
    }, 100);
  }

  /**
   * scrolls to a particular scroller element
   * @param {string} id - The ID of the item to scroll to
   */
  scrollToRow(id) {
    if (!this.props.uiSchema['ui:options'].doNotScroll) {
      setTimeout(() => {
        scrollTo(
          `table_${id}`,
          window.Forms?.scroll || getScrollOptions({ offset: 0 }),
        );
      }, 100);
    }
  }

  /**
   * Finds all focusable elements within a wrapper element and focuses on the first one
   * @param {string} id - The id of the the wrapper element
   * @param {number} index - The index of the item to use to define the wrapper element
   */
  focusOnFirstFocusableElement(index, id = this.props.idSchema.$id) {
    // Wait for new view to render before focusing on the first input field in that group
    setTimeout(() => {
      const wrapper = document.getElementById(`${id}_${index}`);

      if (wrapper) {
        const focusableElements = getFocusableElements(wrapper);
        if (focusableElements.length) {
          const firstElement = focusableElements[0];

          if (firstElement.tagName === 'VA-RADIO-OPTION') {
            const labelForRadio = firstElement.querySelector('label');

            if (labelForRadio) {
              const associatedRadioInputId = labelForRadio.getAttribute('for');
              const associatedRadioInput = document.getElementById(
                associatedRadioInputId,
              );

              if (associatedRadioInput) {
                associatedRadioInput.focus();
              }
            }
          } else {
            firstElement.focus();
          }
        }
      }
    }, 0);
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      disabled,
      readonly,
      registry,
      formContext,
      onBlur,
      schema,
    } = this.props;
    const { definitions } = registry;
    const { TitleField, SchemaField } = registry.fields;

    const uiOptions = uiSchema['ui:options'] || {};
    const ViewField = uiOptions.viewField;
    const title = uiSchema['ui:title'] || schema.title;
    const hideTitle = !!uiOptions.title;
    const description = uiSchema['ui:description'];
    const textDescription =
      typeof description === 'string' ? description : null;
    const DescriptionField = isReactComponent(description)
      ? uiSchema['ui:description']
      : null;
    const isReviewMode = uiOptions.reviewMode;
    const hasTitleOrDescription = (!!title && !hideTitle) || !!description;
    const uiItemNameOriginal = uiOptions.itemName || 'item';
    const uiItemName = (uiOptions.itemName || 'item').toLowerCase();
    const { generateIndividualItemHeaders } = uiOptions;

    // if we have form data, use that, otherwise use an array with a single default object
    const items =
      formData && formData.length
        ? formData
        : [getDefaultFormState(schema, undefined, registry.definitions)];
    const showAddAnotherButton = items.length < (schema.maxItems || Infinity);

    const containerClassNames = classNames({
      'schemaform-field-container': true,
      'schemaform-block': hasTitleOrDescription,
      'rjsf-array-field': true,
    });

    return (
      <div className={containerClassNames}>
        {hasTitleOrDescription && (
          <div className="schemaform-block-header">
            {title && !hideTitle ? (
              <TitleField
                id={`${idSchema.$id}__title`}
                title={title}
                formContext={formContext}
                useHeaderStyling={uiOptions.useHeaderStyling}
              />
            ) : null}
            {textDescription && <p>{textDescription}</p>}
            {DescriptionField && <DescriptionField options={uiOptions} />}
            {!textDescription && !DescriptionField && description}
          </div>
        )}
        <div className="va-growable">
          <Element name={`topOfTable_${idSchema.$id}`} />
          {items.map((item, index) => {
            // This is largely copied from the default ArrayField
            const itemSchema = this.getItemSchema(index);
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(
              itemSchema,
              itemIdPrefix,
              definitions,
            );
            const { showSave } = uiOptions;
            const isLast = items.length === index + 1;
            // if showSave is true, all items show Update except the last item
            const updateText = showSave && isLast ? 'Save' : 'Update';
            const isEditing = this.state.editing[index];
            const isRemoving = this.state.removing[index];
            const ariaLabel = uiOptions.itemAriaLabel;
            const ariaItemName =
              (typeof ariaLabel === 'function' && ariaLabel(item || {})) ||
              uiItemName;
            const multipleRows = items.length > 1;
            const notLastOrMultipleRows = showSave || !isLast || multipleRows;

            if (isReviewMode ? isEditing : isLast || isEditing) {
              return (
                <div
                  key={index}
                  id={`${this.props.idSchema.$id}_${index}`}
                  className={
                    notLastOrMultipleRows ? 'va-growable-background' : null
                  }
                >
                  <Element name={`table_${itemIdPrefix}`} />
                  <div className="row small-collapse">
                    <div className="small-12 columns va-growable-expanded">
                      {isLast && multipleRows ? (
                        <h3 className="vads-u-font-size--h5">
                          New {uiItemName}
                        </h3>
                      ) : null}
                      {!isLast &&
                      multipleRows &&
                      generateIndividualItemHeaders ? (
                        <h3 className="vads-u-font-size--h5">
                          {uiItemNameOriginal}
                        </h3>
                      ) : null}
                      <div className="input-section">
                        <SchemaField
                          key={index}
                          schema={itemSchema}
                          uiSchema={uiSchema.items}
                          errorSchema={
                            errorSchema ? errorSchema[index] : undefined
                          }
                          idSchema={itemIdSchema}
                          formData={item}
                          onChange={value => this.onItemChange(index, value)}
                          onBlur={onBlur}
                          registry={this.props.registry}
                          required={false}
                          disabled={disabled}
                          readonly={readonly}
                        />
                      </div>
                      {notLastOrMultipleRows && (
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            {(!isLast || showSave) && (
                              <button
                                type="button"
                                className="float-left"
                                aria-label={`${updateText} ${ariaItemName}`}
                                onClick={() => this.handleUpdate(index)}
                              >
                                {updateText}
                              </button>
                            )}
                          </div>
                          <div className="small-6 right columns">
                            {multipleRows && (
                              <button
                                type="button"
                                className="usa-button-secondary float-right"
                                aria-label={`Remove ${ariaItemName}`}
                                onClick={() =>
                                  this.handleRemove(
                                    index,
                                    uiOptions.confirmRemove,
                                  )
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {uiOptions.confirmRemove && (
                    <VaModal
                      clickToClose
                      status="warning"
                      modalTitle={`Are you sure you want to remove this ${uiItemName}?`}
                      primaryButtonText={`Yes, remove this ${uiItemName}`}
                      secondaryButtonText="No, cancel"
                      onCloseEvent={() => this.closeRemoveModal(index)}
                      onPrimaryButtonClick={() => this.handleRemoveModal(index)}
                      onSecondaryButtonClick={() =>
                        this.closeRemoveModal(index)
                      }
                      visible={isRemoving}
                      uswds
                    >
                      {uiOptions.confirmRemoveDescription && (
                        <p>{uiOptions.confirmRemoveDescription}</p>
                      )}
                    </VaModal>
                  )}
                </div>
              );
            }
            return (
              <div
                id={`${this.props.name}_${index}`}
                key={index}
                className="va-growable-background editable-row"
              >
                <div className="row small-collapse vads-u-display--flex vads-u-align-items--center">
                  <div className="vads-u-flex--fill">
                    <ViewField
                      formData={item}
                      onEdit={() => this.handleEdit(index)}
                    />
                  </div>
                  <button
                    type="button"
                    className="usa-button-secondary edit vads-u-flex--auto"
                    aria-label={`Edit ${ariaItemName}`}
                    onClick={() => this.handleEdit(index)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
          {/* Only show the 'Add another ..' button when another item can be added. This approach helps
           improve accessibility by removing unnecessary elements from the DOM when they are not relevant 
           or interactable. */}
          {showAddAnotherButton && (
            <button
              type="button"
              className={classNames(
                'usa-button-secondary',
                'va-growable-add-btn',
              )}
              onClick={this.handleAdd}
            >
              Add another {uiItemName}
            </button>
          )}
          {/* Show an alert when no more items can be added */}
          {!showAddAnotherButton && (
            <va-alert status="warning" uswds slim>
              <p className="vads-u-margin-y--0">
                You’ve entered the maximum number of items allowed.
              </p>
            </va-alert>
          )}
        </div>
      </div>
    );
  }
}

ArrayField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};
