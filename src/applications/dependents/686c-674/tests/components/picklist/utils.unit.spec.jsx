import { render } from '@testing-library/react';
import { expect } from 'chai';

import {
  labels,
  location,
  pageDetails,
  showExitLink,
  getPastDateError,
} from '../../../components/picklist/utils';
import { PICKLIST_DATA, PICKLIST_PATHS } from '../../../config/constants';

import { createDoB } from '../../test-helpers';

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
      endOutsideUs: true,
      endProvince: 'Test Province',
      endCountry: 'TST',
    };
    expect(location(item)).to.equal('Test City, Test Province, TST');
  });

  it('should format location for outside US with no province', () => {
    const item = {
      endCity: 'Test City',
      endOutsideUs: true,
      endCountry: 'TST',
    };
    expect(location(item)).to.equal('Test City, TST');
  });

  it('should format location for inside US', () => {
    const item = {
      endCity: 'Test City',
      endOutsideUs: false,
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
        endOutsideUs: true,
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
        endOutsideUs: false,
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
        removalReason: 'spouseDied',
        endDate: '2025-01-01',
        endOutsideUs: false,
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
        endOutsideUs: false,
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
        endOutsideUs: true,
        endCity: 'Test City',
        endProvince: 'Test Province',
        endCountry: 'Text Country',
      });
      expect(details).to.deep.equal([
        {
          label: 'Is PENNY your stepchild?',
          value: 'Yes',
          action: 'is this dependent a stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing this child',
          value: 'They got married',
          hideValue: false,
        },
        { label: 'Date of marriage', value: 'January 1, 2025' },
      ]);
    });

    it('should return child left school details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'N',
        removalReason: 'childNotInSchool',
        childHasPermanentDisability: 'N',
        endDate: '2025-01-01',
      });
      expect(details).to.deep.equal([
        {
          label: 'Is PENNY your stepchild?',
          value: 'No',
          action: 'is this dependent a stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing this child',
          value: 'They’re no longer enrolled in school',
          hideValue: false,
        },
        {
          label: 'Does this child have a permanent disability?',
          value: 'No',
        },
        {
          label: 'Date child stopped attending school',
          value: 'January 1, 2025',
        },
      ]);
    });

    it('should return child left school details and has a permanent disability', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'N',
        removalReason: 'childNotInSchool',
        childHasPermanentDisability: 'Y',
      });
      expect(details[2].label).to.equal(
        'Does this child have a permanent disability?',
      );
      expect(details[2].value).to.equal('Yes');

      expect(details[3].label).to.exist; // JSX
      expect(details[3].value).to.equal('PENNY will remain on your benefits');
      expect(details[3].action).to.equal(
        'This child is still an eligible dependent',
      );
    });

    it('should return child not a member of the household details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'Y',
        removalReason: 'stepchildNotMember',
        stepchildFinancialSupport: 'N',
        endDate: '2025-01-01',
      });
      expect(details).to.deep.equal([
        {
          label: 'Is PENNY your stepchild?',
          value: 'Yes',
          action: 'is this dependent a stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing this child',
          value: 'They no longer live with you',
          hideValue: false,
        },
        {
          label:
            'Do you provide at least half of this child’s financial support?',
          value: 'No',
          hideValue: false,
        },
        {
          label: 'When did this child stop living with you?',
          value: 'January 1, 2025',
        },
      ]);
    });

    it('should return child not a member of the household details but still getting 50% financial support', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'Y',
        removalReason: 'stepchildNotMember',
        stepchildFinancialSupport: 'Y',
      });

      expect(details[2].label).to.equal(
        'Do you provide at least half of this child’s financial support?',
      );
      expect(details[2].value).to.equal('Yes');

      expect(details[3].label).to.exist; // JSX
      expect(details[3].value).to.equal('PENNY will remain on your benefits');
      expect(details[3].action).to.equal(
        'This child still qualifies as your dependent',
      );
    });

    it('should return child death details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'N',
        removalReason: 'childDied',
        endDate: '2020-01-01',
        endOutsideUs: false,
        endCity: 'Test City',
        endState: 'TX',
      });
      expect(details).to.deep.equal([
        {
          label: 'Is PENNY your stepchild?',
          value: 'No',
          action: 'is this dependent a stepchild?',
          hideLabel: true,
          hideValue: false,
        },
        {
          label: 'Reason for removing this child',
          value: 'They died',
          hideValue: false,
        },
        { label: 'When was the death?', value: 'January 1, 2020' },
        { label: 'Where was the death?', value: 'Test City, TX' },
      ]);
    });

    it('should return child adopted out of the family details', () => {
      const details = pageDetails.Child({
        fullName: { first: 'PENNY' },
        isStepchild: 'N',
        removalReason: 'childAdopted',
      });
      expect(details[1].label).to.equal('Reason for removing this child');
      expect(details[1].value).to.equal('They were adopted by another family');

      expect(details[2].label).to.exist; // JSX
      expect(details[2].value).to.equal('PENNY will remain on your benefits');
      expect(details[2].action).to.equal(
        'This child can’t be removed using this application',
      );
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
    expect(showExitLink()).to.be.false;
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

describe('getPastDateError', () => {
  it('should return missing error message if date is not provided', () => {
    const error = getPastDateError('', 'Missing date');
    expect(error).to.equal('Missing date');
  });

  it('should return past date error message if date is in the future', () => {
    const error = getPastDateError(createDoB(0, -2), 'Missing date');
    expect(error).to.equal('Enter a past date');
  });

  it('should return invalid date error message if a partial date is provided', () => {
    const error = getPastDateError('2000-01', 'Missing date');
    expect(error).to.equal('Enter a valid date');
  });

  it('should return null if date is valid and in the past', () => {
    const error = getPastDateError('2020-01-01', 'Missing date');
    expect(error).to.be.null;
  });
});
