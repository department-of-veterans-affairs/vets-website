import React from 'react';

import AccordionItem from '../AccordionItem';
import VetTecAdditionalInformation from './VetTecAdditionalInformation';
import VetTecApplicationProcess from './VetTecApplicationProcess';
import VetTecApprovedPrograms from './VetTecApprovedPrograms';
import VetTecCalculator from './VetTecCalculator';
import VetTecHeadingSummary from './VetTecHeadingSummary';
import VetTecContactInformation from './VetTecContactInformation';
import { renderVetTecLogo } from '../../utils/render';
import classNames from 'classnames';
import environment from 'platform/utilities/environment';
import VetTecVeteranPrograms from './VetTecVeteranPrograms';

const VetTecInstitutionProfile = ({
  institution,
  showModal,
  preSelectedProgram,
}) => (
  <div>
    <div className="vads-u-display--block small-screen:vads-u-display--none vettec-logo-container">
      {renderVetTecLogo(classNames('vettec-logo'))}
    </div>
    <VetTecHeadingSummary institution={institution} showModal={showModal} />
    <div className="usa-accordion">
      <ul>
        <AccordionItem button="Approved programs">
          <VetTecApprovedPrograms
            institution={institution}
            preSelectedProgram={preSelectedProgram}
          />
        </AccordionItem>
        <AccordionItem button="Estimate your benefits">
          <VetTecCalculator showModal={showModal} />
        </AccordionItem>
        {/* Production flag for 19870 */}
        {!environment.isProduction() && (
          <AccordionItem button="Veteran programs">
            <VetTecVeteranPrograms
              institution={institution}
              onShowModal={showModal}
            />
          </AccordionItem>
        )}
        <AccordionItem button="Application process">
          <VetTecApplicationProcess institution={institution} />
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
