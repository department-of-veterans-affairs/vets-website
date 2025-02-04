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

import ConfirmationPageV2, {
  LivingSituationQuestions,
} from '../../components/ConfirmationPageV2';
import maxData from '../fixtures/data/maximal-test.json';
import maxDataV2 from '../fixtures/data/maximal-test-v2.json';
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
    expect(items.length).to.eq(7);
    expect(
      items.map(
        (el, index) => el[[2, 3].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      '',
      'Not selected',
      '<va-telephone contact="" not-clickable="true"></va-telephone>',
      '<va-telephone contact="" not-clickable="true"></va-telephone>',
      '',
      ',  ',
      'No, I didn’t certify',
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
      `Your Supplemental Claim submission is in progress`,
    );
    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(5);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      'File a Supplemental Claim', // print only header
      'Your Supplemental Claim submission is in progress',
      'What to expect next',
      'How to contact us if you have questions',
      'Your Supplemental Claim request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(4); // 5 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
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

    expect($$('ul', container).length).to.eq(6);
    expect($$('li', container).length).to.eq(22);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(31);
    expect(
      items.map(
        (el, index) => el[[4, 5].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Not selected',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
      'VAMC Location 1',
      'Test and Test 2',
      'Jan 1, 2001 – Jan 1, 2011',
      'VAMC Location 2',
      'Test 2',
      'Feb 2, 2002 – Feb 2, 2012',
      'Private Doctor',
      '123 maincity, AK 90210',
      'Test and Test 2',
      'Jan 1, 2022 – Feb 1, 2022',
      'Private Hospital',
      '456 maincity, AK 90211',
      'Test 2',
      'Feb 1, 2022 – May 1, 2022',
      'private-medical-records.pdf',
      'x-rays.pdf',
      'buddy-statement.pdf',
      'photos.pdf',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the v2 confirmation page with evidence', () => {
    const data = getData(maxDataV2.data);
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    expect($('va-alert[status="success"]', container)).to.exist;
    expect($('va-alert[status="success"]', container).innerHTML).to.contain(
      `Your Supplemental Claim submission is in progress`,
    );
    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(5);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      'File a Supplemental Claim', // print only header
      'Your Supplemental Claim submission is in progress',
      'What to expect next',
      'How to contact us if you have questions',
      'Your Supplemental Claim request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(5); // 6 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
      'Issues for review',
      'New and relevant evidence',
      'VHA indicator',
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

    expect($$('ul', container).length).to.eq(7);
    expect($$('li', container).length).to.eq(31);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(37);
    expect(
      items.map(
        (el, index) =>
          el[[7, 8, 9].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Yes',
      'I live or sleep overnight in a place that isn’t meant for regular sleeping, I live in a shelter, I’m staying with a friend or family member, I will have to leave a facility in the next 30 days, I will lose my home in the next 30 days, and I have another housing risk not listed here',
      'Lorem ipsum',
      'John Doe',
      '<va-telephone contact="8005551212" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
      'A VA Vet center, A community care provider that VA paid for, A VA medical center (also called a VAMC), A community-based outpatient clinic (also called a CBOC), A Department of Defense military treatment facility (also called an MTF), A non-VA healthcare provider, and Lorem ipsum',
      'VAMC Location 1',
      'Test and Test 2',
      'January 2001',
      'VAMC Location 2',
      'Test 2',
      // I don't have a date (not hidden from DataDog)
      'Private Doctor',
      '123 maincity, AK 90210',
      'Test and Test 2',
      'Jan 1, 2022 – Feb 1, 2022',
      'Private Hospital',
      '456 maincity, AK 90211',
      'Test 2',
      'Feb 1, 2022 – May 1, 2022',
      'private-medical-records.pdf',
      'x-rays.pdf',
      'buddy-statement.pdf',
      'photos.pdf',
      'Yes',
      'I gave permission in the past, but I want to revoke (or cancel) my permission',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the confirmation page with no evidence', () => {
    const data = getData({
      ...maxData.data,
      facilityTypes: {},
      mstOption: false,
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
      `Your Supplemental Claim submission is in progress`,
    );
    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(5);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      'File a Supplemental Claim', // print only header
      'Your Supplemental Claim submission is in progress',
      'What to expect next',
      'How to contact us if you have questions',
      'Your Supplemental Claim request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(5); // 6 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
      'Issues for review',
      'New and relevant evidence',
      'Review the evidence you’re submitting',
    ]);

    expect($('.no-evidence', container).textContent).to.eq(
      'I didn’t add any evidence',
    );

    expect($$('ul', container).length).to.eq(3);
    expect($$('li', container).length).to.eq(13);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(13);
    expect(
      items.map(
        (el, index) => el[[4, 5].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Not selected',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the v2 confirmation page with no evidence & alternate living situation', () => {
    const data = getData({
      ...maxDataV2.data,
      facilityTypes: {},
      mstOption: false,
      [EVIDENCE_VA]: false,
      [EVIDENCE_PRIVATE]: false,
      [EVIDENCE_OTHER]: false,
      livingSituation: { none: true },
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    expect($('va-alert[status="success"]', container)).to.exist;
    expect($('va-alert[status="success"]', container).innerHTML).to.contain(
      `Your Supplemental Claim submission is in progress`,
    );
    // expect($('va-loading-indicator', container)).to.exist;
    const h2s = $$('h2', container);
    expect(h2s.length).to.eq(5);
    expect(h2s.map(el => el.textContent)).to.deep.equal([
      'File a Supplemental Claim', // print only header
      'Your Supplemental Claim submission is in progress',
      'What to expect next',
      'How to contact us if you have questions',
      'Your Supplemental Claim request',
    ]);

    const h3s = $$('h3', container);
    expect(h3s.length).to.eq(6); // 8 with PDF download code added
    expect(h3s.map(el => el.textContent)).to.deep.equal([
      // 'Save a PDF copy of your Supplemental Claim request',
      'Print this confirmation page',
      'Personal information',
      'Issues for review',
      'New and relevant evidence',
      'Review the evidence you’re submitting',
      'VHA indicator',
    ]);

    expect($('.no-evidence', container).textContent).to.eq(
      'I didn’t add any evidence',
    );

    expect($$('ul', container).length).to.eq(4);
    expect($$('li', container).length).to.eq(18);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(18);
    expect(
      items.map(
        (el, index) =>
          el[[6, 7, 8].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Yes',
      'None of these situations apply to me.',
      'John Doe',
      '<va-telephone contact="8005551212" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
      'None selected',
      'No',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the v2 confirmation page with alternate choices', () => {
    const data = getData({
      ...maxDataV2.data,
      facilityTypes: {},
      optionIndicator: 'no',
      livingSituation: {},
      pointOfContactName: '',
      pointOfContactPhone: '',
      [EVIDENCE_VA]: false,
      [EVIDENCE_PRIVATE]: false,
      [EVIDENCE_OTHER]: false,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    expect($$('ul', container).length).to.eq(4);
    expect($$('li', container).length).to.eq(19);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(19);
    expect(
      items.map(
        (el, index) => el[[7, 8].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Yes',
      'None selected',
      'Nothing entered',
      'Nothing entered',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
      'None selected',
      'Yes',
      'No',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });

  it('should render the v2 confirmation page with more alternate choices', () => {
    const data = getData({
      ...maxDataV2.data,
      facilityTypes: {},
      optionIndicator: '',
      livingSituation: { other: true },
      otherHousingRisks: '',
      pointOfContactName: '',
      pointOfContactPhone: '',
      [EVIDENCE_VA]: false,
      [EVIDENCE_PRIVATE]: false,
      [EVIDENCE_OTHER]: false,
    });
    const { container } = render(
      <Provider store={mockStore(data)}>
        <ConfirmationPageV2 />
      </Provider>,
    );

    expect($$('ul', container).length).to.eq(4);
    expect($$('li', container).length).to.eq(20);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(20);
    expect(
      items.map(
        (el, index) => el[[8, 9].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Michael Thomas Wazowski, Esq.',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'February 3, 1990',
      'Yes',
      'I have another housing risk not listed here.',
      'Nothing entered',
      'Nothing entered',
      'Nothing entered',
      '<va-telephone contact="5558001111" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558002222" extension="1234" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
      'HeadachesDecision date: June 10, 2021',
      'TinnitusDecision date: June 1, 2021',
      'TestDecision date: January 1, 2022',
      'Test 2Decision date: June 28, 2022',
      'Yes, I certify',
      'None selected',
      'Yes',
      'None selected',
    ]);
    expect($$('.vads-c-action-link--green', container).length).to.eq(1);
  });
});

describe('LivingSituationQuestions', () => {
  it('should render the living situation questions', () => {
    const data = { housingRisk: true };
    const { container } = render(<LivingSituationQuestions data={data} />);
    expect($$('li', container).length).to.eq(4);
  });

  it('should prevent submission & show error if none & any other option selected', () => {
    const data = { housingRisk: false };
    const { container } = render(<LivingSituationQuestions data={data} />);
    expect($$('li', container).length).to.eq(1);
  });

  it('should render the other living situation question with nothing entered', () => {
    const data = { housingRisk: true, livingSituation: { other: true } };
    const { container } = render(<LivingSituationQuestions data={data} />);

    const list = $$('li', container);
    expect(list.length).to.eq(5);
    expect(list.map(el => el.textContent)).to.deep.equal([
      'Are you experiencing homelessness or at risk of becoming homeless?Yes',
      'Which of these statements best describes your living situation?I have another housing risk not listed here.',
      'Tell us about other housing risks you’re experiencing.Nothing entered',
      'Name of your point of contactNothing entered',
      'Telephone number of your point of contactNothing entered',
    ]);
  });

  it('should render the other living situation question', () => {
    const data = {
      housingRisk: true,
      livingSituation: {
        other: true,
        friendOrFamily: true,
      },
      otherHousingRisks: 'Lorem ipsum',
      pointOfContactName: 'John Doe',
      pointOfContactPhone: '8005551212',
    };
    const { container } = render(<LivingSituationQuestions data={data} />);

    const list = $$('li', container);
    expect(list.length).to.eq(5);
    expect(list.map(el => el.textContent)).to.deep.equal([
      'Are you experiencing homelessness or at risk of becoming homeless?Yes',
      'Which of these statements best describes your living situation?I have another housing risk not listed here and I’m staying with a friend or family member',
      'Tell us about other housing risks you’re experiencing.Lorem ipsum',
      'Name of your point of contactJohn Doe',
      'Telephone number of your point of contact', // number inside va-telephone
    ]);
  });
});
