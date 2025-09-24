import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $$ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { LivingSituation } from '../../components/LivingSituation';

describe('LivingSituation', () => {
  it('should render the living situation questions', () => {
    const data = { housingRisk: true };
    const { container } = render(<LivingSituation data={data} />);
    expect($$('li', container).length).to.eq(4);
  });

  it('should prevent submission & show error if none & any other option selected', () => {
    const data = { housingRisk: false };
    const { container } = render(<LivingSituation data={data} />);
    expect($$('li', container).length).to.eq(1);
  });

  it('should render the other living situation question with nothing entered', () => {
    const data = { housingRisk: true, livingSituation: { other: true } };
    const { container } = render(<LivingSituation data={data} />);

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
    const { container } = render(<LivingSituation data={data} />);

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
