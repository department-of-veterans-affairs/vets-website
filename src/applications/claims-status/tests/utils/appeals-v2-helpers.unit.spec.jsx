import { expect } from 'chai';

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
          active: true,
          status: {
            type: STATUS_TYPES.pendingSoc,
            details: {
              lastSocDate: '2015-09-12',
              certificationTimeliness: [1, 4],
              socTimeliness: [2, 16],
            },
          },
          aoj: '',
          programArea: 'compensation',
        },
      };
      const contents = getStatusContents(appeal);

      expect(contents.title).to.eql(
        'A Decision Review Officer is reviewing your appeal',
      );
      // console.log(contents.description.props);
      // expect(contents.description.props).to.contain(
      //   'Agency of Original Jurisdiction',
      // );
    });
  });
});
