import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  labels,
  location,
  pageDetails,
  showExitLink,
} from '../../../components/picklist/utils';
import { PICKLIST_DATA, PICKLIST_PATHS } from '../../../config/constants';

describe('labels', () => {
  it('should render Spouse title with and without "Edit"', () => {
    const spouseTitle = render(
      labels.Spouse.removalReasonTitle('SPOUSY FOSTER', false),
    );
    expect(spouseTitle.getByText('Reason for removing')).to.exist;
    expect(spouseTitle.getByText('SPOUSY FOSTER')).to.exist;
    const editSpouseTitle = render(
      labels.Spouse.removalReasonTitle('SPOUSY FOSTER', true),
    );
    expect(editSpouseTitle.getByText('Edit reason for removing')).to.exist;
  });

  it('should render Parent title with and without "Edit"', () => {
    const parentTitle = render(
      labels.Parent.removalReasonTitle('PETER FOSTER', false),
    );
    expect(parentTitle.getByText('Reason for removing')).to.exist;
    expect(parentTitle.getByText('PETER FOSTER')).to.exist;
    const editParentTitle = render(
      labels.Parent.removalReasonTitle('PETER FOSTER', true),
    );
    expect(editParentTitle.getByText('Edit reason for removing')).to.exist;
  });

  it('should return Child title with and without "Edit"', () => {
    expect(
      labels.Child.isStepChildTitle('PENNY FOSTER', '11 years', false),
    ).to.equal('Is PENNY FOSTER (age 11 years) your stepchild?');
    expect(
      labels.Child.isStepChildTitle('PENNY FOSTER', '11 years', true),
    ).to.equal('Edit is PENNY FOSTER (age 11 years) your stepchild?');

    const childTitle = render(
      labels.Child.removalReasonTitle('PENNY FOSTER', false),
    );
    expect(childTitle.getByText('Reason for removing')).to.exist;
    const editChildTitle = render(
      labels.Child.removalReasonTitle('PENNY FOSTER', true),
    );
    expect(editChildTitle.getByText('Edit reason for removing')).to.exist;
  });
});

describe('location', () => {
  it('should format location for outside US', () => {
    const item = {
      endCity: 'Test City',
      endOutsideUS: true,
      endProvince: 'Test Province',
      endCountry: 'TST',
    };
    expect(location(item)).to.equal('Test City, Test Province, TST');
  });

  it('should format location for outside US with no province', () => {
    const item = {
      endCity: 'Test City',
      endOutsideUS: true,
      endCountry: 'TST',
    };
    expect(location(item)).to.equal('Test City, TST');
  });

  it('should format location for inside US', () => {
    const item = {
      endCity: 'Test City',
      endOutsideUS: false,
      endState: 'TS',
    };
    expect(location(item)).to.equal('Test City, TS');
  });
});

describe('pageDetails', () => {
  context('Spouse removal reasons', () => {
    it('should return spouse divorce details', () => {
      const details = pageDetails.Spouse({
        fullName: { first: 'SPOUSY' },
        removalReason: 'marriageEnded',
        endType: 'divorce',
        endDate: '2020-01-01',
        endOutsideUS: true,
        endCity: 'Test City',
        endProvince: 'Test Province',
        endCountry: 'TST',
      });
      expect(details).to.deep.equal([
        {
          label: 'Reason for removing SPOUSY',
          value: 'You’re no longer married to them',
          action: 'reason for removing spouse',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'How did the marriage end?',
          value: 'You got divorced',
          hideValue: false,
        },
        null,
        {
          label: 'When did the marriage end?',
          value: 'January 1, 2020',
        },
        {
          label: 'Where did the marriage end?',
          value: 'Test City, Test Province, TST',
        },
      ]);
    });

    it('should return spouse marriage annulled details', () => {
      const details = pageDetails.Spouse({
        fullName: { first: 'SPOUSY' },
        removalReason: 'marriageEnded',
        endType: 'annulmentOrVoid',
        endAnnulmentOrVoidDescription: 'Test description',
        endDate: '2024-01-01',
        endOutsideUS: false,
        endCity: 'Test City',
        endState: 'TX',
      });
      expect(details).to.deep.equal([
        {
          label: 'Reason for removing SPOUSY',
          value: 'You’re no longer married to them',
          action: 'reason for removing spouse',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'How did the marriage end?',
          value: 'Your marriage was annulled or declared void',
          hideValue: false,
        },
        {
          label: 'Description of annulment or void',
          value: 'Test description',
        },
        {
          label: 'When did the marriage end?',
          value: 'January 1, 2024',
        },
        {
          label: 'Where did the marriage end?',
          value: 'Test City, TX',
        },
      ]);
    });

    it('should return spouse death details', () => {
      const details = pageDetails.Spouse({
        fullName: { first: 'SPOUSY' },
        removalReason: 'death',
        endDate: '2025-01-01',
        endOutsideUS: false,
        endCity: 'Test City',
        endState: 'TX',
      });
      expect(details).to.deep.equal([
        {
          label: 'Reason for removing SPOUSY',
          value: 'They died',
          action: 'reason for removing spouse',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'When was the death?',
          value: 'January 1, 2025',
        },
        {
          label: 'Where was the death?',
          value: 'Test City, TX',
        },
      ]);
    });

    it('should return default error for spouse', () => {
      const details = pageDetails.Spouse({
        fullName: { first: 'SPOUSY' },
        removalReason: 'invalidReason',
      });
      expect(details).to.deep.equal([
        { label: 'Something went wrong', value: '' },
      ]);
    });
  });

  context('Parent removal reasons', () => {
    it('should return parent death details', () => {
      const details = pageDetails.Parent({
        fullName: { first: 'PETER' },
        removalReason: 'parentDied',
        endDate: '2020-01-01',
        endOutsideUS: false,
        endCity: 'Test City',
        endState: 'TX',
      });
      expect(details).to.deep.equal([
        {
          label: 'Reason for removing PETER',
          value: 'They died',
          action: 'reason for removing parent',
          hideLabel: true,
          hideValue: false,
        },
        { label: 'When was the death?', value: 'January 1, 2020' },
        { label: 'Where was the death?', value: 'Test City, TX' },
      ]);
    });

    it('should return parent other details', () => {
      const details = pageDetails.Parent({
        fullName: { first: 'PETER' },
        removalReason: 'parentOther',
      });
      expect(details[0].label).to.exist; // JSX
      expect(details[0].value).to.equal('PETER will remain on your benefits');
      expect(details[0].action).to.equal(
        'This form only supports removing a parent if they died',
      );
    });

    it('should return default error for parent', () => {
      const details = pageDetails.Parent({
        fullName: { first: 'PETER' },
        removalReason: 'invalidReason',
      });
      expect(details).to.deep.equal([
        { label: 'Something went wrong', value: '' },
      ]);
    });
  });

  context('Child removal reasons', () => {
    it('should return child marriage details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'Y',
        removalReason: 'childMarried',
        endDate: '2025-01-01',
        endOutsideUS: true,
        endCity: 'Test City',
        endProvince: 'Test Province',
        endCountry: 'Text Country',
      });
      expect(details).to.deep.equal([
        {
          label: 'PENNY is your stepchild?',
          value: 'Yes',
          action: 'is stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing PENNY',
          value: 'They got married',
          action: 'reason for removing child',
          hideLabel: true,
          hideValue: false,
        },
        { label: 'Date of marriage', value: 'January 1, 2025' },
      ]);
    });

    it('should return child death details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'N',
        removalReason: 'childDied',
        endDate: '2020-01-01',
        endOutsideUS: false,
        endCity: 'Test City',
        endState: 'TX',
      });
      expect(details).to.deep.equal([
        {
          label: 'PENNY is your stepchild?',
          value: 'No',
          action: 'is stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing PENNY',
          value: 'They died',
          action: 'reason for removing child',
          hideLabel: true,
          hideValue: false,
        },
        { label: 'When was the death?', value: 'January 1, 2020' },
        { label: 'Where was the death?', value: 'Test City, TX' },
      ]);
    });

    it('should return default error for child', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        removalReason: 'invalidReason',
      });
      expect(details).to.deep.equal([
        { label: 'Something went wrong', value: '' },
      ]);
    });
  });
});

describe('showExitLink', () => {
  it('should return false if there is no data', () => {
    const data = { [PICKLIST_DATA]: [], [PICKLIST_PATHS]: [] };
    expect(showExitLink({ data, index: 0 })).to.be.false;
  });

  it('should return false for no exit pages', () => {
    const data = {
      [PICKLIST_DATA]: [{ selected: true }, { selected: true }],
      [PICKLIST_PATHS]: [
        { path: 'test1', index: 0 },
        { path: 'test2', index: 1 },
      ],
    };
    expect(showExitLink({ data, index: 0 })).to.be.false;
    expect(showExitLink({ data, index: 1 })).to.be.false;
  });

  it('should return false for a non-exit page with multiple exit page', () => {
    const data = {
      [PICKLIST_DATA]: [
        { selected: true },
        { selected: true },
        { selected: true },
        { selected: true },
      ],
      [PICKLIST_PATHS]: [
        { path: 'test0-exit', index: 0 },
        { path: 'test1', index: 1 },
        { path: 'test2-exit', index: 2 },
        { path: 'test3-exit', index: 3 },
      ],
    };
    expect(showExitLink({ data, index: 0 })).to.be.false;
    expect(showExitLink({ data, index: 1 })).to.be.false;
    expect(showExitLink({ data, index: 2 })).to.be.false;
    expect(showExitLink({ data, index: 3 })).to.be.false;
  });

  it('should return true for a single exit page', () => {
    const data = {
      [PICKLIST_DATA]: [{ selected: false }, { selected: true }],
      [PICKLIST_PATHS]: [{ path: 'test1-exit', index: 1 }],
    };
    expect(showExitLink({ data, index: 0 })).to.be.false;
    expect(showExitLink({ data, index: 1 })).to.be.true;
  });

  it('should return true for second of two exit page', () => {
    const data = {
      [PICKLIST_DATA]: [{ selected: true }, { selected: true }],
      [PICKLIST_PATHS]: [
        { path: 'test1-exit', index: 0 },
        { path: 'test2-exit', index: 1 },
      ],
    };
    expect(showExitLink({ data, index: 0 })).to.be.false;
    expect(showExitLink({ data, index: 1 })).to.be.true;
  });

  it('should return true for third of two exit page', () => {
    const data = {
      [PICKLIST_DATA]: [
        { selected: true },
        { selected: true },
        { selected: true },
        { selected: true },
      ],
      [PICKLIST_PATHS]: [
        { path: 'test0-exit', index: 0 },
        { path: 'test1-exit', index: 1 },
        { path: 'test2-exit', index: 2 },
        { path: 'test3-exit', index: 3 },
      ],
    };
    expect(showExitLink({ data, index: 0 })).to.be.false;
    expect(showExitLink({ data, index: 1 })).to.be.false;
    expect(showExitLink({ data, index: 2 })).to.be.false;
    expect(showExitLink({ data, index: 3 })).to.be.true;
  });
});
