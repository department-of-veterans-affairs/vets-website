import PropTypes from 'prop-types';
import React from 'react';
import set from 'platform/utilities/data/set';
import classNames from 'classnames';

import {
  toIdSchema,
  getDefaultFormState,
  deepEquals,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import { isReactComponent } from 'platform/utilities/ui';
import { Element, getScrollOptions, scrollTo } from 'platform/utilities/scroll';

import {
  scrollToFirstError,
  focusElement,
} from 'platform/forms-system/src/js/utilities/ui';
import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';
import findDuplicateIndexes from 'platform/forms-system/src/js/utilities/data/findDuplicateIndexes';

import { NULL_CONDITION_STRING } from '../constants';

/* Non-review growable table (array) field */
// Mostly copied from USFS with a few additions/modifications:
// Addition of 'Save' button, handleSave action, modifications to handleRemove
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
     * We’re keeping the editing state in local state because it’s easier to
     * manage and doesn’t need to persist from page to page
     */
    this.state = {
      // force edit mode for any empty service period data
      editing: this.setInitialState(),
      // use new focus target function, if the prop is present
      useNewFocus: props.uiSchema.useNewFocus ?? false,
    };
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

  setInitialState = () => {
    const { formData, uiSchema } = this.props;
    if (formData) {
      const key = uiSchema?.['ui:options']?.duplicateKey || '';
      // errorSchema is not populated on init, so we need to use the form data to
      // find duplicates and put the entry into edit mode
      const duplicates = key ? findDuplicateIndexes(formData, key) : [];
      return uiSchema?.['ui:options']?.setEditState
        ? uiSchema['ui:options']?.setEditState(formData)
        : formData.map(
            (obj, index) =>
              !obj[key] ||
              obj[key]?.toLowerCase() === NULL_CONDITION_STRING.toLowerCase() ||
              duplicates.includes(index),
          );
    }
    return [true];
  };

  onItemChange = (indexToChange, value) => {
    const newItems = set(indexToChange, value, this.props.formData || []);
    this.props.onChange(newItems);
  };

  getItemSchema(index) {
    const { schema } = this.props;
    if (schema.items.length > index) {
      return schema.items[index];
    }

    return schema.additionalItems;
  }

  scrollToTop = () => {
    setTimeout(() => {
      scrollTo(
        `topOfTable_${this.props.idSchema.$id}`,
        window.Forms?.scroll || getScrollOptions({ offset: -60 }),
      );
    }, 100);
  };

  scrollToRow = id => {
    setTimeout(() => {
      const tableTarget = `table_${id}`;
      const hasTableAnchor = Boolean(
        document?.querySelector?.(`[name="${tableTarget}"]`),
      );

      scrollTo(
        hasTableAnchor ? tableTarget : `#${id}`,
        window.Forms?.scroll || getScrollOptions({ offset: 0 }),
      );
    }, 100);
  };

  findElementsFromIndex = (index, selector) => {
    // The indexed scroll element doesn't exist when the card is collapsed
    // target scrollElement; then find element
    const target =
      index < 0
        ? `topOfTable_${this.props.idSchema.$id}`
        : `table_${this.props.idSchema.$id}_${index}`;
    return (
      document
        ?.querySelector(`[name="${target}"]`)
        ?.parentElement?.querySelectorAll(selector) || []
    );
  };

  focusOnEditButton = index => {
    const editButton = this.findElementsFromIndex(-1, '.edit');
    focusElement(editButton[index]);
  };

  targetLabel = index => {
    this.scrollToRow(`${this.props.idSchema.$id}_${index}`);
    // Focus on first label
    const labels = this.findElementsFromIndex(index, 'label, legend');
    focusElement(labels[0]);
  };

  targetError = index => {
    scrollToFirstError();
    const errorMessage = this.findElementsFromIndex(
      index,
      '.usa-input-error-message',
    );
    focusElement(errorMessage[0]);
  };

  targetInput = index => {
    this.scrollToRow(`${this.props.idSchema.$id}_${index}`);
    const inputs = this.findElementsFromIndex(index, 'va-text-input');
    // use web-component shadow DOM as root to search within
    focusElement('input', {}, inputs[0]);
  };

  // restore data in event of cancellation
  handleCancelEdit = index => {
    this.props.onChange(this.state.oldData);
    this.setState(set(['editing', index], false, this.state), () => {
      this.focusOnEditButton(index);
    });
  };

  /*
   * Clicking edit on an item that’s not last and so is in view mode
   * also cache the original data in case of cancellation
   */
  handleEdit = (index, status = true) => {
    this.setState(
      set(['editing', index], status, {
        ...this.state,
        oldData: this.props.formData,
      }),
      () => {
        if (this.state.useNewFocus) {
          this.targetInput(index);
        } else {
          this.targetLabel(index);
        }
      },
    );
  };

  /*
   * Clicking Update on an item that’s not last and is in edit mode
   */
  handleUpdate = index => {
    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(set(['editing', index], false, this.state), () => {
        this.scrollToTop();
        this.focusOnEditButton(index);
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(this.props.idSchema.$id, index);
      this.props.formContext.setTouched(touched, () => {
        this.targetError(index);
      });
    }
  };

  /*
   * Clicking Save
   */
  handleSave = () => {
    const lastIndex = this.props.formData.length - 1;
    if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
      // When we add another, we want to change the editing state of the currently
      // last item, but not ones above it
      this.setState(
        state => {
          const newEditing = this.state.editing.map(
            (val, index) => (index + 1 === state.editing.length ? false : val),
          );
          return { editing: newEditing };
        },
        () => {
          // Focus on edit button after saving
          this.focusOnEditButton(lastIndex);
        },
      );
    } else {
      const touched = setArrayRecordTouched(this.props.idSchema.$id, lastIndex);
      this.props.formContext.setTouched(touched, () => {
        this.targetError(lastIndex);
      });
    }
  };

  /*
   * Clicking Add Another
   */
  handleAdd = () => {
    const lastIndex = this.props.formData.length - 1;
    if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
      // When we add another, we want to change the editing state of the currently
      // last item, but not ones above it
      const newEditing = this.state.editing.map(
        (val, index) => (index + 1 === this.state.editing.length ? false : val),
      );
      const newState = {
        ...this.state,
        editing: newEditing.concat(true),
      };

      this.setState(
        newState,
        () => {
          const newFormData = this.props.formData.concat(
            getDefaultFormState(
              this.props.schema.additionalItems,
              undefined,
              this.props.registry.definitions,
            ) || {},
          );
          this.props.onChange(newFormData);
        }, // Allow DOM to render the new card
        setTimeout(() => {
          if (this.state.useNewFocus) {
            this.targetInput(lastIndex + 1);
          } else {
            this.targetLabel(lastIndex + 1);
          }
        }),
      );
    } else {
      const touched = setArrayRecordTouched(this.props.idSchema.$id, lastIndex);
      this.props.formContext.setTouched(touched, () => {
        this.targetError(lastIndex);
      });
    }
  };

  /*
   * Clicking Remove on an item in edit mode
   */
  handleRemove = indexToRemove => {
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
      const lastIndex = this.props.formData.length - 1;
      if (lastIndex < 0) {
        this.scrollToTop();
      } else {
        // Scroll to last entry
        this.scrollToRow(`${this.props.idSchema.$id}_${lastIndex + 1}`);
      }
      // Focus on "Add Another Disability" button after removing
      focusElement('.va-growable-add-btn');
    });
  };

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
    const hasTitle = !!title && !hideTitle;
    const hasTitleOrDescription = hasTitle || !!description;
    const classes = uiOptions.classNames;

    // if we have form data, use that, otherwise use an array with a single default object
    const items =
      formData && formData.length
        ? formData
        : [getDefaultFormState(schema, undefined, registry.definitions)];

    const containerClassNames = classNames({
      'schemaform-field-container': true,
      'schemaform-block': hasTitleOrDescription,
      'schemaform-block-header': hasTitleOrDescription,
      [`${classes}`]: classes,
    });

    const isOnlyItem = items.length < 2;
    const Wrapper =
      hasTitleOrDescription && title && !hideTitle ? 'fieldset' : 'div';

    // TitleField (legend) needs to be the first child of the fieldset
    return (
      <Wrapper className={containerClassNames}>
        {hasTitle && (
          <TitleField
            id={`${idSchema.$id}__title`}
            title={title}
            formContext={formContext}
          />
        )}
        {textDescription && <p>{textDescription}</p>}
        {DescriptionField && <DescriptionField options={uiOptions} />}
        {!textDescription && !DescriptionField && description}

        <div className="va-growable vads-u-margin-top--2">
          <Element name={`topOfTable_${idSchema.$id}`} />
          {items.map((item, index) => {
            const itemSchema = this.getItemSchema(index);
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(
              itemSchema,
              itemIdPrefix,
              definitions,
            );
            const isLast = items.length === index + 1;
            const isEditing = this.state.editing[index];
            const ariaLabel = uiOptions.itemAriaLabel;
            const itemName =
              (typeof ariaLabel === 'function' && ariaLabel(item || {})) ||
              uiOptions.itemName ||
              'Item';
            const legendText = `${
              isLast && items.length > 1 ? 'New' : 'Editing'
            } ${itemName || ''}`;

            if (isEditing) {
              return (
                <div key={index} className="va-growable-background">
                  <Element name={`table_${itemIdPrefix}`} />
                  <div className="row small-collapse">
                    <fieldset className="small-12 columns va-growable-expanded word-break">
                      <legend className="vads-u-font-size--base">
                        {legendText}
                        {uiOptions.includeRequiredLabelInTitle && (
                          <span className="schemaform-required-span vads-u-font-weight--normal">
                            {' '}
                            (*Required)
                          </span>
                        )}
                      </legend>
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
                      <div className="row small-collapse">
                        <div className="small-6 left columns">
                          {!isLast && (
                            <button
                              type="button"
                              className="float-left"
                              aria-label={`Update ${itemName}`}
                              onClick={() => this.handleUpdate(index)}
                            >
                              Update
                            </button>
                          )}
                          {isLast && (
                            <button
                              type="button"
                              className="float-left"
                              aria-label={`Save ${itemName}`}
                              disabled={!this.props.formData}
                              onClick={this.handleSave}
                            >
                              Save
                            </button>
                          )}
                          <div className="float-left row columns">
                            {!isLast && (
                              <button
                                type="button"
                                className="usa-button-secondary float-left"
                                aria-label={`Cancel editing ${itemName}`}
                                onClick={() => this.handleCancelEdit(index)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="small-6 right columns">
                          {!isOnlyItem && (
                            <button
                              type="button"
                              className="usa-button-secondary float-right"
                              aria-label={`Remove ${
                                itemName === uiOptions.itemName
                                  ? 'incomplete '
                                  : ''
                              }${itemName}`}
                              onClick={() => this.handleRemove(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className="va-growable-background">
                <div className="row small-collapse vads-u-display--flex vads-u-align-items--center">
                  <ViewField
                    formData={item}
                    onEdit={() => this.handleEdit(index)}
                  />
                  <button
                    type="button"
                    className="edit usa-button-secondary vads-u-flex--auto"
                    aria-label={`Edit ${itemName}`}
                    onClick={() => this.handleEdit(index)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            className={classNames(
              'usa-button-secondary',
              'va-growable-add-btn',
              {
                'usa-button-disabled': !this.props.formData,
              },
            )}
            disabled={!this.props.formData}
            onClick={this.handleAdd}
          >
            Add another {uiOptions.itemName.toLowerCase()}
          </button>
        </div>
      </Wrapper>
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
      PropTypes.oneOfType([PropTypes.elementType, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};
