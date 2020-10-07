import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';

import VeteranInformationPage from '../../../../config/pages/veteranInformationPage';
import { veteranStatusUI } from '../../../../config/pages/veteranStatusUI';
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

describe('Veteran Information Page', () => {
  const radioButtonClick = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  });

  it('should require veteran status', () => {
    const wrapper = render(
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

    const veteranStatus = wrapper.getByLabelText(
      veteranStatusUI.veteranStatus['ui:title'],
      {
        exact: false,
      },
    );

    expect(veteranStatus).to.have.property('required');
  });

  it('should not render any other fields when veteran status is general question', () => {
    const wrapper = render(
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

    changeVeteranStatus(wrapper, 'general');

    expectBranchOfServiceNotToExist(wrapper);
  });

  it('should require branch of service when veteran status is not general question', () => {
    const wrapper = render(
      <DefinitionTester
        schema={VeteranInformationPage.schema}
        uiSchema={VeteranInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranStatus: {
            veteranStatus: null,
            branchOfService: null,
          },
        }}
      />,
    );

    changeVeteranStatus(wrapper, 'vet');

    expectBranchOfServiceToBeRequired(wrapper);
  });

  it('should require relationship to veteran when veteran status is on behalf of veteran', () => {
    const wrapper = render(
      <DefinitionTester
        schema={VeteranInformationPage.schema}
        uiSchema={VeteranInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranStatus: {
            veteranStatus: null,
            branchOfService: null,
            relationshipToVeteran: null,
            veteranIsDeceased: null,
          },
        }}
      />,
    );

    changeVeteranStatus(wrapper, 'behalf of vet');

    expectBranchOfServiceToBeRequired(wrapper);

    expectRelationshipToVeteranToBeRequired(wrapper);

    expectVeteranIsDeceasedToBeRequired(wrapper);
  });

  it('should display date of death when veteran is deceased', () => {
    const wrapper = render(
      <DefinitionTester
        schema={VeteranInformationPage.schema}
        uiSchema={VeteranInformationPage.uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{
          veteranStatus: {
            veteranStatus: null,
            branchOfService: null,
            relationshipToVeteran: null,
            veteranIsDeceased: null,
          },
        }}
      />,
    );

    changeVeteranStatus(wrapper, 'behalf of vet');

    expectBranchOfServiceToBeRequired(wrapper);

    expectRelationshipToVeteranToBeRequired(wrapper);

    expectVeteranIsDeceasedToBeRequired(wrapper);

    fireEvent.click(
      wrapper.queryByRole('radio', {
        name: 'Yes',
      }),
      radioButtonClick,
    );

    expect(
      wrapper.queryByRole('radio', {
        name: 'Yes',
      }).checked,
    ).to.be.true;
  });
});
