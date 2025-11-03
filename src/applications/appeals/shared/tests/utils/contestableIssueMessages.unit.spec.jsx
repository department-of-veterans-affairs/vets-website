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

  it('should handle missing issue names with fallback', () => {
    const blockedIssues = [
      { issue: 'Back Pain' },
      {}, // Missing both issue and ratingIssueSubjectText
    ];

    const result = extractIssueNames(blockedIssues);
    expect(result).to.deep.equal(['back pain', 'unknown condition']);
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

    expect(result).to.include("Your back pain issue isn't available");
    expect(result).to.include('select it after');
    expect(result).to.include("We're sorry");
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

    expect(result).to.include(
      "Your back pain and knee injury issues aren't available",
    );
    expect(result).to.include('select them after');
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

    expect(result).to.include('12:00 a.m.');
    expect(result).to.include("Your back pain issue isn't available");
  });
});
