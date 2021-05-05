import React from 'react';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';
import moment from 'moment';

const CardDetailsView = ({ formData, onEdit, index, title }) => {
  if (!formData) return <div>no data</div>;

  const keys = Object.keys(formData);
  const capitalize = str => startCase(toLower(str));
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

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
      balance = formatter.format(formData[key]);
    }
    if (key.toLowerCase().includes('monthly')) {
      monthly = formatter.format(formData[key]);
    }
    if (key.toLowerCase().includes('type')) {
      type = capitalize(formData[key]);
    }
    if (
      key.toLowerCase().includes('amount') ||
      key.toLowerCase().includes('value')
    ) {
      amount = formatter.format(formData[key]);
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
      startDate = moment(formatDate).format('MMMM YYYY');
    }
    if (key.toLowerCase().includes('to')) {
      const formatDate = formData[key]?.slice(0, -3);
      endDate = moment(formatDate).format('MMMM YYYY');
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
            onClick={e => onEdit(e, index)}
            aria-label={`Edit ${title}`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsView;
