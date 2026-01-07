import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '../../tests/mocks/setup';
import useAmbAvs from './useAmbAvs';
import * as avsUtils from '../../utils/avs';

// Test probe component to consume the hook and expose values in the DOM
function HookProbe({ appointment, flag }) {
  const { avsPairs, hasValidPdfAvs, objectUrls } = useAmbAvs(appointment, flag);

  return (
    <div>
      <div data-testid="count">{avsPairs.length}</div>
      <div data-testid="has">{String(hasValidPdfAvs)}</div>
      <div data-testid="urls">{JSON.stringify(objectUrls)}</div>
      {avsPairs.map((p, i) => (
        <span data-testid={`pair-${i}-id`} key={p.file?.id}>
          {p.file?.id}
        </span>
      ))}
    </div>
  );
}

HookProbe.propTypes = {
  appointment: PropTypes.object,
  flag: PropTypes.bool,
};

describe('VAOS Hook: useAmbAvs', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns empty results when feature flag is disabled', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          name: 'Ambulatory Visit Summary',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
      ],
    };

    const buildStub = sandbox
      .stub(avsUtils, 'buildPdfObjectUrls')
      .returns(['blob:1']);

    const screen = renderWithStoreAndRouter(
      <HookProbe appointment={appointment} flag={false} />,
      { initialState: {} },
    );

    expect(screen.getByTestId('count').textContent).to.equal('0');
    expect(screen.getByTestId('has').textContent).to.equal('false');
    expect(screen.getByTestId('urls').textContent).to.equal('[]');
    expect(buildStub.called).to.be.false;
  });

  it('builds pairs and urls when flag enabled and PDFs valid', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          name: 'Ambulatory Visit Summary 1',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
        {
          id: '2',
          name: 'Ambulatory Visit Summary 2',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
      ],
    };

    sandbox.stub(avsUtils, 'buildPdfObjectUrls').returns(['blob:1', 'blob:2']);

    const screen = renderWithStoreAndRouter(
      <HookProbe appointment={appointment} flag />,
      { initialState: {} },
    );

    expect(screen.getByTestId('count').textContent).to.equal('2');
    expect(screen.getByTestId('has').textContent).to.equal('true');
    expect(screen.getByTestId('urls').textContent).to.equal(
      JSON.stringify(['blob:1', 'blob:2']),
    );
    expect(screen.getByTestId('pair-0-id').textContent).to.equal('1');
    expect(screen.getByTestId('pair-1-id').textContent).to.equal('2');
  });

  it('filters out pairs with falsy urls while exposing full objectUrls array', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          name: 'Ambulatory Visit Summary 1',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
        {
          id: '2',
          name: 'Ambulatory Visit Summary 2',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
      ],
    };

    sandbox.stub(avsUtils, 'buildPdfObjectUrls').returns(['blob:1', null]);

    const screen = renderWithStoreAndRouter(
      <HookProbe appointment={appointment} flag />,
      { initialState: {} },
    );

    expect(screen.getByTestId('count').textContent).to.equal('1');
    expect(screen.getByTestId('has').textContent).to.equal('true');
    expect(screen.getByTestId('pair-0-id').textContent).to.equal('1');
    expect(screen.getByTestId('urls').textContent).to.equal(
      JSON.stringify(['blob:1', null]),
    );
  });

  it('recomputes when the feature flag toggles from false to true', () => {
    const appointment = {
      avsPdf: [
        {
          id: '1',
          name: 'Ambulatory Visit Summary 1',
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'JVBERi0xLjQK',
        },
      ],
    };

    sandbox.stub(avsUtils, 'buildPdfObjectUrls').returns(['blob:1']);

    const screen1 = renderWithStoreAndRouter(
      <HookProbe appointment={appointment} flag={false} />,
      { initialState: {} },
    );

    const firstCounts = screen1.getAllByTestId('count');
    expect(firstCounts[firstCounts.length - 1].textContent).to.equal('0');
    const firstHas = screen1.getAllByTestId('has');
    expect(firstHas[firstHas.length - 1].textContent).to.equal('false');

    const screen2 = renderWithStoreAndRouter(
      <HookProbe appointment={appointment} flag />,
      { initialState: {} },
    );

    const counts = screen2.getAllByTestId('count');
    expect(counts[counts.length - 1].textContent).to.equal('1');
    const hasEls = screen2.getAllByTestId('has');
    expect(hasEls[hasEls.length - 1].textContent).to.equal('true');
    expect(screen2.getByTestId('pair-0-id').textContent).to.equal('1');
  });
});
