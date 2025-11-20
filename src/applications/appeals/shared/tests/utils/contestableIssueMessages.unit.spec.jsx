import { expect } from 'chai';

import {
  formatIssueList,
  extractIssueNames,
  getBlockedMessage,
} from '../../utils/contestableIssueMessages';

describe('formatIssueList', () => {
  it('should format single issue', () => {
    const result = formatIssueList(['back pain']);
    expect(result).to.equal('back pain');
  });

  it('should format two issues with "and"', () => {
    const result = formatIssueList(['back pain', 'knee injury']);
    expect(result).to.equal('back pain and knee injury');
  });

  it('should format three or more issues with Oxford comma', () => {
    const result = formatIssueList([
      'back pain',
      'knee injury',
      'hearing loss',
    ]);
    expect(result).to.equal('back pain, knee injury, and hearing loss');
  });

  it('should use semicolons as separators when issue names contain commas', () => {
    const result = formatIssueList([
      "bell's palsy",
      'skin cancer, small-cell',
      'tendonitis, left ankle',
      'migraines',
    ]);
    expect(result).to.equal(
      "bell's palsy; skin cancer, small-cell; tendonitis, left ankle; and migraines",
    );
  });

  it('should use semicolons for two issues when names contain commas', () => {
    const result = formatIssueList(["bell's palsy", 'tendonitis, left ankle']);
    expect(result).to.equal("bell's palsy; and tendonitis, left ankle");
  });

  it('should use regular commas when no issue names contain commas', () => {
    const result = formatIssueList([
      'back pain',
      'knee injury',
      'hearing loss',
      'tinnitus',
    ]);
    expect(result).to.equal(
      'back pain, knee injury, hearing loss, and tinnitus',
    );
  });
});

describe('extractIssueNames', () => {
  it('should extract issue names and convert to lowercase', () => {
    const blockedIssues = [
      { issue: 'Back Pain' },
      { ratingIssueSubjectText: 'KNEE INJURY' },
      { issue: 'Hearing Loss' },
    ];

    const result = extractIssueNames(blockedIssues);
    expect(result).to.deep.equal(['back pain', 'knee injury', 'hearing loss']);
  });
});

describe('getBlockedMessage', () => {
  it('should return empty string for no blocked issues', () => {
    const result = getBlockedMessage([]);
    expect(result).to.equal('');

    const nullResult = getBlockedMessage(null);
    expect(nullResult).to.equal('');
  });

  it('should generate message for single issue with correct grammar', () => {
    const blockedIssues = [
      {
        issue: 'Back Pain',
        approxDecisionDate: '2023-06-15',
      },
    ];

    const result = getBlockedMessage(blockedIssues);

    // Assert on the full message structure for single issue
    expect(result).to.match(
      /^We're sorry\. Your back pain issue isn't available to add to your appeal yet\. You can come back and select it after .+, 12:00 a\.m\. [A-Z]{3,4}\.$/,
    );
  });

  it('should generate message for multiple issues with correct grammar', () => {
    const blockedIssues = [
      {
        issue: 'Back Pain',
        approxDecisionDate: '2023-06-15',
      },
      {
        issue: 'Knee Injury',
        approxDecisionDate: '2023-06-15',
      },
    ];

    const result = getBlockedMessage(blockedIssues);

    expect(result).to.match(
      /^We're sorry\. Your back pain and knee injury issues aren't available to add to your appeal yet\. You can come back and select them after .+, 12:00 a\.m\. [A-Z]{3,4}\.$/,
    );
  });

  it('should generate message for three or more issues with correct comma formatting', () => {
    const blockedIssues = [
      {
        issue: 'Back Pain',
        approxDecisionDate: '2023-06-15',
      },
      {
        issue: 'Knee Injury',
        approxDecisionDate: '2023-06-15',
      },
      {
        issue: 'PTSD',
        approxDecisionDate: '2023-06-15',
      },
    ];

    const result = getBlockedMessage(blockedIssues);

    expect(result).to.match(
      /^We're sorry\. Your back pain, knee injury, and ptsd issues aren't available to add to your appeal yet\. You can come back and select them after .+, 12:00 a\.m\. [A-Z]{3,4}\.$/,
    );
  });

  it('should generate local blocking message for current day decision dates', () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    const blockedIssues = [
      {
        issue: 'Back Pain',
        approxDecisionDate: todayString,
      },
    ];

    const result = getBlockedMessage(blockedIssues);

    expect(result).to.match(
      /^We're sorry\. Your back pain issue isn't available to add to your appeal yet\. You can come back and select it after .+, 12:00 a\.m\. [A-Z]{3,4}\.$/,
    );
  });
});
