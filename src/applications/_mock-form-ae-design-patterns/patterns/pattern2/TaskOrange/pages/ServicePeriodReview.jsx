import React from 'react';
import { withRouter } from 'react-router';
import InfoSection from 'applications/_mock-form-ae-design-patterns/shared/components/InfoSection';

const ServicePeriodBase = props => {
  const { data } = props;
  const toursOfDuty = data?.toursOfDuty;
  if (!toursOfDuty) return null;

  return toursOfDuty.map((tour, index) => {
    return (
      <div className="vads-u-margin-top--4" key={index}>
        <InfoSection>
          <InfoSection.SubHeading
            level={3}
            text={`Service Period ${index + 1}`}
            editLink={`#edit-service-period-${index}`}
          />
          <InfoSection.InfoBlock
            label="Branch of service"
            value={tour?.serviceBranch}
          />
          <InfoSection.InfoBlock
            label="Type of service (Active duty, drilling reservist, National Guard, IRR)"
            value={tour?.typeOfService}
          />
          <InfoSection.InfoBlock
            label="Service start date"
            value={tour.dateRange?.from}
          />
          <InfoSection.InfoBlock
            label="Service end date"
            value={tour.dateRange?.to}
          />
          <InfoSection.InfoBlock
            label="Apply this service period to the benefit I’m applying for."
            value={tour?.applyPeriodToSelected ? 'Yes' : null}
          />
        </InfoSection>
      </div>
    );
  });
};

export const ServicePeriodReview = withRouter(ServicePeriodBase);
