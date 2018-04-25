import React from 'react';
import PropTypes from 'prop-types';

import {
  // deepEquals,
  getDefaultFormState,
  // orderProperties,
  getDefaultRegistry
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { errorSchemaIsValid } from '../../../common/schemaform/validation';

import set from '../../../../platform/utilities/data/set';
import get from '../../../../platform/utilities/data/get';

/**
 * Displays a review card if the information inside is valid.
 *
 * For use on a schema of type 'object'.
 * Intended to wrap objects or arrays only to avoid duplicate functionality here.
 */
export default class ReviewCardField extends React.Component {
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

    // Throw an error if there’s no viewField (should be React component)
    if (typeof get('ui:options.viewComponent', this.props.uiSchema) !== 'function') {
      throw new Error(`No viewComponent found in uiSchema for ReviewCardField ${this.props.idSchema.$id}.`);
    }

    if (!['object', 'array'].includes(this.props.schema.type)) {
      throw new Error(`Unknown schema type in ReviewCardField: ${this.props.schema.type}`);
    }

    this.state = {
      // Set initial state based on whether all the data is valid
      editing: !errorSchemaIsValid(props.errorSchema)
    };
  }

  onPropertyChange(name) {
    return (value) => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(this.props.schema, undefined, this.props.registry.definitions);
      this.props.onChange(set(name, value, formData));
    };
  }


  /**
   * Much of this is taken from ArrayField & ObjectField.
   *
   * Renders a SchemaField for each property it wraps.
   */
  getEditView = () => {
    const {
      disabled,
      errorSchema,
      formData,
      idSchema, // I think this exists here
      onBlur,
      readonly,
      registry,
      schema,
      uiSchema
    } = this.props;
    const { SchemaField } = registry.fields;

    let properties;
    if (schema.type === 'object') {
      properties = Object.keys(schema.properties);
    } else if (schema.type === 'array') {
      properties = Object.keys(schema.items.properties);
    } else {
      // Shouldn't get here, but in case we update the gate in the constructor later...
      throw new Error(`Unknown schema type in ReviewCardField: ${schema.type}`);
    }

    const title = this.getTitle();

    return (
      <div className="review-card">
        <div className="review-card--header">
          <h4>{title}</h4>
        </div>
        {properties.map(propName => {
          return (
            <div key={propName}>
              <SchemaField
                name={propName}
                required={this.isRequired(propName)}
                schema={schema.properties[propName]}
                uiSchema={uiSchema[propName]}
                errorSchema={errorSchema[propName]}
                idSchema={idSchema[propName]}
                formData={formData[propName]}
                onChange={this.onPropertyChange(propName)}
                onBlur={onBlur}
                registry={registry}
                disabled={disabled}
                readonly={readonly}/>
            </div>
          );
        })}
        <button className="usa-button-primary" onClick={this.update}>Update</button>
      </div>
    );
  }


  getTitle = () => {
    const { uiSchema, formData } = this.props;
    return typeof uiSchema['ui:title'] === 'function'
      ? uiSchema['ui:title'](formData)
      : uiSchema['ui:title'];
  }


  getReviewView = () => {
    const ViewComponent = this.props.uiSchema['ui:options'].viewComponent;
    const title = this.getTitle();

    return (
      <div className="review-card">
        <div className="review-card--header">
          <h4>{title}</h4>
          <button className="usa-button-secondary" onClick={this.startEditing}>Edit</button>
        </div>
        <div className="review-card--body">
          <ViewComponent formData={this.props.formData}/>
        </div>
      </div>
    );
  }


  startEditing = () => {
    this.setState({ editing: true });
  }


  isRequired = (name) => {
    const { schema } = this.props;
    const schemaRequired = Array.isArray(schema.required) &&
      schema.required.indexOf(name) !== -1;

    if (schemaRequired) {
      return schemaRequired;
    }

    return false;
  }


  update = (event) => {
    // Don't act like the continue button
    event.preventDefault();

    // Validate the input
    // If there are validation errors
    if (!errorSchemaIsValid(this.props.errorSchema)) {
      // Show them (should be automagic)
      // Don't stop editing
    } else {
      // Update the form data in the redux store
      // Set updateRequired to false
      // Stop editing
      this.setState({ editing: false });
    }
  }


  render() {
    if (this.state.editing) {
      return this.getEditView();
    }

    return this.getReviewView();
  }
}

ReviewCardField.propTypes = {
  formData: PropTypes.object.isRequired
};

