import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import formConfig from '../config/form';
import { setupPages } from '../utils/reviewPageHelper';

const updateSubmitted = () => (
  <va-alert
    className="vads-u-margin-bottom--1"
    close-btn-aria-label="Close notification"
    disable-analytics="false"
    full-width="false"
    slim
    status="success"
    visible="true"
  >
    <p className="vads-u-margin-y--0">Your question has been updated</p>
  </va-alert>
);

const PageFieldSummary = props => {
  const { renderedProperties, defaultEditButton, updatedPage } = props;
  const { allPages } = setupPages(formConfig);
  const currentPage = allPages.filter(page => page.key === updatedPage);
  const alertPage = allPages.filter(page => page.title === 'Your question');

  if (!renderedProperties) {
    return null;
  }

  return (
    <div className="vads-u-width--full vads-u-justify-content--space-between vads-u-align-items--center">
      <div className="form-review-panel-page-header-row vads-u-margin-bottom--1">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Your question
        </h4>
        <span>{defaultEditButton({ label: `Edit` })}</span>
      </div>
      {currentPage[0]?.chapterTitle === alertPage[0].chapterTitle &&
        updateSubmitted()}
      <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
        {renderedProperties.map((question, index) => {
          if (
            question?.props.uiSchema['ui:title'] === "What's your question?" &&
            renderedProperties[0] === null
          ) {
            return (
              <p
                className="vads-u-font-weight--bold"
                key={`${question?.props.name} ${index}}`}
              >
                {question?.props.formData}
              </p>
            );
          }
          return (
            question && (
              <div
                className="review-row vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0 overflow-auto"
                key={`${question?.props.name} ${index}}`}
              >
                <dt>{question?.props.uiSchema['ui:title']}</dt>
                <dd>{question?.props.formData}</dd>
              </div>
            )
          );
        })}
      </dl>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    updatedPage: state.askVA.updatedInReview,
  };
}
PageFieldSummary.propTypes = {
  defaultEditButton: PropTypes.func,
  renderedProperties: PropTypes.array,
  title: PropTypes.string,
  updatedPage: PropTypes.string,
};

export default connect(mapStateToProps)(PageFieldSummary);
