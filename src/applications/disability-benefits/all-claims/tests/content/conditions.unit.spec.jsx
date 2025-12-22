import React from 'react';
import { expect } from 'chai';
import { cleanup, render } from '@testing-library/react';

import {
  ConditionsIntroDescription,
  createCauseFollowUpDescriptions,
  formatDateString,
  NewConditionDescription,
  NewConditionCardDescription,
  RatedDisabilityCardDescription,
} from '../../content/conditions';

describe('formatDateString', () => {
  afterEach(() => cleanup());

  it('returns empty string for falsy inputs', () => {
    expect(formatDateString()).to.equal('');
    expect(formatDateString(null)).to.equal('');
    expect(formatDateString('')).to.equal('');
  });

  it('formats YYYY-MM-DD as "MMMM d, yyyy"', () => {
    expect(formatDateString('2023-05-17')).to.equal('May 17, 2023');
  });

  it('formats YYYY-MM as "MMMM yyyy"', () => {
    expect(formatDateString('2023-05')).to.equal('May 2023');
  });

  it('returns year for YYYY', () => {
    expect(formatDateString('2023')).to.equal(2023);
  });
});

describe('createCauseFollowUpDescriptions', () => {
  it('returns empty when no cause', () => {
    const item = {};
    expect(createCauseFollowUpDescriptions(item)).to.equal('');
  });

  it('returns cause is NEW', () => {
    const item = { cause: 'NEW' };
    expect(createCauseFollowUpDescriptions(item)).to.equal(
      'caused by an injury, event, disease or exposure during my service',
    );
  });

  it('returns cause is WORSENED', () => {
    const item = { cause: 'WORSENED' };
    expect(createCauseFollowUpDescriptions(item)).to.equal(
      'existed before I served in the military, but got worse because of my military service',
    );
  });

  it('returns cause is VA', () => {
    const item = { cause: 'VA' };
    expect(createCauseFollowUpDescriptions(item)).to.equal(
      'caused by an injury or event that happened when I was receiving VA care',
    );
  });

  it('returns SECONDARY matches in conditions (case/trim)', () => {
    const item = { cause: 'SECONDARY', causedByDisability: '  Migraine  ' };
    const fullData = { newDisabilities: [{ condition: 'migraine' }] };
    expect(createCauseFollowUpDescriptions(item, fullData)).to.equal(
      'caused by Migraine',
    );
  });

  it('returns SECONDARY match in conditions (sideOfBody)', () => {
    const item = {
      cause: 'SECONDARY',
      causedByDisability: 'Ankle sprain, left',
    };
    const fullData = {
      newDisabilities: [{ condition: 'ankle sprain', sideOfBody: 'Left' }],
    };
    expect(createCauseFollowUpDescriptions(item, fullData)).to.equal(
      'caused by Ankle sprain, left',
    );
  });

  it('returns SECONDARY match in conditions (multiple matching base conditions)', () => {
    const item = {
      cause: 'SECONDARY',
      causedByDisability: 'Ankle sprain, left',
    };
    const fullData = {
      newDisabilities: [
        { condition: 'ankle sprain', sideOfBody: 'Right' },
        { condition: 'ankle sprain', sideOfBody: 'Left' },
        { condition: 'ankle sprain', sideOfBody: 'Bilateral' },
      ],
    };
    expect(createCauseFollowUpDescriptions(item, fullData)).to.equal(
      'caused by Ankle sprain, left',
    );
  });

  it('returns SECONDARY with no match when sideOfBody is different', () => {
    const item = {
      cause: 'SECONDARY',
      causedByDisability: 'Ankle sprain, left',
    };
    const fullData = {
      newDisabilities: [{ condition: 'ankle sprain', sideOfBody: 'Right' }],
    };
    expect(createCauseFollowUpDescriptions(item, fullData)).to.equal(
      'Ankle sprain, left has been removed — please edit to change the cause or delete the condition',
    );
  });

  it('returns SECONDARY matches in ratedDisabilities', () => {
    const item = { cause: 'SECONDARY', causedByDisability: 'Knee Pain' };
    const fullData = { ratedDisabilities: [{ name: 'knee pain' }] };
    expect(createCauseFollowUpDescriptions(item, fullData)).to.equal(
      'caused by Knee Pain',
    );
  });

  it('returns SECONDARY with no match', () => {
    const item = { cause: 'SECONDARY', causedByDisability: 'Unknown Thing' };
    expect(createCauseFollowUpDescriptions(item, {})).to.equal(
      'Unknown Thing has been removed — please edit to change the cause or delete the condition',
    );
  });

  it('returns unknown cause returns empty', () => {
    expect(
      createCauseFollowUpDescriptions({ cause: 'SOMETHING_ELSE' }),
    ).to.equal('');
  });
});

describe('NewConditionCardDescription', () => {
  it('renders date and cause', () => {
    const item = { conditionDate: '2023-05-01', cause: 'NEW' };
    const { getByText } = render(<NewConditionCardDescription {...item} />);
    expect(
      getByText(
        /New condition; started May 1, 2023; caused by an injury, event/i,
      ),
    ).to.exist;
  });

  it('renders date only', () => {
    const item = { conditionDate: '2023-05' };
    const { getByText } = render(<NewConditionCardDescription {...item} />);
    expect(getByText('New condition; started May 2023.')).to.exist;
  });

  it('renders cause only', () => {
    const item = { cause: 'WORSENED' };
    const { getByText } = render(<NewConditionCardDescription {...item} />);
    expect(getByText(/New condition; existed before I served/i)).to.exist;
  });

  it('renders neither date nor cause without trailing period', () => {
    const item = {};
    const { getByText } = render(<NewConditionCardDescription {...item} />);
    expect(getByText('New condition')).to.exist;
  });

  it('renders SECONDARY with no match shows "cause is unknown"', () => {
    const item = { cause: 'SECONDARY', causedByDisability: 'X' };
    const { getByText } = render(<NewConditionCardDescription {...item} />);
    expect(getByText(/X has been removed/i)).to.exist;
  });
});

describe('RatedDisabilityCardDescription', () => {
  it('renders rating and worsened date', () => {
    const item = { ratedDisability: 'Knee', conditionDate: '2023-05' };
    const fullData = {
      ratedDisabilities: [{ name: 'Knee', ratingPercentage: 40 }],
    };
    const { getByText } = render(
      RatedDisabilityCardDescription(item, fullData),
    );

    expect(getByText('Current rating: 40%')).to.exist;
    expect(getByText('Claim for increase; worsened May 2023.')).to.exist;
  });

  it('renders current behavior when rating not found (%)', () => {
    const item = { ratedDisability: 'Elbow' };
    const fullData = { ratedDisabilities: [] };
    const { getByText } = render(
      RatedDisabilityCardDescription(item, fullData),
    );
    expect(getByText('Current rating: %')).to.exist;
  });

  it('renders "Claim for increase" without date when conditionDate is missing', () => {
    const item = { ratedDisability: 'Knee' };
    const fullData = {
      ratedDisabilities: [{ name: 'Knee', ratingPercentage: 40 }],
    };
    const { getByText } = render(
      RatedDisabilityCardDescription(item, fullData),
    );
    expect(getByText('Claim for increase')).to.exist;
  });
});

describe('renders description components', () => {
  it('ConditionsIntroDescription renders expected paragraph', () => {
    const { getByText } = render(<ConditionsIntroDescription />);
    expect(
      getByText(
        /we’ll ask you about the disabilities and conditions you’re claiming/i,
      ),
    ).to.exist;
  });

  it('NewConditionDescription renders headings and examples', () => {
    const { getByRole } = render(<NewConditionDescription />);
    expect(
      getByRole('heading', {
        level: 4,
        name: /If your condition isn’t listed/i,
      }),
    ).to.exist;
    expect(getByRole('heading', { level: 4, name: /Examples of conditions/i }))
      .to.exist;
    expect(getByRole('list', /PTSD/i)).to.exist;
    expect(getByRole('list', /Hearing loss/i)).to.exist;
    expect(getByRole('list', /Ankylosis in knee/i)).to.exist;
  });
});
