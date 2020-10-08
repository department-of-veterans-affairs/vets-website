import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
import { veteranInformationUI } from '../../../../config/pages/veteranInformationUI';
import formConfig from '../../../../config/form';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

function expectBranchOfServiceNotToExist(wrapper) {
  expect(
    wrapper.queryByLabelText(veteranStatusUI.branchOfService['ui:title'], {
      exact: false,
    }),
  ).to.be.null;
}

function expectBranchOfServiceToBeRequired(wrapper) {
  const branchOfService = wrapper.getByLabelText(
    veteranStatusUI.branchOfService['ui:title'],
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

function getRadioOption(wrapper, radioName, optionName) {
  const radioByOptionName = wrapper.queryAllByRole('radio', {
    name: optionName,
  });

  return radioByOptionName.find(radioOption =>
    radioOption.name.includes(radioName),
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

  it('should show optional fields when veteran status is not general question', () => {
    changeVeteranStatus(wrapper, 'vet');

    const { getByText, getByLabelText } = wrapper;

    expect(getByText(veteranInformationUI.dateOfBirth['ui:title'])).not.to.be
      .null;
    expect(
      getByLabelText(veteranInformationUI.socialSecurityNumber['ui:title']),
    ).not.to.be.null;
    expect(getByLabelText(veteranInformationUI.serviceNumber['ui:title'])).not
      .to.be.null;
    expect(getByLabelText(veteranInformationUI.claimNumber['ui:title'])).not.to
      .be.null;
    expect(getByText(veteranInformationUI.serviceDateRange.from['ui:title']))
      .not.to.be.null;
    expect(getByText(veteranInformationUI.serviceDateRange.to['ui:title'])).not
      .to.be.null;
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
  });
});
