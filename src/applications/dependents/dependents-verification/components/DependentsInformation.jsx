import React from 'react';
import { srSubstitute } from '~/platform/forms-system/src/js/utilities/ui/mask-string';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';

const maskSSN = ssnLastFour =>
  srSubstitute(
    `●●●–●●-${ssnLastFour}`,
    `ending with ${ssnLastFour.split('').join(' ')}`,
  );

const dependents = [
  {
    fullName: 'Morty Smith',
    relationship: 'Child',
    dob: 'January 4, 2011',
    ssnLastFour: '6789',
  },
  {
    fullName: 'Summer Smith',
    relationship: 'Child',
    dob: 'August 1, 2008',
    ssnLastFour: '6789',
    age: 17,
    removalDate: 'August 1, 2026',
  },
];

const DependentsInformation = () => {
  return (
    <>
      <h3>Dependents on your VA benefits</h3>

      {dependents.map((dep, index) => (
        <div className="vads-u-margin-bottom--2" key={index}>
          <va-card>
            <h4 className="vads-u-font-size--h4 vads-u-margin-top--0">
              {dep.fullName}
            </h4>
            <div>Relationship: {dep.relationship}</div>
            <div>Date of birth: {dep.dob}</div>
            {dep.age && <div>Age: {dep.age} years old</div>}
            <div>
              SSN:{' '}
              <span
                className="dd-privacy-mask"
                data-dd-action-name="Dependent's SSN"
              >
                {maskSSN(dep.ssnLastFour)}
              </span>
            </div>
            {dep.removalDate && (
              <>
                <p>
                  <strong>Automatic removal date:</strong> {dep.removalDate}
                </p>
                <va-alert status="info" background-only visible>
                  <p>
                    <strong>Note:</strong> If no other action is taken, this
                    dependent will be removed automatically when they turn 18,
                    which may reduce the amount you receive each month. If this
                    child is continuing education, they need to be added back to
                    your benefits.{' '}
                    <va-link
                      href="https://www.va.gov/view-change-dependents/add-dependent/"
                      text="Learn about how to add a student"
                    />
                  </p>
                </va-alert>
              </>
            )}
          </va-card>
        </div>
      ))}

      <p>
        <strong>Note:</strong> To protect your personal information, we don’t
        allow online changes to your dependents’ names, dates of birth, or
        Social Security numbers. If you need to change this information, call us
        at <va-telephone contact={CONTACTS.VA_BENEFITS} /> (
        <va-telephone tty contact="711" />
        ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m.{' '}
        <dfn>
          <abbr title="Eastern Time">ET</abbr>
        </dfn>
        .
      </p>

      <va-link
        href="/resources/how-to-change-your-dependents-name/"
        external
        text="Find more detailed instructions for how to change your dependents’ name"
      />
    </>
  );
};

const DependentsInformationReview = _data => {
  // console.log(_data);
  return <div>test</div>;
};

export { DependentsInformation, DependentsInformationReview };
