import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

const proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('21-4140 pages/sectionTwo', () => {
  const loadModule = () => {
    let capturedOptions;
    const scrollToStub = sinon.stub();
    const arrayBuilderPagesStub = (options, callback) => {
      capturedOptions = options;
      return callback({
        introPage: config => config,
        summaryPage: config => config,
        itemPage: config => config,
      });
    };

    const sectionTwoModule = proxyquire(
      '../../../pages/sectionTwo',
      {
        '~/platform/forms-system/src/js/patterns/array-builder/arrayBuilder': {
          arrayBuilderPages: arrayBuilderPagesStub,
        },
        'platform/utilities/scroll': {
          scrollTo: scrollToStub,
        },
      },
    );

    return {
      sectionTwoModule,
      getCapturedOptions: () => capturedOptions,
      scrollToStub,
    };
  };

  it('scrolls to the top when SectionTwoIntro mounts', async () => {
    const { sectionTwoModule, scrollToStub } = loadModule();
    const { SectionTwoIntro } = sectionTwoModule;
    const NavButtons = () => <div data-testid="nav-buttons" />;

    render(
      <SectionTwoIntro
        goBack={() => {}}
        goForward={() => {}}
        NavButtons={NavButtons}
      />,
    );

    await waitFor(() => {
      expect(scrollToStub.calledWithExactly('topScrollElement')).to.be.true;
    });
  });

  it('evaluates employment entry helpers for array builder pages', () => {
    const { sectionTwoModule, getCapturedOptions } = loadModule();
    const sectionTwo = sectionTwoModule.default;
    const options = getCapturedOptions();

    expect(sectionTwo.employersIntro.title).to.equal('Section 2 - Employment Certification');
    expect(options.arrayPath).to.equal('employers');

    const completeItem = {
      employerName: 'ACME Corp',
      employerAddress: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'VA',
        postalCode: '22101',
      },
      datesOfEmployment: { from: '2024-01-01', to: '2024-05-01' },
      typeOfWork: 'Analyst',
      highestIncome: 5400,
      hoursPerWeek: 40,
      lostTime: 0,
    };

    expect(options.isItemIncomplete(completeItem)).to.be.false;
    expect(options.text.getItemName(completeItem)).to.equal('ACME Corp');
    expect(options.text.cardDescription(completeItem)).to.equal('2024-01-01 - 2024-05-01');

    const incompleteItem = {
      employerName: 'Widgets Inc',
      employerAddress: {
        street: '200 Industrial Way',
        city: 'Norfolk',
        state: 'VA',
        postalCode: '',
      },
      datesOfEmployment: { from: '2023-01-01', to: '' },
      typeOfWork: 'Technician',
      highestIncome: 0,
      hoursPerWeek: '',
      lostTime: '',
    };

    expect(options.isItemIncomplete(incompleteItem)).to.be.true;
    expect(options.text.cardDescription({})).to.equal('Employment dates not provided');
  });
});
