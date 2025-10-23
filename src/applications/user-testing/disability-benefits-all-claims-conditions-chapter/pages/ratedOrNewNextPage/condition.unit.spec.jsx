import 'platform/testing/unit/mocha-setup';
import React from 'react';
import { expect } from 'chai';
import { render, cleanup } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import conditionPage from './condition';
import formConfig from '../../config/form';

const mountPage = (data = {}) =>
  render(
    <DefinitionTester
      data={data}
      onSubmit={() => {}}
      definitions={formConfig?.defaultDefinitions || {}}
      schema={conditionPage.schema}
      uiSchema={conditionPage.uiSchema}
    />,
  );

describe('Rated disability condition page (schema config)', () => {
  afterEach(() => cleanup());

  it('renders radio group with correct label and hint, and populates options from fullData', () => {
    const { container } = mountPage({
      ratedDisabilities: [
        { name: 'Knee', ratingPercentage: 20 },
        { name: 'PTSD', ratingPercentage: 50 },
      ],
    });
    const headingLvl3 = container.querySelector('h3');
    const group = container.querySelector('va-radio');
    const btn = container.querySelector('button');

    expect(headingLvl3).to.exist;
    expect(headingLvl3.textContent).to.equal('Add a condition');

    expect(group).to.exist;
    expect(group.getAttribute('label')).to.equal(
      'What condition would you like to add?',
    );
    expect(group.getAttribute('hint')).to.match(/Choose one/i);

    expect(btn).to.exist;
    expect(btn.textContent).to.equal('Submit');

    const options = container.querySelectorAll('va-radio-option');
    expect(options.length).to.be.at.least(3);

    const html = container.innerHTML;
    expect(html).to.include('Knee');
    expect(html).to.include('PTSD');
  });
});
