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
    formId: '20-0995',
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
    expect(items.length).to.eq(12);
    expect(
      items.map(
        (el, index) => el[[1, 2].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      '',
      '<va-telephone contact="" not-clickable="true"></va-telephone>',
      '<va-telephone contact="" not-clickable="true"></va-telephone>',
      '',
      ',  ',
      'Not selected',
      'None selected',
      '',
      '',
      '',
      'No, I didn’t certify',
      'None selected',
    ]);
    expect($('va-summary-box', container)).to.not.exist;
  });

  it('should render the confirmation page with evidence', () => {
    const data = getData();
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    expect($('va-alert[status="success"]', container)).to.exist;
    expect($('va-alert[status="success"]', container).innerHTML).to.contain(
      `Thank you for filing a Supplemental Claim`,
    );
    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(4);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      'File a Supplemental Claim', // print only header
      'Thank you for filing a Supplemental Claim',
      'What to expect next',
      'Your Supplemental Claim request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(5); // 6 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
      'Living situation',
      'Issues for review',
      'New and relevant evidence',
    ]);

    const h4s = $$('h4', container);
    expect(h4s.length).to.eq(3);
    expect(h4s.map(el => el.textContent)).to.deep.equal([
      'We’re requesting records from these VA locations:',
      'We’re requesting records from these non-VA medical providers:',
      'You uploaded these documents:',
    ]);

    expect($$('ul', container).length).to.eq(8);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(30);
    expect(
      items.map((el, index) => el[index === 4 ? 'innerHTML' : 'textContent']),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      '',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'Not selected',
      'None selected',
      '',
      '',
      '',
      'Yes, I certify',
      'None selected',
      'VAMC Location 1',
      'Test and Test 2',
      'Jan 1, 2001 – Jan 1, 2011',
      'VAMC Location 2',
      'Test 2',
      'Feb 2, 2002 – Feb 2, 2012',
      'Private Doctor',
      'Test and Test 2',
      'Jan 1, 2022 – Feb 1, 2022',
      'Private Hospital',
      'Test 2',
      'Feb 1, 2022 – May 1, 2022',
      'private-medical-records.pdf',
      'x-rays.pdf',
      'buddy-statement.pdf',
      'photos.pdf',
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
    expect(items.length).to.eq(24);
    expect(items.map(el => el.textContent).slice(-2)).to.deep.equal([
      'Hearing',
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
      'Direct review',
    ]);
  });
});
