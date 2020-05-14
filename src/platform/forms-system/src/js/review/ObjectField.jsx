import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports

import {
  getDefaultFormState,
  orderProperties,
  shouldRender,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

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
  };

  constructor() {
    super();
    this.isRequired = this.isRequired.bind(this);
    this.orderAndFilterProperties = _.flow(
      properties =>
        orderProperties(properties, _.get('ui:order', this.props.uiSchema)),
      _.groupBy(item => {
        const expandUnderField = _.get(
          [item, 'ui:options', 'expandUnder'],
          this.props.uiSchema,
        );
        return expandUnderField || item;
      }),
      _.values,
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onPropertyChange(name) {
    return value => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );
      this.props.onChange(_.set(name, value, formData));
    };
  }

  getStateFromProps(props) {
    const { schema, formData, registry } = props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  isRequired(name) {
    const schema = this.props.schema;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  render() {
    const { uiSchema, errorSchema, idSchema, schema, formContext } = this.props;
    const SchemaField = this.props.registry.fields.SchemaField;

    const properties = Object.keys(schema.properties);
    const isRoot = idSchema.$id === 'root';
    const formData = this.props.formData || {};

    const renderField = propName => (
      <SchemaField
        key={propName}
        name={propName}
        schema={schema.properties[propName]}
        uiSchema={uiSchema[propName]}
        errorSchema={errorSchema[propName]}
        idSchema={idSchema[propName]}
        onChange={this.onPropertyChange(propName)}
        onBlur={this.props.onBlur}
        required={this.isRequired(propName)}
        formData={formData[propName]}
        registry={this.props.registry}
      />
    );

    const showField = propName => {
      const hiddenOnSchema = schema.properties[propName]['ui:hidden'];
      const collapsedOnSchema = schema.properties[propName]['ui:collapsed'];
      const hideOnReviewIfFalse =
        _.get([propName, 'ui:options', 'hideOnReviewIfFalse'], uiSchema) ===
        true;
      let hideOnReview = _.get(
        [propName, 'ui:options', 'hideOnReview'],
        uiSchema,
      );
      if (typeof hideOnReview === 'function') {
        hideOnReview = hideOnReview(formData, formContext);
      }
      return (
        (!hideOnReviewIfFalse || !!formData[propName]) &&
        !hideOnReview &&
        !hiddenOnSchema &&
        !collapsedOnSchema
      );
    };
    let divWrapper = false;

    const renderedProperties = this.orderAndFilterProperties(properties).map(
      (objectFields, index) => {
        const [first, ...rest] = objectFields;
        // expand under functionality is controlled in the reducer by setting ui:collapsed, so
        // we can check if its expanded by seeing if there are any visible "children"
        const visible = rest.filter(
          prop => !_.get(['properties', prop, 'ui:collapsed'], schema),
        );
        // Use div or dl to wrap content for array type schemas (e.g. bank info)
        // fixes axe issue on review-and-submit
        divWrapper = objectFields.some(name => {
          const options = uiSchema?.[name]?.['ui:options'] || {};
          return (
            options.volatileData || // ReviewCardField
            options.customTitle || // SelectArrayItemsWidget
            options.addAnotherLabel // fileUiSchema
          );
        });
        if (objectFields.length > 1 && visible.length > 0) {
          return objectFields.filter(showField).map(renderField);
        }
        // eslint-disable-next-line sonarjs/no-extra-arguments
        return showField(first) ? renderField(first, index) : null;
      },
    );

    if (isRoot) {
      let title = formContext.pageTitle;
      if (!formContext.hideTitle && typeof title === 'function') {
        title = title(formData, formContext);
      }
      const editLabel =
        _.get('ui:options.ariaLabelForEditButtonOnReview', uiSchema) ||
        `Edit ${title}`;

      const Tag = divWrapper ? 'div' : 'dl';

      return (
        <>
          {!formContext.hideHeaderRow && (
            <div className="form-review-panel-page-header-row">
              {title?.trim() &&
                !formContext.hideTitle && (
                  <h3 className="form-review-panel-page-header vads-u-font-size--h5">
                    {title}
                  </h3>
                )}
              <button
                type="button"
                className="edit-btn primary-outline"
                aria-label={editLabel}
                onClick={() => formContext.onEdit()}
              >
                Edit
              </button>
            </div>
          )}
          <Tag className="review">{renderedProperties}</Tag>
        </>
      );
    }

    return <>{renderedProperties}</>;
  }
}

ObjectField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  idSchema: PropTypes.object,
  formData: PropTypes.object,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  }),
};

export default ObjectField;
