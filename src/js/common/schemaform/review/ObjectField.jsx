import React from 'react';
import _ from 'lodash/fp';

import {
  getDefaultFormState,
  orderProperties,
  retrieveSchema,
  shouldRender,
  getDefaultRegistry,
} from 'react-jsonschema-form/lib/utils';

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

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  getStateFromProps(props) {
    const { schema, formData, registry } = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      formContext
    } = this.props;
    const { definitions, fields } = this.props.registry;
    const { SchemaField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);

    const title = uiSchema['ui:title'] || schema.title;

    const properties = Object.keys(schema.properties);
    const orderedProperties = orderProperties(properties, uiSchema['ui:order']);
    const isRoot = idSchema.$id === 'root';

    const renderedProperties = orderedProperties
      // you can exclude fields from showing up on the review page in the form config, so remove those
      // before rendering the fields
      .filter(propName => {
        const hideOnReviewIfFalse = _.get([propName, 'ui:options', 'hideOnReviewIfFalse'], uiSchema) === true;
        const hideOnReview = _.get([propName, 'ui:options', 'hideOnReview'], uiSchema) === true;
        return (!hideOnReviewIfFalse || !!formData[propName]) && !hideOnReview;
      })
      .map((propName, index) => {
        return (
          <SchemaField key={index}
              name={propName}
              schema={schema.properties[propName]}
              uiSchema={uiSchema[propName]}
              errorSchema={errorSchema[propName]}
              idSchema={idSchema[propName]}
              onChange={f => f}
              onBlur={f => f}
              formData={formData[propName]}
              registry={this.props.registry}/>
        );
      });

    if (isRoot) {
      return (
        <div>
          <div className="form-review-panel-page-header-row">
            <h5 className="form-review-panel-page-header">{!formContext.hideTitle ? title : null}</h5>
            <button className="edit-btn primary-outline" onClick={() => formContext.onEdit()}>Edit</button>
          </div>
          <dl className="review usa-table-borderless">
            {renderedProperties}
          </dl>
        </div>
      );
    }

    return <div>{renderedProperties}</div>;
  }
}

ObjectField.propTypes = {
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object,
  errorSchema: React.PropTypes.object,
  idSchema: React.PropTypes.object,
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

