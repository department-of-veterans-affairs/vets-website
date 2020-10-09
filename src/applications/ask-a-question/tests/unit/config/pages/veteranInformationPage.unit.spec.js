import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { getLabelText, getText, getRadioOption } from '../../helpers/queryHelper';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
import { veteranServiceInformationUI } from '../../../../config/pages/veteranServiceInformationUI';
import formConfig from '../../../../config/form';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';


function expectBranchOfServiceNotToExist(wrapper) {
  getLabelText(
      wrapper,
      veteranServiceInformationUI.branchOfService['ui:title'],
    'veteranServiceInformation'
  ).shouldNotExist();
}

function expectBranchOfServiceToBeRequired(wrapper) {
  getLabelText(
      wrapper,
      veteranServiceInformationUI.branchOfService['ui:title'],
    'veteranServiceInformation'
  ).shouldBeRequired();
}

function expectRelationshipToVeteranToBeRequired(wrapper) {
  getLabelText(
    wrapper,
    veteranStatusUI.relationshipToVeteran['ui:title'],
    'veteranStatus'
  ).shouldBeRequired();
}

function expectVeteranIsDeceasedToBeRequired(wrapper) {
  getText(
    wrapper,
    veteranStatusUI.veteranIsDeceased['ui:title'],
    'veteranStatus'
  ).shouldBeRequired();
}

function changeVeteranStatus(wrapper, value) {
  getLabelText(
      wrapper,
      veteranStatusUI.veteranStatus['ui:title']
  ).change(value);
}

function changeRelationshipToVeteran(wrapper, value) {
  getLabelText(
      wrapper,
      veteranStatusUI.relationshipToVeteran['ui:title']
  ).change(value);

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
    getLabelText(
        wrapper,
        veteranStatusUI.veteranStatus['ui:title']
    ).shouldBeRequired();
  });

  it('should not require any other fields when veteran status is general question', () => {
    changeVeteranStatus(wrapper, 'general');

    expectBranchOfServiceNotToExist(wrapper);
  });

  it('should not show veteran information if veteran status is not myself as a veteran', () => {
    changeVeteranStatus(wrapper, 'general');

    getLabelText(wrapper,"Veteran's first name", 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,"Veteran's last name", 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'Street address', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'City', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'State', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'Country', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'Postal code', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'Daytime phone (area code)', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper,'Email', 'veteranInformation').shouldNotExist();
  });

  it('should show optional fields when veteran status is not general question', () => {
    changeVeteranStatus(wrapper, 'vet');

    getText(wrapper, veteranServiceInformationUI.dateOfBirth['ui:title'], 'veteranServiceInformation').shouldExist();
    getLabelText(wrapper, veteranServiceInformationUI.socialSecurityNumber['ui:title'], 'veteranServiceInformation').shouldExist();
    getLabelText(wrapper, veteranServiceInformationUI.serviceNumber['ui:title'], 'veteranServiceInformation').shouldExist();
    getLabelText(wrapper, veteranServiceInformationUI.claimNumber['ui:title'], 'veteranServiceInformation').shouldExist();
    getText(wrapper, veteranServiceInformationUI.serviceDateRange.from['ui:title'], 'veteranServiceInformation').shouldExist();
    getText(wrapper, veteranServiceInformationUI.serviceDateRange.to['ui:title'], 'veteranServiceInformation').shouldExist();
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

      getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

      getText(wrapper, veteranStatusUI.dateOfDeath['ui:title'], 'veteranStatus').shouldExist();
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      getRadioOption(wrapper, 'No', 'veteranIsDeceased').click();

      getText(wrapper, veteranStatusUI.dateOfDeath['ui:title'], 'veteranStatus').shouldNotExist();
    });

    it('should not show veteran information when relationship to veteran is veteran', () => {
      changeRelationshipToVeteran(wrapper, 'Veteran');

      getLabelText(wrapper,"Veteran's first name", 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,"Veteran's last name", 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'Street address', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'City', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'State', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'Country', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'Postal code', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'Daytime phone (area code)', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper,'Email', 'veteranInformation').shouldNotExist();
    });

    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        getText(wrapper, 'Veteran Information').shouldExist();

        getLabelText(wrapper,"Veteran's first name", 'veteranInformation').shouldExist();
        getLabelText(wrapper,"Veteran's last name", 'veteranInformation').shouldExist();
        getLabelText(wrapper,'Street address', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'City', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'State', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'Country', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'Postal code', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'Daytime phone (area code)', 'veteranInformation').shouldExist();
        getLabelText(wrapper,'Email', 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        getText(wrapper, "Veteran's first name", "veteranInformation").shouldBeRequired();
        getText(wrapper, "Veteran's last name", "veteranInformation").shouldBeRequired();
        getText(wrapper, "Country", "veteranInformation").shouldBeRequired();
        getText(wrapper, "Email", "veteranInformation").shouldBeRequired();
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
