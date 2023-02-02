import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import createCommonStore from 'platform/startup/store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';
import { LOAN_INTENT } from '../../../constants';

const defaultStore = createCommonStore();

describe('COE applicant loan history', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.loansChapter.pages.loanHistory;

  const intentData = { relevantPriorLoans: [{ propertyOwned: true }] };

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
        />
      </Provider>,
    );

    expect($$('input', container).length).to.equal(9);
    expect($$('select', container).length).to.equal(3);
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={intentData}
        />
      </Provider>,
    );

    expect($$('input', container).length).to.equal(14);
    expect($$('select', container).length).to.equal(3);
  });

  it('Should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(6);
    expect(onSubmit.called).to.be.false;
  });

  it('Should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{}}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(6);
    fireEvent.click(
      $('#root_relevantPriorLoans_0_propertyOwnedYes', container),
    );

    expect($$('.usa-input-error', container).length).to.equal(6);
    expect(onSubmit.called).to.be.false;
  });

  it('Should submit with required fields filled', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.irrrl.value,
                dateRange: {
                  from: '2019-02-XX',
                },
                propertyAddress: {
                  propertyAddress1: '412 Crooks Road',
                  propertyCity: 'Clawson',
                  propertyState: 'AK',
                  propertyZip: '48017',
                },
                propertyOwned: true,
              },
            ],
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
  it('Should allow loan number with numbers, dashes and spaces', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.oneTime.value,
                vaLoanNumber: '12-34-5-6789012',
                propertyOwned: true,
              },
            ],
          }}
          onSubmit={() => {}}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(0);
  });
  it('Should not allow loan number with a leading dash', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.refinance.value,
                vaLoanNumber: '-1-234-56789012',
              },
            ],
          }}
          onSubmit={() => {}}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));
    const error = $$('.usa-input-error', container)?.[0];
    expect(error).to.exist;
    expect(error.textContent).to.contain('numbers only');
  });
  it('Should not allow non-digits in loan number', () => {
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.irrrl.value,
                vaLoanNumber: '1-234-56a789012',
              },
            ],
          }}
          onSubmit={() => {}}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));
    const error = $$('.usa-input-error', container)?.[0];
    expect(error).to.exist;
    expect(error.textContent).to.contain('numbers only');
  });

  it('Should allow same month/year closing & paid off dates', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.irrrl.value,
                dateRange: {
                  from: '2019-02-XX',
                  to: '2019-02-XX',
                },
                propertyAddress: {
                  propertyAddress1: '412 Crooks Road',
                  propertyCity: 'Clawson',
                  propertyState: 'AK',
                  propertyZip: '48017',
                },
                propertyOwned: true,
              },
            ],
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    fireEvent.submit($('form'));

    expect($$('.usa-input-error', container).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('Should render only month & year in date range (no XX for day)', () => {
    const onSubmit = sinon.spy();
    const { container } = render(
      <Provider store={defaultStore}>
        <DefinitionTester
          schema={schema}
          definitions={formConfig.defaultDefinitions}
          uiSchema={uiSchema}
          data={{
            relevantPriorLoans: [
              {
                intent: LOAN_INTENT.irrrl.value,
                dateRange: {
                  from: '2019-02-XX',
                  to: '2019-03-XX',
                },
                propertyAddress: {
                  propertyAddress1: '412 Crooks Road',
                  propertyCity: 'Clawson',
                  propertyState: 'AK',
                  propertyZip: '48017',
                },
                vaLoanNumber: '123456789012',
                propertyOwned: true,
              },
              {
                dateRange: {
                  from: '2019-04-XX',
                  to: '2019-05-XX',
                },
                propertyAddress: {
                  propertyAddress1: '414 Crooks Road',
                  propertyCity: 'Clawson',
                  propertyState: 'AK',
                  propertyZip: '48017',
                },
                propertyOwned: true,
                vaLoanNumber: '123456789013',
              },
            ],
          }}
          onSubmit={onSubmit}
        />
      </Provider>,
    );

    expect($('.small-collapse', container).textContent).to.contain(
      '02/2019 - 03/2019',
    );
  });
});
