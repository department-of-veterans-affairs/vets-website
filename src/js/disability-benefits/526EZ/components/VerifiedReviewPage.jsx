import PropTypes from 'prop-types';
import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash/fp';
import classNames from 'classnames';

import { focusElement } from '../../../common/utils/helpers';
import SchemaForm from '../../../common/schemaform/components/SchemaForm';
import ProgressButton from '@department-of-veterans-affairs/jean-pants/ProgressButton';

const Element = Scroll.Element;
const scroller = Scroll.scroller;
export default class VerifiedReviewPage extends React.Component {
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

  focusOnPage = key => {
    const pageDiv = document.querySelector(`#${key}`);
    focusElement(pageDiv);
  };

  handleEdit = (key, editing, index = null) => {
    this.props.onEdit(key, editing, index);
    this.scrollToPage(`${key}${index === null ? '' : index}`);
    this.focusOnPage(`${key}${index === null ? '' : index}`);
  };

  handleSubmit = (formData, key, path = null, index = null) => {
    // This makes sure defaulted data on a page with no changes is saved
    // Probably safe to do this for regular pages, too, but it hasn’t been necessary
    if (path) {
      const newData = _.set([path, index], formData, this.props.form.data);
      this.props.setData(newData);
    }

    this.handleEdit(key, false, index);
  };

  scrollToTop = () => {
    scroller.scrollTo(
      `${this.props.pageKey}TitleScrollElement`,
      window.VetsGov.scroll || {
        duration: 500,
        delay: 2,
        smooth: true
      }
    );
  };

  scrollToPage = key => {
    scroller.scrollTo(
      `${key}ScrollElement`,
      window.VetsGov.scroll || {
        duration: 500,
        delay: 2,
        smooth: true
      }
    );
  };

  render() {
    const { form, formContext, verifiedReviewComponent, pageKey, title, hideHeaderRow } = this.props;
    const pageState = form.pages[pageKey];
    const editing = pageState.editMode;
    const { data } = form;
    const { schema, uiSchema } = form.pages[pageKey];
    const pageContent = (
      <div className="input-section">
        <div
          className="usa-accordion-content schemaform-chapter-accordion-content"
          aria-hidden="false">
          <div key={`${pageKey}`} className={'form-review-panel-page'}>
            <Element name={`${pageKey}ScrollElement`}/>
            {!editing && verifiedReviewComponent({ formData: data })}
            {editing && (
              <SchemaForm
                name={pageKey}
                title={title}
                data={data}
                schema={schema}
                uiSchema={uiSchema}
                hideHeaderRow={hideHeaderRow}
                hideTitle
                onBlur={this.props.onBlur}
                onEdit={() => this.handleEdit(pageKey, !editing)}
                onSubmit={({ formData }) =>
                  this.handleSubmit(formData, pageKey)
                }
                onChange={formData => this.onChange(formData)}
                uploadFile={this.props.uploadFile}
                reviewMode={!editing}
                formContext={formContext}>
                <ProgressButton
                  submitButton
                  buttonText="Update Page"
                  buttonClass="usa-button-primary"/>
              </SchemaForm>
            )}
          </div>
        </div>
      </div>
    );

    const containerClasses = classNames(
      'usa-accordion-bordered',
      'form-review-panel'
    );
    const editClasses = classNames({
      'viewfield-edit-container': editing
    });

    return (
      <div id={`${this.id}-collapsiblePanel`} className={containerClasses}>
        <p>
          Please review the information we have on file for you. If something
          doesn’t look right, you can fix it by clicking the Edit button.
        </p>
        <Element name={`${pageKey}TitleScrollElement`}/>
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header clearfix schemaform-chapter-accordion-header">
              <div className="accordion-title">
                <h4 className="form-review-panel-page-header">
                  {title}
                </h4>
                {!editing && (
                  <button
                    type="button"
                    aria-expanded={this.state.open ? 'true' : 'false'}
                    aria-controls={`collapsible-${this.id}`}
                    className="edit-btn primary-outline"
                    onClick={() => this.handleEdit(pageKey, !editing)}>
                    Edit
                  </button>
                )}
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

VerifiedReviewPage.propTypes = {
  pageKey: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired
};
