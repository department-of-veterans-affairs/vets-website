import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import groupBy from 'lodash/groupBy';
import {
  deepEquals,
  getDefaultFormState,
  orderProperties,
  getDefaultRegistry,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';
import get from 'platform/forms-system/src/js/utilities/data/get';
import set from 'platform/forms-system/src/js/utilities/data/set';

import ExpandingGroup from 'platform/forms-system/src/js/components/ExpandingGroup';
import { pureWithDeepEquals } from 'platform/forms-system/src/js/helpers';
import { isReactComponent } from 'platform/utilities/ui';

/*
 * This is largely copied platform/forms-system/src/js/fields/ObjectField.jsx
 * the customization is in an 'auto-deselect' functionality
 * which lives in the static method deselectBasedOnValue and onPropertyChange
 * This is required for the behavior of some checkbox fields that include
 * a 'prefer not to answer' option
 */

/*
 * Add a first field class to the first actual field on the page
 * and on any "blocks", which are titled sections of the page
 */
function setFirstFields(id) {
  if (id === 'root') {
    const containers = [document].concat(
      Array.from(document.querySelectorAll('.schemaform-block')),
    );
    containers.forEach(block => {
      const fields = Array.from(
        block.querySelectorAll('.form-checkbox,.schemaform-field-template'),
      );
      if (fields.length) {
        fields[0].classList.add('schemaform-first-field');
      }
    });
  }
}

class DeselectableObjectField extends React.Component {
  static deselectBasedOnValue(name, value, formData, properties) {
    // derive the notListedTextKey by looking at the form schema properties for a 'string' field type
    // be aware this logic limits the usage to a single text field for a 'write in' style field
    const notListedTextKey = Object.entries(properties).reduce(
      (previous, [propertyKey, { type }]) => {
        if (type === 'string') {
          return propertyKey;
        }
        return previous;
      },
      '',
    );

    const formDataKeys = Object.keys(formData);

    // handle the preferNotToAnswer option selected so that
    // all other options are set to false and deselected
    if (name === 'preferNotToAnswer' && value === true) {
      let formDataDeselected = { ...formData };

      formDataKeys.forEach(key => {
        if (key !== 'preferNotToAnswer') {
          // for not listed text field, need to set to empty string instead of false
          if (notListedTextKey && key === notListedTextKey) {
            formDataDeselected = set(notListedTextKey, '', formDataDeselected);
            return;
          }
          formDataDeselected = set(key, false, formDataDeselected);
        }
      });

      return set(name, value, formDataDeselected);
    }

    // uncheck preferNotToAnswer if any other option is selected after the fact
    if (name !== 'preferNotToAnswer' && value === true) {
      const formDataPreferDeselected = set(
        'preferNotToAnswer',
        false,
        formData,
      );

      return set(name, value, formDataPreferDeselected);
    }

    // return a default object with changed value when
    // the above conditions are not met
    return set(name, value, formData);
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
    this.onPropertyChange = this.onPropertyChange.bind(this);
    this.onPropertyBlur = this.onPropertyBlur.bind(this);
    this.isRequired = this.isRequired.bind(this);
    this.SchemaField = pureWithDeepEquals(
      this.props.registry.fields.SchemaField,
    );
    this.orderedProperties = this.orderAndFilterProperties(
      props.schema,
      props.uiSchema,
    );
  }

  componentDidMount() {
    setFirstFields(this.props.idSchema.$id);
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.schema !== nextProps.schema ||
      this.props.uiSchema !== nextProps.uiSchema
    ) {
      this.orderedProperties = this.orderAndFilterProperties(
        nextProps.schema,
        nextProps.uiSchema,
      );
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

  componentDidUpdate() {
    setFirstFields(this.props.idSchema.$id);
  }

  onPropertyChange(name) {
    const {
      schema: { properties },
    } = this.props;

    return value => {
      const formData = Object.keys(this.props.formData || {}).length
        ? this.props.formData
        : getDefaultFormState(
            this.props.schema,
            undefined,
            this.props.registry.definitions,
          );

      this.props.onChange(
        DeselectableObjectField.deselectBasedOnValue(
          name,
          value,
          formData,
          properties,
        ),
      );
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
    const orderedProperties = orderProperties(
      properties,
      get('ui:order', uiSchema),
    );
    const filteredProperties = orderedProperties.filter(
      prop => !schema.properties[prop]['ui:hidden'],
    );
    const groupedProperties = groupBy(filteredProperties, item => {
      const expandUnderField = get(
        [item, 'ui:options', 'expandUnder'],
        uiSchema,
      );
      return expandUnderField || item;
    });

    return Object.values(groupedProperties);
  }

  isRequired(name) {
    const { schema } = this.props;
    const schemaRequired =
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;

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
      schema,
      required,
      disabled,
      readonly,
      onBlur,
      formContext,
    } = this.props;
    const { definitions, fields } = this.props.registry;
    const { TitleField } = fields;
    const { SchemaField } = this;
    const formData = Object.keys(this.props.formData || {}).length
      ? this.props.formData
      : getDefaultFormState(schema, {}, definitions);
    const uiOptions = uiSchema['ui:options'] || {};

    // description and title setup
    const { showFieldLabel } = uiOptions;
    const fieldsetClassNames = classNames(
      uiOptions.classNames,
      'vads-u-margin-y--2',
    );

    const forceDivWrapper = !!uiOptions.forceDivWrapper;
    const title = uiSchema['ui:title'] || schema.title;
    const CustomTitleField = isReactComponent(title) ? title : null;

    const description = uiSchema['ui:description'];
    const textDescription =
      typeof description === 'string' ? description : null;
    const DescriptionField = isReactComponent(description)
      ? uiSchema['ui:description']
      : null;

    const hasTitleOrDescription = !!title || !!description;
    const isRoot = idSchema.$id === 'root';

    const pageIndex = formContext?.pagePerItemIndex;
    // Fix array nested ids (one-level deep)
    const processIds = (originalIds = {}) =>
      // pagePerItemIndex is zero-based
      typeof pageIndex !== 'undefined' && formContext.onReviewPage
        ? Object.keys(originalIds).reduce(
            (ids, key) => ({
              ...ids,
              [key]: originalIds[key].$id
                ? {
                    ...originalIds[key],
                    $id: `${originalIds[key].$id}_${pageIndex}`,
                  }
                : `${originalIds[key]}_${pageIndex}`,
            }),
            {},
          )
        : originalIds;

    const renderProp = propName => (
      <div key={propName}>
        <SchemaField
          name={propName}
          required={this.isRequired(propName)}
          schema={schema.properties[propName]}
          uiSchema={uiSchema[propName]}
          errorSchema={errorSchema[propName]}
          idSchema={processIds(idSchema[propName])}
          formData={formData[propName]}
          onChange={this.onPropertyChange(propName)}
          onBlur={onBlur}
          registry={this.props.registry}
          disabled={disabled}
          readonly={readonly}
        />
      </div>
    );

    // Id's are not always unique on the review and submit page
    const id = `${
      isRoot && formContext.onReviewPage
        ? Object.keys(idSchema)
            .reduce((ids, key) => {
              ids.push(idSchema[key].$id || '');
              return ids;
            }, [])
            .filter(k => k)
            .join('_')
        : idSchema.$id
    }${typeof pageIndex === 'undefined' ? '' : `_${pageIndex}`}`;

    const accessibleFieldContent = (
      <>
        {hasTitleOrDescription && (
          <>
            {CustomTitleField && !showFieldLabel ? (
              <CustomTitleField
                id={`${id}__title`}
                formData={formData}
                formContext={formContext}
                required={required}
              />
            ) : null}
            {!CustomTitleField && title && !showFieldLabel ? (
              <TitleField
                id={`${id}__title`}
                title={title}
                required={required}
                formContext={formContext}
              />
            ) : null}
            {textDescription && <p>{textDescription}</p>}
            {DescriptionField && (
              <DescriptionField
                formData={formData}
                formContext={formContext}
                options={uiSchema['ui:options']}
              />
            )}
            {!textDescription && !DescriptionField && description}
          </>
        )}
        {this.orderedProperties.map((objectFields, index) => {
          if (objectFields.length > 1) {
            const [first, ...rest] = objectFields;
            const visible = rest.filter(
              prop => !schema.properties[prop]['ui:collapsed'],
            );
            return (
              <ExpandingGroup open={visible.length > 0} key={index}>
                {renderProp(first)}
                <div
                  className={get(
                    [first, 'ui:options', 'expandUnderClassNames'],
                    uiSchema,
                  )}
                >
                  {visible.map(renderProp)}
                </div>
              </ExpandingGroup>
            );
          }

          // if fields have expandUnder, but are the only item, that means the
          // field they’re expanding under is hidden, and they should be hidden, too
          return !get([objectFields[0], 'ui:options', 'expandUnder'], uiSchema)
            ? // eslint-disable-next-line sonarjs/no-extra-arguments
              renderProp(objectFields[0], index)
            : undefined;
        })}
      </>
    );

    if (title && !forceDivWrapper) {
      return (
        <fieldset className={fieldsetClassNames}>
          {accessibleFieldContent}
        </fieldset>
      );
    }

    return <div className={fieldsetClassNames}>{accessibleFieldContent}</div>;
  }
}

DeselectableObjectField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  registry: getDefaultRegistry(),
  required: false,
  disabled: false,
  readonly: false,
};

DeselectableObjectField.propTypes = {
  schema: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    definitions: PropTypes.object.isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    formContext: PropTypes.object.isRequired,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
  }),
  required: PropTypes.bool,
  uiSchema: PropTypes.object,
};

export default DeselectableObjectField;
