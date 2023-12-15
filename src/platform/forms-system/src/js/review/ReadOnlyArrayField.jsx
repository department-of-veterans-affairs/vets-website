import PropTypes from 'prop-types';
import React from 'react';

import {
  toIdSchema,
  deepEquals,
} from '@department-of-veterans-affairs/react-jsonschema-form/lib/utils';

class ReadOnlyArrayField extends React.Component {
  shouldComponentUpdate = nextProps => !deepEquals(this.props, nextProps);

  getItemSchema = index => this.props.schema.items[index];

  render() {
    const {
      uiSchema,
      errorSchema,
      idSchema,
      formData,
      disabled,
      readonly,
      registry,
    } = this.props;
    const { definitions } = registry;
    const { SchemaField } = registry.fields;
    const { onReviewPage } = registry.formContext;
    const uiOptions = uiSchema['ui:options'] || {};

    const items = formData || [];
    const Wrapper = uiSchema?.['ui:options']?.useDlWrap ? 'dl' : 'div';
    const H =
      uiOptions.reviewItemHeaderLevel && onReviewPage
        ? `h${uiOptions.reviewItemHeaderLevel}`
        : 'h5';

    return (
      <div className="schemaform-field-container rjsf-array-field">
        {items.map((item, index) => {
          const itemSchema = this.getItemSchema(index);
          const itemIdPrefix = `${idSchema.$id}_${index}`;
          const itemIdSchema = toIdSchema(
            itemSchema,
            itemIdPrefix,
            definitions,
          );

          return (
            <div
              key={index}
              className="va-growable-background vads-u-margin-top--1"
            >
              <div className="row small-collapse">
                <div className="small-12 columns">
                  <H className="schemaform-array-readonly-header">
                    {uiOptions.itemName}
                  </H>
                  {/* outer wrapper needs uiOptions.customTitle = ' ' to prevent
                    * rendering of a <dl> around the schemaform-field-container
                    */}
                  <Wrapper className="review">
                    <SchemaField
                      key={index}
                      schema={itemSchema}
                      uiSchema={uiSchema.items}
                      errorSchema={errorSchema ? errorSchema[index] : undefined}
                      idSchema={itemIdSchema}
                      formData={item}
                      onChange={f => f}
                      onBlur={f => f}
                      registry={this.props.registry}
                      required={false}
                      disabled={disabled}
                      readonly={readonly}
                    />
                  </Wrapper>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ReadOnlyArrayField.propTypes = {
  schema: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  errorSchema: PropTypes.object,
  formData: PropTypes.array,
  idSchema: PropTypes.object,
  readonly: PropTypes.bool,
  registry: PropTypes.shape({
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    ).isRequired,
    fields: PropTypes.objectOf(PropTypes.func).isRequired,
    definitions: PropTypes.object.isRequired,
    formContext: PropTypes.shape({
      onReviewPage: PropTypes.bool,
    }).isRequired,
  }),
  uiSchema: PropTypes.object,
};

export default ReadOnlyArrayField;
