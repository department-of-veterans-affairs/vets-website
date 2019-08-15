import React from 'react';

import AccordionItem from '../AccordionItem';
import VetTecAdditionalInformation from './VetTecAdditionalInformation';
import VetTecApplicationProcess from './VetTecApplicationProcess';
import VetTecApprovedPrograms from './VetTecApprovedPrograms';
import VetTecCalculator from './VetTecCalculator';
import VetTecHeadingSummary from './VetTecHeadingSummary';
import VetTecContactInformation from './VetTecContactInformation';
import environment from 'platform/utilities/environment';

const VetTecInstitutionProfile = ({ institution, showModal }) => (
  <div>
    {!environment.isProduction() && (
      <div className="vads-u-display--block small-screen:vads-u-display--none vettec-logo-container">
        <img
          className="vettec-logo"
          src="/img/logo/vet-tec-logo.png"
          alt="Vet Tec Logo"
        />
      </div>
    )}
    <VetTecHeadingSummary institution={institution} showModal={showModal} />
    <div className="usa-accordion">
      <ul>
        <AccordionItem button="Approved programs">
          <VetTecApprovedPrograms institution={institution} />
        </AccordionItem>
        <AccordionItem button="Estimate your benefits">
          <VetTecCalculator showModal={showModal} />
        </AccordionItem>
        <AccordionItem button="Application process">
          <VetTecApplicationProcess />
        </AccordionItem>
        <AccordionItem button="Contact details">
          <VetTecContactInformation institution={institution} />
        </AccordionItem>
        <AccordionItem button="Additional information">
          <VetTecAdditionalInformation
            institution={institution}
            showModal={showModal}
          />
        </AccordionItem>
      </ul>
    </div>
  </div>
);

export default VetTecInstitutionProfile;
