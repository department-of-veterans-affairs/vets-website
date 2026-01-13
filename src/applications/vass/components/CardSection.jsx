import React from 'react';
import PropTypes from 'prop-types';
import DateTime from './DateTime';
import AddToCalendarButton from './AddToCalendarButton';

export default function CardSection({
  dateContent,
  textContent,
  heading,
  level = 2,
  customBodyElement,
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
      {dateContent && (
        <>
          <DateTime dateTime={dateContent.dateTime} />
          {dateContent.showAddToCalendarButton && (
            <AddToCalendarButton appointment={dateContent} />
          )}
        </>
      )}
      {customBodyElement}
    </div>
  );
}

CardSection.propTypes = {
  customBodyElement: PropTypes.node,
  dateContent: PropTypes.object,
  heading: PropTypes.string,
  level: PropTypes.number,
  textContent: PropTypes.string,
};
