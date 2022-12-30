/* eslint-disable no-unused-expressions */
import React, { useState } from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import SchoolCategoryRating from './SchoolCategoryRating';
import RatingsStars from '../RatingsStars';
import { aboutRatings } from '../../constants';

export default function SchoolRatings({
  ratingAverage,
  ratingCount,
  institutionCategoryRatings = [],
}) {
  const [openNames, setOpenNames] = useState([]);
  const stars = convertRatingToStars(ratingAverage);

  const renderSchoolCategoryRating = (title, categoryName, description) => {
    const categoryRating = institutionCategoryRatings.find(
      category => category.categoryName === categoryName,
    );
    return categoryRating ? (
      <SchoolCategoryRating
        title={title}
        openHandler={() => {
          let newOpenNames = [...openNames];

          if (newOpenNames.includes(categoryName)) {
            newOpenNames = newOpenNames.filter(item => item !== categoryName);
          } else {
            newOpenNames.push(categoryName);
          }

          setOpenNames(newOpenNames);
        }}
        open={openNames.includes(categoryName)}
        categoryRating={categoryRating}
        description={description}
      />
    ) : null;
  };

  const showAboutRatings = () => {
    const bottomLine = <hr className="vads-u-margin-top--neg1px" />;
    const tabIndexCount = 0;
    return aboutRatings.map(value => {
      let result;
      if (value.isDiv) {
        value.addBottomLine
          ? (result = (
              <>
                <div tabIndex={tabIndexCount} className={value.classes}>
                  {value.text}
                </div>
                {bottomLine}
              </>
            ))
          : (result = (
              <div tabIndex={tabIndexCount} className={value.classes}>
                {value.text}
              </div>
            ));
      }
      if (value.isParagraph) {
        value.addBottomLine
          ? (result = (
              <>
                <p tabIndex={tabIndexCount} className="">
                  {value.text}
                </p>
                {bottomLine}
              </>
            ))
          : (result = (
              <p tabIndex={tabIndexCount} className="">
                {value.text}
              </p>
            ));
      }
      if (value.isSpan) {
        value.addBottomLine
          ? (result = (
              <>
                <span tabIndex={tabIndexCount} className={value.classes}>
                  {value.text}
                </span>
                {bottomLine}
              </>
            ))
          : (result = (
              <span tabIndex={tabIndexCount} className={value.classes}>
                {value.text}
              </span>
            ));
      }
      if (value.isUL) {
        value.addBottomLine
          ? (result = (
              <>
                <ul className="">
                  {value.listBullets.map((bullet, index) => {
                    return (
                      <li tabIndex={tabIndexCount} key={index}>
                        {bullet}
                      </li>
                    );
                  })}
                </ul>
                {bottomLine}
              </>
            ))
          : (result = (
              <ul className="">
                {value.listBullets.map((bullet, index) => {
                  return (
                    <li tabIndex={tabIndexCount} key={index}>
                      {bullet}
                    </li>
                  );
                })}
              </ul>
            ));
      }
      return result;
    });
  };

  return (
    <div className="school-ratings vads-l-grid-container vads-u-padding--0 small-screen-font">
      <div className="ratings-heading">
        <div className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif small-screen-font">
          {ratingCount} Veterans rated this institution:
        </div>
        <div className="vads-l-row">
          <div className="vads-u-display--inline-block vads-u-text-align--center main-rating">
            <div className="vads-u-font-weight--bold vads-u-font-size--2xl">
              {stars.display}
            </div>
            <div>out of a possible 4 stars</div>
            <div className="vads-u-font-size--lg">
              <RatingsStars rating={ratingAverage} />
            </div>
          </div>
        </div>
      </div>
      <div className="vads-l-row">
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12 ">
            <div className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings small-screen-font">
              Quality of Learning Experience
            </div>
            <div className="vads-u-padding-left--0">
              {renderSchoolCategoryRating(
                'Quality of Classes',
                'quality_of_classes',
                'Instructors’ knowledge in the subject being taught.',
              )}
            </div>
          </div>
          <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12 ">
            <div className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings small-screen-font">
              Veteran Community
            </div>
            <div className="vads-u-padding-left--0">
              {renderSchoolCategoryRating(
                'Veteran Community',
                'veteran_community',
                'Extent of school’s support for its Veteran community',
              )}
            </div>
          </div>
        </div>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12">
            <div
              className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings"
              small-screen-font
            >
              GI Bill Support
            </div>
            <div className="vads-u-padding-left--0">
              {renderSchoolCategoryRating(
                'GI Bill Support',
                'gi_bill_support',
                'Did you interact with the School Certifying Officials (school staff who assist Veterans/beneficiaries with enrollment, submit documentation to VA, advise on other VA benefits)?',
              )}
            </div>
          </div>
          <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12 ">
            <div className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings small-screen-font">
              Overall Experience
            </div>
            <div className="vads-u-padding-left--0">
              {renderSchoolCategoryRating(
                'Overall Experience',
                'overall_experience',
                'Overall learning experience',
              )}
            </div>
          </div>
        </div>
        <div className="vads-u-padding-top--4 about-ratings">
          {showAboutRatings()}
        </div>
      </div>
    </div>
  );
}
