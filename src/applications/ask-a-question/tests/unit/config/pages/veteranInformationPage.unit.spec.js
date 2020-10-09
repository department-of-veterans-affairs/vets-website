import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  getLabelText,
  getRadioOption,
  getText,
} from '../../helpers/queryHelper';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
import { veteranServiceInformationUI } from '../../../../config/pages/veteranServiceInformationUI';
import formConfig from '../../../../config/form';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

function expectBranchOfServiceNotToExist(wrapper) {
  getLabelText(
    wrapper,
    veteranServiceInformationUI.branchOfService['ui:title'],
    'veteranServiceInformation',
  ).shouldNotExist();
}

function expectBranchOfServiceToBeRequired(wrapper) {
  getLabelText(
    wrapper,
    veteranServiceInformationUI.branchOfService['ui:title'],
    'veteranServiceInformation',
  ).shouldBeRequired();
}

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

function changeRelationshipToVeteran(wrapper, value) {
  getLabelText(
    wrapper,
    veteranStatusUI.relationshipToVeteran['ui:title'],
  ).change(value);
}

function addressFieldsShouldNotExist(wrapper, fieldSetName) {
  getLabelText(wrapper, 'Street address', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'City', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'State', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'Country', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'Postal code', fieldSetName).shouldNotExist();
}

function addressFieldsShouldExist(wrapper, fieldSetName) {
  getLabelText(wrapper, 'Street address', fieldSetName).shouldExist();
  getLabelText(wrapper, 'City', fieldSetName).shouldExist();
  getLabelText(wrapper, 'State', fieldSetName).shouldExist();
  getLabelText(wrapper, 'Country', fieldSetName).shouldExist();
  getLabelText(wrapper, 'Postal code', fieldSetName).shouldExist();
}

function nameFieldsShouldNotExist(wrapper, fieldSetName) {
  const titleLabel =
    fieldSetName === 'veteranInformation' ? 'Veteran' : 'Dependent';
  getLabelText(
    wrapper,
    `${titleLabel}'s first name`,
    fieldSetName,
  ).shouldNotExist();
  getLabelText(
    wrapper,
    `${titleLabel}'s last name`,
    fieldSetName,
  ).shouldNotExist();
}

function nameFieldsShouldExist(wrapper, fieldSetName) {
  const titleLabel =
    fieldSetName === 'veteranInformation' ? 'Veteran' : 'Dependent';
  getLabelText(
    wrapper,
    `${titleLabel}'s first name`,
    fieldSetName,
  ).shouldExist();
  getLabelText(
    wrapper,
    `${titleLabel}'s last name`,
    fieldSetName,
  ).shouldExist();
}

function minimalPersonalInformationFieldsRequired(wrapper, fieldSetName) {
  const titleLabel =
    fieldSetName === 'veteranInformation' ? 'Veteran' : 'Dependent';
  getLabelText(
    wrapper,
    `${titleLabel}'s first name`,
    fieldSetName,
  ).shouldBeRequired();
  getLabelText(
    wrapper,
    `${titleLabel}'s last name`,
    fieldSetName,
  ).shouldBeRequired();
  getLabelText(wrapper, 'Country', fieldSetName).shouldBeRequired();
  getLabelText(wrapper, 'Email', fieldSetName).shouldBeRequired();
}

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
      veteranStatusUI.veteranStatus['ui:title'],
    ).shouldBeRequired();
  });

  it('should not require any other fields when veteran status is general question', () => {
    changeVeteranStatus(wrapper, 'general');

    expectBranchOfServiceNotToExist(wrapper);
  });

  it('should not show veteran information if veteran status is not myself as a veteran', () => {
    changeVeteranStatus(wrapper, 'general');

    nameFieldsShouldNotExist(wrapper, 'veteranInformation');
    addressFieldsShouldNotExist(wrapper, 'veteranInformation');
    getLabelText(
      wrapper,
      'Daytime phone (area code)',
      'veteranInformation',
    ).shouldNotExist();
    getLabelText(wrapper, 'Email', 'veteranInformation').shouldNotExist();
  });

  it('should show optional fields when veteran status is not general question', () => {
    changeVeteranStatus(wrapper, 'vet');

    getText(
      wrapper,
      veteranServiceInformationUI.dateOfBirth['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
    getLabelText(
      wrapper,
      veteranServiceInformationUI.socialSecurityNumber['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
    getLabelText(
      wrapper,
      veteranServiceInformationUI.serviceNumber['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
    getLabelText(
      wrapper,
      veteranServiceInformationUI.claimNumber['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
    getText(
      wrapper,
      veteranServiceInformationUI.serviceDateRange.from['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
    getText(
      wrapper,
      veteranServiceInformationUI.serviceDateRange.to['ui:title'],
      'veteranServiceInformation',
    ).shouldExist();
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

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        'veteranStatus',
      ).shouldExist();
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      getRadioOption(wrapper, 'No', 'veteranIsDeceased').click();

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        'veteranStatus',
      ).shouldNotExist();
    });

    it('should not show veteran information when relationship to veteran is veteran', () => {
      changeRelationshipToVeteran(wrapper, 'Veteran');

      nameFieldsShouldNotExist(wrapper, 'veteranInformation');
      addressFieldsShouldNotExist(wrapper, 'veteranInformation');
      getLabelText(
        wrapper,
        'Daytime phone (area code)',
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(wrapper, 'Email', 'veteranInformation').shouldNotExist();
    });

    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        getText(wrapper, 'Veteran Information').shouldExist();

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        minimalPersonalInformationFieldsRequired(wrapper, 'veteranInformation');
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldNotExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldNotExist();
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

      getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        '',
      ).shouldExist();
    });

    it('should not display date of death when veteran is not deceased', () => {
      expectVeteranIsDeceasedToBeRequired(wrapper);

      getRadioOption(wrapper, 'No', 'veteranIsDeceased').click();

      getText(
        wrapper,
        veteranStatusUI.dateOfDeath['ui:title'],
        '',
      ).shouldNotExist();
    });

    it('should not show dependent information if person filling form is dependent', () => {
      getRadioOption(wrapper, 'Yes', 'isDependent').click();

      getText(wrapper, 'Dependent information', '').shouldNotExist();

      nameFieldsShouldNotExist(wrapper, 'dependentInformation');
      addressFieldsShouldNotExist(wrapper, 'dependentInformation');
      getLabelText(
        wrapper,
        'Daytime phone (area code)',
        'dependentInformation',
      ).shouldNotExist();
      getLabelText(wrapper, 'Email', 'dependentInformation').shouldNotExist();
    });

    it('should show dependent information if person filling form is not dependent', () => {
      getRadioOption(wrapper, 'No', 'isDependent').click();

      getText(wrapper, 'Dependent information', '').shouldExist();

      nameFieldsShouldExist(wrapper, 'dependentInformation');
      addressFieldsShouldExist(wrapper, 'dependentInformation');
      getLabelText(
        wrapper,
        'Daytime phone (area code)',
        'dependentInformation',
      ).shouldExist();
      getLabelText(wrapper, 'Email', 'dependentInformation').shouldExist();
    });

    it('should require dependent first name, last name, country, and email if person filling form is not dependent', () => {
      getRadioOption(wrapper, 'No', 'isDependent').click();

      minimalPersonalInformationFieldsRequired(
        wrapper,
        'dependentInformation ',
      );
    });
    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        getText(wrapper, 'Veteran information', '').shouldExist();

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        minimalPersonalInformationFieldsRequired(wrapper, 'veteranInformation');
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldNotExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldNotExist();
      });

      it('should not reduce dependent information when veteran is deceased', () => {
        getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

        getRadioOption(wrapper, 'No', 'isDependent').click();

        nameFieldsShouldExist(wrapper, 'dependentInformation');
        addressFieldsShouldExist(wrapper, 'dependentInformation');
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'dependentInformation',
        ).shouldExist();
        getLabelText(wrapper, 'Email', 'dependentInformation').shouldExist();
      });
    });
  });
});
