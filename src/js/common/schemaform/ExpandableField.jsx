import React from 'react';
import _ from 'lodash/fp';
import ExpandingGroup from '../components/form-elements/ExpandingGroup';

export default class ExpandableField extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.formData || {};
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  onPropertyChange(name, value) {
    const newState = _.set(name, value, this.state);
    this.setState(newState);
    this.props.onChange(newState);
  }

  isRequired(name) {
    const schema = this.props.schema;
    return Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      disabled,
      readonly,
      onBlur
    } = this.props;
    const schema = this.props.schema;
    const SchemaField = this.props.registry.fields.SchemaField;
    const name = uiSchema['ui:options'].questionField;
    const expandingName = uiSchema['ui:options'].expandingField;
    const matchValue = uiSchema['ui:options'].questionMatchValue;
    return (
      <ExpandingGroup open={this.state[name] === matchValue}>
        <SchemaField
            name={name}
            required={this.isRequired(name)}
            schema={schema.properties[name]}
            uiSchema={uiSchema[name]}
            errorSchema={errorSchema[name]}
            idSchema={idSchema[name]}
            formData={this.state[name]}
            onChange={(value) => this.onPropertyChange(name, value)}
            onBlur={onBlur}
            registry={this.props.registry}
            disabled={disabled}
            readonly={readonly}/>
        <SchemaField
            name={expandingName}
            required={this.isRequired(expandingName)}
            schema={schema.properties[expandingName]}
            uiSchema={uiSchema[expandingName]}
            errorSchema={errorSchema[expandingName]}
            idSchema={idSchema[expandingName]}
            formData={this.state[expandingName]}
            onChange={(value) => this.onPropertyChange(expandingName, value)}
            onBlur={onBlur}
            registry={this.props.registry}
            disabled={disabled}
            readonly={readonly}/>
      </ExpandingGroup>
    );
  }
}

// ExpandableField.propTypes = {
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

