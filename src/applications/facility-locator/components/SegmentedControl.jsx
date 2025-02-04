import React from 'react';
import PropTypes from 'prop-types';

const SegmentedControl = ({
  labels,
  onChange,
  selected,
  a11yLabels,
  testIDs,
}) => {
  const activeBgColor = 'rgb(255, 255, 255)';
  const inactiveBgColor = 'rgb(223, 225, 226)';

  const buildSegment = (label, index) => {
    const isSelected = selected === index;
    const widthPct = `${100 / labels.length}%`;

    const accessibilityLabel = a11yLabels?.[index] || label;

    return (
      <button
        key={index}
        className={`segment ${isSelected ? 'segment--selected' : ''}`}
        onClick={() => {
          onChange(index);
        }}
        style={{
          width: widthPct,
          backgroundColor: isSelected ? activeBgColor : inactiveBgColor,
        }}
        aria-label={accessibilityLabel}
        role="tab"
        aria-selected={isSelected}
        data-testid={testIDs?.[index]}
        type="button"
      >
        <span
          className={`segment-text ${
            isSelected ? 'segment-text--selected' : ''
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`segment-wrapper ${
        selected === 0 ? 'segment-wrapper-list' : ''
      }`}
    >
      <div className="segmented-control-container" role="tablist">
        {labels.map((label, index) => buildSegment(label, index))}
      </div>
    </div>
  );
};

SegmentedControl.propTypes = {
  labels: PropTypes.array.isRequired,
  a11yLabels: PropTypes.array,
  selected: PropTypes.number,
  testIDs: PropTypes.array,
  onChange: PropTypes.func,
};

export default SegmentedControl;
