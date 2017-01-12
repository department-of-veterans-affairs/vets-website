import React from 'react';
import classNames from 'classnames';

import {
  deepEquals,
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  shouldRender,
  getDefaultRegistry,
  setState
} from 'react-jsonschema-form/lib/utils';

/*
 * This is largely copied from the react-jsonschema-form library,
 * but with the way descriptions are used changed
 */

function objectKeysHaveChanged(formData, state) {
  // for performance, first check for lengths
  const newKeys = Object.keys(formData);
  const oldKeys = Object.keys(state);
  if (newKeys.length < oldKeys.length) {
    return true;
  }
  // deep check on sorted keys
  if (!deepEquals(newKeys.sort(), oldKeys.sort())) {
    return true;
  }
  return false;
}

class ObjectField extends React.Component {
  static defaultProps = {
    uiSchema: {},
    errorSchema: {},
    idSchema: {},
    registry: getDefaultRegistry(),
    required: false,
    disabled: false,
    readonly: false,
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this.onPropertyChange = this.onPropertyChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const state = this.getStateFromProps(nextProps);
    const { formData } = nextProps;
    if (formData && objectKeysHaveChanged(formData, this.state)) {
      // We *need* to replace state entirely here has we have received formData
      // holding different keys (so with some removed).
      this.state = state;
      this.forceUpdate();
    } else {
      this.setState(state);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onPropertyChange(name) {
    return (value, options) => {
      this.asyncSetState({ [name]: value }, options);
    };
  }

  getStateFromProps(props) {
    const { schema, formData, registry } = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  isRequired(name) {
    const { schema, uiSchema, formContext } = this.props;
    const schemaRequired = Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    if (uiSchema[name] && uiSchema[name]['ui:requiredIf']) {
      const requiredIf = uiSchema[name]['ui:requiredIf'];
      return requiredIf(formContext.formData);
    }

    return false;
  }

  asyncSetState(state, options = { validate: false }) {
    setState(this, state, () => {
      this.props.onChange(this.state, options);
    });
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      onBlur
    } = this.props;
    const { definitions, fields, formContext } = this.props.registry;
    const { SchemaField, TitleField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);

    // description and title setup
    const showFieldLabel = uiSchema['ui:options'] && uiSchema['ui:options'].showFieldLabel;
    const title = uiSchema['ui:title'] || schema.title;
    const hasTextDescription = typeof uiSchema['ui:description'] === 'string';
    const DescriptionField = !hasTextDescription && typeof uiSchema['ui:description'] === 'function'
      ? uiSchema['ui:description']
      : null;
    const isRoot = idSchema.$id === 'root';

    let orderedProperties;
    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema['ui:order']);
    } catch (err) {
      return (
        <div>
          <p className="config-error" style={{ color: 'red' }}>
            Invalid {name || 'root'} object field configuration:
            <em>{err.message}</em>.
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }

    let containerClassNames = classNames({
      'input-section': isRoot,
      'schemaform-block': title && !isRoot
    });


    return (
      <fieldset>
        <div className={containerClassNames}>
          {title && !showFieldLabel
              ? <TitleField
                  id={`${idSchema.$id}__title`}
                  title={title}
                  required={required}
                  formContext={formContext}/> : null}
          {hasTextDescription && <p>{uiSchema['ui:description']}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {
          orderedProperties.map((propName, index) => {
            return (
              <SchemaField key={index}
                  name={propName}
                  required={this.isRequired(propName)}
                  schema={schema.properties[propName]}
                  uiSchema={uiSchema[propName]}
                  errorSchema={errorSchema[propName]}
                  idSchema={idSchema[propName]}
                  formData={this.state[propName]}
                  onChange={this.onPropertyChange(propName)}
                  onBlur={onBlur}
                  registry={this.props.registry}
                  disabled={disabled}
                  readonly={readonly}/>
            );
          })
          }
        </div>
      </fieldset>
    );
  }
}

ObjectField.propTypes = {
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object,
  errorSchema: React.PropTypes.object,
  idSchema: React.PropTypes.object,
  onChange: React.PropTypes.func.isRequired,
  formData: React.PropTypes.object,
  required: React.PropTypes.bool,
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

export default ObjectField;

