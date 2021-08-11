import React, { useState } from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import SchoolCategoryRating from './SchoolCategoryRating';
import RatingsStars from '../RatingsStars';

export default function SchoolRatings({
  ratingAverage,
  ratingCount,
  institutionCategoryRatings = [],
}) {
  const [openNames, setOpenNames] = useState({
    educationRatings: '',
    veteranFriendliness: '',
  });
  const stars = convertRatingToStars(ratingAverage);

  const renderSchoolCategoryRating = (
    title,
    categoryName,
    description,
    groupName,
  ) => {
    const categoryRating = institutionCategoryRatings.find(
      category => category.categoryName === categoryName,
    );
    return categoryRating ? (
      <SchoolCategoryRating
        title={title}
        openHandler={() => {
          const newOpenNames = {
            ...openNames,
            [groupName]:
              openNames[groupName] === categoryName ? '' : categoryName,
          };

          setOpenNames(newOpenNames);
        }}
        open={openNames[groupName] === categoryName}
        categoryRating={categoryRating}
        description={description}
      />
    ) : null;
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
            <div>out of a possible 5 stars</div>
            <div className="vads-u-font-size--lg">
              <RatingsStars rating={ratingAverage} />
            </div>
          </div>
        </div>
      </div>

      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12">
          <div
            className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings"
            small-screen-font
          >
            Education ratings
          </div>

          <div className="vads-u-padding-left--0">
            {renderSchoolCategoryRating(
              'Overall experience',
              'overall_experience',
              'How was the overall experience at this school? Would Veterans recommend this school to other Veterans or military family members?',
              'educationRatings',
            )}
            {renderSchoolCategoryRating(
              'Quality of classes',
              'quality_of_classes',
              'Classes, academic programs, and instruction meet Veteran expectations for a high quality education.',
              'educationRatings',
            )}
            {renderSchoolCategoryRating(
              'Online instruction',
              'online_instruction',
              'Online classes are comparable quality to in-person instruction. Technology for virtual classes is easy to use. The school offers helpful tech support for online students.',
              'educationRatings',
            )}
            {renderSchoolCategoryRating(
              'Job preparation',
              'job_preparation',
              'Coursework prepares Veterans for the job market. Instructors and school support systems help them find work in their desired fields.',
              'educationRatings',
            )}
          </div>
        </div>

        <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12 ">
          <div className="vads-u-font-weight--bold small-screen:vads-u-font-size--lg vads-u-font-family--serif category-ratings-accordion-headings small-screen-font">
            Veteran friendliness
          </div>
          <div className="vads-u-padding-left--0">
            {renderSchoolCategoryRating(
              'GI Bill support',
              'gi_bill_support',
              'It’s easy to use GI Bill education benefits at this school. School officials are helpful if there are challenges processing VA benefits.',
              'veteranFriendliness',
            )}
            {renderSchoolCategoryRating(
              'Veteran community',
              'veteran_community',
              'There’s a robust community at the school for Veterans and military-connected students. The school supports and engages Veterans.',
              'veteranFriendliness',
            )}
            {renderSchoolCategoryRating(
              'True to expectations',
              'marketing_practices',
              'The school provides clear and detailed explanations of admissions requirements, academic programs, and all the associated costs.',
              'veteranFriendliness',
            )}
          </div>
        </div>
        <div className="vads-u-padding-top--4 about-ratings">
          <div className="small-screen:vads-u-font-size--h3 vads-u-padding-bottom--1p5 vads-u-font-weight--bold vads-u-font-family--serif small-screen-font">
            About ratings
          </div>
          <hr className="vads-u-margin-top--neg1px" />
          <p>
            We ask Veterans who have used their education benefits to rate
            schools they’ve attended on a scale of 1 to 5 stars, with 5 stars
            being the best rating.
          </p>
          <span className="small-screen:vads-u-font-size--h4 vads-u-font-weight--bold small-screen-font">
            How ratings are collected
          </span>
          <p>
            VA works independently to collect ratings from Veterans. We reach
            out to Veterans to provide a rating who have:
          </p>
          <ul>
            <li>Received a Certificate of Eligibility (COE) for benefits</li>
            <li>Transferred into or out of a school</li>
            <li>
              Made a change to their program of study, <strong>or</strong>
            </li>
            <li>Completed their degree program</li>
          </ul>
          <p>
            Veterans rate schools on a number of categories. Those ratings are
            averaged to calculate the overall school rating. If a Veteran
            doesn’t rate a category, it has no effect on the category’s overall
            score.
          </p>
          <span className="vads-u-font-size--h4 vads-u-font-weight--bold">
            Veteran privacy
          </span>
          <p>
            A school may ask us for a list of Veterans who rated their school,
            but we do not share individual ratings with schools. If an
            institution asks us for information on who rated their school, no
            information beyond what is publicly available on the Comparison Tool
            is shared with them that would tie an individual to their ratings.
          </p>
        </div>
      </div>
    </div>
  );
}
