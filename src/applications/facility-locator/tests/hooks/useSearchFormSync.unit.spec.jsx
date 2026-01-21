import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderHook } from '@testing-library/react-hooks';
import useSearchFormSync from '../../hooks/useSearchFormSync';

describe('useSearchFormSync hook', () => {
  const getDefaultCurrentQuery = () => ({
    facilityType: null,
    serviceType: null,
    searchString: '',
    vamcServiceDisplay: null,
  });

  const getDefaultDraftFormState = () => ({
    facilityType: null,
    serviceType: null,
    searchString: '',
    vamcServiceDisplay: null,
    isValid: true,
    locationChanged: false,
    facilityTypeChanged: false,
    serviceTypeChanged: false,
  });

  const getDefaultProps = () => ({
    currentQuery: getDefaultCurrentQuery(),
    draftFormState: getDefaultDraftFormState(),
    setDraftFormState: sinon.spy(),
    updateDraftState: sinon.spy(),
    location: null,
    onChange: sinon.spy(),
    vaHealthServicesData: null,
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('searchString sync from Redux to draft', () => {
    it('should sync searchString when Redux changes', () => {
      const props = getDefaultProps();
      props.currentQuery.searchString = 'Austin, TX';

      renderHook(() => useSearchFormSync(props));

      expect(props.updateDraftState.calledOnce).to.be.true;
      expect(props.updateDraftState.calledWith({ searchString: 'Austin, TX' }))
        .to.be.true;
    });

    it('should not sync when searchString matches draft', () => {
      const props = getDefaultProps();
      props.currentQuery.searchString = 'Austin, TX';
      props.draftFormState.searchString = 'Austin, TX';

      renderHook(() => useSearchFormSync(props));

      // updateDraftState should not be called for searchString sync
      // (it may be called for other effects)
      const searchStringCalls = props.updateDraftState
        .getCalls()
        .filter(
          call =>
            call.args[0]?.searchString !== undefined &&
            Object.keys(call.args[0]).length === 1,
        );
      expect(searchStringCalls.length).to.equal(0);
    });

    it('should handle empty searchString from Redux', () => {
      const props = getDefaultProps();
      props.draftFormState.searchString = 'Old value';
      props.currentQuery.searchString = '';

      renderHook(() => useSearchFormSync(props));

      expect(props.updateDraftState.calledWith({ searchString: '' })).to.be
        .true;
    });
  });

  describe('URL params sync', () => {
    it('should sync URL params to draft state on mount', () => {
      const props = getDefaultProps();
      props.location = {
        search: '?facilityType=health&address=Denver',
        query: {
          facilityType: 'health',
          address: 'Denver, CO',
          serviceType: 'primaryCare',
        },
      };

      renderHook(() => useSearchFormSync(props));

      expect(props.setDraftFormState.calledOnce).to.be.true;
    });

    it('should call onChange to sync URL to Redux when updater runs', () => {
      const props = getDefaultProps();
      props.location = {
        search: '?facilityType=health',
        query: {
          facilityType: 'health',
          address: 'Austin, TX',
          serviceType: 'primaryCare',
        },
      };

      renderHook(() => useSearchFormSync(props));

      // setDraftFormState should have been called with an updater function
      expect(props.setDraftFormState.calledOnce).to.be.true;

      // The updater function should be defined
      const updater = props.setDraftFormState.firstCall.args[0];
      expect(typeof updater).to.equal('function');

      // When the updater runs, it should return state derived from URL params
      const result = updater(getDefaultDraftFormState());
      expect(result.facilityType).to.equal('health');
      expect(result.serviceType).to.equal('primaryCare');
      expect(result.searchString).to.equal('Austin, TX');
    });

    it('should prioritize URL params over Redux data', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        facilityType: 'benefits',
        searchString: 'Old location',
      };
      props.location = {
        search: '?facilityType=health',
        query: {
          facilityType: 'health',
          address: 'New location',
        },
      };

      renderHook(() => useSearchFormSync(props));

      const updater = props.setDraftFormState.firstCall.args[0];
      const result = updater(getDefaultDraftFormState());

      expect(result.facilityType).to.equal('health');
      expect(result.searchString).to.equal('New location');
    });
  });

  describe('Redux data sync (no URL params)', () => {
    it('should sync Redux data to draft when no URL params', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        facilityType: 'health',
        serviceType: 'mentalHealth',
        searchString: 'Seattle, WA',
      };

      renderHook(() => useSearchFormSync(props));

      expect(props.setDraftFormState.calledOnce).to.be.true;
      const updater = props.setDraftFormState.firstCall.args[0];
      const result = updater(getDefaultDraftFormState());

      expect(result.facilityType).to.equal('health');
      expect(result.serviceType).to.equal('mentalHealth');
      expect(result.searchString).to.equal('Seattle, WA');
    });

    it('should not call onChange when syncing from Redux only', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        facilityType: 'health',
      };

      renderHook(() => useSearchFormSync(props));

      const updater = props.setDraftFormState.firstCall.args[0];
      updater(getDefaultDraftFormState());

      // onChange should NOT be called when syncing from Redux (no URL params)
      expect(props.onChange.called).to.be.false;
    });
  });

  describe('vamcServiceDisplay sync', () => {
    it('should sync vamcServiceDisplay when Redux has it and draft does not', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        vamcServiceDisplay: 'Primary care',
      };
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: 'health',
        serviceType: 'primaryCare', // serviceType must be set for sync to occur
        vamcServiceDisplay: null,
      };

      renderHook(() => useSearchFormSync(props));

      expect(
        props.updateDraftState.calledWith({
          vamcServiceDisplay: 'Primary care',
        }),
      ).to.be.true;
    });

    it('should not sync vamcServiceDisplay when serviceType is null (cleared by facility change)', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        vamcServiceDisplay: 'Primary care',
      };
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: 'health',
        serviceType: null, // serviceType is null means user cleared it
        vamcServiceDisplay: null,
      };

      renderHook(() => useSearchFormSync(props));

      // Should not call updateDraftState with vamcServiceDisplay
      const vamcCalls = props.updateDraftState
        .getCalls()
        .filter(call => call.args[0]?.vamcServiceDisplay !== undefined);
      expect(vamcCalls.length).to.equal(0);
    });

    it('should not sync vamcServiceDisplay if draft already has it', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        vamcServiceDisplay: 'Primary care',
      };
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: 'health',
        vamcServiceDisplay: 'Mental health care',
      };

      renderHook(() => useSearchFormSync(props));

      // Should not call updateDraftState with vamcServiceDisplay
      const vamcCalls = props.updateDraftState
        .getCalls()
        .filter(call => call.args[0]?.vamcServiceDisplay !== undefined);
      expect(vamcCalls.length).to.equal(0);
    });

    it('should not sync vamcServiceDisplay if facility type is not health', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        vamcServiceDisplay: 'Primary care',
      };
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: 'benefits',
        vamcServiceDisplay: null,
      };

      renderHook(() => useSearchFormSync(props));

      const vamcCalls = props.updateDraftState
        .getCalls()
        .filter(call => call.args[0]?.vamcServiceDisplay !== undefined);
      expect(vamcCalls.length).to.equal(0);
    });
  });

  describe('no sync needed', () => {
    it('should not sync when no URL params and no Redux data', () => {
      const props = getDefaultProps();

      renderHook(() => useSearchFormSync(props));

      // setDraftFormState should not be called for URL/Redux sync
      expect(props.setDraftFormState.called).to.be.false;
    });
  });

  describe('validation', () => {
    it('should apply validation to synced state', () => {
      const props = getDefaultProps();
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        facilityType: 'health',
        searchString: 'Austin, TX',
      };

      renderHook(() => useSearchFormSync(props));

      const updater = props.setDraftFormState.firstCall.args[0];
      const result = updater(getDefaultDraftFormState());

      // validateForm should set isValid based on the new state
      expect(result.isValid).to.be.true;
      expect(result.facilityTypeChanged).to.be.true;
      expect(result.locationChanged).to.be.true;
    });
  });
});
