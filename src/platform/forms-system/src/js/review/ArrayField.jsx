import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import Scroll from 'react-scroll';

import {
  getDefaultFormState,
  toIdSchema,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import SchemaForm from '../components/SchemaForm';
import { focusElement } from '../utilities/ui';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/* Growable table (Array) field on the Review page
 *
 * The idea here is that, because our pattern for growable tables on the review
 * page is that each item can be in review or edit mode, we will treat each item
 * as its own form page and this component will handle the edit/review states and
 * make sure data is properly updated in the Redux store
 */
class ArrayField extends React.Component {
  constructor(props) {
    super(props);
    // In contrast to the normal array field, we don’t want to add an empty item
    // and always show at least one item on the review page
    const arrayData = Array.isArray(props.arrayData) ? props.arrayData : null;
    this.state = {
      items: arrayData || [],
      editing: (this.props.arrayData || []).map(() => false),
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSetData = this.handleSetData.bind(this);
    this.scrollToAndFocus = this.scrollToAndFocus.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
    this.isLocked = this.isLocked.bind(this);
  }
  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.arrayData !== this.props.arrayData) {
      const arrayData = Array.isArray(newProps.arrayData)
        ? newProps.arrayData
        : [];
      const newState = {
        items: arrayData,
      };
      if (arrayData.length !== this.state.items.length) {
        newState.editing = arrayData.map(() => false);
      }

      this.setState(newState);
    }
  }

  getItemSchema(index) {
    const schema = this.props.schema;
    if (schema.items.length > index) {
      return schema.items[index];
    }

    return schema.additionalItems;
  }

  /**
   * Scroll to an element, then focus on a button within the element
   * @param {string} scrollElementName - element with "name" attribute to scroll
   *   to
   * @param {string} focusElementSelector - element to focus within element
   */
  scrollToAndFocus(scrollElementName, focusElementSelector = '') {
    if (scrollElementName) {
      setTimeout(() => {
        scroller.scrollTo(
          scrollElementName,
          window.Forms?.scroll || {
            duration: 500,
            delay: 0,
            smooth: true,
            offset: -60,
          },
        );
        focusElement(`[name="${scrollElementName}"] ${focusElementSelector}`);
      }, 100);
    }
  }

  scrollToRow(id) {
    setTimeout(() => {
      scroller.scrollTo(
        `table_${id}`,
        window.Forms?.scroll || {
          duration: 500,
          delay: 0,
          smooth: true,
          offset: 0,
        },
      );
    }, 100);
  }

  /*
   * Clicking edit on the item in review mode
   */
  handleEdit(index, status = true) {
    this.setState(_.set(['editing', index], status, this.state), () => {
      const id = `${this.props.path[this.props.path.length - 1]}_${index}`;
      this.scrollToRow(id);
      focusElement(`#table_${id}`);
    });
  }

  /*
   * Clicking Add Another in the header of the array field section
   */
  handleAdd() {
    const newState = {
      items: this.state.items.concat(
        getDefaultFormState(
          this.getItemSchema(this.state.items.length),
          undefined,
          this.props.schema.definitions,
        ) || {},
      ),
      editing: this.state.editing.concat(true),
    };
    this.setState(newState, () => {
      this.scrollToRow(
        `${this.props.path[this.props.path.length - 1]}_${this.state.items
          .length - 1}`,
      );
    });
  }

  /**
   * Clicking Remove when editing an item
   * @param {number} indexToRemove - Index in array
   * @param {string} fieldName - Name of ArrayField used by the wrapper;
   *   determined from path
   */
  handleRemove(indexToRemove, fieldName) {
    const { path, formData } = this.props;
    const newState = _.assign(this.state, {
      items: this.state.items.filter((val, index) => index !== indexToRemove),
      editing: this.state.editing.filter(
        (val, index) => index !== indexToRemove,
      ),
    });
    this.setState(newState, () => {
      this.props.setData(_.set(path, this.state.items, formData));
      // Move focus back to the add button
      this.scrollToAndFocus(`add-another-${fieldName}`);
    });
  }

  /*
   * Called on any form data change.
   *
   * When data is changed, since we’re only editing one array item at a time,
   * we need to update the full page’s form data and call the Redux setData action
   */
  handleSetData(index, data) {
    const { path, formData } = this.props;
    const newArray = _.set(index, data, this.state.items);
    this.setState({ items: newArray }, () => {
      this.props.setData(_.set(path, newArray, formData));
    });
  }

  /**
   * Clicking Update in edit mode.
   *
   * This is only called if the form is valid
   * and data is already saved through handleSetData, so we just need to change
   * the edting state
   *
   * @param {number} indexToRemove - Index in array
   * @param {string} fieldName - Name of ArrayField used by the wrapper;
   *   determined from path
   */
  handleSave(index, fieldName) {
    const newEditingArray = _.set(index, false, this.state.editing);
    this.setState({ editing: newEditingArray }, () => {
      // Return focus to button that toggled edit mode
      this.scrollToAndFocus(`${fieldName}-${index}`, '.edit-btn');
    });
  }

  isLocked() {
    return this.props.uiSchema['ui:field'] === 'BasicArrayField';
  }

  render() {
    const { schema, uiSchema, path, pageTitle, formContext } = this.props;

    const uiOptions = uiSchema['ui:options'] || {};
    const fieldName = path[path.length - 1];
    const schemaTitle = _.get('ui:title', uiSchema);
    const title =
      uiOptions.reviewTitle ||
      (typeof schemaTitle === 'string' ? schemaTitle.trim() : schemaTitle) ||
      pageTitle;

    // TODO: Make this better; it’s super hacky for now.
    const itemCountLocked = this.isLocked();
    // Make sure we default to an empty array if the item count is locked and no
    //  arrayData is passed (mysteriously)
    const items = itemCountLocked
      ? this.props.arrayData || []
      : this.state.items;
    const itemsNeeded = (schema.minItems || 0) > 0 && items.length === 0;
    const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

    return (
      <div
        name={fieldName}
        className={itemsNeeded ? 'schemaform-review-array-warning' : ''}
      >
        {title && (
          <div className="form-review-panel-page-header-row">
            <h3 className="form-review-panel-page-header vads-u-font-size--h4">
              {title}
            </h3>
            {itemsNeeded && (
              <span className="schemaform-review-array-warning-icon" />
            )}
          </div>
        )}
        <div className="va-growable va-growable-review">
          <Element
            name={`topOfTable_${fieldName}${itemCountLocked ? '_locked' : ''}`}
          />
          {items.map((item, index) => {
            const isLast = items.length === index + 1;
            const isEditing = this.state.editing[index];
            const showReviewButton =
              !itemCountLocked &&
              (!schema.minItems || items.length > schema.minItems);
            const itemSchema = this.getItemSchema(index);
            const itemTitle = itemSchema ? itemSchema.title : '';

            const idSchema = toIdSchema(
              itemSchema,
              itemSchema?.$id,
              this.props.schema.definitions,
              index,
            );

            if (isEditing) {
              return (
                <div key={index} className="va-growable-background">
                  <Element name={`table_${fieldName}_${index}`} />
                  <div
                    className="row small-collapse schemaform-array-row"
                    id={`table_${fieldName}_${index}`}
                  >
                    <div className="small-12 columns va-growable-expanded">
                      {isLast ? (
                        <h4
                          className="schemaform-array-row-title vads-u-font-size--h5 va-u-outline--none"
                          tabIndex="-1"
                          ref={focusElement}
                        >
                          New {uiOptions.itemName || 'Item'}
                        </h4>
                      ) : null}
                      <SchemaForm
                        data={item}
                        appStateData={this.props.appStateData}
                        schema={itemSchema}
                        uiSchema={uiSchema.items}
                        idSchema={idSchema}
                        trackingPrefix={this.props.trackingPrefix}
                        title={pageTitle}
                        hideTitle
                        name={fieldName}
                        formContext={formContext}
                        onBlur={this.props.onBlur}
                        onChange={data => this.handleSetData(index, data)}
                        onEdit={() => this.handleEdit(index, !isEditing)}
                        onSubmit={() => this.handleSave(index, fieldName)}
                      >
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            <button className="float-left">Update</button>
                          </div>
                          <div className="small-6 right columns">
                            {showReviewButton && (
                              <button
                                type="button"
                                className="usa-button-secondary float-right"
                                onClick={() =>
                                  this.handleRemove(index, fieldName)
                                }
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </SchemaForm>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={index}
                name={`${fieldName}-${index}`}
                className={'va-growable-background'}
              >
                <div className="row small-collapse">
                  <SchemaForm
                    reviewMode
                    data={item}
                    appStateData={this.props.appStateData}
                    schema={itemSchema}
                    uiSchema={uiSchema.items}
                    idSchema={idSchema}
                    trackingPrefix={this.props.trackingPrefix}
                    title={itemTitle}
                    name={fieldName}
                    onChange={data => this.handleSetData(index, data)}
                    onEdit={() => this.handleEdit(index, !isEditing)}
                    onSubmit={() => this.handleSave(index, fieldName)}
                  >
                    <div />
                  </SchemaForm>
                </div>
              </div>
            );
          })}
          {itemsNeeded && (
            <div className="usa-alert usa-alert-warning usa-alert-no-color usa-alert-mini">
              <div className="usa-alert-body">
                {_.get('ui:errorMessages.minItems', uiSchema) ||
                  'You need to add at least one item.'}
              </div>
            </div>
          )}
          {title &&
            !itemCountLocked && (
              <>
                <button
                  type="button"
                  name={`add-another-${fieldName}`}
                  disabled={addAnotherDisabled}
                  className="add-btn primary-outline"
                  onClick={() => this.handleAdd()}
                >
                  {uiOptions.itemName
                    ? `Add another ${uiOptions.itemName}`
                    : 'Add another'}
                </button>
                <div>
                  {addAnotherDisabled &&
                    `You’ve entered the maximum number of items allowed.`}
                </div>
              </>
            )}
        </div>
      </div>
    );
  }
}

export default ArrayField;

ArrayField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  trackingPrefix: PropTypes.string.required,
  pageKey: PropTypes.string.isRequired,
  path: PropTypes.array.isRequired,
  formData: PropTypes.object,
  arrayData: PropTypes.array,
  appStateData: PropTypes.object,
  pageTitle: PropTypes.string,
};
