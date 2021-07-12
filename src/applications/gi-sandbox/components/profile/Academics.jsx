import React from 'react';
import { ariaLabels } from '../../constants';
import { upperCaseFirstLetterOnly } from '../../utils/helpers';
import LearnMoreLabel from '../LearnMoreLabel';

export default function Academics({ institution, onShowModal }) {
  const accredited = institution.accredited && institution.accreditationType;

  const typeOfAccreditation = (
    <div aria-live="off">
      <strong>
        <LearnMoreLabel
          text={'Accreditation'}
          onClick={() => onShowModal('accreditation')}
          ariaLabel={ariaLabels.learnMore.accreditation}
          buttonId={'accreditation-button'}
        />
        :
      </strong>
      &nbsp;
      {accredited && (
        <>
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
        </>
      )}
      {!accredited && 'None'}
    </div>
  );

  const militaryTrainingCredit = (
    <div aria-live="off">
      <strong>
        <LearnMoreLabel
          text={'Credit for military training'}
          onClick={() => onShowModal('creditTraining')}
          ariaLabel={ariaLabels.learnMore.militaryTrainingCredit}
          buttonId={'creditTraining-button'}
        />
        :
      </strong>
      &nbsp;
      {institution.creditForMilTraining ? 'Yes' : 'No'}
    </div>
  );

  const independentStudy = (
    <div aria-live="off">
      <strong>
        <LearnMoreLabel
          text={'Independent study'}
          onClick={() => onShowModal('independentStudy')}
          ariaLabel={ariaLabels.learnMore.independentStudy}
          buttonId={'independentStudy-button'}
        />
        :
      </strong>
      &nbsp;
      {institution.independentStudy ? 'Yes' : 'No'}
    </div>
  );

  const priorityEnrollment = (
    <div aria-live="off">
      <strong>
        <LearnMoreLabel
          text={'Priority Enrollment'}
          onClick={() => onShowModal('priorityEnrollment')}
          ariaLabel={ariaLabels.learnMore.priorityEnrollment}
        />
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
