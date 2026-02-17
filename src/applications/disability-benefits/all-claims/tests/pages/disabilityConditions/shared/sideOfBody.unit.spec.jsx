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

import sideOfBody from '../../../../pages/disabilityConditions/shared/sideOfBody';
import formConfig from '../../../../config/form';
import * as utils from '../../../../pages/disabilityConditions/shared/utils';

const mountPage = (data = {}, onSubmit = () => {}) => {
  const seed = {
    [utils.arrayOptions.arrayPath]: [{}],
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

  it('blocks submit without a selection (required)', async () => {
    const onSubmit = sinon.spy();
    const { container, getByRole } = mountPage({}, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const radio = container.querySelector('va-radio');
      expect(radio).to.have.attribute('error', 'You must provide a response');
    });

    expect(onSubmit.called).to.be.false;
  });

  it('submits when RIGHT is selected', async () => {
    const onSubmit = sinon.spy();
    const { getByRole } = mountPage({ sideOfBody: 'RIGHT' }, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('submits when LEFT is selected', async () => {
    const onSubmit = sinon.spy();
    const { getByRole } = mountPage({ sideOfBody: 'LEFT' }, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });

  it('submits when BILATERAL is selected', async () => {
    const onSubmit = sinon.spy();
    const { getByRole } = mountPage({ sideOfBody: 'BILATERAL' }, onSubmit);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSubmit.calledOnce).to.be.true);
  });
});
