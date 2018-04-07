import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import classNames from 'classnames';

import { focusElement } from '../../../common/utils/helpers';
import SchemaForm from '../../../common/schemaform/components/SchemaForm';
import ProgressButton from '../../../common/components/form-elements/ProgressButton';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
export default class ReviewCollapsiblePage extends React.Component {
  constructor() {
    super();
    this.state = { open: false };
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  componentDidUpdate(oldProps, oldState) {
    if (!oldState.open && this.state.open) {
      this.scrollToTop();
    }
  }

  onChange(formData, path = null, index = null) {
    let newData = formData;
    if (path) {
      newData = _.set([path, index], formData, this.props.form.data);
    }
    this.props.setData(newData);
  }

  focusOnPage = (key) => {
    const pageDiv = document.querySelector(`#${key}`);
    focusElement(pageDiv);
  }

  handleEdit = (key, editing, index = null) => {
    this.props.onEdit(key, editing, index);
    this.scrollToPage(`${key}${index === null ? '' : index}`);
    this.focusOnPage(`${key}${index === null ? '' : index}`);
  }

  handleSubmit = (formData, key, path = null, index = null) => {
    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    if (path) {
      const newData = _.set([path, index], formData, this.props.form.data);
      this.props.setData(newData);
    }

    this.handleEdit(key, false, index);
  }

  scrollToTop = () => {
    scroller.scrollTo(`chapter${this.props.chapterKey}ScrollElement`, window.VetsGov.scroll || {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  scrollToPage = (key) => {
    scroller.scrollTo(`${key}ScrollElement`, window.VetsGov.scroll || {
      duration: 500,
      delay: 2,
      smooth: true,
    });
  }

  render() {
    const { page, formContext, fullPageKey, form } = this.props;
    page.pageKey = fullPageKey;
    const pageState = form.pages[page.pageKey];
    const editing = pageState.editMode;
    const pageData = form.data;

    const pageContent = (
      <div className="usa-accordion-content schemaform-chapter-accordion-content" aria-hidden="false">
        <div key={`${fullPageKey}`} className={'form-review-panel-page'}>
          <Element name={`${fullPageKey}ScrollElement`}/>
          {page.verifiedReviewComponent && !editing &&
          <page.verifiedReviewComponent formData={pageData}/>}
          {page.schema && editing &&
          <SchemaForm
            name={page.pageKey}
            title={page.title.replace('Review ', '')}
            data={pageData}
            schema={page.schema}
            uiSchema={page.uiSchema}
            hideHeaderRow={page.hideHeaderRow}
            hideEditButton
            hideTitle
            hideBorders
            pagePerItemIndex={page.index}
            onBlur={this.props.onBlur}
            onEdit={() => this.handleEdit(page.pageKey, !editing, page.index)}
            onSubmit={({ formData }) => this.handleSubmit(formData, page.pageKey, page.arrayPath, page.index)}
            onChange={(formData) => this.onChange(formData, page.arrayPath, page.index)}
            uploadFile={this.props.uploadFile}
            reviewMode={!editing}
            formContext={formContext}
            editModeOnReviewPage={page.editModeOnReviewPage}>
            {!editing ? <div/> : <ProgressButton
              submitButton
              buttonText="Update Page"
              buttonClass="usa-button-primary"/>}
          </SchemaForm>}
        </div>
      </div>
    );

    const containerClasses = classNames('usa-accordion-bordered', 'form-review-panel');
    const editClasses = classNames({
      'viewfield-edit-container': editing
    });

    return (
      <div id={`${this.id}-collapsiblePanel`} className={containerClasses}>
        <Element name={`chapter${this.props.chapterKey}ScrollElement`}/>
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix schemaform-chapter-accordion-header">
              <div
                className="accordion-title">
                <h4 className="form-review-panel-page-header">{this.props.chapter.title(true)}</h4>
                {!editing &&
                <button
                  type="button"
                  aria-expanded={this.state.open ? 'true' : 'false'}
                  aria-controls={`collapsible-${this.id}`}
                  className="edit-btn primary-outline"
                  onClick={() => this.handleEdit('reviewVeteranInformation', !editing, page.index)}>
                Edit
                </button>}
              </div>
            </div>
            <div className={editClasses} id={`collapsible-${this.id}`}>
              {pageContent}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePage.propTypes = {
  chapter: PropTypes.object.isRequired,
  page: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};
