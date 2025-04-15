import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import sinon from 'sinon';

import formConfig from '../../config/form';
import {
  servicePeriodInformationPage,
  handleGetItemName,
  handleAlertMaxItems,
  handleCardDescription,
  handleCancelAddTitle,
  handleCancelAddNo,
  handleDeleteTitle,
  handleDeleteDescription,
  handleDeleteNeedAtLeastOneDescription,
  handleDeleteYes,
  handleDeleteNo,
  handleCancelEditTitle,
  handleCancelEditDescription,
  handleCancelEditYes,
  handleCancelEditNo,
  handleSummaryTitle,
  handleVeteranDepends,
  handlePreparerVeteranDepends,
  handleNonVeteranDepends,
  handlePreparerNonVeteranDepends,
} from '../../config/pages/servicePeriodsPages';

describe('pension add federal medical centers page', () => {
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={servicePeriodInformationPage(true, false).schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={servicePeriodInformationPage(true, false).uiSchema}
      />,
    );

    expect(form.find('select').length).to.equal(5);
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={servicePeriodInformationPage(true, false).schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={servicePeriodInformationPage(true, false).uiSchema}
      />,
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should handle page text', () => {
    expect(handleGetItemName({ serviceBranch: 'AC' })).to.equal(
      'U.S. Army Air Corps',
    );

    expect(handleAlertMaxItems()).to.equal(
      'You have added the maximum number of allowed service periods for this application. You may edit or delete a service period or choose to continue the application.',
    );

    expect(
      handleCardDescription({
        dateRange: { from: '19500315', to: '20000523' },
      }),
    ).to.equal('03/15/1950 - 05/23/2000');

    expect(
      handleCancelAddTitle({
        getItemName: handleGetItemName,
        itemData: { serviceBranch: 'AC' },
      }),
    ).to.equal('Cancel adding U.S. Army Air Corps service period');

    expect(
      handleCancelAddTitle({
        getItemName: handleGetItemName,
        itemData: { serviceBranch: null },
      }),
    ).to.equal('Cancel adding this service period');

    expect(handleCancelAddNo()).to.equal('No, keep this');

    expect(
      handleDeleteTitle({
        getItemName: handleGetItemName,
        itemData: { serviceBranch: 'AC' },
      }),
    ).to.equal(
      'Are you sure you want to remove this U.S. Army Air Corps service period?',
    );

    expect(
      handleDeleteDescription({
        getItemName: handleGetItemName,
        itemData: { serviceBranch: 'AC' },
      }),
    ).to.equal(
      'This will remove U.S. Army Air Corps and all the information from the service period records.',
    );

    expect(handleDeleteNeedAtLeastOneDescription()).to.equal(
      'If you remove this service period, we’ll take you to a screen where you can add another service period. You’ll need to list at least one service period for us to process this form.',
    );

    expect(handleDeleteYes()).to.equal('Yes, remove this');

    expect(handleDeleteNo()).to.equal('No, keep this');

    expect(
      handleCancelEditTitle({
        getItemName: handleGetItemName,
        itemData: { serviceBranch: 'AC' },
      }),
    ).to.equal('Cancel editing U.S. Army Air Corps service period?');

    expect(handleCancelEditDescription()).to.equal(
      'If you cancel, you’ll lose any changes you made on this screen and you will be returned to the service periods review page.',
    );

    expect(handleCancelEditYes()).to.equal('Yes, cancel');

    expect(handleCancelEditNo()).to.equal('No, keep this');

    expect(handleSummaryTitle({})).to.equal('Review service period records');

    expect(
      handleVeteranDepends({
        application: {
          claimant: { relationshipToVet: 'veteran' },
          applicant: {
            applicantRelationshipToClaimant: 'Authorized Agent/Rep',
          },
        },
      }),
    ).to.equal(false);

    expect(
      handlePreparerVeteranDepends({
        application: {
          claimant: { relationshipToVet: 'veteran' },
          applicant: {
            applicantRelationshipToClaimant: 'Authorized Agent/Rep',
          },
        },
      }),
    ).to.equal(true);

    expect(
      handleNonVeteranDepends({
        application: {
          claimant: { relationshipToVet: 'veteran' },
          applicant: {
            applicantRelationshipToClaimant: 'Authorized Agent/Rep',
          },
        },
      }),
    ).to.equal(false);

    expect(
      handlePreparerNonVeteranDepends({
        application: {
          claimant: { relationshipToVet: 'veteran' },
          applicant: {
            applicantRelationshipToClaimant: 'Authorized Agent/Rep',
          },
        },
      }),
    ).to.equal(false);
  });
});
