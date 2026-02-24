import React from 'react';
import PropTypes from 'prop-types';

import DateTime from './DateTime';
import AddToCalendarButton from './AddToCalendarButton';

/**
 * Renders a card section.
 * @param {Object} props
 * @param {import('../utils/appointments').Appointment} props.appointmentData - The appointment data
 * @param {string} props.textContent - The text content
 * @param {string} props.heading - The heading
 * @param {number} props.level - The heading level. Defaults to 3.
 * @param {boolean} props.showAddToCalendarButton - Whether to show the add to calendar button if appointmentData is provided
 * @param {React.ReactNode} props.customBodyElement - The custom body element
 * @returns {JSX.Element}
 */
export default function CardSection({
  appointmentData,
  textContent,
  heading,
  level = 3,
  customBodyElement,
  showAddToCalendarButton,
  ...props
}) {
  const Heading = `h${level}`;

  return (
    <div {...props}>
      <Heading className="vads-u-font-size--h4 vads-u-margin-bottom--0p5">
        {heading}
      </Heading>
      {textContent && (
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          {textContent}
        </p>
      )}
      {appointmentData && (
        <>
          <DateTime dateTime={appointmentData.startUTC} />
          {showAddToCalendarButton && (
            <AddToCalendarButton appointment={appointmentData} />
          )}
        </>
      )}
      {customBodyElement}
    </div>
  );
}

CardSection.propTypes = {
  appointmentData: PropTypes.object,
  customBodyElement: PropTypes.node,
  heading: PropTypes.string,
  level: PropTypes.number,
  showAddToCalendarButton: PropTypes.bool,
  textContent: PropTypes.string,
};
