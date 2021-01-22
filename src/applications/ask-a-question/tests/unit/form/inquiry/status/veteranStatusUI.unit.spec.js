import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import {
  getLabelText,
  getRadioOption,
  getText,
} from '../../../helpers/queryHelper';
import { veteranStatusUI } from '../../../../../form/inquiry/status/veteranStatusUI';
import formConfig from '../../../../../form/form';
import InquiryPage from '../../../../../form/inquiry/inquiryPage';

function expectRelationshipToVeteranToBeRequired(wrapper) {
  getLabelText(
    wrapper,
    veteranStatusUI.relationshipToVeteran['ui:title'],
    'veteranStatus',
  ).shouldBeRequired();
}

function expectVeteranIsDeceasedToBeRequired(wrapper) {
  getText(
    wrapper,
    veteranStatusUI.veteranIsDeceased['ui:title'],
    'veteranStatus',
  ).shouldBeRequired();
}

function changeVeteranStatus(wrapper, value) {
  getLabelText(wrapper, veteranStatusUI.veteranStatus['ui:title']).change(
    value,
  );
}

function changeDropdownValue(wrapper, dropdown, value) {
  fireEvent.change(dropdown, { target: { value } });

  const expectOptionToBeSelected = option => wrapper.getByDisplayValue(option);

  expectOptionToBeSelected(value);
}

describe('Veteran Status UI', () => {
  let wrapper;
  const queryDateOfDeath = () => wrapper.queryByText(/date of death/i);
  const queryIsDeceased = () =>
    wrapper.queryByText(/Is the Veteran deceased\?/i);

  beforeEach(() => {
    wrapper = render(
      <DefinitionTester
        schema={InquiryPage.schema}
        uiSchema={InquiryPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          topic: {
            levelOne: null,
            levelTwo: null,
          },
          veteranStatus: {
            veteranStatus: null,
          },
        }}
      />,
    );
  });

  afterEach(() => {
    wrapper && wrapper.unmount();
  });

  describe('when the veteran status is not general or vet', () => {
    ['behalf of vet', 'dependent'].forEach(veteranStatus => {
      describe(veteranStatus, () => {
        beforeEach(() => {
          changeVeteranStatus(wrapper, veteranStatus);
        });

        it('should require relationship to veteran', () => {
          expectRelationshipToVeteranToBeRequired(wrapper);
        });

        describe('deceased fields', () => {
          describe('when relation to veteran is Veteran', () => {
            it('should not show the deceased field', () => {
              const relationship = wrapper.getByLabelText(
                /relationship to the veteran/i,
              );

              changeDropdownValue(wrapper, relationship, 'Veteran');

              expect(queryIsDeceased()).to.be.null;
            });

            it('should not require the deceased field', () => {
              // Q: Why are we not testing this through the UI?
              // A: if the field is required, its not visible in any way to the user
              //    and it just stops the form from going to the next chapter.
              //    In these tests, we don't know how to test that you go to the next chapter.

              const {
                'ui:required': isVeteranDeceasedRequired,
              } = InquiryPage.uiSchema.veteranStatus.veteranIsDeceased;

              const formState = {
                veteranStatus: {
                  veteranStatus,
                  relationshipToVeteran: 'Veteran',
                },
              };

              expect(isVeteranDeceasedRequired(formState)).to.equal(false);
            });

            it('should hide the date of death after selecting relationship=Veteran', () => {
              expectVeteranIsDeceasedToBeRequired(wrapper);

              getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

              expect(queryDateOfDeath()).to.not.be.null;

              const relationship = wrapper.getByLabelText(
                /relationship to the veteran/i,
              );

              changeDropdownValue(wrapper, relationship, 'Veteran');

              expect(queryDateOfDeath()).to.be.null;
            });
          });
        });

        it('should not display date of death when veteran is not deceased', () => {
          expectVeteranIsDeceasedToBeRequired(wrapper);

          getRadioOption(wrapper, 'No', 'veteranIsDeceased').click();

          expect(queryDateOfDeath()).to.be.null;
        });

        it('should display date of death when veteran is deceased', () => {
          expectVeteranIsDeceasedToBeRequired(wrapper);

          getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

          expect(queryDateOfDeath()).not.to.be.null;
        });
      });
    });
  });

  describe('when the veteran status is general or vet', () => {
    ['vet', 'general'].forEach(veteranStatus => {
      describe(veteranStatus, () => {
        it('should not show is deceased field', () => {
          changeVeteranStatus(wrapper, veteranStatus);

          expect(queryIsDeceased()).to.be.null;
        });
      });
    });
  });

  describe('when veteran status is behalf of vet', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'behalf of vet');
    });

    it('should NOT have are you the dependent', () => {
      expect(wrapper.queryByText('Are you the dependent?')).not.to.exist;
    });
  });

  describe('when veteran status is dependent', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'dependent');
    });

    it('should require are you the dependent', () => {
      const isDependent = wrapper.getByText(
        veteranStatusUI.isDependent['ui:title'],
        { exact: false },
      );

      expect(isDependent).to.contain.text('Required');
    });
  });
});
