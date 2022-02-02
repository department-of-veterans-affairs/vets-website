import React from 'react';
import { connect } from 'react-redux';

const SearchRepresentativeReviewWidget = props => {
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      {Object.keys(props?.formData?.representativeData).map((item, index) => {
        return (
          <>
            <div key={index} className="vads-u-display--flex">
              <p className="vads-u-flex--1 vads-u-text-align--left vads-u-font-weight--normal vads-u-margin-y--0">
                {capitalizeFirstLetter(item)}:
              </p>
              <p className="vads-u-flex--1 vads-u-margin-y--0">
                {props.formData.representativeData[item]}
              </p>
            </div>
            {index !== 4 ? <hr /> : ''}
          </>
        );
      })}
    </>
  );
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(
  mapStateToProps,
  {},
)(SearchRepresentativeReviewWidget);
