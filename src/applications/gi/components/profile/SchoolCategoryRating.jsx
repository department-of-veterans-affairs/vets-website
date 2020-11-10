import React from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import { renderStars } from '../../utils/render';

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

  return (
    <div className="vads-u-margin-right--0 category-rating">
      <div className="rating vads-u-border-bottom--1px vads-u-border-color--gray-lighter">
        <button
          aria-expanded={open}
          className="usa-accordion-button-ratings"
          onClick={() => openHandler(categoryRating.categoryName)}
        >
          <div className="category-main vads-l-row medium-screen:vads-u-padding-left--1">
            <div className="vads-l-col--6 vads-u-font-size--sm">{title}</div>
            {categoryRating.averageRating && (
              <div className="vads-l-col--6 vads-u-font-size--sm">
                {renderStars(categoryRating.averageRating)}{' '}
                <span className="vads-u-font-weight--normal">
                  {averageStars.display}
                </span>
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
