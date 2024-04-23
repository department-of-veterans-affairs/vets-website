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
  });
});
