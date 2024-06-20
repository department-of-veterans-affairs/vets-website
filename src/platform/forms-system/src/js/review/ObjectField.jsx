import PropTypes from 'prop-types';
import React from 'react';
import { flow, groupBy } from 'lodash';

import {
  getDefaultFormState,
  orderProperties,
  shouldRender,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { showReviewField } from '../helpers';
import { isReactComponent } from '../../../../utilities/ui';
import get from '../../../../utilities/data/get';
import set from '../../../../utilities/data/set';

/*
 * This is largely copied from the react-jsonschema-form library,
 * but with the way descriptions are used changed
 */

class ObjectField extends React.Component {
  constructor() {
    super();
    this.isRequired = this.isRequired.bind(this);
    this.orderAndFilterProperties = flow(
      properties =>
        orderProperties(
          properties,
          this.props.uiSchema['ui:order']?.filter(
            prop =>
              // `view:*` properties will have been removed from the schema and
              // values by the time they reach this component. This removes them
              // from the ui:order so we don't trigger an error in the
              // react-json-schema library for having "extraneous properties."
              prop === '*' ||
              Object.keys(this.props.schema.properties).includes(prop),
          ),
        ),
      properties =>
        groupBy(properties, item => {
          const expandUnderField = get(
            [item, 'ui:options', 'expandUnder'],
            this.props.uiSchema,
          );
          return expandUnderField || item;
        }),
      properties => Object.values(properties),
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
      this.props.onChange(set(name, value, formData));
    };
  }

  getStateFromProps() {
    const { schema, formData, registry } = this.props;
    return getDefaultFormState(schema, formData, registry.definitions) || {};
  }

  isRequired(name) {
    const { schema } = this.props;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  render() {
    const { uiSchema, errorSchema, idSchema, schema, formContext } = this.props;
    const { SchemaField } = this.props.registry.fields || {};

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
      objectFields => {
        const [first, ...rest] = objectFields;
        // expand under functionality is controlled in the reducer by setting ui:collapsed, so
        // we can check if its expanded by seeing if there are any visible "children"
        const visible = rest.filter(
          prop => !get(['properties', prop, 'ui:collapsed'], schema),
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
          ? renderField(first)
          : null;
      },
    );

    let title;
    if (typeof formContext?.pageTitle === 'function') {
      // the `formData` is local to the object, not the page.
      // A page would have access to properties that a child object wouldn't
      title = isRoot && formContext?.pageTitle(formData, formContext);
    } else {
      title = formContext?.pageTitle;
    }
    const uiOptions = uiSchema['ui:options'] || {};
    const ariaLabel = uiOptions.itemAriaLabel;
    const itemName =
      (typeof ariaLabel === 'function' && ariaLabel(formData || {})) ||
      formData[uiOptions.itemName] ||
      uiOptions.itemName;
    const editLabel = (itemName && `Edit ${itemName}`) || `Edit ${title}`;

    const Tag = divWrapper ? 'div' : 'dl';
    const ObjectViewField = uiSchema?.['ui:objectViewField'];

    const defaultEditButton = ({
      label = editLabel,
      onEdit = formContext?.onEdit,
      text = 'Edit',
    } = {}) => (
      <va-button secondary label={label} onClick={onEdit} text={text} uswds />
    );

    if (isReactComponent(ObjectViewField)) {
      return (
        <ObjectViewField
          {...this.props}
          renderedProperties={renderedProperties}
          title={!formContext?.hideTitle ? title : ''}
          defaultEditButton={defaultEditButton}
        />
      );
    }

    const titleString = typeof title === 'string';
    return isRoot ? (
      <>
        {!formContext?.hideHeaderRow && (
          <div className="form-review-panel-page-header-row">
            {((titleString && title.trim()) || !titleString) &&
            !formContext?.hideTitle ? (
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                {title}
              </h4>
            ) : (
              <div className="form-review-panel-page-header" />
            )}
            <div className="vads-u-justify-content--flex-end">
              {defaultEditButton()}
            </div>
          </div>
        )}
        <Tag className="review" style={{ margin: '16px auto' }}>
          {renderedProperties}
        </Tag>
      </>
    ) : (
      <>{renderedProperties}</>
    );
  }
}

ObjectField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  registry: getDefaultRegistry(),
  required: false,
  disabled: false,
  readonly: false,
};

ObjectField.propTypes = {
  schema: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formContext: PropTypes.shape({
    hideHeaderRow: PropTypes.bool,
    hideTitle: PropTypes.bool,
    onEdit: PropTypes.func,
    pageTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    reviewMode: PropTypes.bool,
  }),
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    definitions: PropTypes.object.isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    formContext: PropTypes.shape({}).isRequired,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
  }),
  required: PropTypes.bool,
  uiSchema: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default ObjectField;
