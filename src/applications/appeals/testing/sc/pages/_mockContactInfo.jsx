import React from 'react';

import MockContactInfo from '../components/_MockContactInfo';

export const MockContactInfoReview = () => (
  <div className="form-review-panel-page">
    <div name="confirmContactInfoScrollElement" />
    <div className="form-review-panel-page-header-row">
      <h4 className="form-review-panel-page-header vads-u-font-size--h5 vads-u-margin--0">
        Contact information
      </h4>
      <va-button
        secondary=""
        id="confirmContactInfoEdit"
        className="edit-page vads-u-justify-content--flex-end hydrated"
        label="Edit contact information"
        text="Edit"
      />
    </div>
    <dl className="review">
      <div className="review-row">
        <dt>Home phone number</dt>
        <dd className="dd-privacy-hidden">555-800-1111, ext. 5678</dd>
      </div>
      <div className="review-row">
        <dt>Mobile phone number</dt>
        <dd className="dd-privacy-hidden">555-800-2222, ext. 1234</dd>
      </div>
      <div className="review-row">
        <dt>Email address</dt>
        <dd className="dd-privacy-hidden">user@example.com</dd>
      </div>
      <div className="review-row">
        <dt>Country</dt>
        <dd className="dd-privacy-hidden">United States</dd>
      </div>
      <div className="review-row">
        <dt>Street address</dt>
        <dd className="dd-privacy-hidden">
          123 Main St, Suite #1200, Box 4567890
        </dd>
      </div>
      <div className="review-row">
        <dt>City</dt>
        <dd className="dd-privacy-hidden">New York</dd>
      </div>
      <div className="review-row">
        <dt>State</dt>
        <dd className="dd-privacy-hidden">NY</dd>
      </div>
      <div className="review-row">
        <dt>Zip code</dt>
        <dd className="dd-privacy-hidden">30012</dd>
      </div>
    </dl>
  </div>
);

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': MockContactInfo,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
