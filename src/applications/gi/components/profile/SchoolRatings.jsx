import React, { useState } from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import { renderStars } from '../../utils/render';
import SchoolCategoryRating from './SchoolCategoryRating';

export default function SchoolRatings({
  ratingAverage,
  ratingCount,
  institutionCategoryRatings,
}) {
  const [openName, setOpenName] = useState('');
  const stars = convertRatingToStars(ratingAverage);

  const getCategoryRating = categoryName => {
    return institutionCategoryRatings.filter(
      category => category.categoryName === categoryName,
    )[0];
  };

  const openHandler = name => {
    setOpenName(openName === name ? '' : name);
  };

  return (
    <div className="vads-l-grid-container vads-u-padding--0">
      <div className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-font-family--serif">
        {ratingCount} Veterans rated this institution:
      </div>
      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--2 small-screen:vads-l-col--3 xsmall-screen:vads-l-col--6 vads-u-text-align--center">
          <div className="vads-u-font-weight--bold vads-u-font-size--2xl">
            {stars.display}
          </div>
          <div>out of a possible 5 stars</div>
          <div className="vads-u-font-size--lg">
            {renderStars(ratingAverage)}
          </div>
        </div>
      </div>

      <div className="vads-l-row">
        <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12">
          <div className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-font-family--serif vads-u-padding-top--3">
            Education ratings
          </div>

          <div className="vads-u-padding-left--0">
            <SchoolCategoryRating
              title="Overall experience"
              openHandler={openHandler}
              open={
                openName ===
                getCategoryRating('overall_experience').categoryName
              }
              categoryRating={getCategoryRating('overall_experience')}
              description="How was the overall experience at this school? Would Veterans recommend this school to other Veterans or military family members?"
            />
            <SchoolCategoryRating
              title="Quality of classes"
              openHandler={openHandler}
              open={
                openName ===
                getCategoryRating('quality_of_classes').categoryName
              }
              categoryRating={getCategoryRating('quality_of_classes')}
              description="Classes, academic programs, and instruction meet Veteran expectations for a high quality education."
            />
            <SchoolCategoryRating
              title="Online instruction"
              openHandler={openHandler}
              open={
                openName ===
                getCategoryRating('online_instruction').categoryName
              }
              categoryRating={getCategoryRating('online_instruction')}
              description="Online classes are comparable quality to in-person instruction. Technology for virtual classes is easy to use. The school offers helpful tech support for online students."
            />
            <SchoolCategoryRating
              title="Job preparation"
              openHandler={openHandler}
              open={
                openName === getCategoryRating('job_preparation').categoryName
              }
              categoryRating={getCategoryRating('job_preparation')}
              description="Coursework prepares Veterans for the job market. Instructors and school support systems help them find work in their desired fields."
            />
          </div>
        </div>

        <div className="medium-screen:vads-l-col--6 small-screen:vads-l-col--12 xsmall-screen:vads-l-col--12 ">
          <div className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-font-family--serif vads-u-padding-top--3">
            Veteran friendliness
          </div>
          <div className="vads-u-padding-left--0">
            <SchoolCategoryRating
              title="GI Bill support"
              openHandler={openHandler}
              open={
                openName === getCategoryRating('gi_bill_support').categoryName
              }
              categoryRating={getCategoryRating('gi_bill_support')}
              description="It’s easy to use GI Bill education benefits at this school. School officials are helpful if there are challenges processing VA benefits."
            />
            <SchoolCategoryRating
              title="Veteran community"
              openHandler={openHandler}
              open={
                openName === getCategoryRating('veteran_community').categoryName
              }
              categoryRating={getCategoryRating('veteran_community')}
              description="There’s a robust community at the school for Veterans and military-connected students. The school supports and engages Veterans."
            />
            <SchoolCategoryRating
              title="Marketing practices"
              openHandler={openHandler}
              open={
                openName ===
                getCategoryRating('marketing_practices').categoryName
              }
              categoryRating={getCategoryRating('marketing_practices')}
              description="The school provides clear and detailed explanations of admissions requirements, academic programs, and all the associated costs."
            />
          </div>
        </div>
        <div className="vads-u-padding-top--4">
          <span className="vads-u-font-size--h3 vads-u-font-weight--bold">
            About ratings
          </span>
          <p>
            We ask Veterans who have used their education benefits to rate
            schools they’ve attended on a scale of 1 to 5 stars, with 5 stars
            being the best rating.
          </p>
          <span className="vads-u-font-size--h4 vads-u-font-weight--bold">
            How ratings are collected
          </span>
          <p>
            VA works independently to collect ratings from Veterans. We reach
            out to Veterans to provide a rating who have:
          </p>
          <ul>
            <li className="vads-u-margin-y--0">
              Received a Certificate of Eligibility (COE) for benefits
            </li>
            <li className="vads-u-margin-y--0">
              Transferred into or out of a school
            </li>
            <li className="vads-u-margin-y--0">
              Made a change to their program of study, <strong>or</strong>
            </li>
            <li className="vads-u-margin-y--0">
              Completed their degree program Veterans rate schools on a number
              of categories.
            </li>
          </ul>
          <p>
            Those ratings are averaged to calculate the overall school rating.
            If a Veteran doesn’t rate a category, it has no effect on the
            category’s overall score.
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
