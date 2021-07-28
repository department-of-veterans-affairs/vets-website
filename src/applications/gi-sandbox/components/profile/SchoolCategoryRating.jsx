import React from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import recordEvent from 'platform/monitoring/record-event';
import RatingsStars from '../RatingsStars';

export default function SchoolCategoryRating({
  categoryRating,
  description,
  open,
  openHandler,
  title,
}) {
  const averageStars = convertRatingToStars(categoryRating.averageRating);

  const renderBar = (label, count) => {
    const percent = categoryRating.averageRating
      ? ((count / categoryRating.totalCount).toFixed(2) * 100).toFixed(0)
      : 0;

    return (
      <div className="vads-l-row category-rating-count">
        <div className="vads-l-col--2">{label} </div>
        <div className="vads-l-col--5">
          <div className="bar bar-outer vads-u-display--inline-block vads-u-background-color--gray-lighter">
            <div
              style={{
                width: `${percent}%`,
              }}
              className="bar vads-u-display--inline-block vads-u-background-color--gold-darker"
            >
              &nbsp;
            </div>
          </div>
        </div>
        <div className="vads-l-col--2"> {percent}%</div>
        <div className="vads-l-col--3 count-value">({count} users)</div>
      </div>
    );
  };

  const onClick = () => {
    const action = open ? 'collapse' : 'expand';

    recordEvent({
      event: `int-accordion-${action}`,
      'accordion-parent-label': title,
      'accordion-child-label': undefined,
      'accordion-size': 'small',
      'gibct-rating': categoryRating.averageRating,
    });

    openHandler(categoryRating.categoryName);
  };

  return (
    <div className="vads-u-margin-right--0 category-rating">
      <div className="rating">
        <button
          aria-expanded={open}
          className="usa-accordion-button vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
          onClick={onClick}
        >
          <div className="category-main vads-l-row medium-screen:vads-u-padding-left--1">
            <div className="vads-l-col--6 vads-u-font-size--sm ">{title}</div>
            {categoryRating.averageRating && (
              <div className="vads-l-col--6 vads-u-font-size--sm">
                <RatingsStars rating={categoryRating.averageRating} />
                <div className="vads-u-font-weight--normal vads-u-display--inline vads-u-padding-left--1 vads-u-margin-right--1p5">
                  {averageStars.display}
                </div>
              </div>
            )}
            {!categoryRating.averageRating && (
              <div className="vads-u-font-weight--normal">Not yet rated</div>
            )}
          </div>
        </button>
        {open && (
          <div className="vads-u-padding-top--1  vads-u-margin-top--2p5 medium-screen:vads-u-padding-left--1 ">
            Distribution of ratings
            <div className="vads-u-margin-top--1">
              {renderBar('5 star', categoryRating.rated5Count)}
              {renderBar('4 star', categoryRating.rated4Count)}
              {renderBar('3 star', categoryRating.rated3Count)}
              {renderBar('2 star', categoryRating.rated2Count)}
              {renderBar('1 star', categoryRating.rated1Count)}
            </div>
            {categoryRating.naCount > 0 && (
              <div className="vads-u-margin-top--1 vads-u-font-style--italic na-count-display">
                {categoryRating.naCount} users didn’t rate this category
              </div>
            )}
            <p>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
