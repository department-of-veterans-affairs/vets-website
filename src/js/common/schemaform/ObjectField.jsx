import React from 'react';
import classNames from 'classnames';
import _ from 'lodash/fp';
import { pureWithDeepEquals } from './helpers';

import {
  deepEquals,
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  getDefaultRegistry
} from 'react-jsonschema-form/lib/utils';

import ExpandingGroup from '../components/form-elements/ExpandingGroup';

/*
 * This is largely copied from the react-jsonschema-form library,
 * but with the way descriptions are used changed
 */

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
    this.SchemaField = pureWithDeepEquals(this.props.registry.fields.SchemaField);
    this.orderedProperties = this.orderAndFilterProperties(props.schema, props.uiSchema);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.schema !== nextProps.schema || this.props.uiSchema !== nextProps.uiSchema) {
      this.orderedProperties = this.orderAndFilterProperties(nextProps.schema, nextProps.uiSchema);
    }
  }

  /*
   * This is a performance optimization to avoid extra renders. Because we mirror
   * formData in local state, each form data change will trigger two renders: one when
   * local state is updated and another when that change is reflected in formData. This check
   * skips the second render if no other props or state has changed
   */
  shouldComponentUpdate(nextProps) {
    return !deepEquals(this.props, nextProps);
  }

  onPropertyChange(name) {
    return (value) => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(this.props.schema, undefined, this.props.registry.definitions);
      this.props.onChange(_.set(name, value, formData));
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

  // This runs a series of steps that order properties and then group them into
  // expandable groups. If there are no expandable groups, then the end result of this
  // will be an array of single item arrays
  orderAndFilterProperties(schema, uiSchema) {
    const properties = Object.keys(schema.properties);
    const orderedProperties = orderProperties(properties, _.get('ui:order', uiSchema));
    const filteredProperties = orderedProperties.filter(prop => !schema.properties[prop]['ui:hidden']);
    const groupedProperties = _.groupBy((item) => {
      const expandUnderField = _.get([item, 'ui:options', 'expandUnder'], uiSchema);
      return expandUnderField || item;
    }, filteredProperties);

    return _.values(groupedProperties);
  }

  isRequired(name) {
    const { schema } = this.props;
    const schemaRequired = Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      required,
      disabled,
      readonly,
      touchedSchema
    } = this.props;
    const { definitions, fields, formContext } = this.props.registry;
    const { TitleField } = fields;
    const SchemaField = this.SchemaField;
    const schema = retrieveSchema(this.props.schema, definitions);
    const formData = Object.keys(this.props.formData || {}).length
      ? this.props.formData
      : getDefaultFormState(schema, {}, definitions);

    // description and title setup
    const showFieldLabel = uiSchema['ui:options'] && uiSchema['ui:options'].showFieldLabel;
    const title = uiSchema['ui:title'] || schema.title;

    const description = uiSchema['ui:description'];
    const textDescription = typeof description === 'string' ? description : null;
    const DescriptionField = typeof description === 'function'
      ? uiSchema['ui:description']
      : null;

    const isRoot = idSchema.$id === 'root';

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
            formData={formData[propName]}
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
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {!textDescription && !DescriptionField && description}
          {this.orderedProperties.map((objectFields, index) => {
            if (objectFields.length > 1) {
              return (
                <ExpandingGroup open={!!formData[objectFields[0]]} key={index}>
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
