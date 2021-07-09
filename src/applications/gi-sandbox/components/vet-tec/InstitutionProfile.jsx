import React from 'react';
import _ from 'lodash';

import AccordionItem from '../AccordionItem';
import VetTecAdditionalInformation from './VetTecAdditionalInformation';
import VetTecApplicationProcess from './VetTecApplicationProcess';
import VetTecApprovedProgramsList from './VetTecApprovedProgramsList';
import ContactInformation from '../profile/ContactInformation';
import classNames from 'classnames';

import VetTecVeteranPrograms from './VetTecVeteranPrograms';
import VetTecEstimateYourBenefits from '../../containers/VetTecEstimateYourBenefits';
import ProfilePageHeader from '../../containers/ProfilePageHeader';
import VetTecLogo from '../VetTecLogo';

const profileLogo =
  'vads-u-display--block medium-screen:vads-u-display--none vettec-logo-container';

const InstitutionProfile = ({
  institution,
  showModal,
  preSelectedProgram,
  selectedProgram,
}) => {
  const program =
    selectedProgram ||
    preSelectedProgram ||
    _.get(institution, 'programs[0].description', '');

  return (
    <div>
      {
        <div className={profileLogo}>
          <VetTecLogo classNames={classNames('vettec-logo-profile')} />
        </div>
      }
      <ProfilePageHeader institution={institution} />
      <ul className="profile-accordion-list">
        <AccordionItem button="Estimate your benefits">
          <VetTecEstimateYourBenefits
            institution={institution}
            showModal={showModal}
            selectedProgram={program}
            preSelectedProgram={preSelectedProgram}
          />
        </AccordionItem>
        <AccordionItem button="Approved programs">
          <VetTecApprovedProgramsList
            programs={institution.programs}
            selectedProgram={program}
          />
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

export default InstitutionProfile;
