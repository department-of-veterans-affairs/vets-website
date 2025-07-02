import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollAndFocus } from 'platform/utilities/scroll';

import { DEPENDENT_CHOICES } from '../constants';
import { maskID, getFullName } from '../../shared/utils';

export const DependentsInformation = ({
  data = {},
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [showError, setShowError] = useState(false);

  const handlers = {
    onValueChange: ({ detail }) => {
      setFormData({
        ...data,
        hasDependentsStatusChanged: detail.value,
      });
      setShowError(false);
    },
    onSubmit: () => {
      if (!data.hasDependentsStatusChanged) {
        scrollAndFocus('va-radio');
        setShowError(true);
        return;
      }
      goForward(data);
    },
    goBack: () => {
      goToPath('/veteran-contact-information', { force: true });
    },
  };

  const dependents = Array.isArray(data.dependents) ? data.dependents : [];

  return (
    <>
      <h3>Dependents on your VA benefits</h3>
      {dependents.length > 0 ? (
        dependents.map((dep = {}, index) => (
          <div className="vads-u-margin-bottom--2" key={index}>
            <va-card>
              <h4 className="vads-u-font-size--h4 vads-u-margin-top--0">
                {getFullName(dep.fullName)}
              </h4>
              <dl>
                <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                  <dt>Relationship:&nbsp;</dt>
                  <dd>{dep.relationship}</dd>
                </div>
                <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                  <dt>Date of birth:&nbsp;</dt>
                  <dd>{dep.dob}</dd>
                </div>
                {dep.age && (
                  <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                    <dt>Age:&nbsp;</dt>
                    <dd
                      className="dd-privacy-mask"
                      data-dd-action-name="Dependent's age"
                    >
                      {dep.age} years old
                    </dd>
                  </div>
                )}
                <div className="item vads-u-display--flex vads-u-justify-content--start vads-u-margin-bottom--1">
                  <dt>SSN:&nbsp;</dt>
                  <dd
                    className="dd-privacy-mask"
                    data-dd-action-name="Dependent's SSN"
                  >
                    {maskID(dep.ssnLastFour)}
                  </dd>
                </div>
                {dep.removalDate && (
                  <div className="removal-date vads-u-margin-top--2">
                    <dt className="vads-u-display--inline-block vads-u-width--auto">
                      <strong>Automatic removal date:&nbsp;</strong>
                    </dt>
                    <dd className="vads-u-display--inline-block vads-u-width--auto">
                      <span
                        className="dd-privacy-mask"
                        data-dd-action-name="Dependent's removal date"
                      >
                        {dep.removalDate}
                      </span>
                    </dd>
                    <dd className="vads-u-margin-top--1">
                      <va-alert status="info" background-only visible>
                        <strong>Note:</strong> If no other action is taken, this
                        dependent will be removed automatically when they turn
                        18, which may reduce the amount you receive each month.
                        Ifthis child is continuing education, they need to be
                        added back to your benefits.{' '}
                        <va-link
                          href="/exit-form"
                          text="Learn about how to add a dependent"
                        />
                      </va-alert>
                    </dd>
                  </div>
                )}
              </dl>
            </va-card>
          </div>
        ))
      ) : (
        <strong>No dependents found</strong>
      )}
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
      {/* Values and labels are flipped as 21-0538 form asks a differently worded question, which allows pdf mapping to be more intuitive */}
      <VaRadio
        label="Is your dependent information correct?"
        required
        onVaValueChange={handlers.onValueChange}
        label-header-level="3"
        class="vads-u-margin-top--2"
        error={showError ? 'Select an option' : null}
      >
        <va-radio-option
          name="hasDependentsStatusChanged"
          value="N"
          label={DEPENDENT_CHOICES.Y}
          tile
          checked={data.hasDependentsStatusChanged === 'N'}
        />
        <va-radio-option
          name="hasDependentsStatusChanged"
          value="Y"
          label={DEPENDENT_CHOICES.N}
          tile
          checked={data.hasDependentsStatusChanged === 'Y'}
        />
      </VaRadio>

      <p className="vads-u-margin-top--4" />
      {contentBeforeButtons}
      <FormNavButtons
        goBack={handlers.goBack}
        goForward={handlers.onSubmit}
        submitToContinue
      />
      {contentAfterButtons}
    </>
  );
};

DependentsInformation.propTypes = {
  contentAfterButtons: PropTypes.node.isRequired,
  contentBeforeButtons: PropTypes.node.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,

  data: PropTypes.shape({
    dependents: PropTypes.arrayOf(
      PropTypes.shape({
        fullName: PropTypes.shape({
          first: PropTypes.string,
          middle: PropTypes.string,
          last: PropTypes.string,
        }),
        relationship: PropTypes.string,
        dob: PropTypes.string,
        age: PropTypes.number,
        ssnLastFour: PropTypes.string,
        removalDate: PropTypes.string,
      }),
    ),
    hasDependentsStatusChanged: PropTypes.string,
  }),
};
