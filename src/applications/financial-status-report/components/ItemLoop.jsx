import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import _ from 'lodash/fp'; // eslint-disable-line no-restricted-imports
import classNames from 'classnames';
import Scroll from 'react-scroll';

import {
  toIdSchema,
  getDefaultFormState,
  // deepEquals,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

import { scrollToFirstError } from 'platform/forms-system/src/js/utilities/ui';
import { setArrayRecordTouched } from 'platform/forms-system/src/js/helpers';
import { errorSchemaIsValid } from 'platform/forms-system/src/js/validation';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

// export default class ItemLoop extends React.Component {
const ItemLoop = props => {
  // constructor(props) {
  //   super(props);

  // Throw an error if there’s no viewField (should be React component)
  // if (typeof this.props.uiSchema['ui:options'].viewField !== 'function') {
  //   throw new Error(
  //     `No viewField found in uiSchema for ArrayField ${
  //       this.props.idSchema.$id
  //     }.`,
  //   );
  // }

  // this.state = {
  //   editing: props.formData ? props.formData.map((item, index) => !errorSchemaIsValid(props.errorSchema[index]),) : [true],
  // };
  // }

  const [editing, setEditing] = useState([]);

  useEffect(
    () => {
      const isEditing = props.formData
        ? props.formData.map(
            (item, index) => !errorSchemaIsValid(props.errorSchema[index]),
          )
        : [true];
      setEditing(isEditing);
    },
    [props.errorSchema, props.formData],
  );

  // useEffect(
  //   () => {
  //     // Throw an error if there’s no viewField (should be React component)
  //     if (typeof props.uiSchema['ui:options'].viewField !== 'function') {
  //       throw new Error(
  //         `No viewField found in uiSchema for ArrayField ${
  //           props.idSchema.$id
  //         }.`,
  //       );
  //     }
  //   },
  //   [props.idSchema.$id, props.uiSchema],
  // );

  // useEffect(
  //   () => {
  //     const { schema, formData = [], registry } = props;
  //     if (schema.minItems > 0 && formData.length === 0) {
  //       props.onChange(
  //         Array(schema.minItems).fill(
  //           getDefaultFormState(
  //             schema.additionalItems,
  //             undefined,
  //             registry.definitions,
  //           ),
  //         ),
  //       );
  //     }
  //   },
  //   [props],
  // );

  // componentDidMount() {
  //   const { schema, formData = [], registry } = this.props;
  //   if (schema.minItems > 0 && formData.length === 0) {
  //     this.props.onChange(
  //       Array(schema.minItems).fill(
  //         getDefaultFormState(
  //           schema.additionalItems,
  //           undefined,
  //           registry.definitions,
  //         ),
  //       ),
  //     );
  //   }
  // }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   return !deepEquals(props, nextProps) || nextState !== this.state;
  // };

  const onItemChange = (indexToChange, value) => {
    const newItems = _.set(indexToChange, value, props.formData || []);
    props.onChange(newItems);
  };

  const getItemSchema = index => {
    const schema = props.schema;
    if (schema.items.length > index) {
      return schema.items[index];
    }
    return schema.additionalItems;
  };

  // const scrollToTop = () => {
  //   setTimeout(() => {
  //     scroller.scrollTo(// TODO: sets new item to empty object should be integer for type number
  //       `topOfTable_${props.idSchema.$id}`,
  //       window.Forms?.scroll || {
  //         duration: 500,
  //         delay: 0,
  //         smooth: true,
  //         offset: -60,
  //       },
  //     );
  //   }, 100);
  // };

  const scrollToRow = id => {
    if (!props.uiSchema['ui:options'].doNotScroll) {
      setTimeout(() => {
        scroller.scrollTo(
          `table_${id}`,
          window.Forms?.scroll || {
            duration: 500,
            delay: 0,
            smooth: true,
            offset: 0,
          },
        );
      }, 100);
    }
  };

  const handleEdit = (index, status = true) => {
    // this.setState(_.set(['editing', index], status, this.state), () => {
    //   scrollToRow(`${props.idSchema.$id}_${index}`);
    // });

    setEditing(_.set(['editing', index], status), () => {
      scrollToRow(`${props.idSchema.$id}_${index}`);
    });
  };

  const handleUpdate = index => {
    if (errorSchemaIsValid(props.errorSchema[index])) {
      // this.setState(_.set(['editing', index], false, this.state), () => {
      //   scrollToTop();
      // });

      setEditing(_.set(['editing', index], status), () => {
        scrollToRow(`${props.idSchema.$id}_${index}`);
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setArrayRecordTouched(props.idSchema.$id, index);
      props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleAdd = () => {
    const lastIndex = props.formData.length - 1;
    if (errorSchemaIsValid(props.errorSchema[lastIndex])) {
      // When we add another, we want to change the editing
      // state of the last item, but not ones above it

      const newEditing = editing?.map(
        (val, index) => (index + 1 === editing.length ? false : val),
      );
      const editingState = props.uiSchema['ui:options'].reviewMode;
      const newState = _.assign(editing, {
        editing: newEditing.concat(!!editingState),
      });
      setEditing(
        (newState,
        () => {
          const newFormData = props.formData.concat(
            getDefaultFormState(
              props.schema.additionalItems,
              undefined,
              props.registry.definitions,
              // ) || {}, // TODO: sets new item to empty object should be integer for type number
            ) || undefined,
          );
          props.onChange(newFormData);
          scrollToRow(`${props.idSchema.$id}_${lastIndex + 1}`);
        }),
      );
    } else {
      const touched = setArrayRecordTouched(props.idSchema.$id, lastIndex);
      props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  };

  const handleRemove = indexToRemove => {
    const newItems = props.formData.filter(
      (val, index) => index !== indexToRemove,
    );
    const filtered = editing.filter((val, index) => index !== indexToRemove);
    setEditing(filtered);
    props.onChange(newItems);
    // this.setState(newState, () => {
    //   scrollToTop();
    // });
  };

  const {
    uiSchema,
    errorSchema,
    idSchema,
    formData,
    disabled,
    readonly,
    registry,
    formContext,
    onBlur,
    schema,
  } = props;
  const definitions = registry.definitions;
  const { TitleField, SchemaField } = registry.fields;

  const uiOptions = uiSchema['ui:options'] || {};
  const ViewField = uiOptions.viewField;
  const title = uiSchema['ui:title'] || schema.title;
  const hideTitle = !!uiOptions.title;
  const description = uiSchema['ui:description'];
  const textDescription = typeof description === 'string' ? description : null;
  const DescriptionField =
    typeof description === 'function' ? uiSchema['ui:description'] : null;
  const isReviewMode = uiSchema['ui:options'].reviewMode;
  const hasTitleOrDescription = (!!title && !hideTitle) || !!description;

  // if we have form data, use that, otherwise use an array with a single default object
  const items =
    formData && formData.length
      ? formData
      : [getDefaultFormState(schema, undefined, registry.definitions)];
  const addAnotherDisabled = items.length >= (schema.maxItems || Infinity);

  const containerClassNames = classNames({
    'schemaform-field-container': true,
    'schemaform-block': hasTitleOrDescription,
  });

  return (
    <div className={containerClassNames}>
      {hasTitleOrDescription && (
        <div className="schemaform-block-header">
          {title && !hideTitle ? (
            <TitleField
              id={`${idSchema.$id}__title`}
              title={title}
              formContext={formContext}
            />
          ) : null}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && (
            <DescriptionField options={uiSchema['ui:options']} />
          )}
          {!textDescription && !DescriptionField && description}
        </div>
      )}
      <div className="va-growable">
        <Element name={`topOfTable_${idSchema.$id}`} />
        {items.map((item, index) => {
          const itemSchema = getItemSchema(index);
          const itemIdPrefix = `${idSchema.$id}_${index}`;
          const itemIdSchema = toIdSchema(
            itemSchema,
            itemIdPrefix,
            definitions,
          );
          const showSave = uiSchema['ui:options'].showSave;
          const updateText = showSave && index === 0 ? 'Save' : 'Update';
          const isLast = items.length === index + 1;
          const notLastOrMultipleRows = showSave || !isLast || items.length > 1;
          let isEditing = false;

          if (editing) {
            isEditing = editing[index];
          }

          return (isReviewMode ? (
            isEditing
          ) : (
            isLast || isEditing
          )) ? (
            <div
              key={index}
              className={
                notLastOrMultipleRows ? 'va-growable-background' : null
              }
            >
              <Element name={`table_${itemIdPrefix}`} />
              <div className="row small-collapse">
                <div className="small-12 columns va-growable-expanded">
                  {isLast &&
                  items.length > 1 &&
                  uiSchema['ui:options'].itemName ? (
                    <h3 className="vads-u-font-size--h5">
                      New {uiSchema['ui:options'].itemName}
                    </h3>
                  ) : null}
                  <div className="input-section">
                    <SchemaField
                      key={index}
                      schema={itemSchema}
                      uiSchema={uiSchema.items}
                      errorSchema={errorSchema ? errorSchema[index] : undefined}
                      idSchema={itemIdSchema}
                      formData={item}
                      onChange={value => onItemChange(index, value)}
                      onBlur={onBlur}
                      registry={props.registry}
                      required={false}
                      disabled={disabled}
                      readonly={readonly}
                    />
                  </div>
                  {notLastOrMultipleRows && (
                    <div className="row small-collapse">
                      <div className="small-6 left columns">
                        {(!isLast || showSave) && (
                          <button
                            className="float-left"
                            onClick={() => handleUpdate(index)}
                            aria-label={`${updateText} ${title}`}
                          >
                            {updateText}
                          </button>
                        )}
                      </div>
                      <div className="small-6 right columns">
                        {index !== 0 && (
                          <button
                            className="usa-button-secondary float-right"
                            type="button"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="va-growable-background editable-row">
              <div className="row small-collapse vads-u-display--flex vads-u-align-items--center">
                <div className="vads-u-flex--fill">
                  <ViewField formData={item} onEdit={() => handleEdit(index)} />
                </div>
                <button
                  className="usa-button-secondary edit vads-u-flex--auto"
                  onClick={() => handleEdit(index)}
                  aria-label={`Edit ${title}`}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className={classNames('usa-button-secondary', 'va-growable-add-btn', {
            'usa-button-disabled': !props.formData || addAnotherDisabled,
          })}
          disabled={!props.formData || addAnotherDisabled}
          onClick={() => handleAdd()}
        >
          Add another {uiOptions.itemName}
        </button>
        <p>
          {addAnotherDisabled &&
            `You’ve entered the maximum number of items allowed.`}
        </p>
      </div>
    </div>
  );
};

export default ItemLoop;

ItemLoop.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.array,
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
