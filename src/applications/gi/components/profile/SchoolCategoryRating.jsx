import React from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import { renderStars } from '../../utils/render';

export default function SchoolCategoryRating({
  categoryRating,
  description,
  open,
  title,
}) {
  const averageStars = convertRatingToStars(categoryRating.averageRating);

  const renderBar = (label, count) => {
    const percent = `${(count / categoryRating.totalCount).toFixed(2) * 100}%`;
    return (
      <div>
        {label}{' '}
        <div className="bar vads-u-display--inline-block vads-u-background-color--gray-lighter ">
          <div
            style={{
              width: percent,
            }}
            className="bar vads-u-display--inline-block vads-u-background-color--gold-darker"
          >
            &nbsp;
          </div>
        </div>
        {percent}
      </div>
    );
  };

  return (
    <div className="vads-u-margin-right--0 category-rating usa-width-two-thirds">
      <button aria-expanded={open} className="usa-accordion-button">
        {title} {renderStars(categoryRating.averageRating)}{' '}
        <span className="vads-u-font-weight--normal">
          {averageStars.display}
        </span>
      </button>
      {open && (
        <div>
          Distribution of ratings
          {renderBar('5 star', categoryRating.rated5Count)}
          {renderBar('4 star', categoryRating.rated4Count)}
          {renderBar('3 star', categoryRating.rated3Count)}
          {renderBar('2 star', categoryRating.rated2Count)}
          {renderBar('1 star', categoryRating.rated1Count)}
          {categoryRating.naCount > 0 && (
            <div>
              <i>{categoryRating.naCount} users didn't rate this category</i>
            </div>
          )}
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
