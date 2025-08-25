import React from 'react';
import { expect } from 'chai';
import { cleanup, render } from '@testing-library/react';
import useStudentFeedbackCards from '../../hooks/useStudentFeedbackCards';

const Harness = props => {
  const out = useStudentFeedbackCards(props);
  return (
    <div>
      <pre data-testid="cards">{JSON.stringify(out.cards)}</pre>
      <pre data-testid="years">{JSON.stringify(out.availableYears)}</pre>
      <pre data-testid="types">{JSON.stringify(out.availableTypes)}</pre>
    </div>
  );
};

const parse = el => JSON.parse(el.textContent);

describe('useStudentFeedbackCards (with real helpers)', () => {
  afterEach(() => cleanup());

  it('builds cards with correct labels/defs, year totals, and per-campus/all-campus counts', () => {
    const allOpe6Complaints = [
      { closed: '2022-06-15', facilityCode: '111', categories: ['marketing'] },
      {
        closed: '2022-06-20',
        facilityCode: '111',
        categories: ['accreditation', 'marketing'],
      },
      { closed: '2022-07-01', facilityCode: '222', categories: ['marketing'] },
      {
        closed: '2023-06-15',
        facilityCode: '111',
        categories: ['financial'],
      },
    ];

    const complaintData = [
      { key: 'Marketing', type: 'Marketing', definition: 'Ads related issues' },
      {
        key: 'Accreditation',
        type: 'Accreditation',
        definition: 'Course issues',
      },
      {
        key: 'Financial',
        type: 'Financial',
        definition: 'Money topics',
      },
    ];

    const { getByTestId } = render(
      <Harness
        allOpe6Complaints={allOpe6Complaints}
        facilityCode="111"
        complaintData={complaintData}
      />,
    );

    const cards = parse(getByTestId('cards'));
    const years = parse(getByTestId('years'));
    const types = parse(getByTestId('types'));

    expect(years).to.deep.equal([2023, 2022]);

    expect(types).to.deep.equal(['accreditation', 'financial', 'marketing']);

    const expectCard = (idx, shape) => {
      const c = cards[idx];
      expect(c, `card @ index ${idx}`).to.exist;
      Object.entries(shape).forEach(([k, v]) => {
        expect(c[k]).to.eql(v, `mismatch on "${k}" for card[${idx}]`);
      });
    };

    expectCard(0, {
      year: 2022,
      key: 'marketing',
      label: 'Marketing',
      definition: 'Ads related issues',
      totalYear: 3,
      campusCount: 2,
      allCampusCount: 3,
    });

    expectCard(1, {
      year: 2022,
      key: 'accreditation',
      label: 'Accreditation',
      definition: 'Course issues',
      totalYear: 3,
      campusCount: 1,
      allCampusCount: 1,
    });

    expectCard(2, {
      year: 2022,
      key: 'marketing',
      label: 'Marketing',
      definition: 'Ads related issues',
      totalYear: 3,
      campusCount: 2,
      allCampusCount: 3,
    });

    expectCard(3, {
      year: 2023,
      key: 'financial',
      label: 'Financial',
      definition: 'Money topics',
      totalYear: 1,
      campusCount: 1,
      allCampusCount: 1,
    });

    expect(cards[0].id).to.include('2022-06-15-111-0');
    expect(cards[2].id).to.include('2022-07-01-222-2');

    expect(cards[1].coCategories).to.deep.equal(['accreditation', 'marketing']);
  });

  it('handles empty inputs gracefully', () => {
    const { getByTestId } = render(
      <Harness allOpe6Complaints={[]} facilityCode="123" complaintData={[]} />,
    );
    expect(parse(getByTestId('cards'))).to.deep.equal([]);
    expect(parse(getByTestId('years'))).to.deep.equal([]);
    expect(parse(getByTestId('types'))).to.deep.equal([]);
  });

  it('falls back to humanized label when a category is missing in complaintData', () => {
    const allOpe6Complaints = [
      { closed: '2024-06-15', facilityCode: '999', categories: ['other'] },
    ];

    const { getByTestId } = render(
      <Harness
        allOpe6Complaints={allOpe6Complaints}
        facilityCode="999"
        complaintData={[]}
      />,
    );

    const cards = parse(getByTestId('cards'));
    expect(cards).to.have.lengthOf(1);
    expect(cards[0].key).to.equal('other');
    expect(cards[0].label).to.equal('Other');
    expect(cards[0].definition).to.equal('');
  });
});
