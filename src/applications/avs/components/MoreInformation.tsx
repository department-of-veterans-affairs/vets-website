import React from 'react';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ItemsBlock from './ItemsBlock';
import ParagraphBlock from './ParagraphBlock';
import { normalizePhoneNumber, numberIsClickable } from '../utils/phone';
import type { MoreInformationProps, ClinicalService } from '../types';

const MoreInformation: React.FC<MoreInformationProps> = ({ avs }) => {
  const { clinicalServices, clinicsVisited, moreHelpAndInformation } = avs;

  const renderClinicalService = (service: ClinicalService): React.ReactNode => {
    const servicePhone = normalizePhoneNumber(service.phone);
    const phoneNotClickable = !numberIsClickable(servicePhone);

    return (
      <>
        <h4>{service.name}</h4>
        <p>
          Location: {service.location}
          <br />
          Hours of operation: {service.hours}
          <br />
          Phone:{' '}
          <VaTelephone
            contact={servicePhone}
            notClickable={phoneNotClickable}
          />
          <br />
          Comment: {service.comment}
        </p>
      </>
    );
  };

  return (
    <div>
      <ItemsBlock<ClinicalService>
        heading={`Clinical services${
          clinicsVisited[0]?.site ? ` (${clinicsVisited[0].site})` : ''
        }`}
        itemType="clinical-services"
        items={clinicalServices}
        renderItem={renderClinicalService}
      />
      <ParagraphBlock
        heading="More help and information"
        content={moreHelpAndInformation}
        htmlContent
      />
    </div>
  );
};

export default MoreInformation;
