import React from 'react';
import _ from 'lodash/fp';

import {
  retrieveSchema,
  toIdSchema,
  getDefaultFormState
} from 'react-jsonschema-form/lib/utils';

import { errorSchemaIsValid } from './helpers';

export default class ArrayField extends React.Component {
  constructor(props) {
    super(props);
    const formData = Array.isArray(props.formData) ? props.formData : null;
    this.state = {
      items: getDefaultFormState(props.schema, formData, this.props.registry.definitions) || [],
      editing: (this.props.formData || []).map(() => false)
    };
    this.onItemChange = this.onItemChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  onItemChange(indexToChange, value) {
    const newState = _.set('items', this.state.items.map(
      (current, index) => {
        return index === indexToChange
          ? value
          : current;
      }
    ), this.state);
    this.setState(newState, () => {
      this.props.onChange(newState.items);
    });
  }

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;
  }

  handleEdit(index, status = true) {
    this.setState(_.set(['editing', index], status, this.state));
  }

  handleUpdate(index) {
    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(_.set(['editing', index], false, this.state));
    }
  }

  handleAdd() {
    if (errorSchemaIsValid(this.props.errorSchema[this.state.items.length - 1])) {
      const newEditing = this.state.editing.map((val, index) => {
        return (index + 1) === this.state.editing.length
          ? false
          : val;
      });
      const newState = _.assign(this.state, {
        items: this.state.items.concat(getDefaultFormState(this.props.schema.items, undefined, this.props.registry.definitions) || {}),
        editing: newEditing.concat(false)
      });
      this.setState(newState, () => {
        this.props.onChange(newState.items);
      });
    } else {
      this.props.formContext.touchFields(this.props.idSchema, this.props.idSchema.$id, this.state.items.length - 1);
    }
  }

  handleRemove(indexToRemove) {
    const newState = _.assign(this.state, {
      items: this.state.items.filter((val, index) => index !== indexToRemove),
      editing: this.state.editing.filter((val, index) => index !== indexToRemove),
    });
    this.setState(newState, () => {
      this.props.onChange(newState.items);
    });
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      disabled,
      readonly,
      onBlur,
      registry,
      formContext,
      schema
    } = this.props;
    const definitions = registry.definitions;
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const { TitleField, SchemaField } = registry.fields;
    const ViewField = uiSchema['ui:options'].viewField;

    const title = uiSchema['ui:title'] || schema.title;
    const hasTextDescription = typeof uiSchema['ui:description'] === 'string';
    const DescriptionField = !hasTextDescription && typeof uiSchema['ui:description'] === 'function'
      ? uiSchema['ui:description']
      : null;

    return (
      <div>
        {title
            ? <TitleField
                id={`${idSchema.$id}__title`}
                title={title}
                formContext={formContext}/> : null}
        {hasTextDescription && <p>{uiSchema['ui:description']}</p>}
        {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
        <div className="va-growable">
          {this.state.items.map((item, index) => {
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);
            const isLast = this.state.items.length === (index + 1);
            const isEditing = this.state.editing[index];
            const notLastOrMultipleRows = !isLast || this.state.items.length > 1;
            if (isLast || isEditing) {
              return (
                <div key={index} className={notLastOrMultipleRows ? 'va-growable-background' : null}>
                  <div className="row small-collapse">
                    <div className="small-12 columns va-growable-expanded">
                      {isLast && this.state.items.length > 1 && uiSchema['ui:options'].itemName
                          ? <h5>New {uiSchema['ui:options'].itemName}</h5>
                          : null}
                      <div className="input-section">
                        <SchemaField key={index}
                            schema={itemsSchema}
                            uiSchema={uiSchema.items}
                            errorSchema={errorSchema ? errorSchema[index] : undefined}
                            idSchema={itemIdSchema}
                            formData={item}
                            onChange={(value) => this.onItemChange(index, value)}
                            onBlur={onBlur}
                            registry={this.props.registry}
                            disabled={disabled}
                            readonly={readonly}/>
                      </div>
                      {notLastOrMultipleRows &&
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            {!isLast && <button className="float-left" onClick={() => this.handleUpdate(index)}>Update</button>}
                          </div>
                          <div className="small-6 right columns">
                            <button className="usa-button-outline float-right" onClick={() => this.handleRemove(index)}>Remove</button>
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
          <button type="button" className="usa-button-outline va-growable-add-btn" onClick={this.handleAdd}>Add Another</button>
        </div>
      </div>
    );
  }
}

// ArrayField.propTypes = {
//   schema: React.PropTypes.object.isRequired,
//   uiSchema: React.PropTypes.object,
//   errorSchema: React.PropTypes.object,
//   idSchema: React.PropTypes.object,
//   onChange: React.PropTypes.func.isRequired,
//   formData: React.PropTypes.object,
//   required: React.PropTypes.bool,
//   disabled: React.PropTypes.bool,
//   readonly: React.PropTypes.bool,
//   registry: React.PropTypes.shape({
//     widgets: React.PropTypes.objectOf(React.PropTypes.oneOfType([
//       React.PropTypes.func,
//       React.PropTypes.object,
//     ])).isRequired,
//     fields: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
//     definitions: React.PropTypes.object.isRequired,
//     formContext: React.PropTypes.object.isRequired,
//   })
// };

