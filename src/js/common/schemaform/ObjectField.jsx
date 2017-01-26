import React from 'react';
import classNames from 'classnames';
import _ from 'lodash/fp';

import {
  deepEquals,
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  getDefaultRegistry,
  setState
} from 'react-jsonschema-form/lib/utils';

import ExpandingGroup from '../components/form-elements/ExpandingGroup';

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
    this.onPropertyBlur = this.onPropertyBlur.bind(this);
    this.isRequired = this.isRequired.bind(this);
    // This runs a series of steps that order properties and then group them into
    // expandable groups. If there are no expandable groups, then the end result of this
    // will be an array of single item arrays
    this.orderAndFilterProperties = _.flow(
      properties => orderProperties(properties, _.get('ui:order', this.props.uiSchema)),
      _.groupBy((item) => {
        const expandUnderField = _.get([item, 'ui:options', 'expandUnder'], this.props.uiSchema);
        return expandUnderField || item;
      }),
      _.values
    );
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

  /*
   * This is a performance optimization to avoid extra renders. Because we mirror
   * formData in local state, each form data change will trigger two renders: one when
   * local state is updated and another when that change is reflected in formData. This check
   * skips the second render if no other props or state has changed
   */
  shouldComponentUpdate(nextProps, nextState) {
    const propsWithoutDataUnchanged = deepEquals(_.omit('formData', this.props), _.omit('formData', nextProps));
    const stateUnchanged = deepEquals(this.state, nextState);

    if (propsWithoutDataUnchanged && stateUnchanged && deepEquals(nextProps.formData, nextState)) {
      return false;
    }

    return true;
  }

  onPropertyChange(name) {
    return (value, options) => {
      this.asyncSetState({ [name]: value }, options);
    };
  }

  onPropertyBlur(name) {
    return (path = []) => {
      this.props.onBlur([name].concat(path));
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
      touchedSchema
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
      orderedProperties = this.orderAndFilterProperties(properties);
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

    const renderProp = (propName, index) => (
      <div key={index} className={index === 0 ? 'first-field' : null}>
        <SchemaField
            name={propName}
            required={this.isRequired(propName)}
            schema={schema.properties[propName]}
            uiSchema={uiSchema[propName]}
            errorSchema={errorSchema[propName]}
            idSchema={idSchema[propName]}
            formData={this.state[propName]}
            onChange={this.onPropertyChange(propName)}
            onBlur={this.onPropertyBlur(propName)}
            touchedSchema={typeof touchedSchema === 'object' ? touchedSchema[propName] : !!touchedSchema}
            registry={this.props.registry}
            disabled={disabled}
            readonly={readonly}/>
      </div>
    );

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
          {orderedProperties.map((objectFields, index) => {
            if (objectFields.length > 1) {
              return (
                <ExpandingGroup open={!!this.state[objectFields[0]]} key={index}>
                  {objectFields.map(renderProp)}
                </ExpandingGroup>
              );
            }

            return renderProp(objectFields[0], index);
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

