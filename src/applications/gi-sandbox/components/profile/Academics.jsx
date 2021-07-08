import React from 'react';
import { renderLearnMoreLabel } from '../../utils/render';
import { ariaLabels } from '../../constants';
import { upperCaseFirstLetterOnly } from '../../utils/helpers';

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
            text: 'Accreditation',
            modal: 'accreditation',
            ariaLabel: ariaLabels.learnMore.accreditation,
          })}
          :
        </strong>
        &nbsp;
        {upperCaseFirstLetterOnly(institution.accreditationType)} (
        <a
          href={`http://nces.ed.gov/collegenavigator/?id=${
            institution.cross
          }#accred`}
          target="_blank"
          rel="noopener noreferrer"
        >
          See accreditors
        </a>
        )
      </div>
    );

  const educationDetails = (
    <div>
      <h3>Education details</h3>
      <hr />
      {typeOfAccreditation}
    </div>
  );

  return <div>{educationDetails}</div>;
}
