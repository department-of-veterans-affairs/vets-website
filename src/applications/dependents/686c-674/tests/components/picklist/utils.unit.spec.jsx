import { expect } from 'chai';

import {
  labels,
  location,
  pageDetails,
} from '../../../components/picklist/utils';

describe('labels', () => {
  it('should render title with and without "Edit"', () => {
    expect(labels.Spouse.removalReasonTitle('SPOUSY FOSTER', false)).to.equal(
      'Reason for removing SPOUSY FOSTER',
    );
    expect(labels.Spouse.removalReasonTitle('SPOUSY FOSTER', true)).to.equal(
      'Edit reason for removing SPOUSY FOSTER',
    );

    expect(labels.Parent.removalReasonTitle('PETER FOSTER', false)).to.equal(
      'Reason for removing PETER FOSTER',
    );
    expect(labels.Parent.removalReasonTitle('PETER FOSTER', true)).to.equal(
      'Edit reason for removing PETER FOSTER',
    );

    expect(
      labels.Child.isStepChildTitle('PENNY FOSTER', '11 years', false),
    ).to.equal('Is PENNY FOSTER (age 11 years) your stepchild?');
    expect(
      labels.Child.isStepChildTitle('PENNY FOSTER', '11 years', true),
    ).to.equal('Edit is PENNY FOSTER (age 11 years) your stepchild?');

    expect(labels.Child.removalReasonTitle('PENNY FOSTER', false)).to.equal(
      'Reason for removing PENNY FOSTER',
    );
    expect(labels.Child.removalReasonTitle('PENNY FOSTER', true)).to.equal(
      'Edit reason for removing PENNY FOSTER',
    );
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
