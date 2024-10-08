import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomPageReview = ({
  data,
  editPage,
  title,
  question,
  dataValue,
  className,
  moreRow,
  questionTwo,
  dataValue2,
}) => {
  const [editing, setEditing] = useState(false);
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  const value = dataValue.includes('.')
    ? getNestedValue(data, dataValue) || ''
    : data?.[dataValue] || '';
  const handleEdit = () => {
    setEditing(!editing);
    editPage();
  };

  return (
    <div className="form-review-panel-page">
      <div className={`${className} form-review-panel-page-header-row`}>
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          {title}
        </h4>
        <va-button
          secondary
          className="edit-page float-right"
          onClick={handleEdit}
          text="Edit"
          uswds
        />
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>{question}</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="veteranDesc">
            <strong>{value || ''}</strong>
          </dd>
        </div>
        {moreRow && (
          <div className="review-row">
            <dt>{questionTwo}</dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="veteranDesc">
              <strong>{data?.[dataValue2]?.join(', ') || ''}</strong>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};
CustomPageReview.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  dataValue: PropTypes.string,
  dataValue2: PropTypes.string,
  editPage: PropTypes.func,
  moreRow: PropTypes.bool,
  question: PropTypes.string,
  questionTwo: PropTypes.string,
  title: PropTypes.string,
};
CustomPageReview.defaultProps = {
  data: {},
  editPage: () => {},
};

export default CustomPageReview;
