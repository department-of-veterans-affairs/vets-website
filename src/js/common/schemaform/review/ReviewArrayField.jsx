import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';
import { focusElement } from '../../utils/helpers';

import { FormPage } from '../FormPage';
import { setData, setValid } from '../actions';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

const scrollToFirstError = () => {
  setTimeout(() => {
    const errorEl = document.querySelector('.usa-input-error, .input-error-date');
    if (errorEl) {
      const position = errorEl.getBoundingClientRect().top + document.body.scrollTop;
      Scroll.animateScroll.scrollTo(position - 10, {
        duration: 500,
        delay: 0,
        smooth: true
      });
      focusElement(errorEl);
    }
  }, 100);
};

class ReviewArrayField extends React.Component {
  constructor(props) {
    super(props);
    const arrayData = Array.isArray(props.arrayData) ? props.arrayData : null;
    this.state = {
      items: arrayData || [],
      editing: (this.props.arrayData || []).map(() => false)
    };
    this.onItemChange = this.onItemChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.onItemBlur = this.onItemBlur.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const propsWithoutDataUnchanged = deepEquals(_.omit('formData', this.props), _.omit('formData', nextProps));
  //   const stateUnchanged = deepEquals(this.state, nextState);
  //
  //   if (propsWithoutDataUnchanged && stateUnchanged && deepEquals(nextProps.formData, nextState.items)) {
  //     return false;
  //   }
  //
  //   return true;
  // }

  onItemChange(indexToChange, value) {
    const newState = _.set('items', this.state.items.map(
      (current, index) => {
        return index === indexToChange
          ? value
          : current;
      }
    ), this.state);
    this.setState(newState, () => {
      this.props.onChange(newState.items);
    });
  }

  onItemBlur(index, path) {
    this.props.onBlur([index].concat(path));
  }

  scrollToTop() {
    setTimeout(() => {
      scroller.scrollTo(`topOfTable_${this.props.path[this.props.path.length - 1]}`, {
        duration: 500,
        delay: 0,
        smooth: true,
        offset: -60
      });
    }, 100);
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

  handleEdit(index, status = true) {
    this.setState(_.set(['editing', index], status, this.state), () => {
      this.scrollToRow(`${this.props.path[this.props.path.length - 1]}_${index}`);
    });
  }

  handleUpdate(index) {
    if (errorSchemaIsValid(this.props.errorSchema[index])) {
      this.setState(_.set(['editing', index], false, this.state), () => {
        this.scrollToTop();
      });
    } else {
      const touchedSchema = _.set(index, true, this.state.touchedSchema);
      this.setState({ touchedSchema }, () => {
        scrollToFirstError();
      });
    }
  }

  handleAdd() {
    const lastIndex = this.state.items.length - 1;
    if (errorSchemaIsValid(this.props.errorSchema[lastIndex])) {
      const newEditing = this.state.editing.map((val, index) => {
        return (index + 1) === this.state.editing.length
          ? false
          : val;
      });
      const newState = _.assign(this.state, {
        items: this.state.items.concat({}),
        editing: newEditing.concat(false)
      });
      this.setState(newState, () => {
        this.scrollToRow(`${this.props.idSchema.$id}_${lastIndex + 1}`);
        this.props.onChange(newState.items);
      });
    } else {
      const touchedSchema = _.set(lastIndex, true, this.state.touchedSchema);
      this.setState({ touchedSchema }, () => {
        scrollToFirstError();
      });
    }
  }

  handleRemove(indexToRemove) {
    const newState = _.assign(this.state, {
      items: this.state.items.filter((val, index) => index !== indexToRemove),
      editing: this.state.editing.filter((val, index) => index !== indexToRemove),
    });
    this.setState(newState, () => {
      this.props.onChange(newState.items);
      this.scrollToTop();
    });
  }

  handleSetData(index, data) {
    const { pageKey, path, formData } = this.props;
    const newArray = _.set(index, data, this.state.items);
    this.setState({ items: newArray }, () => {
      this.props.setData(pageKey, _.set(path, newArray, formData));
    });
  }

  handleSave(index) {
    const newEditingArray = _.set(index, false, this.state.editing);
    this.setState({ editing: newEditingArray }, () => {
      this.scrollToTop();
    });
  }

  render() {
    const {
      schema,
      uiSchema,
      path,
      formData
    } = this.props;
    const fieldName = path[path.length - 1];
    const title = uiSchema && uiSchema['ui:title'] ? uiSchema['ui:title'] : null;
    const hasTextDescription = typeof uiSchema['ui:description'] === 'string';
    const DescriptionField = !hasTextDescription && typeof uiSchema['ui:description'] === 'function'
      ? uiSchema['ui:description']
      : null;
    const arrayPageConfig = {
      schema: schema.items,
      uiSchema: uiSchema.items,
      pageKey: fieldName
    };

    return (
      <div>
        {title &&
          <legend
              id={`${fieldName}__title`}>
            {uiSchema['ui:title']}
          </legend>}
        <div className="va-growable">
          <Element name={`topOfTable_${fieldName}`}/>
          {this.state.items.map((item, index) => {
            const isLast = this.state.items.length === (index + 1);
            const isEditing = this.state.editing[index];
            const notLastOrMultipleRows = !isLast || this.state.items.length > 1;
            if (isEditing) {
              return (
                <div key={index} className={notLastOrMultipleRows ? 'va-growable-background' : null}>
                  <Element name={`table_${fieldName}_${index}`}/>
                  <div className="row small-collapse">
                    <div className="small-12 columns va-growable-expanded">
                      {isLast && uiSchema['ui:options'].itemName && this.state.items.length > 1
                          ? <h5>New {uiSchema['ui:options'].itemName}</h5>
                          : null}
                      <div className="input-section">
                        <FormPage
                            setData={(key, data) => this.handleSetData(index, data)}
                            setValid={f => f}
                            reviewPage
                            onEdit={() => this.handleEdit(index, !isEditing)}
                            onSubmit={() => this.handleSave(index)}
                            form={{ [fieldName]: { data: item } }}
                            route={{ pageConfig: arrayPageConfig }}/>
                      </div>
                      {notLastOrMultipleRows &&
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            {!isLast && <button className="float-left" onClick={() => this.handleUpdate(index)}>Update</button>}
                          </div>
                          <div className="small-6 right columns">
                            <button className="usa-button-outline float-right" onClick={() => this.handleRemove(index)}>Remove</button>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div key={index} className="va-growable-background">
                <div className="row small-collapse">
                  <FormPage
                      setData={(key, data) => this.handleSetData(index, data)}
                      setValid={f => f}
                      reviewPage
                      reviewMode
                      onEdit={() => this.handleEdit(index, !isEditing)}
                      onSubmit={() => this.handleSave(index)}
                      form={{ [fieldName]: { data: item } }}
                      route={{ pageConfig: arrayPageConfig }}/>
                </div>
              </div>
            );
          })}
          <button type="button" className="usa-button-outline va-growable-add-btn" onClick={this.handleAdd}>Add Another</button>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setData,
  setValid
};

export default connect(null, mapDispatchToProps)(ReviewArrayField);

// ReviewArrayField.propTypes = {
//   schema: React.PropTypes.object.isRequired,
//   uiSchema: React.PropTypes.object,
//   errorSchema: React.PropTypes.object,
//   idSchema: React.PropTypes.object,
//   onChange: React.PropTypes.func.isRequired,
//   formData: React.PropTypes.object,
//   required: React.PropTypes.bool,
//   disabled: React.PropTypes.bool,
//   readonly: React.PropTypes.bool,
//   registry: React.PropTypes.shape({
//     widgets: React.PropTypes.objectOf(React.PropTypes.oneOfType([
//       React.PropTypes.func,
//       React.PropTypes.object,
//     ])).isRequired,
//     fields: React.PropTypes.objectOf(React.PropTypes.func).isRequired,
//     definitions: React.PropTypes.object.isRequired,
//     formContext: React.PropTypes.object.isRequired,
//   })
// };

