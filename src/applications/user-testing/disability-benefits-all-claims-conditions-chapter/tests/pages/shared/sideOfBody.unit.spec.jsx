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

import sideOfBody from '../../../pages/shared/sideOfBody';
import formConfig from '../../../config/form';
import * as utils from '../../../pages/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [utils.arrayBuilderOptions.arrayPath]: [{}],
  };
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={sideOfBody.schema}
      uiSchema={sideOfBody.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

describe('526 side of body shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders heading, label, 3 radio group options, and submit', () => {
    const { container } = mountPage();
    const view = within(container);

    expect(view.getByRole('heading', { level: 3, name: /condition/i })).to
      .exist;

    const group = container.querySelector('va-radio');
    expect(group).to.exist;
    expect(group).to.have.attribute(
      'label',
      'Which side of the body is your condition on?',
    );

    const options = [...container.querySelectorAll('va-radio-option')];
    expect(options).to.have.length(3);
    expect(container.querySelector('va-radio-option[value="RIGHT"]')).to.exist;
    expect(container.querySelector('va-radio-option[value="LEFT"]')).to.exist;
    expect(container.querySelector('va-radio-option[value="BILATERAL"]')).to
      .exist;

    expect(view.getByRole('button', { name: /submit/i })).to.exist;
  });

  it('allows submit without a selection (not required)', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(onSubmit.calledOnce).to.be.true;
    });
  });

  it('submits when selecting RIGHT via event', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);
    const group = container.querySelector('va-radio');
    fireEvent(
      group,
      new CustomEvent('vaChange', {
        bubbles: true,
        detail: { value: 'RIGHT' },
      }),
    );

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('submits when selecting LEFT via event', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);
    const group = container.querySelector('va-radio');
    fireEvent(
      group,
      new CustomEvent('vaChange', {
        bubbles: true,
        detail: { value: 'LEFT' },
      }),
    );

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('submits when selecting BILATERAL via event', async () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);
    const group = container.querySelector('va-radio');
    fireEvent(
      group,
      new CustomEvent('vaChange', {
        bubbles: true,
        detail: { value: 'BILATERAL' },
      }),
    );

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });
});
