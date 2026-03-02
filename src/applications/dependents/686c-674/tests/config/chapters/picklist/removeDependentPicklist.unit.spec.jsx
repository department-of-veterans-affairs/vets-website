import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

const removalSelectedFormData = {
  'view:addOrRemoveDependents': { remove: true },
  dependents: {
    hasDependents: true,
    awarded: [
      {
        firstName: 'SPOUSY',
        lastName: 'FOSTER',
        dateOfBirth: '1981-01-06',
        ssn: '3332',
        relationshipToVeteran: 'Spouse',
        awardIndicator: 'Y',
        dob: 'January 6, 1981',
        fullName: {
          first: 'SPOUSY',
          last: 'FOSTER',
        },
        age: 45,
        removalDate: '',
        key: 'spousy-3332',
        labeledAge: '45 years old',
      },
    ],
  },
  'view:removeDependentPickList': [
    {
      fullName: {
        first: 'SPOUSY',
        last: 'FOSTER',
      },
      dateOfBirth: '1981-01-06',
      ssn: '3332',
      relationshipToVeteran: 'Spouse',
      awardIndicator: 'Y',
      age: 45,
      labeledAge: '45 years old',
      key: 'spousy-3332',
      selected: true,
      removalReason: 'marriageEnded',
      endType: 'annulmentOrVoid',
      endAnnulmentOrVoidDescription: 'Test description',
      endDate: '2020-01-01',
      endOutsideUs: true,
      endCity: 'Test',
      endProvince: 'Prov',
      endCountry: 'AGO',
      endState: 'AK',
      firstName: 'SPOUSY',
      lastName: 'FOSTER',
      dob: 'January 6, 1981',
      removalDate: '',
    },
  ],
  vaDependentsV3: true,
  vaDependentV2Flow: false,
};

describe('Remove Dependent Picklist options page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.optionSelection.pages.removeDependentsPicklistOptions;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Using a custom page, which isn't rendered by DefinitionTester
    expect($('form', container)).to.exist;
  });
});

describe('Remove Dependent Picklist followup page', () => {
  const {
    schema,
    uiSchema,
    depends,
  } = formConfig.chapters.removeDependentsPicklistFollowupPages.pages.removeDependentFollowup;

  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Using a custom page, which isn't rendered by DefinitionTester
    expect($('form', container)).to.exist;
  });

  // ensure that followup pages only show when 'remove dependents' option has been selected
  it('should return true when remove is true', () => {
    const formData = removalSelectedFormData;

    expect(depends(formData)).to.be.true;
  });

  it('should return false when remove is false', () => {
    const formData = {
      'view:addOrRemoveDependents': { remove: false },
    };

    expect(depends(formData)).to.be.false;
  });
});
