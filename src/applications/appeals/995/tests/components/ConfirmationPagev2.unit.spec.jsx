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
import { EVIDENCE_VA, EVIDENCE_PRIVATE, EVIDENCE_OTHER } from '../../constants';

const getData = (customData = maxData.data) => ({
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
    expect(items.length).to.eq(9);
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
      'No',
      'None selected',
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

    expect($('.va-title', container).textContent).to.eq(
      'We’re requesting records from these VA locations:',
    );
    expect($('.private-title', container).textContent).to.eq(
      'We’re requesting records from these non-VA medical providers:',
    );
    expect($('.upload-title', container).textContent).to.eq(
      'You uploaded these documents:',
    );

    expect($$('ul', container).length).to.eq(8);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(32);
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
      'No',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes',
      'I gave permission in the past, but I want to revoke (or cancel) my permission',
      'Yes, I certify',
      'A VA Vet center, A community care provider that VA paid for, A VA medical center (also called a VAMC), A community-based outpatient clinic (also called a CBOC), A Department of Defense military treatment facility (also called an MTF), A non-VA healthcare provider, and Lorem ipsum',
      'VAMC Location 1',
      'Test and Test 2',
      'January 2001',
      'VAMC Location 2',
      'Test 2',
      'February 2001',
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

  it('should render the confirmation page with no evidence', () => {
    const data = getData({
      ...maxData.data,
      facilityTypes: {},
      optionIndicator: 'no',
      [EVIDENCE_VA]: false,
      [EVIDENCE_PRIVATE]: false,
      [EVIDENCE_OTHER]: false,
    });
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
    expect(h3s.length).to.eq(6); // 7 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
      'Living situation',
      'Issues for review',
      'New and relevant evidence',
      'Review the evidence you’re submitting',
    ]);

    expect($('.no-evidence', container).textContent).to.eq(
      'I didn’t add any evidence',
    );

    expect($$('ul', container).length).to.eq(5);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(16);
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
      'No',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes',
      'No',
      'Yes, I certify',
      'None selected',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });
});
