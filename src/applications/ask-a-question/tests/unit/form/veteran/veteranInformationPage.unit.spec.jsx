import React from 'react';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { getLabelText, getText } from '../../helpers/queryHelper';

import VeteranInformationPage from '../../../../form/veteran/veteranInformationPage';
import { veteranServiceInformationUI } from '../../../../form/veteran/service/veteranServiceInformationUI';
import formConfig from '../../../../form/form';

import {
  daytimePhoneAreaCodeTitle,
  dependentRelationshipToVeteran,
  emailTitle,
  streetAddress,
} from '../../../../constants/labels';

function expectBranchOfServiceToBeRequired(wrapper) {
  getLabelText(
    wrapper,
    veteranServiceInformationUI.branchOfService['ui:title'],
    'veteranServiceInformation',
  ).shouldBeRequired();
}

function relationshipToVeteranShouldExist(wrapper) {
  getLabelText(wrapper, dependentRelationshipToVeteran).shouldExist();
  getLabelText(wrapper, dependentRelationshipToVeteran).shouldBeRequired();
}

function addressFieldsShouldNotExist(wrapper, fieldSetName) {
  getLabelText(wrapper, streetAddress, fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'City', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'State', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'Country', fieldSetName).shouldNotExist();
  getLabelText(wrapper, 'Postal code', fieldSetName).shouldNotExist();
}

function addressFieldsShouldExist(wrapper, fieldSetName) {
  getLabelText(wrapper, streetAddress, fieldSetName).shouldExist();
  getLabelText(wrapper, 'City', fieldSetName).shouldExist();
  getLabelText(wrapper, 'State', fieldSetName).shouldExist();
  getLabelText(wrapper, 'Country', fieldSetName).shouldExist();
  getLabelText(wrapper, 'Zip code', fieldSetName).shouldExist();
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
  getLabelText(wrapper, emailTitle, fieldSetName).shouldBeRequired();
}

describe('Veteran Information Page', () => {
  let wrapper;

  function renderWithVeteranStatus(veteranStatus) {
    wrapper = render(
      <DefinitionTester
        schema={VeteranInformationPage.schema}
        uiSchema={VeteranInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranStatus,
        }}
      />,
    );
  }

  it('should show optional fields when veteran status is not general question', () => {
    renderWithVeteranStatus({ veteranStatus: 'vet' });

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
      renderWithVeteranStatus({ veteranStatus: 'behalf of vet' });
    });

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });

    it('should not show veteran information if veteran status is not myself as a veteran', () => {
      nameFieldsShouldNotExist(wrapper, 'veteranInformation');
      addressFieldsShouldNotExist(wrapper, 'veteranInformation');
      getLabelText(
        wrapper,
        daytimePhoneAreaCodeTitle,
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(wrapper, emailTitle, 'veteranInformation').shouldNotExist();
    });

    it('should not show veteran information when relationship to veteran is veteran', () => {
      renderWithVeteranStatus({
        veteranStatus: 'behalf of vet',
        relationshipToVeteran: 'Veteran',
      });

      nameFieldsShouldNotExist(wrapper, 'veteranInformation');
      addressFieldsShouldNotExist(wrapper, 'veteranInformation');
      getLabelText(
        wrapper,
        daytimePhoneAreaCodeTitle,
        'veteranInformation',
      ).shouldNotExist();
      getLabelText(wrapper, emailTitle, 'veteranInformation').shouldNotExist();
    });

    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        renderWithVeteranStatus({
          veteranStatus: 'behalf of vet',
          relationshipToVeteran: 'Son',
        });
      });

      it('should show veteran information', () => {
        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          daytimePhoneAreaCodeTitle,
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, emailTitle, 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        minimalPersonalInformationFieldsRequired(wrapper, 'veteranInformation');
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        wrapper.unmount();
        renderWithVeteranStatus({
          veteranStatus: 'behalf of vet',
          relationshipToVeteran: 'Son',
          veteranIsDeceased: true,
        });

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldNotExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          daytimePhoneAreaCodeTitle,
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(
          wrapper,
          emailTitle,
          'veteranInformation',
        ).shouldNotExist();
      });
    });
  });

  describe('for myself as veteran', () => {
    beforeEach(() => {
      renderWithVeteranStatus({ veteranStatus: 'vet' });
    });

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });
  });

  describe('for the dependent of a veteran', () => {
    beforeEach(() => {
      renderWithVeteranStatus({ veteranStatus: 'dependent' });
    });

    it('should require branch of service', () => {
      expectBranchOfServiceToBeRequired(wrapper);
    });

    it('should not show dependent information if person filling form is dependent', () => {
      renderWithVeteranStatus({
        veteranStatus: 'dependent',
        isDependent: true,
      });

      nameFieldsShouldNotExist(wrapper, 'dependentInformation');
      addressFieldsShouldNotExist(wrapper, 'dependentInformation');
      getLabelText(
        wrapper,
        daytimePhoneAreaCodeTitle,
        'dependentInformation',
      ).shouldNotExist();
      getLabelText(
        wrapper,
        emailTitle,
        'dependentInformation',
      ).shouldNotExist();
    });

    it('should show dependent information if person filling form is not dependent', () => {
      renderWithVeteranStatus({
        veteranStatus: 'dependent',
        isDependent: false,
      });

      relationshipToVeteranShouldExist(wrapper);
      nameFieldsShouldExist(wrapper, 'dependentInformation');
      addressFieldsShouldExist(wrapper, 'dependentInformation');
      getLabelText(
        wrapper,
        daytimePhoneAreaCodeTitle,
        'dependentInformation',
      ).shouldExist();
      getLabelText(wrapper, emailTitle, 'dependentInformation').shouldExist();
    });

    it('should require dependent first name, last name, country, and email if person filling form is not dependent', () => {
      renderWithVeteranStatus({
        veteranStatus: 'dependent',
        isDependent: false,
      });

      minimalPersonalInformationFieldsRequired(
        wrapper,
        'dependentInformation ',
      );
    });

    describe('relationship to veteran is not veteran', () => {
      beforeEach(() => {
        renderWithVeteranStatus({
          veteranStatus: 'dependent',
          relationshipToVeteran: 'Son',
        });
      });

      it('should show veteran information', () => {
        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          daytimePhoneAreaCodeTitle,
          'veteranInformation',
        ).shouldExist();
        getLabelText(wrapper, emailTitle, 'veteranInformation').shouldExist();
      });

      it('should require veteran first name, last name, country, and email', () => {
        minimalPersonalInformationFieldsRequired(wrapper, 'veteranInformation');
      });

      it('should show reduced veteran information when veteran is deceased', () => {
        wrapper.unmount();
        renderWithVeteranStatus({
          veteranStatus: 'dependent',
          relationshipToVeteran: 'Son',
          veteranIsDeceased: true,
        });

        nameFieldsShouldExist(wrapper, 'veteranInformation');
        addressFieldsShouldNotExist(wrapper, 'veteranInformation');
        getLabelText(
          wrapper,
          daytimePhoneAreaCodeTitle,
          'veteranInformation',
        ).shouldNotExist();
        getLabelText(
          wrapper,
          emailTitle,
          'veteranInformation',
        ).shouldNotExist();
      });

      it('should not reduce dependent information when veteran is deceased', () => {
        renderWithVeteranStatus({
          veteranStatus: 'dependent',
          relationshipToVeteran: 'Son',
          veteranIsDeceased: true,
          isDependent: false,
        });

        nameFieldsShouldExist(wrapper, 'dependentInformation');
        addressFieldsShouldExist(wrapper, 'dependentInformation');
        getLabelText(
          wrapper,
          daytimePhoneAreaCodeTitle,
          'dependentInformation',
        ).shouldExist();
        getLabelText(wrapper, emailTitle, 'dependentInformation').shouldExist();
      });
    });
  });
});
