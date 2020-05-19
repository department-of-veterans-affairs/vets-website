import React from 'react';

import AccordionItem from '../AccordionItem';
import VetTecAdditionalInformation from './VetTecAdditionalInformation';
import VetTecApplicationProcess from './VetTecApplicationProcess';
import VetTecApprovedPrograms from './VetTecApprovedPrograms';
import VetTecApprovedProgramsList from './VetTecApprovedProgramsList';
import VetTecCalculator from './VetTecCalculator';
import VetTecHeadingSummary from './VetTecHeadingSummary';
import ContactInformation from '../profile/ContactInformation';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';

import VetTecVeteranPrograms from './VetTecVeteranPrograms';
import VetTecEstimateYourBenefits from '../../containers/VetTecEstimateYourBenefits';

const profileLogo =
  'vads-u-display--block medium-screen:vads-u-display--none vettec-logo-container';

const VetTecInstitutionProfile = ({
  institution,
  showModal,
  preSelectedProgram,
  gibctEstimateYourBenefits,
  selectedProgram,
}) => {
  const program = selectedProgram || preSelectedProgram;
  return (
    <div>
      {
        <div className={profileLogo}>
          {renderVetTecLogo(classNames('vettec-logo-profile'))}
        </div>
      }
      <VetTecHeadingSummary institution={institution} showModal={showModal} />
      <ul className="profile-accordion-list">
        <AccordionItem button="Approved programs">
          {gibctEstimateYourBenefits ? (
            <VetTecApprovedProgramsList
              institution={institution}
              selectedProgram={program}
            />
          ) : (
            <VetTecApprovedPrograms
              institution={institution}
              preSelectedProgram={preSelectedProgram}
            />
          )}
        </AccordionItem>
        <AccordionItem button="Estimate your benefits">
          {gibctEstimateYourBenefits ? (
            <VetTecEstimateYourBenefits
              institution={institution}
              showModal={showModal}
              preSelectedProgram={preSelectedProgram}
            />
          ) : (
            <VetTecCalculator showModal={showModal} />
          )}
        </AccordionItem>
        <AccordionItem button="Veteran programs">
          <VetTecVeteranPrograms
            institution={institution}
            onShowModal={showModal}
          />
        </AccordionItem>
        <AccordionItem button="Application process">
          <VetTecApplicationProcess institution={institution} />
        </AccordionItem>
        <AccordionItem button="Contact details">
          <ContactInformation institution={institution} />
        </AccordionItem>
        <AccordionItem button="Additional information">
          <VetTecAdditionalInformation
            institution={institution}
            showModal={showModal}
          />
        </AccordionItem>
      </ul>
    </div>
  );
};

export default VetTecInstitutionProfile;
