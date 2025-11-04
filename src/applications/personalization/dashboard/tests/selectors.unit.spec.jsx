import { expect } from 'chai';
import * as selectors from '../selectors';

describe('dashboard selectors', () => {
  describe('selectFolders (via selectFolder)', () => {
    describe('when state.health is null', () => {
      it('should return undefined', () => {
        const state = {};
        expect(selectors.selectFolder(state)).to.be.undefined;
      });
    });

    describe('when state.health.msg is null', () => {
      it('should return undefined', () => {
        const state = {
          health: {},
        };
        expect(selectors.selectFolder(state)).to.be.undefined;
      });
    });

    describe('when state.health.msg.folders is null', () => {
      it('should return undefined', () => {
        const state = {
          health: {
            msg: {},
          },
        };
        expect(selectors.selectFolder(state)).to.be.undefined;
      });
    });

    describe('when state.health.msg.folders.data is null', () => {
      it('should return undefined', () => {
        const state = {
          health: {
            msg: {
              folders: {},
            },
          },
        };
        expect(selectors.selectFolder(state)).to.be.undefined;
      });
    });

    describe('when state.health.msg.folders.data.currentItem exists', () => {
      it('should return the currentItem', () => {
        const currentItem = { id: 1, name: 'Inbox' };
        const state = {
          health: {
            msg: {
              folders: {
                data: {
                  currentItem,
                },
              },
            },
          },
        };
        expect(selectors.selectFolder(state)).to.deep.equal(currentItem);
      });
    });
  });

  describe('selectUserCernerFacilityNames', () => {
    // Note: These tests require proper state setup for the underlying platform selectors
    // selectPatientCernerFacilities and selectCernerFacilities to work correctly.
    // The state structure needed is complex and depends on platform modules.
    // For now, we test the branches that are directly testable with state manipulation.

    describe('when user has no Cerner facilities (selectPatientCernerFacilities returns empty array)', () => {
      it('should return empty array', () => {
        // State where user has facilities but none are Cerner
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '984' }, { facilityId: '668' }],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [
                  {
                    vhaId: '757',
                    vamcSystemName: 'VA Central Ohio health care',
                  },
                ],
              },
            },
          },
        };
        const result = selectors.selectUserCernerFacilityNames(state);
        expect(result).to.deep.equal([]);
      });
    });

    describe('when user has Cerner facilities matching drupal data', () => {
      it('should return matching facility names', () => {
        // State where user has Cerner facilities that match drupal data
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '757' }, { facilityId: '687' }],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [
                  {
                    vhaId: '757',
                    vamcSystemName: 'VA Central Ohio health care',
                  },
                  {
                    vhaId: '687',
                    vamcSystemName: 'VA Walla Walla health care',
                  },
                  { vhaId: '999', vamcSystemName: 'Other Facility' },
                ],
              },
            },
          },
        };
        const result = selectors.selectUserCernerFacilityNames(state);
        expect(result).to.deep.equal([
          'VA Central Ohio health care',
          'VA Walla Walla health care',
        ]);
      });
    });

    describe('when drupal data has no cernerFacilities', () => {
      it('should return empty array', () => {
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '757' }],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [],
              },
            },
          },
        };
        const result = selectors.selectUserCernerFacilityNames(state);
        expect(result).to.deep.equal([]);
      });
    });

    describe('when patientCernerFacilityIds includes current.vhaId (true branch)', () => {
      it('should include the facility name in the result', () => {
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '757' }],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [
                  {
                    vhaId: '757',
                    vamcSystemName: 'VA Central Ohio health care',
                  },
                  {
                    vhaId: '687',
                    vamcSystemName: 'VA Walla Walla health care',
                  },
                ],
              },
            },
          },
        };
        const result = selectors.selectUserCernerFacilityNames(state);
        expect(result).to.deep.equal(['VA Central Ohio health care']);
      });
    });

    describe('when patientCernerFacilityIds does not include current.vhaId (false branch)', () => {
      it('should not include the facility name in the result', () => {
        const state = {
          user: {
            profile: {
              facilities: [{ facilityId: '757' }],
            },
          },
          drupalStaticData: {
            vamcEhrData: {
              data: {
                cernerFacilities: [
                  {
                    vhaId: '687',
                    vamcSystemName: 'VA Walla Walla health care',
                  },
                  { vhaId: '999', vamcSystemName: 'Other Facility' },
                ],
              },
            },
          },
        };
        const result = selectors.selectUserCernerFacilityNames(state);
        expect(result).to.deep.equal([]);
      });
    });
  });

  describe('selectPdf', () => {
    describe('when submissions[guid] exists', () => {
      it('should return the submission object', () => {
        const mockSubmission = {
          url: 'http://example.com/form.pdf',
          guid: 'test-guid',
        };
        const state = {
          myVaFormPdfs: {
            submissions: {
              'test-guid': mockSubmission,
            },
          },
        };
        const result = selectors.selectPdf(state, 'test-guid');
        expect(result).to.deep.equal(mockSubmission);
      });
    });

    describe('when submissions[guid] is undefined', () => {
      it('should return empty object as fallback', () => {
        const state = {
          myVaFormPdfs: {
            submissions: {},
          },
        };
        const result = selectors.selectPdf(state, 'non-existent-guid');
        expect(result).to.deep.equal({});
      });
    });
  });
});
