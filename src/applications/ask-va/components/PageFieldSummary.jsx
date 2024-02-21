import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import formConfig from '../config/form';
import { noEditBtn } from '../constants';
import { setupPages } from '../utils/reviewPageHelper';

const updateSubmitted = (
  <p className="vads-u-width--full vads-u-background-color--green-lightest vads-u-padding--2">
    <i className="fas fa-check vads-u-color--green-darker vads-u-margin-right--2" />
    Your edit was submitted successfully.
  </p>
);

const PageFieldSummary = props => {
  const { renderedProperties, defaultEditButton, title, updatedPage } = props;
  const { allPages } = setupPages(formConfig);
  const currentPage = allPages.filter(page => page.key === updatedPage);
  const alertPage = allPages.filter(page => page.title === title);

  if (!renderedProperties) {
    return null;
  }

  return (
    <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
      {currentPage[0]?.chapterTitle === alertPage[0].chapterTitle &&
        updateSubmitted}
      <div className="form-review-panel-page-header-row vads-u-font-size--h4">
        <h4 className="form-review-panel-page-header">{title}</h4>
        <span>
          {!noEditBtn.includes(title) && defaultEditButton({ label: `Edit` })}
        </span>
      </div>
      <dl className="review">
        {renderedProperties.map((question, index) => (
          <dl className="review-row" key={`${question?.props.name} ${index}}`}>
            <dt>{question?.props.uiSchema['ui:title']}</dt>
            <dd>{question?.props.formData}</dd>
          </dl>
        ))}
      </dl>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    updatedPage: state.askVA.updatedInReview,
  };
}
PageFieldSummary.prototype = {
  title: PropTypes.string,
  defaultEditButton: PropTypes.func,
  renderedProperties: PropTypes.array,
  updatedPage: PropTypes.string,
};

export default connect(mapStateToProps)(PageFieldSummary);
