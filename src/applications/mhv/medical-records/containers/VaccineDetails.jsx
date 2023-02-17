import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { dateFormat } from '../util/helpers';

const VaccineDetails = () => {
  const vaccineDetails = useSelector(state => state.mr.vaccines.vaccineDetails);
  const formattedDate = dateFormat(vaccineDetails?.date, 'MMMM D, YYYY');
  const history = useHistory();

  useEffect(
    () => {
      if (!vaccineDetails) {
        history.push('/vaccines');
      }
    },
    [vaccineDetails, history],
  );

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

  return vaccineDetails ? (
    <div className="vads-l-grid-container vads-u-padding-x--0 vads-u-margin-bottom--5">
      <h1 className="vaccine-header">{vaccineDetails.name}</h1>
      <div className="vads-u-display--flex vads-u-margin-y--3">
        <button className="link-button vads-u-margin-right--3" type="button">
          <i
            aria-hidden="true"
            className="fas fa-print vads-u-margin-right--1"
          />
          Print page
        </button>
        <button className="link-button" type="button">
          <i
            aria-hidden="true"
            className="fas fa-download vads-u-margin-right--1"
          />
          Download page
        </button>
      </div>
      <div className="detail-block">
        <h2 className="vads-u-margin-top--0">Date received</h2>
        <p>{formattedDate}</p>
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
        <h2>Reactions recorded by provider</h2>
        {reactions()}
        <h2>Provider comments</h2>
        {comments()}
      </div>
    </div>
  ) : (
    <div />
  );
};

export default VaccineDetails;
