import React from 'react';
import PropTypes from 'prop-types';
import { capitalizeEachWord } from '../../utils';
import { formatDateString } from '../../content/conditions';

const normalize = val => (typeof val === 'string' ? val.trim() : '');

const deriveRatedIncreaseSelections = (formData = {}) => {
  const ratedDisabilities = Array.isArray(formData.ratedDisabilities)
    ? formData.ratedDisabilities
    : [];

  const newDisabilities = Array.isArray(formData.newDisabilities)
    ? formData.newDisabilities
    : [];

  // --- Build lookup for ratedDisabilities by name (case-insensitive) ---
  const ratedByName = new Map(
    ratedDisabilities
      .filter(d => d && typeof d.name === 'string')
      .map(d => [d.name.toLowerCase(), d]),
  );

  // 1) Current workflow (view:selected)
  const fromRatedDisabilities = ratedDisabilities
    .filter(d => d && d['view:selected'])
    .map(d => ({
      name: normalize(d.name),
      ratingPercentage: d.ratingPercentage,
      source: 'ratedDisabilities',
    }))
    .filter(d => d.name);

  // 2) New conditions workflow (rated increases inside newDisabilities)
  const fromNewDisabilities = newDisabilities
    .filter(d => d && typeof d === 'object')
    .filter(d => {
      const ratedName = normalize(d.ratedDisability);
      const condition = normalize(d.condition).toLowerCase();

      return (
        ratedName &&
        (condition === 'rated disability' || d.cause === 'WORSENED') &&
        ratedByName.has(ratedName.toLowerCase())
      );
    })
    .map(d => {
      const ratedName = normalize(d.ratedDisability);
      const ratedMatch = ratedByName.get(ratedName.toLowerCase());

      return {
        name: ratedName,
        ratingPercentage: ratedMatch?.ratingPercentage,
        conditionDate: formatDateString(d.conditionDate),
        source: 'newDisabilities',
      };
    });

  const combined = [...fromRatedDisabilities, ...fromNewDisabilities];

  const deduped = new Map();
  combined.forEach(item => {
    const key = item.name.toLowerCase();
    const existing = deduped.get(key);

    if (
      !existing ||
      (existing.ratingPercentage == null && item.ratingPercentage != null)
    ) {
      deduped.set(key, item);
    }
  });

  return [...deduped.values()];
};

const ConfirmationDisCondRatedDisabilities = ({ formData }) => {
  const selectedRated = deriveRatedIncreaseSelections(formData);

  return (
    <>
      {selectedRated.map(dis => (
        <li key={dis.name}>
          <h4>{capitalizeEachWord(dis.name)}</h4>
          <div className="vads-u-color--gray">Description</div>

          {dis.ratingPercentage != null ? (
            <>
              <div className="vads-u-margin-bottom--2">
                {`Claiming an increase from current ${dis.ratingPercentage}% rating`}
              </div>
            </>
          ) : (
            <>
              <div className="vads-u-margin-bottom--2">
                Claiming an increase
              </div>
            </>
          )}

          {dis.conditionDate && (
            <>
              <div className="vads-u-color--gray vads-u-margin-top--2">
                Date
              </div>
              <div className="vads-u-margin-bottom--2">{dis.conditionDate}</div>
            </>
          )}
        </li>
      ))}
    </>
  );
};

ConfirmationDisCondRatedDisabilities.propTypes = {
  formData: PropTypes.shape({
    ratedDisabilities: PropTypes.array,
    newDisabilities: PropTypes.array,
  }),
};

export default ConfirmationDisCondRatedDisabilities;
