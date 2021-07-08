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

  const typeOfAccreditation = institution.accredited && (
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
      {institution.accreditationType &&
        upperCaseFirstLetterOnly(institution.accreditationType)}{' '}
      (
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

  const militaryTrainingCredit = (
    <div aria-live="off">
      <strong>
        {renderLearnMore({
          text: 'Credit for military training',
          modal: 'creditTraining',
          ariaLabel: ariaLabels.learnMore.militaryTrainingCredit,
        })}
        :
      </strong>
      &nbsp;
      {institution.creditForMilTraining ? 'Yes' : 'No'}
    </div>
  );

  const independentStudy = (
    <div aria-live="off">
      <strong>
        {renderLearnMore({
          text: 'Independent study',
          modal: 'independentStudy',
          ariaLabel: ariaLabels.learnMore.independentStudy,
        })}
        :
      </strong>
      &nbsp;
      {institution.independentStudy ? 'Yes' : 'No'}
    </div>
  );

  const priorityEnrollment = (
    <div aria-live="off">
      <strong>
        {renderLearnMore({
          text: 'Priority Enrollment',
          modal: 'priEnroll',
          ariaLabel: ariaLabels.learnMore.priorityEnrollment,
        })}
        :
      </strong>
      &nbsp;
      {institution.priorityEnrollment ? 'Yes' : 'No'}
    </div>
  );

  const educationDetails = (
    <div>
      <h3>Education details</h3>
      <hr />
      {typeOfAccreditation}
      {militaryTrainingCredit}
      {independentStudy}
      {priorityEnrollment}
    </div>
  );

  const careerScope = (
    <div>
      <h3>Get started with CareerScope</h3>
      <hr />
      <p>
        CareerScope&reg; take career and educational planning to a new level.
        The proven career assessment and reporting system from the Vocational
        Research Institute is a powerful, yet easy-to-use program.
      </p>
      <p>
        <a
          href="https://va.careerscope.net/gibill"
          target="_blank"
          rel="noopener noreferrer"
          className="vads-c-action-link--blue"
        >
          Get started with CareerScope
        </a>
      </p>
    </div>
  );

  return (
    <div>
      {educationDetails}
      <br />
      {careerScope}
    </div>
  );
}
