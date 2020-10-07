import React from 'react';
import { convertRatingToStars } from '../../utils/helpers';
import { renderStars } from '../../utils/render';
import SchoolCategoryRating from './SchoolCategoryRating';

export default function SchoolRatings({
  ratingAverage,
  ratingCount,
  institutionCategoryRatings,
}) {
  const stars = convertRatingToStars(ratingAverage);

  const getCategoryRating = categoryName => {
    return institutionCategoryRatings.filter(
      category => category.categoryName === categoryName,
    )[0];
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
        <div className="medium-screen:vads-l-col--6">
          <div className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-font-family--serif vads-u-padding-top--3">
            Education ratings
          </div>

          <div className="usa-grid vads-u-padding-left--0">
            <SchoolCategoryRating
              title="Overall experience"
              categoryRating={getCategoryRating('overall_experience')}
              description="How was the overall experience at this school? Would Veterans recommend this school to other Veterans or military family members?"
            />
            <SchoolCategoryRating
              title="Quality of classes"
              categoryRating={getCategoryRating('quality_of_classes')}
              description="Classes, academic programs, and instruction meet Veteran expectations for a high quality education."
            />
            <SchoolCategoryRating
              title="Online instruction"
              categoryRating={getCategoryRating('online_instruction')}
              description="Online classes are comparable quality to in-person instruction. Technology for virtual classes is easy to use. The school offers helpful tech support for online students."
            />
            <SchoolCategoryRating
              title="Job preparation"
              categoryRating={getCategoryRating('job_preparation')}
              description="Coursework prepares Veterans for the job market. Instructors and school support systems help them find work in their desired fields."
            />
          </div>
        </div>

        <div className="medium-screen:vads-l-col--6">
          <div className="vads-u-font-weight--bold vads-u-font-size--lg vads-u-font-family--serif vads-u-padding-top--3">
            Veteran friendliness
          </div>
          <div className="usa-grid vads-u-padding-left--0">
            <SchoolCategoryRating
              title="GI Bill support"
              categoryRating={getCategoryRating('gi_bill_support')}
              description="It’s easy to use GI Bill education benefits at this school. School officials are helpful if there are challenges processing VA benefits."
            />
            <SchoolCategoryRating
              title="Veteran community"
              categoryRating={getCategoryRating('veteran_community')}
              description="There’s a robust community at the school for Veterans and military-connected students. The school supports and engages Veterans."
            />
            <SchoolCategoryRating
              title="Marketing practices"
              categoryRating={getCategoryRating('marketing_practices')}
              description="The school provides clear and detailed explanations of admissions requirements, academic programs, and all the associated costs."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
