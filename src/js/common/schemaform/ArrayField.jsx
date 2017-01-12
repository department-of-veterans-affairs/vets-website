import React from 'react';
import _ from 'lodash/fp';

import {
  retrieveSchema,
  toIdSchema,
  getDefaultFormState
} from 'react-jsonschema-form/lib/utils';

export default class ArrayField extends React.Component {
  constructor(props) {
    super(props);
    const formData = Array.isArray(props.formData) ? props.formData : null;
    this.state = {
      items: getDefaultFormState(props.schema, formData, this.props.registry.definitions) || [],
      editing: (this.props.formData || []).map(() => false)
    };
    this.onItemChange = this.onItemChange.bind(this);
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
    if (!this.props.errorSchema || !this.props.errorSchema[index]) {
      this.setState(_.set(['editing', index], false, this.state));
    }
  }

  isValid(errorSchema) {
    if (errorSchema) {
      return _.values(errorSchema).every(itemErrorSchema => {
        return !itemErrorSchema.__errors || itemErrorSchema.__errors.length === 0;
      });
    }

    return true;
  }

  handleAdd() {
    if (this.isValid(this.props.errorSchema)) {
      const newEditing = this.state.editing.map((val, index) => {
        return (index + 1) === this.state.editing.length
          ? false
          : val;
      });
      const newState = _.assign(this.state, {
        items: this.state.items.concat({}),
        editing: newEditing.concat(false)
      });
      this.setState(newState, () => {
        this.props.onChange(newState.items);
      });
    } else {
      this.props.formContext.setSubmitted();
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
      schema
    } = this.props;
    const definitions = registry.definitions;
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const SchemaField = registry.fields.SchemaField;
    const ViewField = uiSchema['ui:options'].viewField;
    return (
      <div>
        {this.state.items.map((item, index) => {
          const itemIdPrefix = `${idSchema.$id}_${index}`;
          const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);
          const isLast = this.state.items.length === (index + 1);
          const isEditing = this.state.editing[index];
          if (isLast || isEditing) {
            return (
              <div>
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
                  {!isLast &&
                    <div>
                      <button type="button" onClick={() => this.handleUpdate(index)}>Update</button>
                      <button type="button" onClick={() => this.handleRemove(index)}>Remove</button>
                    </div>}
              </div>
            );
          }
          return (
            <ViewField key={index}
                formData={item}
                onEdit={() => this.handleEdit(index)}/>
          );
        })}
        <div>
          <button type="button" onClick={() => this.handleAdd()}>Add Another</button>
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

