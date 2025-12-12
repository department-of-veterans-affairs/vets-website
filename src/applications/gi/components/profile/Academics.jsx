import React from 'react';
import PropTypes from 'prop-types';
import { ariaLabels } from '../../constants';
import LearnMoreLabel from '../LearnMoreLabel';

export default function Academics({ institution, onShowModal }) {
  const { accredited } = institution;
  const { accreditationType } = institution;

  const typeOfAccreditation = (
    <div aria-live="off">
      {accredited && (
        <>
          {accreditationType ? (
            <strong>
              <LearnMoreLabel
                bold
                text="Accreditation"
                onClick={() => {
                  onShowModal('accreditation');
                }}
                ariaLabel={ariaLabels.learnMore.accreditation}
                buttonId="accreditation-button"
                buttonClassName="small-screen-font"
              />
              : Yes
            </strong>
          ) : (
            <>
              <span className="vads-u-font-weight--bold">Accreditation</span>:
              Yes
            </>
          )}
        </>
      )}
      {accredited &&
        institution.cross && (
          <>
            {' '}
            (
            <a
              href={`http://nces.ed.gov/collegenavigator/?id=${
                institution.cross
              }#accred`}
              target="_blank"
              rel="noopener noreferrer"
              id="see-accreditors"
            >
              See accreditors
            </a>
            )
          </>
        )}
      {!accredited &&
        !accreditationType && (
          <>
            <span className="vads-u-font-weight--bold">Accreditation</span>:
            None
          </>
        )}
    </div>
  );

  const militaryTrainingCredit = (
    <div aria-live="off">
      <strong>
        <LearnMoreLabel
          bold
          text="Credit for military training"
          onClick={() => {
            onShowModal('militaryTrainingCredit');
          }}
          ariaLabel={ariaLabels.learnMore.militaryTrainingCredit}
          buttonId="creditTraining-button"
          buttonClassName="small-screen-font"
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
          bold
          text="Independent study"
          onClick={() => {
            onShowModal('independentStudy');
          }}
          ariaLabel={ariaLabels.learnMore.independentStudy}
          buttonId="independentStudy-button"
          buttonClassName="small-screen-font"
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
          bold
          text="Priority Enrollment"
          onClick={() => {
            onShowModal('priorityEnrollment');
          }}
          ariaLabel={ariaLabels.learnMore.priorityEnrollment}
          buttonClassName="small-screen-font"
          buttonId="priority-enrollment-learn-more"
        />
        :
      </strong>
      &nbsp;
      {institution.priorityEnrollment ? 'Yes' : 'No'}
    </div>
  );

  const educationDetails = (
    <div className="small-screen-font">
      <h3 className="small-screen-font">Education details</h3>
      <hr />
      {typeOfAccreditation}
      {militaryTrainingCredit}
      {independentStudy}
      {priorityEnrollment}
    </div>
  );

  const careerScope = (
    <div className="small-screen-font">
      <h3 className="small-screen-font">Looking for career options?</h3>
      <hr />
      <p>
        The O*NET Interest Profiler career assessment tool lets you explore
        options that match your interests.
      </p>
      <p>
        <a
          href="https://www.va.gov/resources/onet-interest-profiler-career-assessment/"
          target="_blank"
          rel="noopener noreferrer"
          className="vads-c-action-link--blue"
          id="get-started-with-onet"
        >
          Get started with the O*NET Interest Profiler
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
Academics.propTypes = {
  institution: PropTypes.object,
  onShowModal: PropTypes.func,
};
