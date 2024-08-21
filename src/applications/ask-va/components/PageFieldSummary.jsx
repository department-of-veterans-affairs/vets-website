import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import formConfig from '../config/form';
import { noEditBtn } from '../constants';
import { setupPages } from '../utils/reviewPageHelper';

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
      {currentPage[0]?.chapterTitle === alertPage[0].chapterTitle && (
        <va-alert
          className="vads-u-margin-bottom--1"
          close-btn-aria-label="Close notification"
          disable-analytics="false"
          full-width="false"
          slim
          status="success"
          visible="true"
        >
          <p className="vads-u-margin-y--0">{title} has been updated</p>
        </va-alert>
      )}
      {!noEditBtn.includes(title) && (
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
          <span>{defaultEditButton({ label: `Edit` })}</span>
        </div>
      )}
      <dl className="review vads-u-margin-top--0 vads-u-margin-bottom--0">
        {renderedProperties.map(
          (question, index) =>
            question && (
              <dl
                className="review-row vads-u-border-top--0 vads-u-margin-top--0 vads-u-margin-bottom--0"
                key={`${question?.props.name} ${index}}`}
              >
                <dt>{question?.props.uiSchema['ui:title']}</dt>
                <dd>{question?.props.formData}</dd>
              </dl>
            ),
        )}
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
