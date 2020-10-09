import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
import { veteranServiceInformationUI } from '../../../../config/pages/veteranServiceInformationUI';
import formConfig from '../../../../config/form';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

function expectBranchOfServiceNotToExist(wrapper) {
  expect(
    wrapper.queryByLabelText(
      veteranServiceInformationUI.branchOfService['ui:title'],
      {
        exact: false,
      },
    ),
  ).to.be.null;
}

function expectBranchOfServiceToBeRequired(wrapper) {
  const branchOfService = wrapper.getByLabelText(
    veteranServiceInformationUI.branchOfService['ui:title'],
    {
      exact: false,
    },
  );

  expect(branchOfService).to.have.property('required');
}

function expectRelationshipToVeteranToBeRequired(wrapper) {
  const relationshipToVeteran = wrapper.getByLabelText(
    veteranStatusUI.relationshipToVeteran['ui:title'],
    {
      exact: false,
    },
  );

  expect(relationshipToVeteran).to.have.property('required');
}

function expectVeteranIsDeceasedToBeRequired(wrapper) {
  const veteranIsDeceased = wrapper.getByText(
    veteranStatusUI.veteranIsDeceased['ui:title'],
    {
      exact: false,
    },
  );

  expect(veteranIsDeceased).to.contain.text('Required');
}

function changeVeteranStatus(wrapper, value) {
  const veteranStatus = wrapper.getByLabelText(
    veteranStatusUI.veteranStatus['ui:title'],
    {
      exact: false,
    },
  );

  fireEvent.change(veteranStatus, { target: { value } });
}

function changeRelationshipToVeteran(wrapper, value) {
  const veteranStatus = wrapper.getByLabelText(
    veteranStatusUI.relationshipToVeteran['ui:title'],
    {
      exact: false,
    },
  );

  fireEvent.change(veteranStatus, { target: { value } });
}

function getRadioOption(wrapper, radioName, optionName) {
  const radioByOptionName = wrapper.queryAllByRole('radio', {
    name: optionName,
  });

  return radioByOptionName.find(radioOption =>
    radioOption.name.includes(radioName),
  );
}

function queryByLabelTextAndName(wrapper, labelText, name) {
  const byLabelTexts = wrapper.queryAllByLabelText(labelText, { exact: false });
  return (
    byLabelTexts.find(byLabelText => byLabelText.name.includes(name)) || null
  );
}

const radioButtonClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('Veteran Information Page', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = render(
      <DefinitionTester
        schema={VeteranInformationPage.schema}
        uiSchema={VeteranInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranStatus: {
            veteranStatus: null,
          },
        }}
      />,
    );
  });

  it('should require veteran status', () => {
    const veteranStatus = wrapper.getByLabelText(
      veteranStatusUI.veteranStatus['ui:title'],
      {
        exact: false,
      },
    );

    expect(veteranStatus).to.have.property('required');
  });

  it('should not require any other fields when veteran status is general question', () => {
    changeVeteranStatus(wrapper, 'general');

    expectBranchOfServiceNotToExist(wrapper);
  });

  it('should not show veteran information if veteran status is not myself as a veteran', () => {
    changeVeteranStatus(wrapper, 'general');

    expect(wrapper.queryByLabelText("Veteran's first name", { exact: false }))
      .to.be.null;
    expect(wrapper.queryByLabelText("Veteran's last name", { exact: false })).to
      .be.null;
    expect(wrapper.queryByLabelText('Street address', { exact: false })).to.be
      .null;
    expect(wrapper.queryByLabelText('City', { exact: false })).to.be.null;
    expect(wrapper.queryByLabelText('State', { exact: false })).to.be.null;
    expect(wrapper.queryByLabelText('Country', { exact: false })).to.be.null;
    expect(wrapper.queryByLabelText('Postal code', { exact: false })).to.be
      .null;
    expect(
      wrapper.queryByLabelText('Daytime phone (area code)', { exact: false }),
    ).to.be.null;
    expect(wrapper.queryByLabelText('Email', { exact: false })).to.be.null;
  });

  it('should show optional fields when veteran status is not general question', () => {
    changeVeteranStatus(wrapper, 'vet');

    const { getByText, getByLabelText } = wrapper;

    expect(getByText(veteranServiceInformationUI.dateOfBirth['ui:title'])).not
      .to.be.null;
    expect(
      getByLabelText(
        veteranServiceInformationUI.socialSecurityNumber['ui:title'],
      ),
    ).not.to.be.null;
    expect(
      getByLabelText(veteranServiceInformationUI.serviceNumber['ui:title']),
    ).not.to.be.null;
    expect(getByLabelText(veteranServiceInformationUI.claimNumber['ui:title']))
      .not.to.be.null;
    expect(
      getByText(veteranServiceInformationUI.serviceDateRange.from['ui:title']),
    ).not.to.be.null;
    expect(
      getByText(veteranServiceInformationUI.serviceDateRange.to['ui:title']),
    ).not.to.be.null;
  });

  describe('when on behalf of veteran', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'behalf of vet');
    });

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });

    it('should require relationship to veteran', () => {
      expectRelationshipToVeteranToBeRequired(wrapper);
    });

    it('should display date of death when veteran is deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      const yesOption = getRadioOption(wrapper, 'veteranIsDeceased', 'Yes');

      fireEvent.click(yesOption, radioButtonClick);

      expect(wrapper.queryByText(veteranStatusUI.dateOfDeath['ui:title'])).to
        .not.be.null;
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      const noOption = getRadioOption(wrapper, 'veteranIsDeceased', 'No');

      fireEvent.click(noOption, radioButtonClick);

      expect(wrapper.queryByText(veteranStatusUI.dateOfDeath['ui:title'])).to.be
        .null;
    });

    it('should not show veteran information when relationship to veteran is veteran', () => {
      changeRelationshipToVeteran(wrapper, 'Veteran');

      expect(wrapper.queryByLabelText("Veteran's first name", { exact: false }))
        .to.be.null;
      expect(wrapper.queryByLabelText("Veteran's last name", { exact: false }))
        .to.be.null;
      expect(wrapper.queryByLabelText('Street address', { exact: false })).to.be
        .null;
      expect(wrapper.queryByLabelText('City', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('State', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('Country', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('Postal code', { exact: false })).to.be
        .null;
      expect(
        wrapper.queryByLabelText('Daytime phone (area code)', { exact: false }),
      ).to.be.null;
      expect(wrapper.queryByLabelText('Email', { exact: false })).to.be.null;
    });

    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        wrapper.getByText('Veteran information');

        wrapper.getByLabelText("Veteran's first name", { exact: false });
        wrapper.getByLabelText("Veteran's last name", { exact: false });
        wrapper.getByLabelText('Street address', { exact: false });
        wrapper.getByLabelText('City', { exact: false });
        wrapper.getByLabelText('State', { exact: false });
        wrapper.getByLabelText('Country', { exact: false });
        wrapper.getByLabelText('Postal code', { exact: false });
        wrapper.getByLabelText('Daytime phone (area code)', { exact: false });
        wrapper.getByLabelText('Email', { exact: false });
      });

      it('should require veteran first name, last name, country, and email', () => {
        expect(
          wrapper.getByText("Veteran's first name", { exact: false }),
        ).to.contain.text('Required');
        expect(
          wrapper.getByText("Veteran's last name", { exact: false }),
        ).to.contain.text('Required');
        expect(wrapper.getByText('Country', { exact: false })).to.contain.text(
          'Required',
        );
        expect(wrapper.getByText('Email', { exact: false })).to.contain.text(
          'Required',
        );
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        const yesOption = getRadioOption(wrapper, 'veteranIsDeceased', 'Yes');

        fireEvent.click(yesOption, radioButtonClick);

        wrapper.getByLabelText("Veteran's first name", { exact: false });
        wrapper.getByLabelText("Veteran's last name", { exact: false });

        expect(wrapper.queryByLabelText('Street address', { exact: false })).to
          .be.null;
        expect(wrapper.queryByLabelText('City', { exact: false })).to.be.null;
        expect(wrapper.queryByLabelText('State', { exact: false })).to.be.null;
        expect(wrapper.queryByLabelText('Country', { exact: false })).to.be
          .null;
        expect(wrapper.queryByLabelText('Postal code', { exact: false })).to.be
          .null;
        expect(
          wrapper.queryByLabelText('Daytime phone (area code)', {
            exact: false,
          }),
        ).to.be.null;
        expect(wrapper.queryByLabelText('Email', { exact: false })).to.be.null;
      });
    });
  });

  describe('for myself as veteran', () => {
    beforeEach(() => {
      changeVeteranStatus(wrapper, 'vet');
    });

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });
  });

  describe('for the dependent of a veteran', () => {
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

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });

    it('should require relationship to veteran', () => {
      expectRelationshipToVeteranToBeRequired(wrapper);
    });

    it('should display date of death when veteran is deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      const yesOption = getRadioOption(wrapper, 'veteranIsDeceased', 'Yes');

      fireEvent.click(yesOption, radioButtonClick);

      expect(wrapper.queryByText(veteranStatusUI.dateOfDeath['ui:title'])).to
        .not.be.null;
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      const noOption = getRadioOption(wrapper, 'veteranIsDeceased', 'No');

      fireEvent.click(noOption, radioButtonClick);

      expect(wrapper.queryByText(veteranStatusUI.dateOfDeath['ui:title'])).to.be
        .null;
    });

    it('should not show dependent information if person filling form is dependent', () => {
      const yesOption = getRadioOption(wrapper, 'isDependent', 'Yes');

      fireEvent.click(yesOption, radioButtonClick);

      expect(wrapper.queryByText('Dependent information')).to.be.null;

      expect(
        wrapper.queryByLabelText("Dependent's first name", { exact: false }),
      ).to.be.null;
      expect(
        wrapper.queryByLabelText("Dependent's last name", { exact: false }),
      ).to.be.null;
      expect(wrapper.queryByLabelText('Street address', { exact: false })).to.be
        .null;
      expect(wrapper.queryByLabelText('City', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('State', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('Country', { exact: false })).to.be.null;
      expect(wrapper.queryByLabelText('Postal code', { exact: false })).to.be
        .null;
      expect(
        wrapper.queryByLabelText('Daytime phone (area code)', { exact: false }),
      ).to.be.null;
      expect(wrapper.queryByLabelText('Email', { exact: false })).to.be.null;
    });

    it('should show dependent information if person filling form is not dependent', () => {
      const noOption = getRadioOption(wrapper, 'isDependent', 'No');

      fireEvent.click(noOption, radioButtonClick);

      wrapper.getByText('Dependent information');

      wrapper.getByLabelText("Dependent's first name", { exact: false });
      wrapper.getByLabelText("Dependent's last name", { exact: false });
      wrapper.getByLabelText('Street address', { exact: false });
      wrapper.getByLabelText('City', { exact: false });
      wrapper.getByLabelText('State', { exact: false });
      wrapper.getByLabelText('Country', { exact: false });
      wrapper.getByLabelText('Postal code', { exact: false });
      wrapper.getByLabelText('Daytime phone (area code)', { exact: false });
      wrapper.getByLabelText('Email', { exact: false });
    });

    it('should require dependent first name, last name, country, and email if person filling form is not dependent', () => {
      const noOption = getRadioOption(wrapper, 'isDependent', 'No');

      fireEvent.click(noOption, radioButtonClick);

      expect(
        wrapper.getByText("Dependent's first name", { exact: false }),
      ).to.contain.text('Required');
      expect(
        wrapper.getByText("Dependent's last name", { exact: false }),
      ).to.contain.text('Required');
      expect(wrapper.getByText('Country', { exact: false })).to.contain.text(
        'Required',
      );
      expect(wrapper.getByText('Email', { exact: false })).to.contain.text(
        'Required',
      );
    });
    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        wrapper.getByText('Veteran information');

        wrapper.getByLabelText("Veteran's first name", { exact: false });
        wrapper.getByLabelText("Veteran's last name", { exact: false });
        wrapper.getByLabelText('Street address', { exact: false });
        wrapper.getByLabelText('City', { exact: false });
        wrapper.getByLabelText('State', { exact: false });
        wrapper.getByLabelText('Country', { exact: false });
        wrapper.getByLabelText('Postal code', { exact: false });
        wrapper.getByLabelText('Daytime phone (area code)', { exact: false });
        wrapper.getByLabelText('Email', { exact: false });
      });

      it('should require veteran first name, last name, country, and email', () => {
        expect(
          wrapper.getByText("Veteran's first name", { exact: false }),
        ).to.contain.text('Required');
        expect(
          wrapper.getByText("Veteran's last name", { exact: false }),
        ).to.contain.text('Required');
        expect(wrapper.getByText('Country', { exact: false })).to.contain.text(
          'Required',
        );
        expect(wrapper.getByText('Email', { exact: false })).to.contain.text(
          'Required',
        );
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        const yesOption = getRadioOption(wrapper, 'veteranIsDeceased', 'Yes');

        fireEvent.click(yesOption, radioButtonClick);

        wrapper.getByLabelText("Veteran's first name", { exact: false });
        wrapper.getByLabelText("Veteran's last name", { exact: false });

        expect(wrapper.queryByLabelText('Street address', { exact: false })).to
          .be.null;
        expect(wrapper.queryByLabelText('City', { exact: false })).to.be.null;
        expect(wrapper.queryByLabelText('State', { exact: false })).to.be.null;
        expect(wrapper.queryByLabelText('Country', { exact: false })).to.be
          .null;
        expect(wrapper.queryByLabelText('Postal code', { exact: false })).to.be
          .null;
        expect(
          wrapper.queryByLabelText('Daytime phone (area code)', {
            exact: false,
          }),
        ).to.be.null;
        expect(wrapper.queryByLabelText('Email', { exact: false })).to.be.null;
      });

      it('should not reduce dependent information when veteran is deceased', () => {
        const yesOption = getRadioOption(wrapper, 'veteranIsDeceased', 'Yes');

        fireEvent.click(yesOption, radioButtonClick);

        const noOption = getRadioOption(wrapper, 'isDependent', 'No');

        fireEvent.click(noOption, radioButtonClick);

        wrapper.getByLabelText("Dependent's first name", { exact: false });
        wrapper.getByLabelText("Dependent's last name", { exact: false });

        expect(
          queryByLabelTextAndName(
            wrapper,
            'Street address',
            'dependentInformation',
          ),
        ).to.not.be.null;
        expect(queryByLabelTextAndName(wrapper, 'City', 'dependentInformation'))
          .to.not.be.null;
        expect(
          queryByLabelTextAndName(wrapper, 'State', 'dependentInformation'),
        ).to.not.be.null;
        expect(
          queryByLabelTextAndName(wrapper, 'Country', 'dependentInformation'),
        ).to.not.be.null;
        expect(
          queryByLabelTextAndName(
            wrapper,
            'Postal code',
            'dependentInformation',
          ),
        ).to.not.be.null;
        expect(
          queryByLabelTextAndName(
            wrapper,
            'Daytime phone (area code)',
            'dependentInformation',
          ),
        ).to.not.be.null;
        expect(
          queryByLabelTextAndName(wrapper, 'Email', 'dependentInformation'),
        ).to.not.be.null;
      });
    });
  });
});
