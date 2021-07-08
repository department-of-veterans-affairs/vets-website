import React from 'react';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';

export default function Academics({ institution, onShowModal }) {
  /**
   * Renders a learn more label with common props for this component being set
   * @param text
   * @param modal
   * @param ariaLabel
   * @returns {*}
   */
  const renderLearnMore = ({ text, modal, ariaLabel }) =>
    renderLearnMoreLabel({
      text,
      modal,
      ariaLabel,
      showModal: onShowModal,
      component: this,
    });

  const typeOfAccreditation = institution.accredited &&
    institution.accreditationType && (
      <div aria-live="off">
        <strong>
          {renderLearnMore({
            text: 'Type of accreditation',
            modal: 'typeAccreditedAcademics',
            ariaLabel: ariaLabels.learnMore.typeAccredited,
          })}
          :
        </strong>
        &nbsp;
        {institution.accreditationType.toUpperCase()}
      </div>
    );

  const educationOpportunities = (
    <div>
      <h3>Education opportunities</h3>
      <hr />
      {typeOfAccreditation}
    </div>
  );

  return <div>{educationOpportunities}</div>;
}
