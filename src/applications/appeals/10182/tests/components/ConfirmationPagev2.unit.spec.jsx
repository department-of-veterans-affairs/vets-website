import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { expect } from 'chai';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import ConfirmationPageV2 from '../../components/ConfirmationPageV2';
import maxData from '../fixtures/data/maximal-test.json';

import { getReadableDate } from '../../../shared/utils/dates';

const getData = (customData = {}) => ({
  user: {
    profile: {
      userFullName: {
        first: 'Michael',
        middle: 'Thomas',
        last: 'Wazowski',
        suffix: 'Esq.',
      },
      dob: '1990-02-03',
    },
  },
  form: {
    formId: '10182',
    submission: {
      response: new Date().toISOString(),
    },
    data: {
      ...maxData.data,
      ...customData,
    },
  },
});

describe('ConfirmationPageV2', () => {
  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  it('should render with no data', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    expect($('va-alert[status="success"]', container)).to.exist;

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(8);
    expect(
      items.map((el, index) => el[index === 3 ? 'innerHTML' : 'textContent']),
    ).to.deep.equal([
      '',
      'Not selected',
      '',
      '',
      ',  ',
      'Not selected',
      'Not selected',
      '',
    ]);
  });

  it('should render the confirmation page with evidence', () => {
    const data = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    const date = getReadableDate(data.form.submission.response);

    expect($('va-alert[status="success"]', container)).to.exist;
    expect($('va-loading-indicator', container)).to.exist;

    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(4);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      `You submitted your Board Appeal request on ${date}`,
      'What to expect next',
      'How to contact us if you have questions',
      'Your Board Appeal request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(5);
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      'Save a PDF copy of your Board Appeal request',
      'Print this confirmation page',
      'Personal information',
      'Issues for review',
      'Board review options',
    ]);
    expect($$('h4', container).length).to.eq(0);
    expect($$('ul', container).length).to.eq(4);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(16);
    expect(
      items.map((el, index) => el[index === 4 ? 'innerHTML' : 'textContent']),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'No',
      '<va-telephone contact="5558001111" extension="2" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'Yes',
      'Lorem ipsum',
      'Yes',
      'tinnitusDecision date: June 1, 2021Disagree with the service connection, the effective date of award, your evaluation of my condition, and this is tinnitus entry',
      'left kneeDecision date: June 2, 2021Disagree with the effective date of award',
      'right shoulderDecision date: June 6, 2021Disagree with your evaluation of my condition and this is right shoulder entry',
      'Submit more evidence',
      'file-1.pdf',
      'file-2.pdf',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the confirmation page with a hearing request', () => {
    const data = getData({
      boardReviewOption: 'hearing',
      hearingTypePreference: 'central_office',
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(15);
    expect(items.map(el => el.textContent).slice(-2)).to.deep.equal([
      'Request a hearing',
      'An in-person hearing at the Board in Washington, D.C.',
    ]);
  });

  it('should render the confirmation page with a direct review', () => {
    const data = getData({
      boardReviewOption: 'direct_review',
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(14);
    expect(items.map(el => el.textContent).slice(-1)).to.deep.equal([
      'Request a direct review',
    ]);
  });
});
