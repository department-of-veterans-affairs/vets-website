import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports

import {
  getDefaultFormState,
  orderProperties,
  shouldRender,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { showReviewField } from '../helpers';

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
            (options.volatileData && !formContext.reviewMode) || // ReviewCardField
            options.customTitle || // SelectArrayItemsWidget
            (options.addAnotherLabel && formContext.reviewMode) // fileUiSchema
          );
        });
        if (objectFields.length > 1 && visible.length > 0) {
          return objectFields
            .filter(propName =>
              showReviewField(
                propName,
                schema,
                uiSchema,
                formData,
                formContext,
              ),
            )
            .map(renderField);
        }
        return showReviewField(first, schema, uiSchema, formData, formContext)
          ? // eslint-disable-next-line sonarjs/no-extra-arguments
            renderField(first, index)
          : null;
      },
    );

    if (isRoot) {
      let title = formContext.pageTitle;
      if (!formContext.hideTitle && typeof title === 'function') {
        title = title(formData, formContext);
      }
      const uiOptions = uiSchema['ui:options'] || {};
      const ariaLabel = uiOptions.itemAriaLabel;
      const itemName =
        (typeof ariaLabel === 'function' && ariaLabel(formData || {})) ||
        formData[uiOptions.itemName] ||
        uiOptions.itemName;
      const editLabel = (itemName && `Edit ${itemName}`) || `Edit ${title}`;

      const Tag = divWrapper ? 'div' : 'dl';
      const objectViewField = uiSchema?.['ui:objectViewField'];

      const defaultEditButton = ({
        label = editLabel,
        onEdit = formContext.onEdit,
        text = 'Edit',
      } = {}) => (
        <button
          type="button"
          className="edit-btn primary-outline"
          aria-label={label}
          onClick={onEdit}
        >
          {text}
        </button>
      );

      return typeof objectViewField === 'function' ? (
        objectViewField({
          ...this.props,
          renderedProperties,
          title,
          defaultEditButton,
        })
      ) : (
        <>
          {!formContext.hideHeaderRow && (
            <div className="form-review-panel-page-header-row">
              {title?.trim() &&
                !formContext.hideTitle && (
                  <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                    {title}
                  </h4>
                )}
              {defaultEditButton()}
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
