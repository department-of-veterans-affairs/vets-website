import React from 'react';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import IconCTALink from '../IconCTALink';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

const EducationAndTraining = ({ isLOA1, rE = recordEvent }) => {
  return (
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-education-and-training"
    >
      <h2 data-testid="education-and-training-section-header">
        Education and training
      </h2>
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          <IconCTALink
            text="Learn how to apply for VA education benefits"
            icon="school"
            href="/education/how-to-apply/"
            testId="apply-education-benefits-from-cta"
            onClick={() =>
              rE({
                event: 'nav-linkslist',
                'links-list-header':
                  'Learn how to apply for VA education benefits',
                'links-list-section-header': 'Education and training',
              })
            }
          />
          {!isLOA1 && (
            <>
              <IconCTALink
                text="Compare GI Bill benefits by school"
                icon="assignment"
                href="/education/gi-bill-comparison-tool"
                testId="compare-gi-benefits-from-cta"
                onClick={() =>
                  rE({
                    event: 'nav-linkslist',
                    'links-list-header': 'Compare GI Bill benefits by school',
                    'links-list-section-header': 'Education and training',
                  })
                }
              />
              <IconCTALink
                text="Check your Post-9/11 GI Bill benefits"
                icon="attach_money"
                href="/education/gi-bill/post-9-11/ch-33-benefit/status"
                testId="check-gi-bill-benefits-from-cta"
                onClick={() =>
                  rE({
                    event: 'nav-linkslist',
                    'links-list-header':
                      'Check your Post-9/11 GI Bill benefits',
                    'links-list-section-header': 'Education and training',
                  })
                }
              />
            </>
          )}
        </DashboardWidgetWrapper>
      </div>
    </div>
  );
};

EducationAndTraining.propTypes = {
  isLOA1: PropTypes.bool,
  rE: PropTypes.func,
};

export default EducationAndTraining;
