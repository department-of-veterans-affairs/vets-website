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

  keys.forEach(item => {
    if (item.toLowerCase().includes('type')) {
      type = capitalize(formData[item]);
    }
    if (item.toLowerCase().includes('amount')) {
      amount = formatter.format(formData[item]);
    }
    if (item.toLowerCase().includes('make')) {
      make = capitalize(formData[item]);
    }
    if (item.toLowerCase().includes('model')) {
      model = capitalize(formData[item]);
    }
    if (item.toLowerCase().includes('year')) {
      year = formData[item];
    }
    if (item.toLowerCase().includes('employer')) {
      employer = formData[item];
    }
    if (item.toLowerCase().includes('employmentstart')) {
      startDate = moment(formData[item]).format('MMMM Do, YYYY');
    }
    if (item.toLowerCase().includes('employmentend')) {
      endDate = moment(formData[item]).format('MMMM Do, YYYY');
    }
    if (item.toLowerCase().includes('age')) {
      age = formData[item];
    }
  });

  const renderDetails = () => {
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
