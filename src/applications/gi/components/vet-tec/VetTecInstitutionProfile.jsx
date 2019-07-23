import React from 'react';

import AccordionItem from '../AccordionItem';
import VetTecAdditionalInformation from './VetTecAdditionalInformation';
import VetTecApplicationProcess from './VetTecApplicationProcess';
import VetTecApprovedPrograms from './VetTecApprovedPrograms';
import VetTecCalculator from './VetTecCalculator';
import VetTecHeadingSummary from './VetTecHeadingSummary';
import VetTecContactInformation from './VetTecContactInformation';

const VetTecInstitutionProfile = ({ institution, showModal }) => (
  <div>
    <VetTecHeadingSummary institution={institution} />
    <div className="usa-accordion">
      <ul>
        <AccordionItem button="Approved programs">
          <VetTecApprovedPrograms institution={institution} />
        </AccordionItem>
        <AccordionItem button="Estimate your benefits">
          <VetTecCalculator />
        </AccordionItem>
        <AccordionItem button="Contact us">
          <VetTecContactInformation institution={institution} />
        </AccordionItem>
        <AccordionItem button="Application process">
          <VetTecApplicationProcess />
        </AccordionItem>
        <AccordionItem button="Additional information">
          <VetTecAdditionalInformation
            institution={institution}
            onShowModal={showModal}
          />
        </AccordionItem>
      </ul>
    </div>
  </div>
);

export default VetTecInstitutionProfile;
