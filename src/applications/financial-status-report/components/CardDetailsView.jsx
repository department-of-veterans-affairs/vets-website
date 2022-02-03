import React from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import moment from 'moment';
import PropTypes from 'prop-types';
import { currency } from '../utils/helpers';

const CardDetailsView = ({ formData, onEdit, title }) => {
  if (!formData) return <div>no data</div>;

  const keys = Object.keys(formData);
  const capitalize = str => startCase(toLower(str));

  let type;
  let amount;
  let make;
  let model;
  let year;
  let employer;
  let startDate;
  let endDate;
  let age;
  let purpose;
  let balance;
  let monthly;

  keys.forEach(key => {
    if (key.toLowerCase().includes('purpose')) {
      purpose = capitalize(formData[key]);
    }
    if (key.toLowerCase().includes('balance')) {
      balance = currency(formData[key]);
    }
    if (key.toLowerCase().includes('monthly')) {
      monthly = currency(formData[key]);
    }
    if (key.toLowerCase().includes('type')) {
      type = capitalize(formData[key]);
    }
    if (
      key.toLowerCase().includes('amount') ||
      key.toLowerCase().includes('value')
    ) {
      amount = currency(formData[key]);
    }
    if (key.toLowerCase().includes('make')) {
      make = capitalize(formData[key]);
    }
    if (key.toLowerCase().includes('model')) {
      model = capitalize(formData[key]);
    }
    if (key.toLowerCase().includes('year')) {
      year = formData[key];
    }
    if (key.toLowerCase().includes('employer')) {
      employer = formData[key];
    }
    if (key.toLowerCase().includes('from')) {
      const formatDate = formData[key]?.slice(0, -3);
      startDate = moment(formatDate, 'YYYY-MM').format('MMMM YYYY');
    }
    if (key.toLowerCase().includes('to')) {
      const formatDate = formData[key]?.slice(0, -3);
      endDate = moment(formatDate, 'YYYY-MM').format('MMMM YYYY');
      if (!formatDate) {
        endDate = 'Present';
      }
    }
    if (key.toLowerCase().includes('age')) {
      age = formData[key];
    }
  });

  const renderDetails = () => {
    if (purpose) {
      return (
        <h4 className="card-title">
          {monthly} monthly toward {balance} balance for {purpose}
        </h4>
      );
    }

    if (age) {
      return (
        <>
          <h4 className="card-title">Dependent age</h4>
          <p>{age}</p>
        </>
      );
    }

    if (employer) {
      return (
        <>
          <h4 className="card-title">
            {type} employment at {employer}
          </h4>
          <p>
            {startDate} to {endDate}
          </p>
        </>
      );
    }

    return (
      <h4 className="card-title">
        {amount} for {make ? null : type} {year} {make} {model}
      </h4>
    );
  };

  return (
    <div className="va-growable-background card-details-view">
      <div className="row small-collapse">
        <div className="card-details">{renderDetails()}</div>
        <div className="edit-item-container">
          <button
            className="usa-button-secondary vads-u-flex--auto"
            onClick={() => onEdit()}
            aria-label={`Edit ${title}`}
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

CardDetailsView.propTypes = {
  formData: PropTypes.object,
  title: PropTypes.string,
  onEdit: PropTypes.func,
};

export default CardDetailsView;
