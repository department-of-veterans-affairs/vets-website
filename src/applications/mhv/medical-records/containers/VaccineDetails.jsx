import React from 'react';
import { useSelector } from 'react-redux';
import { dateFormat } from '../util/helpers';

const VaccineDetails = () => {
  const vaccineDetails = useSelector(state => state.mr.vaccines.vaccineDetails);
  const formattedDate = dateFormat(vaccineDetails.date, 'MMMM D, YYYY');

  const typeAndDose = () => {
    if (vaccineDetails.type && vaccineDetails.dosage) {
      return `${vaccineDetails.type}, ${vaccineDetails.dosage}`;
    }
    if (vaccineDetails.type) {
      return vaccineDetails.type;
    }
    if (vaccineDetails.dosage) {
      return vaccineDetails.dosage;
    }
    return 'There is no type or dosage reported at this time.';
  };

  const reactions = () => {
    if (vaccineDetails.reactions) {
      if (vaccineDetails.reactions.length > 1) {
        return (
          <ul className="vads-u-margin-top--1">
            {vaccineDetails.reactions.map((reaction, idx) => {
              return (
                <li key={idx} className="vads-u-margin-bottom-0">
                  {reaction}
                </li>
              );
            })}
          </ul>
        );
      }
      return vaccineDetails.reactions[0];
    }
    return 'None reported';
  };

  const comments = () => {
    if (vaccineDetails.comments) {
      if (vaccineDetails.comments.length > 1) {
        return (
          <ul className="vads-u-margin-top--1">
            {vaccineDetails.comments.map((comment, idx) => {
              return (
                <li key={idx} className="vads-u-margin-bottom-0">
                  {comment}
                </li>
              );
            })}
          </ul>
        );
      }
      return vaccineDetails.comments[0];
    }
    return 'No comments at this time';
  };

  return (
    <div className="vads-l-grid-container">
      <div className="vads-u-display--flex vads-u-justify-content--space-between">
        <p className="vads-l-col--3">{formattedDate}</p>
        <button className="vads-l-col--3" type="button">
          Print
        </button>
      </div>
      <h1 className="vads-u-margin-bottom--1p5">{vaccineDetails.name}</h1>
      <div className="detail-block">
        <h2>Type and dosage</h2>
        {typeAndDose()}
        <h2>Series</h2>
        {vaccineDetails.series
          ? vaccineDetails.series
          : 'There is no series reported at this time'}
        <h2>Facility</h2>
        {vaccineDetails.facility
          ? vaccineDetails.facility
          : 'There is no facility reported at this time'}
        <h2>Reaction</h2>
        {reactions()}
        <h2>Comments</h2>
        {comments()}
      </div>
    </div>
  );
};

export default VaccineDetails;
