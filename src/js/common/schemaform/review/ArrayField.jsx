import React from 'react';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';

import { FormPage } from '../FormPage';

import {
  getDefaultFormState
} from 'react-jsonschema-form/lib/utils';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

/* Growable table (Array) field on the Review page
 *
 * The idea here is that, because our pattern for growable tables on the review
 * page is that each item can be in review or edit mode, we will treat each item
 * as its own form page and this component will handle the edit/review states and
 * make sure data is properly updated in the Redux store
 */
class ArrayField extends React.Component {
  constructor(props) {
    super(props);
    // In contrast to the normal array field, we don't want to add an empty item
    // and always show at least one item on the review page
    const arrayData = Array.isArray(props.arrayData) ? props.arrayData : null;
    this.state = {
      items: arrayData || [],
      editing: (this.props.arrayData || []).map(() => false)
    };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSetData = this.handleSetData.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.scrollToRow = this.scrollToRow.bind(this);
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

  /*
   * Clicking edit on the item in review mode
   */
  handleEdit(index, status = true) {
    this.setState(_.set(['editing', index], status, this.state), () => {
      this.scrollToRow(`${this.props.path[this.props.path.length - 1]}_${index}`);
    });
  }

  /*
   * Clicking Add Another in the header of the array field section
   */
  handleAdd() {
    const newState = {
      items: this.state.items.concat(getDefaultFormState(this.props.schema.items, undefined, this.props.schema.definitions) || {}),
      editing: this.state.editing.concat(true)
    };
    this.setState(newState, () => {
      this.scrollToRow(`${this.props.path[this.props.path.length - 1]}_${this.state.items.length - 1}`);
    });
  }

  /*
   * Clicking Remove when editing an item
   */
  handleRemove(indexToRemove) {
    const { pageKey, path, formData } = this.props;
    const newState = _.assign(this.state, {
      items: this.state.items.filter((val, index) => index !== indexToRemove),
      editing: this.state.editing.filter((val, index) => index !== indexToRemove),
    });
    this.setState(newState, () => {
      this.props.setData(pageKey, _.set(path, this.state.items, formData));
      this.scrollToTop();
    });
  }

  /*
   * Called on any form data change.
   *
   * When data is changed, since we're only editing one array item at a time,
   * we need to update the full page's form data and call the Redux setData action
   */
  handleSetData(index, data) {
    const { pageKey, path, formData } = this.props;
    const newArray = _.set(index, data, this.state.items);
    this.setState({ items: newArray }, () => {
      this.props.setData(pageKey, _.set(path, newArray, formData));
    });
  }

  /*
   * Clicking Update in edit mode.
   *
   * This is only called if the form is valid
   * and data is already saved through handleSetData, so we just need to change
   * the edting state
   */
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
      pageTitle
    } = this.props;
    const fieldName = path[path.length - 1];
    const title = _.get('ui:title', uiSchema) || pageTitle;
    const arrayPageConfig = {
      schema: _.assign(schema.items, { definitions: schema.definitions }),
      uiSchema: uiSchema.items,
      pageKey: fieldName
    };

    return (
      <div>
        {title &&
          <div className="form-review-panel-page-header-row">
            <h5 className="form-review-panel-page-header">{title}</h5>
            <button type="button" className="edit-btn primary-outline" onClick={() => this.handleAdd()}>Add Another</button>
          </div>}
        <div className="va-growable va-growable-review">
          <Element name={`topOfTable_${fieldName}`}/>
          {this.state.items.map((item, index) => {
            const isLast = this.state.items.length === (index + 1);
            const isEditing = this.state.editing[index];
            if (isEditing) {
              return (
                <div key={index} className="va-growable-background">
                  <Element name={`table_${fieldName}_${index}`}/>
                  <div className="row small-collapse">
                    <div className="small-12 columns va-growable-expanded">
                      {isLast && uiSchema['ui:options'].itemName && this.state.items.length > 1
                          ? <h5>New {uiSchema['ui:options'].itemName}</h5>
                          : null}
                      <FormPage
                          setData={(key, data) => this.handleSetData(index, data)}
                          reviewPage
                          onEdit={() => this.handleEdit(index, !isEditing)}
                          onSubmit={() => this.handleSave(index)}
                          form={{ [fieldName]: { data: item, schema: arrayPageConfig.schema } }}
                          route={{ pageConfig: arrayPageConfig }}>
                        <div className="row small-collapse">
                          <div className="small-6 left columns">
                            <button className="float-left">Update</button>
                          </div>
                          <div className="small-6 right columns">
                            <button type="button" className="usa-button-outline float-right" onClick={() => this.handleRemove(index)}>Remove</button>
                          </div>
                        </div>
                      </FormPage>
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
                      reviewPage
                      reviewMode
                      onEdit={() => this.handleEdit(index, !isEditing)}
                      onSubmit={() => this.handleSave(index)}
                      form={{ [fieldName]: { data: item, schema: arrayPageConfig.schema } }}
                      route={{ pageConfig: arrayPageConfig }}>
                    <div/>
                  </FormPage>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ArrayField;

ArrayField.propTypes = {
  schema: React.PropTypes.object.isRequired,
  uiSchema: React.PropTypes.object,
  pageKey: React.PropTypes.string.isRequired,
  path: React.PropTypes.array.isRequired,
  formData: React.PropTypes.object,
  arrayData: React.PropTypes.array,
  pageTitle: React.PropTypes.string
};

