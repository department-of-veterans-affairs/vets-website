/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { getAvgCount } from '../../../utils/helpers';
import RatingsStars from './RatingsStars';
import RenderBar from './RenderBar';

export default function RatingsAccordion({
  categoryRating,
  open,
  openHandler,
  title,
  questionObj,
}) {
  const [subHeader, setSubHeader] = useState(false);
  const breakPoint = 768;

  const getQuestions = () => {
    const tempQuestions = [];
    const values = Object.values(questionObj);
    values.forEach((_, index) => {
      const avgCount = getAvgCount(questionObj, index);
      const { question } = questionObj[index];
      const ariaLabel =
        avgCount > 0
          ? `${question} with a rating of ${avgCount} out of 4.`
          : `${question} This question has not been rated.`;
      tempQuestions.push(
        <div
          key={index}
          role="listitem"
          tabIndex="0"
          aria-label={ariaLabel}
          className="vads-u-margin-top--1"
        >
          <RenderBar label={question} avgRating={avgCount} />
        </div>,
      );
    });
    return tempQuestions;
  };

  const onClickHandler = () => {
    const action = open ? 'collapse' : 'expand';
    recordEvent({
      event: `int-accordion-${action}`,
      'accordion-parent-label': title,
      'accordion-child-label': undefined,
      'accordion-size': 'small',
      'gibct-rating': categoryRating,
    });

    openHandler(title);
  };

  useEffect(() => {
    // set initial value for subHeader
    if (window.innerWidth <= breakPoint) {
      setSubHeader(true);
    } else {
      setSubHeader(false);
    }
  }, []);

  useEffect(() => {
    // controls expansion of accordion block to make room for stars
    // when they move below title
    window.addEventListener('resize', event => {
      const { innerWidth } = event.target;
      if (innerWidth <= breakPoint) {
        setSubHeader(true);
      } else {
        setSubHeader(false);
      }
    });
  }, []);

  return (
    <div className="vads-u-padding--1">
      <div aria-hidden className="star-heading">
        <RatingsStars rating={categoryRating} />
        <span className="vads-u-margin-left--1">{categoryRating}</span>
      </div>
      <va-accordion
        open-single
        headline={<h6 slot="headline">{title}</h6>}
        onClick={onClickHandler}
      >
        {subHeader && (
          <va-accordion-item id={title} header={title} subheader="-">
            <div>{getQuestions()}</div>
          </va-accordion-item>
        )}

        {!subHeader && (
          <va-accordion-item id={title}>
            <h6 slot="headline">{title}</h6>
            <div>{getQuestions()}</div>
          </va-accordion-item>
        )}
      </va-accordion>
    </div>
  );
}

RatingsAccordion.propTypes = {
  categoryRating: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  openHandler: PropTypes.func.isRequired,
  questionObj: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};
