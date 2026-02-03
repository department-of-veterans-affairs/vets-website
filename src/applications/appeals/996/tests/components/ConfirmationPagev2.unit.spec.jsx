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
import maxData from '../fixtures/data/maximal-test-v2.json';

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
    formId: '20-0996',
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
    const data = getData();
    const { container } = render(
      <Provider store={mockStore({})}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    const date = getReadableDate(data.form.submission.response);

    const alert = $('va-alert[status="success"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(`You submitted the request on ${date}`);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(6);
    expect(
      items.map((el, index) => el[index === 3 ? 'innerHTML' : 'textContent']),
    ).to.deep.equal(['', 'Not answered', '', '', ',  ', '']);
  });

  it('should render the confirmation page with evidence', () => {
    const contactRepMessage =
      'Since you requested an informal conference, we’ll contact your accredited representative to schedule your conference.';
    const data = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    const date = getReadableDate(data.form.submission.response);

    const alert = $('va-alert[status="success"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(`You submitted the request on ${date}`);
    expect(alert.innerHTML).to.contain(contactRepMessage);

    const nextSteps = $('.next-steps', container).textContent;
    expect(nextSteps).to.contain(contactRepMessage);
    expect(nextSteps).to.contain('After we’ve completed our review');

    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(5);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      // `You submitted your Board Appeal request on ${date}`,
      'Request a Higher-Level Review', // print only header
      'Your Higher Level Review request submission is in progress',
      'What to expect next',
      'How to contact us if you have questions',
      'Your Higher-Level Review request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(4); // 5 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Board Appeal request',
      'Print this confirmation page',
      'Personal information',
      'Issues for review',
      'Informal conference',
    ]);
    expect($$('h4', container).length).to.eq(0);
    expect($$('ul', container).length).to.eq(3);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(17);
    expect(
      items.map(
        (el, index) =>
          el[[4, 14].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'No',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'tinnitusDecision date: Disagree with the service connection, the effective date of award, your evaluation of my condition, and this is tinnitus entry',
      'left kneeDecision date: Disagree with the effective date of award',
      'right shoulderDecision date: Disagree with your evaluation of my condition and this is right shoulder entry',
      'Yes',
      'Contact my accredited representative',
      'James',
      'Sullivan',
      '<va-telephone not-clickable="true" contact="8005551212" extension="1234"></va-telephone>',
      'sully@pixar.com',
      'Morning hours in your accredited representative’s time zone',
    ]);
    expect($$('va-link-action', container).length).to.eq(2);
  });

  it('should render the confirmation page with a hearing request', () => {
    const contactMeMessage =
      'Since you requested an informal conference, we’ll contact you to schedule your conference.';
    const data = getData({
      informalConference: 'me',
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    const date = getReadableDate(data.form.submission.response);

    const alert = $('va-alert[status="success"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(`You submitted the request on ${date}`);
    expect(alert.innerHTML).to.contain(contactMeMessage);

    const nextSteps = $('.next-steps', container).textContent;
    expect(nextSteps).to.contain(contactMeMessage);
    expect(nextSteps).to.contain('After we’ve completed our review');

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(13);
    expect(items.map(el => el.textContent).slice(-3)).to.deep.equal([
      'Yes',
      'Contact me',
      'Morning hours in my time zone',
    ]);
  });

  it('should render the confirmation page with a direct review', () => {
    const data = getData({
      informalConferenceChoice: 'no',
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );
    const date = getReadableDate(data.form.submission.response);

    const alert = $('va-alert[status="success"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(`You submitted the request on ${date}`);
    expect(alert.innerHTML).to.not.contain('Since you requested');

    const nextSteps = $('.next-steps', container).textContent;
    expect(nextSteps).to.not.contain('Since you requested');
    expect(nextSteps).to.contain('After we’ve completed our review');

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(11);
    expect(items.map(el => el.textContent).slice(-1)).to.deep.equal(['No']);
  });
});
