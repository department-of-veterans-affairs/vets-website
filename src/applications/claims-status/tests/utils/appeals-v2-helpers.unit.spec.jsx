import { expect } from 'chai';
import moment from 'moment';

import {
  getTypeName,
  APPEAL_TYPES,
  STATUS_TYPES,
  getStatusContents,
  EVENT_TYPES,
  getEventContent,
  isClosed,
  isInProgress,
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
      expect(contents.title).to.eql('We received your supplemental claim');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children[0]).to.contain(
        'To get the latest information—like whether your claim has been assigned to a reviewer or if we’re gathering evidence—call the VA benefits hotline at',
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
      expect(contents.title).to.eql('We received your higher level review');
      // Get the description from the <p/>
      const description = contents.description.props.children;
      expect(description[0].props.children[0]).to.contain(
        'To get the latest information—like whether your higher level review has been assigned to a reviewer—call the VA benefits hotline at',
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

  describe('getEventContent', () => {
    const event = {
      type: '',
    };
    it('when event type is claimDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.claimDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA sent you a claim decision');
      expect(content.description).to.eql('');
    });

    it('when event type is nod, should return a given title/description', () => {
      event.type = EVENT_TYPES.nod;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA received your Notice of Disagreement');
      expect(content.description).to.eql('');
    });

    it('when event type is soc, should return a given title/description', () => {
      event.type = EVENT_TYPES.soc;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA sent you a Statement of the Case');
      expect(content.description).to.eql('');
    });

    it('when event type is form9, should return a given title/description', () => {
      event.type = EVENT_TYPES.form9;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA received your Form 9');
      expect(content.description).to.eql('');
    });

    it('when event type is ssoc, should return a given title/description', () => {
      event.type = EVENT_TYPES.ssoc;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA sent you a Supplemental Statement of the Case',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is certified, should return a given title/description', () => {
      event.type = EVENT_TYPES.certified;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Your appeal was sent to the Board of Veterans’ Appeals',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is hearingHeld, should return a given title/description', () => {
      event.type = EVENT_TYPES.hearingHeld;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'You attended a hearing with a Veterans Law Judge',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is hearingNoShow, should return a given title/description', () => {
      event.type = EVENT_TYPES.hearingNoShow;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'You missed your hearing with a Veterans Law Judge',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is transcript, should return a given title/description', () => {
      event.type = EVENT_TYPES.transcript;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA sent you a transcript of your hearing');
      expect(content.description).to.eql('');
    });

    it('when event type is bvaDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.bvaDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Board of Veterans’ Appeals made a decision',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is cavcDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.cavcDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'U.S. Court of Appeals for Veterans Claims made a decision',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is remandReturn, should return a given title/description', () => {
      event.type = EVENT_TYPES.remandReturn;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Your appeal was returned to the Board of Veterans’ Appeals',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is rampNotice, should return a given title/description', () => {
      event.type = EVENT_TYPES.rampNotice;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA sent you a letter about the Rapid Appeals Modernization Program',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is fieldGrant, should return a given title/description', () => {
      event.type = EVENT_TYPES.fieldGrant;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA granted one or more issues');
      expect(content.description).to.eql('');
    });

    it('when event type is withdrawn, should return a given title/description', () => {
      event.type = EVENT_TYPES.withdrawn;
      const content = getEventContent(event);

      expect(content.title).to.eql('You withdrew your appeal');
      expect(content.description).to.eql('');
    });

    it('when event type is failureToRespond, should return a given title/description', () => {
      event.type = EVENT_TYPES.failureToRespond;
      const content = getEventContent(event);

      expect(content.title).to.eql('Your appeal was closed');
      expect(content.description).to.eql('');
    });

    it('when event type is otherClose, should return a given title/description', () => {
      event.type = EVENT_TYPES.otherClose;
      const content = getEventContent(event);

      expect(content.title).to.eql('Your appeal was closed');
      expect(content.description).to.eql('');
    });

    it('when event type is rampOptIn, should return a given title/description', () => {
      event.type = EVENT_TYPES.rampOptIn;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'You opted in to the Rapid Appeals Modernization Program',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is death, should return a given title/description', () => {
      event.type = EVENT_TYPES.death;
      const content = getEventContent(event);

      expect(content.title).to.eql('The appeal was closed');
      expect(content.description).to.eql('');
    });

    it('when event type is merged, should return a given title/description', () => {
      event.type = EVENT_TYPES.merged;
      const content = getEventContent(event);

      expect(content.title).to.eql('Your appeals were merged');
      expect(content.description).to.eql('');
    });

    it('when event type is reconsideration, should return a given title/description', () => {
      event.type = EVENT_TYPES.reconsideration;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Your Motion for Reconsideration was denied',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is vacated, should return a given title/description', () => {
      event.type = EVENT_TYPES.vacated;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Board of Veterans’ Appeals vacated a previous decision',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is amaNod, should return a given title/description', () => {
      event.type = EVENT_TYPES.amaNod;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Board of Veterans’ Appeals received your appeal',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is docketChange, should return a given title/description', () => {
      event.type = EVENT_TYPES.docketChange;
      const content = getEventContent(event);

      expect(content.title).to.eql('You switched appeal options');
      expect(content.description).to.eql('');
    });

    it('when event type is distributedToVlj, should return a given title/description', () => {
      event.type = EVENT_TYPES.distributedToVlj;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'Your appeal was distributed to a Veterans Law Judge',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is bvaDecisionEffectuation, should return a given title/description', () => {
      event.type = EVENT_TYPES.bvaDecisionEffectuation;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA updated your benefits to reflect the Board’s decision',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is dtaDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.dtaDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA corrected an error and made a new decision',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is scRequest, should return a given title/description', () => {
      event.type = EVENT_TYPES.scRequest;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA received your Supplemental Claim request',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is scDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.scDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA made a new decision');
      expect(content.description).to.eql('');
    });

    it('when event type is hlrDecision, should return a given title/description', () => {
      event.type = EVENT_TYPES.hlrDecision;
      const content = getEventContent(event);

      expect(content.title).to.eql('VA made a new decision');
      expect(content.description).to.eql('');
    });

    it('when event type is scOtherClose, should return a given title/description', () => {
      event.type = EVENT_TYPES.scOtherClose;
      const content = getEventContent(event);

      expect(content.title).to.eql('Your Supplemental Claim was closed');
      expect(content.description).to.eql('');
    });

    it('when event type is hlrRequest, should return a given title/description', () => {
      event.type = EVENT_TYPES.hlrRequest;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA received your Higher-Level Review request',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is hlrDtaError, should return a given title/description', () => {
      event.type = EVENT_TYPES.hlrDtaError;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'VA identified an error that must be corrected',
      );
      expect(content.description).to.eql('');
    });

    it('when event type is hlrOtherClose, should return a given title/description', () => {
      event.type = EVENT_TYPES.hlrOtherClose;
      const content = getEventContent(event);

      expect(content.title).to.eql('Your Higher-Level Review was closed');
      expect(content.description).to.eql('');
    });

    it('when event type is statutoryOptIn, should return a given title/description', () => {
      event.type = EVENT_TYPES.statutoryOptIn;
      const content = getEventContent(event);

      expect(content.title).to.eql(
        'You requested a decision review under the Appeals Modernization Act',
      );
      expect(content.description).to.eql('');
    });
  });

  describe('isClosed', () => {
    it('should return false for null or undefined items', () => {
      expect(isClosed(null)).to.be.false;
      expect(isClosed(undefined)).to.be.false;
    });

    it('should return false for items without attributes', () => {
      expect(isClosed({})).to.be.false;
      expect(isClosed({ type: 'appeal' })).to.be.false;
    });

    it('should return true for closed appeals (active: false)', () => {
      const closedAppeal = {
        type: APPEAL_TYPES.appeal,
        attributes: {
          active: false,
          status: { type: 'decision_mailed' },
        },
      };
      expect(isClosed(closedAppeal)).to.be.true;
    });

    it('should return false for open appeals (active: true)', () => {
      const openAppeal = {
        type: APPEAL_TYPES.appeal,
        attributes: {
          active: true,
          status: { type: 'pending_soc' },
        },
      };
      expect(isClosed(openAppeal)).to.be.false;
    });

    it('should handle all appeal types correctly', () => {
      const appealTypes = [
        APPEAL_TYPES.appeal,
        APPEAL_TYPES.legacy,
        APPEAL_TYPES.supplementalClaim,
        APPEAL_TYPES.higherLevelReview,
      ];

      appealTypes.forEach(type => {
        const closedItem = {
          type,
          attributes: { active: false },
        };
        const openItem = {
          type,
          attributes: { active: true },
        };

        expect(isClosed(closedItem)).to.be.true;
        expect(isClosed(openItem)).to.be.false;
      });
    });

    it('should return true for claims with status COMPLETE', () => {
      const completedClaim = {
        type: 'claim',
        attributes: {
          status: 'COMPLETE',
        },
      };
      expect(isClosed(completedClaim)).to.be.true;
    });

    it('should return false for claims with other statuses', () => {
      const activeClaim = {
        type: 'claim',
        attributes: {
          status: 'CLAIM_RECEIVED',
        },
      };
      expect(isClosed(activeClaim)).to.be.false;
    });

    it('should return true for STEM claims', () => {
      const stemClaim = {
        type: 'claim',
        attributes: {
          claimType: 'STEM',
          status: 'PENDING',
        },
      };
      expect(isClosed(stemClaim)).to.be.true;
    });

    it('should return true for completed STEM claims', () => {
      const completedStemClaim = {
        type: 'claim',
        attributes: {
          claimType: 'STEM',
          status: 'COMPLETE',
        },
      };
      expect(isClosed(completedStemClaim)).to.be.true;
    });
  });

  describe('isInProgress', () => {
    it('should return true for null or undefined items', () => {
      expect(isInProgress(null)).to.be.true;
      expect(isInProgress(undefined)).to.be.true;
    });

    it('should return true for items without attributes', () => {
      expect(isInProgress({})).to.be.true;
      expect(isInProgress({ type: 'appeal' })).to.be.true;
    });

    it('should return false for closed appeals', () => {
      const closedAppeal = {
        type: APPEAL_TYPES.appeal,
        attributes: {
          active: false,
          status: { type: 'decision_mailed' },
        },
      };
      expect(isInProgress(closedAppeal)).to.be.false;
    });

    it('should return true for open appeals', () => {
      const openAppeal = {
        type: APPEAL_TYPES.appeal,
        attributes: {
          active: true,
          status: { type: 'pending_soc' },
        },
      };
      expect(isInProgress(openAppeal)).to.be.true;
    });

    it('should return false for completed claims', () => {
      const completedClaim = {
        type: 'claim',
        attributes: {
          status: 'COMPLETE',
        },
      };
      expect(isInProgress(completedClaim)).to.be.false;
    });

    it('should return true for active claims', () => {
      const activeClaim = {
        type: 'claim',
        attributes: {
          status: 'CLAIM_RECEIVED',
        },
      };
      expect(isInProgress(activeClaim)).to.be.true;
    });

    it('should return false for STEM claims', () => {
      const stemClaim = {
        type: 'claim',
        attributes: {
          claimType: 'STEM',
          status: 'PENDING',
        },
      };
      expect(isInProgress(stemClaim)).to.be.false;
    });

    it('should be the inverse of isClosed', () => {
      const testItems = [
        { type: APPEAL_TYPES.appeal, attributes: { active: true } },
        { type: APPEAL_TYPES.appeal, attributes: { active: false } },
        { type: 'claim', attributes: { status: 'COMPLETE' } },
        { type: 'claim', attributes: { status: 'PENDING' } },
        { type: 'claim', attributes: { claimType: 'STEM' } },
      ];

      testItems.forEach(item => {
        expect(isInProgress(item)).to.equal(!isClosed(item));
      });
    });
  });
});
