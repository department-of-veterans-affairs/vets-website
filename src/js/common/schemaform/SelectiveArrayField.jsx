import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import Scroll from 'react-scroll';


import {
  toIdSchema,
  getDefaultFormState,
  deepEquals
} from 'react-jsonschema-form/lib/utils';

const Element = Scroll.Element;
const scroller = Scroll.scroller;


class SelectiveArrayField extends React.Component {
  // This fills in an empty item in the array if it has minItems set
  // so that schema validation runs against the fields in the first item
  // in the array. This shouldn't be necessary, but there's a fix in rjsf
  // that has not been released yet
  componentDidMount = () => {
    const { schema, formData = [], registry } = this.props;
    if (schema.minItems > 0 && formData.length === 0) {
      this.props.onChange(Array(schema.minItems).fill(
        getDefaultFormState(schema.additionalItems, undefined, registry.definitions)
      ));
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    return !deepEquals(this.props, nextProps) || nextState !== this.state;
  }

  onItemChange = (indexToChange, value) => {
    const newItems = _.set(indexToChange, value, this.props.formData || []);
    this.props.onChange(newItems);
  }

  getItemSchema = (index, selectedFields) => {
    const schema = this.props.schema;
    let properties;
    if (schema.items.length > index) {
      properties = _.pick(selectedFields, schema.items[index].properties);
    }

    properties = _.pick(selectedFields, schema.additionalItems.properties);

    return {
      type: 'object',
      properties
    };
  }

  scrollToTop = () => {
    setTimeout(() => {
      scroller.scrollTo(`topOfTable_${this.props.idSchema.$id}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: -60
      });
    }, 100);
  }

  scrollToRow = (id) => {
    setTimeout(() => {
      scroller.scrollTo(`table_${id}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: 0
      });
    }, 100);
  }

  render() {
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
      schema
    } = this.props;
    const definitions = registry.definitions;
    const { TitleField, SchemaField } = registry.fields;


    const title = uiSchema['ui:title'] || schema.title;
    const hideTitle = !!_.get(['ui:options', 'hideTitle'], uiSchema);
    const description = uiSchema['ui:description'];
    const textDescription = typeof description === 'string' ? description : null;
    const DescriptionField = typeof description === 'function'
      ? uiSchema['ui:description']
      : null;
    const hasTitleOrDescription = (!!title && !hideTitle) || !!description;
    const selectedFields = uiSchema['ui:selectedFields'] || Object.keys(schema.properties);

    // if we have form data, use that, otherwise use an array with a single default object
    const items = (formData && formData.length)
      ? formData
      : [getDefaultFormState(schema, undefined, registry.definitions)];

    // uiSchema's ui:order complains loudly if there are extraineous properties
    //  or missing properties. We take the ui:order and slap on the selectedFields
    //  to make sure we're not missing any. _.intersection() will take the
    //  unique values in the order in which they occur in ui:order.
    if (uiSchema.items && uiSchema.items['ui:order']) {
      uiSchema.items['ui:order'] = _.intersection(
        // Make sure ALL the selectedFields are in there
        _.concat(uiSchema.items['ui:order'], uiSchema['ui:selectedFields']),
        uiSchema['ui:selectedFields']
      );
    }

    let containerClassNames = classNames({
      'schemaform-field-container': true,
      'schemaform-block': hasTitleOrDescription
    });


    return (
      <div className={containerClassNames}>
        {hasTitleOrDescription && <div className="schemaform-block-header">
          {title && !hideTitle
              ? <TitleField
                  id={`${idSchema.$id}__title`}
                  title={title}
                  formContext={formContext}/> : null}
          {textDescription && <p>{textDescription}</p>}
          {DescriptionField && <DescriptionField options={uiSchema['ui:options']}/>}
          {!textDescription && !DescriptionField && description}
        </div>}
        <div>
          {items.map((item, index) => {
            const itemSchema = this.getItemSchema(index, selectedFields);
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);

            return (
              <div key={index}>
                <Element name={`table_${itemIdPrefix}`}/>
                <div className="row small-collapse">
                  <div className="small-12 columns">
                    <div className="input-section">
                      <SchemaField key={index}
                          schema={itemSchema}
                          uiSchema={uiSchema.items}
                          errorSchema={errorSchema ? errorSchema[index] : undefined}
                          idSchema={itemIdSchema}
                          formData={item}
                          onChange={(value) => this.onItemChange(index, value)}
                          onBlur={onBlur}
                          registry={this.props.registry}
                          required={false}
                          disabled={disabled}
                          readonly={readonly}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

SelectiveArrayField.propTypes = {
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
    widgets: PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ])).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.object.isRequired,
  })
};

export default SelectiveArrayField;
