import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import summaryPage from '../../../../pages/disabilityConditions/shared/summary';
import formConfig from '../../../../config/form';
import * as utils from '../../../../pages/disabilityConditions/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [utils.arrayOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={summaryPage.schema}
      uiSchema={summaryPage.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 summary shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders radio group, label, and submit', () => {
    const { container } = mountPage();
    const view = within(container);

    const group = container.querySelector('va-radio');

    expect(group).to.exist;
    expect(group).to.have.attribute(
      'label',
      'Do you have another condition to add?',
    );
    expect(group).to.have.attribute('label-header-level', '4');
    expect(group).to.have.attribute('required', 'true');
    expect(group.hasAttribute('hint')).to.be.false;

    const yes = container.querySelector('va-radio-option[value="Y"]');
    const no = container.querySelector('va-radio-option[value="N"]');

    expect(yes).to.exist;
    expect(no).to.exist;
    expect(yes).to.have.attribute('label', 'Yes');
    expect(no).to.have.attribute('label', 'No');

    expect(view.getByRole('button', { name: /submit/i })).to.exist;
  });

  it('blocks submit when no selection made', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('submits when selecting Yes', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);
    const group = container.querySelector('va-radio');
    const yesOpt = container.querySelector('va-radio-option[value="Y"]');

    expect(group, 'va-radio not found').to.exist;
    expect(yesOpt, 'va-radio-option[value="Y"] not found').to.exist;

    Object.defineProperty(yesOpt, 'value', {
      configurable: true,
      get: () => 'Y',
    });
    Object.defineProperty(yesOpt, 'checked', {
      configurable: true,
      get: () => true,
    });

    const payload = {
      bubbles: true,
      composed: true,
      detail: { value: 'Y', checked: true },
    };

    fireEvent.click(yesOpt);

    fireEvent(yesOpt, new CustomEvent('vaChange', payload));
    fireEvent(yesOpt, new CustomEvent('vaValueChange', payload));

    fireEvent(group, new CustomEvent('vaChange', payload));
    fireEvent(group, new CustomEvent('vaValueChange', payload));

    await waitFor(() => {
      expect(group.getAttribute('error')).to.not.be.ok;
      expect(group.getAttribute('aria-invalid')).to.not.equal('true');
    });

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('preselects when seeded to No (N) and submits', async () => {
    const onSubmit = sinon.spy();
    const data = {
      [utils.arrayOptions.arrayPath]: [{}],
      'view:hasConditions': false,
    };
    const { container } = mountPage(data, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('shows required error when submitting with no selection', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage(
      { [utils.arrayOptions.arrayPath]: [{}] },
      onSubmit,
    );
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    const group = container.querySelector('va-radio');
    expect(group).to.exist;

    await waitFor(() => {
      const err = group.getAttribute('error') || '';
      expect(err).to.match(/select yes if you have another condition to add/i);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('shows orphan secondary error when a secondary condition is not linked', async () => {
    const onSubmit = sinon.spy();
    const data = {
      [utils.arrayOptions.arrayPath]: [{}],
      'view:hasConditions': false,
      newDisabilities: [
        {
          cause: 'SECONDARY',
          causedByDisability: 'Primary Condition',
          condition: 'Secondary Condition',
        },
      ],
      ratedDisabilities: [],
    };

    const { container } = mountPage(data, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    const group = container.querySelector('va-radio');
    expect(group).to.exist;

    await waitFor(() => {
      const err = group.getAttribute('error') || '';
      expect(err).to.match(
        /A secondary condition is no longer linked to an existing condition/i,
      );
      expect(onSubmit.called).to.be.false;
    });
  });

  it('does not show orphan error when secondary is linked to a rated disability', async () => {
    const onSubmit = sinon.spy();
    const data = {
      [utils.arrayOptions.arrayPath]: [{}],
      'view:hasConditions': false,
      newDisabilities: [
        {
          cause: 'SECONDARY',
          causedByDisability: 'Migraines',
          condition: 'Secondary Condition',
        },
      ],
      ratedDisabilities: [
        { name: 'migraines' }, // different case, tests normalization
      ],
    };

    const { container } = mountPage(data, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const group = container.querySelector('va-radio');
      expect(group.getAttribute('error') || '').to.not.match(
        /secondary condition is no longer linked/i,
      );
      expect(onSubmit.calledOnce).to.be.true;
    });
  });
});
