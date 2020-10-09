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

    getLabelText(
      wrapper,
      "Veteran's first name",
      'veteranInformation',
    ).shouldNotExist();
    getLabelText(
      wrapper,
      "Veteran's last name",
      'veteranInformation',
    ).shouldNotExist();
    getLabelText(
      wrapper,
      'Street address',
      'veteranInformation',
    ).shouldNotExist();
    getLabelText(wrapper, 'City', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper, 'State', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper, 'Country', 'veteranInformation').shouldNotExist();
    getLabelText(wrapper, 'Postal code', 'veteranInformation').shouldNotExist();
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

      getLabelText(
        wrapper,
        "Veteran's first name",
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(
        wrapper,
        "Veteran's last name",
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(
        wrapper,
        'Street address',
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(wrapper, 'City', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper, 'State', 'veteranInformation').shouldNotExist();
      getLabelText(wrapper, 'Country', 'veteranInformation').shouldNotExist();
      getLabelText(
        wrapper,
        'Postal code',
        'veteranInformation',
      ).shouldNotExist();
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

        getLabelText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          'Street address',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'City', 'veteranInformation').shouldExist();
        getLabelText(wrapper, 'State', 'veteranInformation').shouldExist();
        getLabelText(wrapper, 'Country', 'veteranInformation').shouldExist();
        getLabelText(
          wrapper,
          'Postal code',
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        getText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldBeRequired();
        getText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldBeRequired();
        getText(wrapper, 'Country', 'veteranInformation').shouldBeRequired();
        getText(wrapper, 'Email', 'veteranInformation').shouldBeRequired();
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

        getLabelText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldExist();

        getLabelText(
          wrapper,
          'Street address',
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(wrapper, 'City', 'veteranInformation').shouldNotExist();
        getLabelText(wrapper, 'State', 'veteranInformation').shouldNotExist();
        getLabelText(wrapper, 'Country', 'veteranInformation').shouldNotExist();
        getLabelText(
          wrapper,
          'Postal code',
          'veteranInformation',
        ).shouldNotExist();
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

      getLabelText(
        wrapper,
        "Dependent's first name",
        'dependentInformation',
      ).shouldNotExist();
      getLabelText(
        wrapper,
        "Dependent's last name",
        'dependentInformation',
      ).shouldNotExist();
      getLabelText(
        wrapper,
        'Street address',
        'dependentInformation',
      ).shouldNotExist();
      getLabelText(wrapper, 'City', 'dependentInformation').shouldNotExist();
      getLabelText(wrapper, 'State', 'dependentInformation').shouldNotExist();
      getLabelText(wrapper, 'Country', 'dependentInformation').shouldNotExist();
      getLabelText(
        wrapper,
        'Postal code',
        'dependentInformation',
      ).shouldNotExist();
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

      getLabelText(
        wrapper,
        "Dependent's first name",
        'dependentInformation',
      ).shouldExist();
      getLabelText(
        wrapper,
        "Dependent's last name",
        'dependentInformation',
      ).shouldExist();
      getLabelText(
        wrapper,
        'Street address',
        'dependentInformation',
      ).shouldExist();
      getLabelText(wrapper, 'City', 'dependentInformation').shouldExist();
      getLabelText(wrapper, 'State', 'dependentInformation').shouldExist();
      getLabelText(wrapper, 'Country', 'dependentInformation').shouldExist();
      getLabelText(
        wrapper,
        'Postal code',
        'dependentInformation',
      ).shouldExist();
      getLabelText(
        wrapper,
        'Daytime phone (area code)',
        'dependentInformation',
      ).shouldExist();
      getLabelText(wrapper, 'Email', 'dependentInformation').shouldExist();
    });

    it('should require dependent first name, last name, country, and email if person filling form is not dependent', () => {
      getRadioOption(wrapper, 'No', 'isDependent').click();

      getLabelText(
        wrapper,
        "Dependent's first name",
        'dependentInformation',
      ).shouldBeRequired();
      getLabelText(
        wrapper,
        "Dependent's last name",
        'dependentInformation',
      ).shouldBeRequired();
      getLabelText(
        wrapper,
        'Country',
        'dependentInformation',
      ).shouldBeRequired();
      getLabelText(wrapper, 'Email', 'dependentInformation').shouldBeRequired();
    });
    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        changeRelationshipToVeteran(wrapper, 'Son');
      });

      it('should show veteran information', () => {
        getText(wrapper, 'Veteran information', '').shouldExist();

        getLabelText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldExist();

        getLabelText(
          wrapper,
          'Street address',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'City', 'veteranInformation').shouldExist();
        getLabelText(wrapper, 'State', 'veteranInformation').shouldExist();
        getLabelText(wrapper, 'Country', 'veteranInformation').shouldExist();
        getLabelText(
          wrapper,
          'Postal code',
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          'Daytime phone (area code)',
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        getLabelText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldBeRequired();
        getLabelText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldBeRequired();
        getLabelText(
          wrapper,
          'Country',
          'veteranInformation',
        ).shouldBeRequired();
        getLabelText(wrapper, 'Email', 'veteranInformation').shouldBeRequired();
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        getRadioOption(wrapper, 'Yes', 'veteranIsDeceased').click();

        getLabelText(
          wrapper,
          "Veteran's first name",
          'veteranInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          "Veteran's last name",
          'veteranInformation',
        ).shouldExist();

        getLabelText(
          wrapper,
          'Street address',
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(wrapper, 'City', 'veteranInformation').shouldNotExist();
        getLabelText(wrapper, 'State', 'veteranInformation').shouldNotExist();
        getLabelText(wrapper, 'Country', 'veteranInformation').shouldNotExist();
        getLabelText(
          wrapper,
          'Postal code',
          'veteranInformation',
        ).shouldNotExist();
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

        getLabelText(
          wrapper,
          "Dependent's first name",
          'dependentInformation',
        ).shouldExist();
        getLabelText(
          wrapper,
          "Dependent's last name",
          'dependentInformation',
        ).shouldExist();

        getLabelText(
          wrapper,
          'Street address',
          'dependentInformation',
        ).shouldExist();
        getLabelText(wrapper, 'City', 'dependentInformation').shouldExist();
        getLabelText(wrapper, 'State', 'dependentInformation').shouldExist();
        getLabelText(wrapper, 'Country', 'dependentInformation').shouldExist();
        getLabelText(
          wrapper,
          'Postal code',
          'dependentInformation',
        ).shouldExist();
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
