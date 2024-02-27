import { expect } from 'chai';
import moment from 'moment';
import { SHOW_PART3 } from '../../constants';
import { issuesNeedUpdating } from '../../utils/issues';

describe('issuesNeedUpdating', () => {
  const yesterday = moment().format('YYYY-MM-DD');
  const longAgo = '2000-01-01';

  const createEntry = (
    ratingIssueSubjectText = '',
    approxDecisionDate = longAgo,
  ) => ({
    attributes: {
      ratingIssueSubjectText,
      approxDecisionDate,
    },
  });

  it('returns false if nothing is passed in', () => {
    expect(issuesNeedUpdating()).to.be.false;
    expect(issuesNeedUpdating([{}], [{}])).to.be.false;
  });

  it('returns false if loadedIssues have a decision date older than a year and existingIssues is empty', () => {
    let result;
    result = issuesNeedUpdating([createEntry('Old Issue', longAgo)], []);
    expect(result).to.be.false;

    result = issuesNeedUpdating(
      [createEntry('Old Issue', longAgo), createEntry('Old Issue', longAgo)],
      [],
    );
    expect(result).to.be.false;
  });

  it('return false if loadedIssues have a decision date older than a year and existingIssues is identical to loadedIssues', () => {
    let result;
    result = issuesNeedUpdating(
      [createEntry('Old Issue', longAgo)],
      [createEntry('Old Issue', longAgo)],
    );
    expect(result).to.be.false;

    result = issuesNeedUpdating(
      [
        createEntry('Old Issue 1', longAgo),
        createEntry('Old Issue 2', longAgo),
      ],
      [
        createEntry('Old Issue 1', longAgo),
        createEntry('Old Issue 2', longAgo),
      ],
    );
    expect(result).to.be.false;
  });

  it('returns true if loadedIssues has new issues that existingIssues does not yet have', () => {
    let result;
    result = issuesNeedUpdating(
      [createEntry('Old Issue', longAgo), createEntry('New Issue', yesterday)],
      [createEntry('Old Issue', longAgo)],
    );
    expect(result).to.be.true;

    result = issuesNeedUpdating([createEntry('New Issue', yesterday)], []);
    expect(result).to.be.true;

    result = issuesNeedUpdating(
      [
        createEntry('New Issue 1', yesterday),
        createEntry('New Issue 2', yesterday),
      ],
      [createEntry('New Issue 1', yesterday)],
    );
    expect(result).to.be.true;
  });

  describe('when showPart3 is true', () => {
    it('returns true if loadedIssues have a decision date older than a year and existingIssues is empty', () => {
      const options = { showPart3: SHOW_PART3 };
      let result;
      result = issuesNeedUpdating(
        [createEntry('Old Issue', longAgo)],
        [],
        options,
      );
      expect(result).to.be.true;

      result = issuesNeedUpdating(
        [createEntry('Old Issue', longAgo), createEntry('Old Issue', longAgo)],
        [],
        options,
      );
      expect(result).to.be.true;
    });

    it('return false if loadedIssues have a decision date older than a year and existingIssues is identical to loadedIssues', () => {
      const options = { showPart3: SHOW_PART3 };
      let result;
      result = issuesNeedUpdating(
        [createEntry('Old Issue', longAgo)],
        [createEntry('Old Issue', longAgo)],
        options,
      );
      expect(result).to.be.false;

      result = issuesNeedUpdating(
        [
          createEntry('Old Issue 1', longAgo),
          createEntry('Old Issue 2', longAgo),
        ],
        [
          createEntry('Old Issue 1', longAgo),
          createEntry('Old Issue 2', longAgo),
        ],
        options,
      );
      expect(result).to.be.false;
    });

    it('returns true if loadedIssues has new issues that existingIssues does not yet have', () => {
      const options = { showPart3: SHOW_PART3 };
      let result;
      result = issuesNeedUpdating(
        [
          createEntry('Old Issue', longAgo),
          createEntry('New Issue', yesterday),
        ],
        [createEntry('Old Issue', longAgo)],
        options,
      );
      expect(result).to.be.true;

      result = issuesNeedUpdating(
        [createEntry('New Issue', yesterday)],
        [],
        options,
      );
      expect(result).to.be.true;

      result = issuesNeedUpdating(
        [
          createEntry('New Issue 1', yesterday),
          createEntry('New Issue 2', yesterday),
        ],
        [createEntry('New Issue 1', yesterday)],
        options,
      );
      expect(result).to.be.true;
    });
  });
});
