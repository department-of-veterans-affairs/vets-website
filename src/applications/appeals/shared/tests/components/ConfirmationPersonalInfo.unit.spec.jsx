import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';
import ConfirmationPersonalInfo from '../../components/ConfirmationPersonalInfo';
import { dob, userFullName, veteran } from '../data/veteran';

describe('ConfirmationPersonalInfo', () => {
  it('should render all fields for HLR & NOD', () => {
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless
        userFullName={userFullName}
        veteran={veteran()}
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(7);
    expect(
      items.map(
        (item, index) => item[index === 4 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'Yes',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
    ]);
  });

  it('should render all fields for SC', () => {
    const TestLi = () => (
      <li className="dd-privacy-hidden" data-dd-action-name="test">
        Testing
      </li>
    );
    const livingSituation = <TestLi />;
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless
        userFullName={userFullName}
        veteran={veteran(true, 'mobilePhone')}
        livingSituation={livingSituation}
        hasHomeAndMobilePhone
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(8);
    expect(
      items.map(
        (item, index) =>
          item[[4, 5].includes(index) ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'Testing',
      '<va-telephone contact="5558002222" extension="5678" not-clickable="true"></va-telephone>',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StNew York, NY 30012',
    ]);
  });

  it('should render all fields with international address', () => {
    const { container } = render(
      <ConfirmationPersonalInfo
        dob={dob}
        homeless={false}
        userFullName={userFullName}
        veteran={veteran(false)}
      />,
    );

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(7);
    expect(
      items.map(
        (item, index) => item[index === 4 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal([
      'Mike Wazowski',
      '●●●–●●–8765V A file number ending with 8 7 6 5',
      'October 28, 2001',
      'No',
      '<va-telephone contact="5558001111" extension="2345" not-clickable="true"></va-telephone>',
      'user@example.com',
      '123 Main StParis, Ile-de-France, France 75000',
    ]);
  });

  it('should render without any data', () => {
    const { container } = render(<ConfirmationPersonalInfo />);

    expect($('h3', container).textContent).to.eq('Personal information');
    expect($$('ul[role="list"]', container).length).to.eq(1);

    const items = $$('.dd-privacy-hidden[data-dd-action-name]', container);
    expect(items.length).to.eq(5);
    expect(
      items.map(
        (item, index) => item[index === 3 ? 'innerHTML' : 'textContent'],
      ),
    ).to.deep.equal(['', 'Not answered', '', '', ',  ']);
  });
});
