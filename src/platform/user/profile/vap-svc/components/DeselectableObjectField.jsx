import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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

function deselectBasedOnValue(name, value, formData, properties) {
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
    const formDataPreferDeselected = set('preferNotToAnswer', false, formData);

    return set(name, value, formDataPreferDeselected);
  }

  // return a default object with changed value when
  // the above conditions are not met
  return set(name, value, formData);
}

const DeselectableObjectField = React.memo(
  ({
    disabled = false,
    errorSchema = {},
    formData: formDataProp,
    idSchema = {},
    onChange,
    onBlur,
    readonly = false,
    registry = getDefaultRegistry(),
    required = false,
    schema,
    uiSchema = {},
  }) => {
    const { definitions, fields } = registry;
    const { formContext } = registry;

    const SchemaField = useMemo(() => pureWithDeepEquals(fields.SchemaField), [
      fields.SchemaField,
    ]);

    const orderedProperties = useMemo(
      () => {
        const properties = Object.keys(schema.properties);
        const ordered = orderProperties(properties, get('ui:order', uiSchema));
        const filtered = ordered.filter(
          prop => !schema.properties[prop]['ui:hidden'],
        );
        const grouped = groupBy(filtered, item => {
          const expandUnderField = get(
            [item, 'ui:options', 'expandUnder'],
            uiSchema,
          );
          return expandUnderField || item;
        });

        return Object.values(grouped);
      },
      [schema, uiSchema],
    );

    const isFirstRender = useRef(true);

    useEffect(() => {
      setFirstFields(idSchema.$id);
    });

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      }
    }, []);

    const isRequired = useCallback(
      name => {
        const schemaRequired =
          Array.isArray(schema.required) &&
          schema.required.indexOf(name) !== -1;

        if (schemaRequired) {
          return schemaRequired;
        }

        return false;
      },
      [schema.required],
    );

    const onPropertyChange = useCallback(
      name => {
        return value => {
          const currentFormData = Object.keys(formDataProp || {}).length
            ? formDataProp
            : getDefaultFormState(schema, undefined, definitions);

          onChange(
            deselectBasedOnValue(
              name,
              value,
              currentFormData,
              schema.properties,
            ),
          );
        };
      },
      [formDataProp, schema, definitions, onChange],
    );

    const onPropertyBlur = useCallback(
      name => {
        return (path = []) => {
          onBlur([name].concat(path));
        };
      },
      [onBlur],
    );

    const formData = Object.keys(formDataProp || {}).length
      ? formDataProp
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

    const { TitleField } = fields;

    const renderProp = propName => (
      <div key={propName}>
        <SchemaField
          name={propName}
          required={isRequired(propName)}
          schema={schema.properties[propName]}
          uiSchema={uiSchema[propName]}
          errorSchema={errorSchema[propName]}
          idSchema={processIds(idSchema[propName])}
          formData={formData[propName]}
          onChange={onPropertyChange(propName)}
          onBlur={onPropertyBlur(propName)}
          registry={registry}
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
        {orderedProperties.map((objectFields, index) => {
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
          // field they're expanding under is hidden, and they should be hidden, too
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
  },
  (prevProps, nextProps) => deepEquals(prevProps, nextProps),
);

// Preserve the static method as a named export for external usage
DeselectableObjectField.deselectBasedOnValue = deselectBasedOnValue;

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
