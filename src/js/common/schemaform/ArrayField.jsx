import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import Scroll from 'react-scroll';
import { scrollToFirstError } from '../utils/helpers';
import { setItemTouched } from './helpers';

import {
  toIdSchema,
  getDefaultFormState,
  deepEquals
} from 'react-jsonschema-form/lib/utils';

import { errorSchemaIsValid } from './validation';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/* Non-review growable table (array) field */
export default class ArrayField extends React.Component {
  constructor(props) {
    super(props);

    /*
     * We're keeping the editing state in local state because it's easier to manage and
     * doesn't need to persist from page to page
     */

    this.state = {
      editing: props.formData ? props.formData.map(() => false) : [true]
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
  }

  // This fills in an empty item in the array if it has minItems set
  // so that schema validation runs against the fields in the first item
  // in the array. This shouldn't be necessary, but there's a fix in rjsf
  // that has not been released yet
  componentDidMount() {
    const { schema, formData = [], registry } = this.props;
    if (schema.minItems > 0 && formData.length === 0) {
      this.props.onChange(Array(schema.minItems).fill(
        getDefaultFormState(schema.items, undefined, registry.definitions)
      ));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || nextState !== this.state;
  }

  onItemChange(indexToChange, value) {
    const newItems = _.set(indexToChange, value, this.props.formData || []);
    this.props.onChange(newItems);
  }

  scrollToTop() {
    setTimeout(() => {
      scroller.scrollTo(`topOfTable_${this.props.idSchema.$id}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: -60
      });
    }, 100);
  }

  scrollToRow(id) {
    setTimeout(() => {
      scroller.scrollTo(`table_${id}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: 0
      });
    }, 100);
  }

  /*
   * Clicking edit on an item that's not last and so is in view mode
   */
  handleEdit(index, status = true) {
    this.setState(_.set(['editing', index], status, this.state), () => {
      this.scrollToRow(`${this.props.idSchema.$id}_${index}`);
    });
  }

  /*
   * Clicking Update on an item that's not last and is in edit mode
   */
  handleUpdate(index) {
    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(_.set(['editing', index], false, this.state), () => {
        this.scrollToTop();
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setItemTouched(this.props.idSchema.$id, index, this.props.idSchema);
      this.props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  }

  /*
   * Clicking Add Another
   */
  handleAdd() {
    const lastIndex = this.props.formData.length - 1;
    if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
      // When we add another, we want to change the editing state of the currently
      // last item, but not ones above it
      const newEditing = this.state.editing.map((val, index) => {
        return (index + 1) === this.state.editing.length
          ? false
          : val;
      });
      const newState = _.assign(this.state, {
        editing: newEditing.concat(false)
      });
      this.setState(newState, () => {
        const newFormData = this.props.formData.concat(getDefaultFormState(this.props.schema.items, undefined, this.props.registry.definitions) || {});
        this.props.onChange(newFormData);
        this.scrollToRow(`${this.props.idSchema.$id}_${lastIndex + 1}`);
      });
    } else {
      const touched = setItemTouched(this.props.idSchema.$id, lastIndex, this.props.idSchema);
      this.props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  }

  /*
   * Clicking Remove on an item in edit mode
   */
  handleRemove(indexToRemove) {
    const newItems = this.props.formData.filter((val, index) => index !== indexToRemove);
    const newState = _.assign(this.state, {
      editing: this.state.editing.filter((val, index) => index !== indexToRemove),
    });
    this.props.onChange(newItems);
    this.setState(newState, () => {
      this.scrollToTop();
    });
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
      schema
    } = this.props;
    const definitions = registry.definitions;
    const { TitleField, SchemaField } = registry.fields;
    const ViewField = uiSchema['ui:options'].viewField;

    const title = uiSchema['ui:title'] || schema.title;
    const hideTitle = !!_.get(['ui:options', 'hideTitle'], uiSchema);
    const description = uiSchema['ui:description'];
    const textDescription = typeof description === 'string' ? description : null;
    const DescriptionField = typeof description === 'function'
      ? uiSchema['ui:description']
      : null;
    const hasTitleOrDescription = (!!title && !hideTitle) || !!description;

    // if we have form data, use that, otherwise use an array with a single default object
    const items = (formData && formData.length)
      ? formData
      : [getDefaultFormState(schema, undefined, registry.definitions)];

    let containerClassNames = classNames({
      'schemaform-field-container': true,
      'schemaform-block': hasTitleOrDescription
    });

    return (
      <div className={containerClassNames}>
        {hasTitleOrDescription && <div className="schemaform-block-header">
          {title && !hideTitle
              ? <TitleField
                  id={`${idSchema.$id}__title`}
                  title={title}
                  formContext={formContext}/> : null}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {!textDescription && !DescriptionField && description}
        </div>}
        <div className="va-growable">
          <Element name={`topOfTable_${idSchema.$id}`}/>
          {items.map((item, index) => {
            // This is largely copied from the default ArrayField
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(schema.items, itemIdPrefix, definitions);
            const isLast = items.length === (index + 1);
            const isEditing = this.state.editing[index];
            const notLastOrMultipleRows = !isLast || items.length > 1;

            if (isLast || isEditing) {
              return (
                <div key={index} className={notLastOrMultipleRows ? 'va-growable-background' : null}>
                  <Element name={`table_${itemIdPrefix}`}/>
                  <div className="row small-collapse">
                    <div className="small-12 columns va-growable-expanded">
                      {isLast && items.length > 1 && uiSchema['ui:options'].itemName
                          ? <h5>New {uiSchema['ui:options'].itemName}</h5>
                          : null}
                      <div className="input-section">
                        <SchemaField key={index}
                            schema={schema.items}
                            uiSchema={uiSchema.items}
                            errorSchema={errorSchema ? errorSchema[index] : undefined}
                            idSchema={itemIdSchema}
                            formData={item}
                            onChange={(value) => this.onItemChange(index, value)}
                            onBlur={onBlur}
                            registry={this.props.registry}
                            required={false}
                            disabled={disabled}
                            readonly={readonly}/>
                      </div>
                      {notLastOrMultipleRows &&
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            {!isLast && <button className="float-left" onClick={() => this.handleUpdate(index)}>Update</button>}
                          </div>
                          <div className="small-6 right columns">
                            <button className="usa-button-outline float-right" type="button" onClick={() => this.handleRemove(index)}>Remove</button>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className="va-growable-background">
                <div className="row small-collapse">
                  <div className="small-9 columns">
                    <ViewField
                        formData={item}
                        onEdit={() => this.handleEdit(index)}/>
                  </div>
                  <div className="small-3 columns">
                    <button className="usa-button-outline float-right" onClick={() => this.handleEdit(index)}>Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
          <button
              type="button"
              className={classNames(
                'usa-button-outline',
                'va-growable-add-btn',
                {
                  'usa-button-disabled': !this.props.formData
                }
              )}
              disabled={!this.props.formData}
              onClick={this.handleAdd}>
            Add Another
          </button>
        </div>
      </div>
    );
  }
}

ArrayField.propTypes = {
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object,
  errorSchema: React.PropTypes.object,
  requiredSchema: React.PropTypes.object,
  idSchema: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
  onBlur: React.PropTypes.func,
  formData: React.PropTypes.array,
  disabled: React.PropTypes.bool,
  readonly: React.PropTypes.bool,
  registry: React.PropTypes.shape({
    widgets: React.PropTypes.objectOf(React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.object,
    ])).isRequired,
    fields: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
    definitions: React.PropTypes.object.isRequired,
    formContext: React.PropTypes.object.isRequired,
  })
};
