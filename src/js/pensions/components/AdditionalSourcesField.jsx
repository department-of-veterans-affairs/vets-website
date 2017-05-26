import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import classNames from 'classnames';
import Scroll from 'react-scroll';
import { scrollToFirstError } from '../../common/utils/helpers';
import { setItemTouched } from '../../common/schemaform/helpers';

import {
  toIdSchema,
  getDefaultFormState,
  deepEquals
} from 'react-jsonschema-form/lib/utils';

import { errorSchemaIsValid } from '../../common/schemaform/validation';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

export default class AdditionalSourcesField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false
    };

    this.onItemChange = this.onItemChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEquals(this.props, nextProps) || nextState !== this.state;
  }

  onItemChange(indexToChange, value, fullItem = false) {
    let newItems;
    if (fullItem) {
      newItems = _.set([indexToChange], value, this.props.formData || []);
    } else {
      newItems = _.set([indexToChange, 'amount'], value, this.props.formData || []);
    }
    this.props.onChange(newItems);
  }

  getItemSchema(index) {
    const schema = this.props.schema;
    if (schema.items.length > index) {
      return schema.items[index];
    }

    return schema.additionalItems;
  }

  scrollToRow(id) {
    setTimeout(() => {
      scroller.scrollTo(`table_${id}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: 0
      });
    }, 100);
  }

  /*
   * Clicking Update on an item that's not last and is in edit mode
   */
  handleUpdate(index) {
    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(_.set(['editing', index], false, this.state), () => {
        this.scrollToTop();
      });
    } else {
      // Set all the fields for this item as touched, so we show errors
      const touched = setItemTouched(this.props.idSchema.$id, index, this.props.idSchema);
      this.props.formContext.setTouched(touched, () => {
        scrollToFirstError();
      });
    }
  }

  /*
   * Clicking Add Another
   */
  handleAdd() {
    this.setState({ adding: true }, () => {
      const data = this.props.formData || [];
      this.props.onChange(data.concat({}));
    });
  }
  //   const lastIndex = this.props.formData.length - 1;
  //   if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
  //     // When we add another, we want to change the editing state of the currently
  //     // last item, but not ones above it
  //     const newEditing = this.state.editing.map((val, index) => {
  //       return (index + 1) === this.state.editing.length
  //         ? false
  //         : val;
  //     });
  //     const newState = _.assign(this.state, {
  //       editing: newEditing.concat(false)
  //     });
  //     this.setState(newState, () => {
  //       const newFormData = this.props.formData.concat(getDefaultFormState(this.props.schema.additionalItems, undefined, this.props.registry.definitions) || {});
  //       this.props.onChange(newFormData);
  //       this.scrollToRow(`${this.props.idSchema.$id}_${lastIndex + 1}`);
  //     });
  //   } else {
  //     const touched = setItemTouched(this.props.idSchema.$id, lastIndex, this.props.idSchema);
  //     this.props.formContext.setTouched(touched, () => {
  //       scrollToFirstError();
  //     });
  //   }
  // }

  /*
   * Clicking Remove on an item in edit mode
   */
  handleRemove(indexToRemove) {
    const newItems = this.props.formData.filter((val, index) => index !== indexToRemove);
    const newState = _.assign(this.state, {
      editing: this.state.editing.filter((val, index) => index !== indexToRemove),
    });
    this.props.onChange(newItems);
    this.setState(newState, () => {
      this.scrollToTop();
    });
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
      onBlur
    } = this.props;
    const definitions = registry.definitions;
    const { SchemaField } = registry.fields;

    // if we have form data, use that, otherwise use an array with a single default object
    const items = formData || [];

    let containerClassNames = classNames({
      'schemaform-field-container': true
    });

    const hasEditableItems = items.some(item => !item.name);

    return (
      <div className={containerClassNames}>
        <div className="va-growable">
          <Element name={`topOfTable_${idSchema.$id}`}/>
          {items.map((item, index) => {
            const itemSchema = this.getItemSchema(index);
            const itemIdPrefix = `${idSchema.$id}_${index}`;
            const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);
            const itemData = items[index];

            if (!itemData.name) {
              debugger;
              return (
                <div key={index} className="va-growable-background">
                  <SchemaField
                      name="additionalSources"
                      required
                      schema={itemSchema}
                      uiSchema={uiSchema.items}
                      errorSchema={_.get([index], errorSchema) || {}}
                      idSchema={itemIdSchema}
                      formData={formData[index]}
                      onChange={(value) => this.onItemChange(index, value, true)}
                      onBlur={onBlur}
                      registry={this.props.registry}
                      disabled={disabled}
                      readonly={readonly}/>
                </div>
              );
            }
            return (
              <div key={index}>
                <SchemaField
                    name="amount"
                    required
                    schema={itemSchema.properties.amount}
                    uiSchema={{ 'ui:title': formData[index].name }}
                    errorSchema={_.get([index, 'amount'], errorSchema) || {}}
                    idSchema={itemIdSchema.amount}
                    formData={formData[index].amount}
                    onChange={(value) => this.onItemChange(index, value)}
                    onBlur={onBlur}
                    registry={this.props.registry}
                    disabled={disabled}
                    readonly={readonly}/>
              </div>
            );
          })}
          {!hasEditableItems && <button
              type="button"
              className={classNames(
                'usa-button-outline',
                'va-growable-add-btn'
              )}
              onClick={this.handleAdd}>
            Add Another Source
          </button>}
        </div>
      </div>
    );
  }
}

AdditionalSourcesField.propTypes = {
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
