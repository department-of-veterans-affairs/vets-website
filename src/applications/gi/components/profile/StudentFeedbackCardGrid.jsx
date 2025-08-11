import React from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function StudentFeedbackCardGrid({
  pageCards,
  isSmallScreen,
  currentPage,
  totalPages,
  onPageSelect,
}) {
  return (
    <>
      <div className="vads-l-row vads-u-flex--wrap vads-u-margin-x--neg1">
        {pageCards.map(card => {
          return (
            <div
              key={card.id}
              className="vads-l-col--12 medium-screen:vads-l-col--6 vads-u-margin-bottom--3 vads-u-padding-x--1"
            >
              <va-card
                style={{
                  backgroundColor: 'rgb(240, 240, 240)',
                  ...(isSmallScreen ? {} : { minHeight: '420px' }),
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-height--full">
                  <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
                    {card.label}
                  </h3>

                  {card.coCategories.length > 0 && (
                    <div className="vads-u-display--flex vads-u-flex-wrap--wrap vads-u-margin-bottom--2">
                      {card.coCategories.map(cat => (
                        <span
                          key={`${card.id}-${cat}`}
                          className="usa-label vads-u-color--white vads-u-margin-right--1 vads-u-margin-bottom--1"
                        >
                          {cat.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {card.definition && (
                    <p className="vads-u-margin-top--1 vads-u-margin-bottom--3">
                      {card.definition}
                    </p>
                  )}

                  <div className="vads-u-margin-top--auto">
                    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-bottom--1">
                      <span className="vads-u-font-weight--bold">
                        Complaint Year
                      </span>
                      <span className="vads-u-font-weight--bold">
                        {card.year}
                      </span>
                    </div>

                    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-bottom--1">
                      <span className="vads-u-font-weight--bold">
                        Total complaints for the year:
                      </span>
                      <span className="vads-u-font-weight--bold">
                        {card.totalYear}
                      </span>
                    </div>

                    <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-margin-bottom--1">
                      <span className="vads-u-font-weight--bold">
                        Complaints at this Campus:
                      </span>
                      <span className="vads-u-font-weight--bold">
                        {card.campusCount}
                      </span>
                    </div>

                    <div className="vads-u-display--flex vads-u-justify-content--space-between">
                      <span className="vads-u-font-weight--bold">
                        Complaints at all Campuses:
                      </span>
                      <span className="vads-u-font-weight--bold">
                        {card.allCampusCount}
                      </span>
                    </div>
                  </div>
                </div>
              </va-card>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <VaPagination
          uswds
          page={currentPage}
          pages={totalPages}
          onPageSelect={e => onPageSelect(e.detail.page)}
          class="vads-u-margin-top--4"
        />
      )}
    </>
  );
}

// allFacilityCodeComplaints;
// [
//   {
//     ope: '01072795',
//     ope6: '10727',
//     closed: '2020-04-17',
//     facilityCode: '21376032',
//     categories: ['other'],
//   },
//   {
//     ope: '01072795',
//     ope6: '10727',
//     closed: '2022-04-19',
//     facilityCode: '21376032',
//     categories: ['other'],
//   },
// ];
/// /////////////////////////////////////
