import { expect } from 'chai';
import moment from 'moment';

import {
  getTypeName,
  APPEAL_TYPES,
  STATUS_TYPES,
  getStatusContents,
} from '../../utils/appeals-v2-helpers';

describe('functions', () => {
  describe('getTypeName', () => {
    const appeal = {
      type: '',
    };
    it('should return supplemental claim when appeal is supplementalClaim', () => {
      appeal.type = APPEAL_TYPES.supplementalClaim;
      const action = getTypeName(appeal);

      expect(action).to.eql('supplemental claim');
    });
    it('should return higher-level review when appeal is higherLevelReview', () => {
      appeal.type = APPEAL_TYPES.higherLevelReview;
      const action = getTypeName(appeal);

      expect(action).to.eql('higher-level review');
    });
    it('should return appeal when appeal is legacy', () => {
      appeal.type = APPEAL_TYPES.legacy;
      const action = getTypeName(appeal);

      expect(action).to.eql('appeal');
    });
    it('should return appeal when appeal is appeal', () => {
      appeal.type = APPEAL_TYPES.appeal;
      const action = getTypeName(appeal);

      expect(action).to.eql('appeal');
    });
    it('should return null when appeal is an unknown type', () => {
      appeal.type = 'unknown';
      const action = getTypeName(appeal);

      expect(action).to.be.null;
    });
  });

  describe('getStatusContents', () => {
    it('when appeal status pendingSoc shows specific title/description', () => {
      const appeal = {
        id: '1234',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.pendingSoc,
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'A Decision Review Officer is reviewing your appeal',
      );
      const description = contents.description.props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');
    });

    it('when appeal status pendingForm9 shows specific title/description', () => {
      const appeal = {
        id: 'A1234',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.pendingForm9,
            details: {
              lastSocDate: '2015-09-12',
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql('Please review your Statement of the Case');
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');

      const formattedSocDate = moment(
        appeal.attributes.status.details.lastSocDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      expect(description).to.contain(formattedSocDate);
    });

    it('when appeal status pendingCertification shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.pendingCertification,
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'The Decision Review Officer is finishing their review of your appeal',
      );
      const description = contents.description.props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');
    });

    it('when appeal status pendingCertificationSsoc shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.pendingCertificationSsoc,
            details: {
              lastSocDate: '2015-09-12',
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'Please review your Supplemental Statement of the Case',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');

      const formattedSocDate = moment(
        appeal.attributes.status.details.lastSocDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      expect(description).to.contain(formattedSocDate);
    });

    it('when appeal status remandSsoc shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.remandSsoc,
            details: {
              lastSocDate: '2015-09-12',
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'Please review your Supplemental Statement of the Case',
      );
      const description = contents.description.props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');

      const formattedSocDate = moment(
        appeal.attributes.status.details.lastSocDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      expect(description).to.contain(formattedSocDate);
    });
    it('when appeal status pendingHearingScheduling shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.pendingHearingScheduling,
            details: {
              lastSocDate: '2015-09-12',
              type: 'video',
            },
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'You’re waiting for your hearing to be scheduled',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('videoconference');
    });

    it('when appeal status scheduledHearing shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.scheduledHearing,
            details: {
              date: '2012-09-11',
              type: 'video',
              location: 'Boston, MA',
            },
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql('Your hearing has been scheduled');
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      const formattedSocDate = moment(
        appeal.attributes.status.details.date,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      expect(description).to.contain('videoconference');
      expect(description).to.contain(formattedSocDate);
      expect(description).to.contain(appeal.attributes.status.details.location);
    });

    it('when appeal status onDocket shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.onDocket,
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'Your appeal is waiting to be sent to a judge',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain(
        'Your appeal is at the Board of Veterans’ Appeals, waiting to be sent to a Veterans Law Judge. Staff at the Board will make sure your case is complete, accurate, and ready to be decided by a judge.',
      );
    });

    it('when appeal status atVso shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.atVso,
            details: {
              vsoName: 'Disabled American Veterans',
            },
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'Your appeal is with your Veterans Service Organization',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(appeal.attributes.status.details.vsoName);
    });

    it('when appeal status decisionInProgress and legacy appeal, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'legacyAppeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.decisionInProgress,
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql('A judge is reviewing your appeal');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'If you submit evidence that isn’t already included in your case, it may delay your appeal.',
      );
    });

    it('when appeal status decisionInProgress and appeal, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.decisionInProgress,
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql('A judge is reviewing your appeal');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.not.contain(
        'If you submit evidence that isn’t already included in your case, it may delay your appeal.',
      );
    });

    it('when appeal status bvaDevelopment, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.bvaDevelopment,
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'The judge is seeking more information before making a decision',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'The Board of Veterans’ Appeals is seeking evidence or an outside opinion from a legal, medical, or other professional in order to make a decision about your appeal.',
      );
    });

    it('when appeal status stayed, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.stayed,
          },
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'The Board is waiting until a higher court makes a decision',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'A higher court has asked the Board of Veterans’ Appeals to hold open a group of appeals awaiting review. Yours is one of the appeals held open. The higher court believes that a decision it will make on a different appeal could affect yours.',
      );
    });

    it('when appeal status remand, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.remand,
            details: {
              // added issues because remand expects these
              issues: [
                {
                  description: 'Heel, increased rating',
                  disposition: 'allowed',
                  date: '2016-05-30',
                },
                {
                  description: 'Tinnitus, increased rating',
                  disposition: 'denied',
                  date: '2016-05-30',
                },
              ],
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql('The Board made a decision on your appeal');
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain(
        'The Board of Veterans’ Appeals sent you a decision on your appeal. Here’s an overview:',
      );
    });

    it('when appeal status fieldGrant, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.fieldGrant,
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };
      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'The Agency of Original Jurisdiction granted your appeal',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain('Agency of Original Jurisdiction');
    });

    it('when appeal status withdrawn, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.withdrawn,
          },
        },
      };
      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('You withdrew your appeal');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'You chose not to continue your appeal. If this information is incorrect, please contact your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status ftr, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.ftr,
          },
        },
      };
      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('Your appeal was closed');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'You didn’t take an action VA requested in order to continue your appeal. If this information is incorrect, or if you want to reopen your appeal, please contact your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status ramp, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.ramp,
          },
        },
      };
      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'You opted in to the Rapid Appeals Modernization Program (RAMP)',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'You chose to participate in the new Supplemental Claim or Higher-Level Review options. This doesn’t mean that your appeal has been closed. If this information is incorrect, please contact your Veterans Service Organization or representative as soon as possible.',
      );
    });

    it('when appeal status reconsideration, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.reconsideration,
          },
        },
      };
      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'Your Motion for Reconsideration was denied',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'The Board of Veterans’ Appeals declined to reopen your appeal. Please contact your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status death, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.death,
          },
        },
      };

      const name = {
        first: 'Frank',
        middle: 'James',
        last: 'Potter',
      };
      const contents = getStatusContents(appeal, name);
      expect(contents.title).to.eql('The appeal was closed');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain('Frank James Potter');
    });

    it('when appeal status otherClose, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.otherClose,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('Your appeal was closed');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'Your appeal was dismissed or closed. Please contact your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status merged, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.merged,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('Your appeal was merged');
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain(
        'Your appeal was merged with another appeal. The Board of Veterans’ Appeals merges appeals so that you can receive a single decision on as many appealed issues as possible. This appeal was merged with an older appeal that was closest to receiving a Board decision.',
      );
    });

    it('when appeal status statutoryOptIn, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.statutoryOptIn,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'You requested a decision review under the Appeals Modernization Act',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain(
        'A new law, the Veterans Appeals Improvement and Modernization Act, took effect on February 19, 2019. Although your appeal started before the new law took effect, you asked for it to be converted into one of the new decision review options.',
      );
    });

    it('when appeal status evidentiaryPeriod, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          docket: {
            type: 'hearingRequest',
            month: '2019-02-01',
            switchDueDate: '2019-06-05',
            eligibleToSwitch: true,
          },
          status: {
            type: STATUS_TYPES.evidentiaryPeriod,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'Your appeals file is open for new evidence',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('Hearing Request');
    });

    it('when appeal status postBvaDtaDecision, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.postBvaDtaDecision,
            details: {
              bvaDecisionDate: '2015-09-12',
              aojDecisionDate: '2015-09-13',
              // added issues because remand expects these
              issues: [
                {
                  description: 'Heel, increased rating',
                  disposition: 'allowed',
                  date: '2016-05-30',
                },
                {
                  description: 'Tinnitus, increased rating',
                  disposition: 'denied',
                  date: '2016-05-30',
                },
              ],
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'The Agency of Original Jurisdiction corrected an error',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('September 12, 2015');
      expect(description).to.contain('September 13, 2015');
      expect(description).to.contain('Agency of Original Jurisdiction');
    });

    it('when appeal status bvaDecisionEffectuation, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.bvaDecisionEffectuation,
            details: {
              bvaDecisionDate: '2015-09-12',
              aojDecisionDate: '2015-09-13',
              // added issues because remand expects these
              issues: [
                {
                  description: 'Heel, increased rating',
                  disposition: 'allowed',
                  date: '2016-05-30',
                },
                {
                  description: 'Tinnitus, increased rating',
                  disposition: 'denied',
                  date: '2016-05-30',
                },
              ],
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'The Agency of Original Jurisdiction corrected an error',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children[0].props.children;
      expect(description).to.contain('September 12, 2015');
      expect(description).to.contain('September 13, 2015');
      expect(description).to.contain('Agency of Original Jurisdiction');
    });

    it('when appeal status sc_recieved and programArea is compensation, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: 'sc_recieved',
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
          programArea: 'compensation',
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'A reviewer is examining your new evidence',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children).to.contain(
        'Agency of Original Jurisdiction',
      );
      expect(description[1]).to.be.false; // if statement should be false since programArea is compensation
      expect(description[2].props.children[0].props.children).to.contain(
        'Agency of Original Jurisdiction',
      );
    });

    it('when appeal status hlrReceived, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.hlrReceived,
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'A higher-level reviewer is taking a new look at your case',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children).to.contain(
        'Agency of Original Jurisdiction',
      );
    });

    it('when appeal status scDecision, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.scDecision,
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'The Agency of Original Jurisdiction made a decision',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children).to.contain(
        'Agency of Original Jurisdiction',
      );
    });

    it('when appeal status hlrDecision, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.hlrDecision,
            details: {
              // added issues because remand expects these
              issues: [
                {
                  description: 'Heel, increased rating',
                  disposition: 'allowed',
                  date: '2016-05-30',
                },
                {
                  description: 'Tinnitus, increased rating',
                  disposition: 'denied',
                  date: '2016-05-30',
                },
              ],
            },
          },
          aoj: '', // when aoj is '' shows Agency of Original Jurisdiction
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'The Agency of Original Jurisdiction made a decision',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children).to.contain(
        'Agency of Original Jurisdiction',
      );
    });

    it('when appeal status scClosed, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.scClosed,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('Your Supplemental Claim was closed');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'Your Supplemental Claim was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status hlrClosed, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.hlrClosed,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('Your Higher-Level Review was closed');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'Your Higher-Level Review was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
      );
    });

    it('when appeal status remandReturn, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: STATUS_TYPES.remandReturn,
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql(
        'Your appeal was returned to the Board of Veterans’ Appeals',
      );
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'The Veterans Benefits Administration finished their work on the remand and will return your case to the Board of Veterans’ Appeals.',
      );
    });

    it('when appeal status motion, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: 'motion',
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('We don’t know your status');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'We’re sorry, VA.gov will soon be updated to show your status.',
      );
    });

    it('when appeal status pre_docketed, shows specific title/description', () => {
      const appeal = {
        id: 'A123',
        type: 'appeal',
        attributes: {
          appealIds: ['A123'],
          active: true,
          status: {
            type: 'pre_docketed',
          },
        },
      };

      const contents = getStatusContents(appeal);
      expect(contents.title).to.eql('We don’t know your status');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description).to.contain(
        'We’re sorry, VA.gov will soon be updated to show your status.',
      );
    });
  });
});
