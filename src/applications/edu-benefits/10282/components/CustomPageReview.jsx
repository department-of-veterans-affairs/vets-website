// src/applications/edu-benefits/10282/components/CustomPageReview.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CustomPageReview = ({ data, editPage }) => {
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(!editing);
    editPage();
  };
  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
          Your personal information
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
          <dt>First name </dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="veteranFullName.first"
          >
            <strong>{data.veteranFullName?.first || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Middle name </dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="veteranFullName.middle"
          >
            <strong>{data.veteranFullName?.middle || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Last name </dt>
          <dd
            className="dd-privacy-hidden"
            data-dd-action-name="veteranFullName.last"
          >
            <strong>{data.veteranFullName?.last || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Which one best describes you?</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="veteranDesc">
            <strong>{data.veteranDesc || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Email Address </dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="contactInfo">
            <strong>{data.contactInfo.email || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Home phone number </dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="contactInfo">
            <strong>{data.contactInfo.homePhone || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Mobile phone number </dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="contactInfo">
            <strong>{data.contactInfo.mobilePhone || ''}</strong>
          </dd>
        </div>
        <div className="review-row">
          <dt>Country </dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="country">
            <strong>{data.country || ''}</strong>
          </dd>
        </div>
        {data.country === 'United States' && (
          <div className="review-row">
            <dt>State </dt>
            <dd className="dd-privacy-hidden" data-dd-action-name="country">
              <strong>{data.state || ''}</strong>
            </dd>
          </div>
        )}
        <div className="review-row">
          <dt>Do you want to answer the optional questions?</dt>
          <dd className="dd-privacy-hidden" data-dd-action-name="country">
            <strong>{data.raceAndGender || ''}</strong>
          </dd>
        </div>
        {data.raceAndGender === 'Yes' && (
          <>
            <div className="review-row">
              <dt>What is your ethnicity?</dt>
              <dd className="dd-privacy-hidden" data-dd-action-name="country">
                <strong>{data.ethnicity || ''}</strong>
              </dd>
            </div>
            <div className="review-row">
              <dt>What is your race or origin?</dt>
              <dd className="dd-privacy-hidden" data-dd-action-name="country">
                <strong>{data.orginRace || ''}</strong>
              </dd>
            </div>
            <div className="review-row">
              <dt> How would you describe your gender?</dt>
              <dd className="dd-privacy-hidden" data-dd-action-name="country">
                <strong>{data.gender || ''}</strong>
              </dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};
CustomPageReview.propTypes = {
  data: PropTypes.object,
  editPage: PropTypes.func,
};
export default CustomPageReview;
