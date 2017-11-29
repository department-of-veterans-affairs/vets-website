import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash/fp';
import Scroll from 'react-scroll';

import SchemaForm from './SchemaForm';
import { focusElement } from '../utils/helpers';

function focusForm() {
  const legend = document.querySelector('.form-panel legend:not(.schemaform-label)');
  if (legend && legend.getBoundingClientRect().height > 0) {
    focusElement(legend);
  } else {
    focusElement('.nav-header');
  }
}

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', window.VetsGov.scroll || {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

/*
 * Component for regular form pages (i.e. not on the review page). Handles moving back
 * and forward through pages
 */
class FormPage extends React.Component {
  componentDidMount() {
    if (!this.props.blockScrollOnMount) {
      scrollToTop();
      focusForm();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name || prevProps.itemIndex !== this.props.itemIndex) {
      scrollToTop();
      focusForm();
    }
  }

  onChange = (formData) => {
    let newData = formData;
    if (this.props.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = _.set([this.props.arrayPath, this.props.itemIndex], formData, this.props.data);
    }
    this.props.onChange(newData);
  }

  onSubmit = ({ formData }) => {
    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    let newData = formData;
    if (this.props.showPagePerItem) {
      // If this is a per item page, the formData object will have data for a particular
      // row in an array, so we need to update the full form data object and then call setData
      newData = _.set([this.props.arrayPath, this.props.itemIndex], formData, this.props.data);
    }

    this.props.onSubmit(newData);
  }

  render() {
    const {
      showPagePerItem,
      arrayPath,
      itemIndex,
      name,
      title,
      prefilled
    } = this.props;

    let { schema, uiSchema } = this.props;
    let data = this.props.data;

    if (showPagePerItem) {
      // Instead of passing through the schema/uiSchema to SchemaForm, the
      // current item schema for the array at arrayPath is pulled out of the page state and passed
      schema = schema.properties[arrayPath].items[itemIndex];
      // Similarly, the items uiSchema and the data for just that particular item are passed
      uiSchema = uiSchema[arrayPath].items;
      // And the data should be for just the item in the array
      data = _.get([arrayPath, itemIndex], data);
    }

    return (
      <div className="form-panel">
        <SchemaForm
          name={name}
          title={title}
          data={data}
          schema={schema}
          uiSchema={uiSchema}
          pagePerItemIndex={itemIndex}
          uploadFile={this.props.uploadFile}
          prefilled={prefilled}
          onChange={this.onChange}
          onSubmit={this.onSubmit}>
          {this.props.children}
        </SchemaForm>
      </div>
    );
  }
}

FormPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object.isRequired,
  showPagePerItem: PropTypes.bool,
  arrayPath: PropTypes.string,
  itemIndex: PropTypes.number,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  prefilled: PropTypes.bool
};

export default FormPage;
