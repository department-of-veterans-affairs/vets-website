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

import ratedDisabilityDatePage from '../../../pages/disabilityConditions/shared/ratedDisabilityDate';
import formConfig from '../../../config/form';
import * as utils from '../../../pages/disabilityConditions/shared/utils';

const seed = {
  [utils.arrayBuilderOptions.arrayPath]: [{}],
};

const mountPage = (data = {}, onSubmit = () => {}) => {
  return render(
    <DefinitionTester
      definitions={formConfig.defaultDefinitions}
      schema={ratedDisabilityDatePage.schema}
      uiSchema={ratedDisabilityDatePage.uiSchema}
      data={{ ...seed, ...data }}
      onSubmit={onSubmit}
    />,
  );
};

const getDateErrorMsg = container =>
  container.querySelector('va-memorable-date');

describe('526 rated disability date shared page', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders form, heading, date component, and submit', () => {
    const { container } = mountPage();
    const view = within(container);

    expect(
      view.getByRole('heading', {
        level: 3,
        name: /service-connected disability/i,
      }),
    ).to.exist;
    expect(view.getByRole('button', { name: /submit/i })).to.exist;
    expect(container.querySelector('va-memorable-date')).to.exist;
  });

  it('renders the correct label and hint text on <va-memorable-date>', () => {
    const { container } = mountPage();
    const dateElem = container.querySelector('va-memorable-date');

    expect(dateElem).to.exist;
    expect(dateElem).to.have.attribute(
      'label',
      'When did your condition get worse?',
    );
    expect(dateElem)
      .to.have.attribute('hint')
      .that.matches(/You can share an approximate date/i);
  });

  it('injects style into va-memorable-date to hide default hint', async () => {
    const stub = sinon.stub(utils, 'addStyleToShadowDomOnPages');
    try {
      mountPage();

      await waitFor(() => {
        expect(stub.calledOnce).to.be.true;
      });

      const [pages, tags, css] = stub.firstCall.args;
      expect(pages).to.deep.equal(['']);
      expect(tags).to.deep.equal(['va-memorable-date']);
      expect(css).to.equal('#dateHint {display:none}');
    } finally {
      stub.restore();
    }
  });

  it('submits with a valid past date and shows no errors', async () => {
    const onSubmit = sinon.spy();
    const stubTime = sinon
      .stub(Date, 'now')
      .returns(new Date('2025-08-27T12:00:00Z').getTime());

    try {
      const data = {
        [utils.arrayBuilderOptions.arrayPath]: [{}],
        conditionDate: '2025-01-01',
      };

      const { container } = mountPage(data, onSubmit);
      const view = within(container);

      view.getByRole('button', { name: /submit/i }).click();

      await waitFor(() => {
        expect(onSubmit.calledOnce).to.be.true;
      });
      expect(view.queryByText(/must be/i)).to.not.exist;
    } finally {
      stubTime.restore();
    }
  });

  it('allows submit without a date when not required', () => {
    const onSubmit = sinon.spy();
    const { container } = mountPage({}, onSubmit);
    const view = within(container);

    fireEvent.click(view.getByRole('button', { name: /submit/i }));
    expect(onSubmit.calledOnce).to.be.true;
    expect(view.queryByText(/required/i)).to.not.exist;
  });

  it('shows an error for a future date', async () => {
    const onSubmit = sinon.spy();
    const data = {
      [utils.arrayBuilderOptions.arrayPath]: [{}],
      conditionDate: '2999-01-01',
    };

    const { container } = mountPage(data, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });
  });

  it('rejects year before 1900', async () => {
    const onSubmit = sinon.spy();
    const nowStub = sinon
      .stub(Date, 'now')
      .returns(new Date('2025-08-27T12:00:00Z').getTime());
    try {
      const { container } = mountPage(
        { ...seed, conditionDate: '1899-XX-XX' },
        onSubmit,
      );
      const view = within(container);

      view.getByRole('button', { name: /submit/i }).click();

      await waitFor(() => {
        expect(onSubmit.called).to.be.false;
      });

      const dateErrorMsg = getDateErrorMsg(container);
      expect(dateErrorMsg.getAttribute('error')).to.match(
        /between 1900 and 2025/i,
      );
    } finally {
      nowStub.restore();
    }
  });

  it('rejects year after current year (approximate date)', async () => {
    const onSubmit = sinon.spy();
    const nowStub = sinon
      .stub(Date, 'now')
      .returns(new Date('2025-08-27T12:00:00Z').getTime());
    try {
      const { container } = mountPage(
        { ...seed, conditionDate: '2026-XX-XX' },
        onSubmit,
      );
      const view = within(container);

      view.getByRole('button', { name: /submit/i }).click();

      await waitFor(() => {
        expect(onSubmit.called).to.be.false;
      });

      const dateErrorMsg = getDateErrorMsg(container);
      const maxYear = new Date(Date.now()).getUTCFullYear();
      expect(dateErrorMsg.getAttribute('error')).to.match(
        new RegExp(`between\\s+1900\\s+and\\s+${maxYear}`, 'i'),
      );
    } finally {
      nowStub.restore();
    }
  });

  it('accepts year-only within range', async () => {
    const onSubmit = sinon.spy();
    const nowStub = sinon
      .stub(Date, 'now')
      .returns(new Date('2025-08-27T12:00:00Z').getTime());
    try {
      const { container } = mountPage(
        { ...seed, conditionDate: '2020-XX-XX' },
        onSubmit,
      );
      const view = within(container);

      view.getByRole('button', { name: /submit/i }).click();

      await waitFor(() => {
        expect(onSubmit.calledOnce).to.be.true;
      });

      const dateErrorMsg = getDateErrorMsg(container);
      expect(dateErrorMsg.getAttribute('error')).to.not.be.ok;
    } finally {
      nowStub.restore();
    }
  });

  it('accepts month and year only within range', async () => {
    const onSubmit = sinon.spy();
    const nowStub = sinon
      .stub(Date, 'now')
      .returns(new Date('2025-08-27T12:00:00Z').getTime());

    try {
      const { container } = mountPage(
        { ...seed, conditionDate: '2020-06-XX' },
        onSubmit,
      );
      const view = within(container);

      view.getByRole('button', { name: /submit/i }).click();

      await waitFor(() => {
        expect(onSubmit.calledOnce).to.be.true;
      });
    } finally {
      nowStub.restore();
    }
  });

  it('rejects month-only without a year (e.g., XXXX-06-XX)', async () => {
    const onSubmit = sinon.spy();

    const { container } = mountPage({ conditionDate: 'XXXX-06-XX' }, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });

    const dateErrorMsg = getDateErrorMsg(container);
    expect(dateErrorMsg.getAttribute('error')).to.match(
      /enter a year only.*month and year.*full date/i,
    );
  });

  it('rejects month and day without a year (e.g., XXXX-06-15)', async () => {
    const onSubmit = sinon.spy();

    const { container } = mountPage({ conditionDate: 'XXXX-06-15' }, onSubmit);
    const view = within(container);

    view.getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(onSubmit.called).to.be.false;
    });

    const dateErrorMsg = getDateErrorMsg(container);
    expect(dateErrorMsg.getAttribute('error')).to.match(
      /enter a year only.*month and year.*full date/i,
    );
  });
});
