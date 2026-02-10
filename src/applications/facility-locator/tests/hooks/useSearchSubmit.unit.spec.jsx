import { expect } from 'chai';
import sinon from 'sinon-v20';
import { renderHook, act } from '@testing-library/react-hooks';
import * as recordEvent from 'platform/monitoring/record-event';
import useSearchSubmit from '../../hooks/useSearchSubmit';
import { LocationType } from '../../constants';

describe('useSearchSubmit hook', () => {
  let recordStub;

  const getDefaultDraftFormState = () => ({
    facilityType: 'health',
    serviceType: 'primaryCare',
    searchString: 'Austin, TX',
    vamcServiceDisplay: 'Primary care',
    isValid: true,
    locationChanged: false,
    facilityTypeChanged: false,
    serviceTypeChanged: false,
  });

  const getDefaultCurrentQuery = () => ({
    zoomLevel: 10,
    specialties: null,
  });

  const getDefaultProps = () => ({
    draftFormState: getDefaultDraftFormState(),
    setDraftFormState: sinon.spy(),
    selectedServiceType: { id: 'primaryCare', name: 'Primary care' },
    currentQuery: getDefaultCurrentQuery(),
    onChange: sinon.spy(),
    onSubmit: sinon.spy(),
    isMobile: false,
    mobileMapUpdateEnabled: false,
    selectMobileMapPin: sinon.spy(),
    setSearchInitiated: sinon.spy(),
  });

  const createMockEvent = () => ({
    preventDefault: sinon.spy(),
  });

  beforeEach(() => {
    recordStub = sinon.stub(recordEvent, 'default');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('successful submission', () => {
    it('should prevent default form behavior', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));
      const mockEvent = createMockEvent();

      act(() => {
        result.current.handleSubmit(mockEvent);
      });

      expect(mockEvent.preventDefault.calledOnce).to.be.true;
    });

    it('should call onChange with draft form state', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onChange.calledOnce).to.be.true;
      expect(
        props.onChange.calledWith({
          facilityType: 'health',
          serviceType: 'primaryCare',
          searchString: 'Austin, TX',
          vamcServiceDisplay: 'Primary care',
        }),
      ).to.be.true;
    });

    it('should call onSubmit with draft form state', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.calledOnce).to.be.true;
      expect(
        props.onSubmit.calledWith({
          facilityType: 'health',
          serviceType: 'primaryCare',
          searchString: 'Austin, TX',
          vamcServiceDisplay: 'Primary care',
        }),
      ).to.be.true;
    });

    it('should call setSearchInitiated with true', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.setSearchInitiated.calledOnce).to.be.true;
      expect(props.setSearchInitiated.calledWith(true)).to.be.true;
    });

    it('should record analytics event', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(recordStub.calledOnce).to.be.true;
      expect(
        recordStub.calledWith({
          event: 'fl-search',
          'fl-search-fac-type': 'health',
          'fl-search-svc-type': 'primaryCare',
          'fl-current-zoom-depth': 10,
        }),
      ).to.be.true;
    });
  });

  describe('duplicate query prevention', () => {
    it('should prevent duplicate submissions with same query', () => {
      const props = getDefaultProps();
      const { result } = renderHook(() => useSearchSubmit(props));

      // First submission
      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.calledOnce).to.be.true;

      // Second submission with same data
      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      // Should still be called only once
      expect(props.onSubmit.calledOnce).to.be.true;
    });

    it('should allow submission when query changes', () => {
      const props = getDefaultProps();
      const { result, rerender } = renderHook(() => useSearchSubmit(props));

      // First submission
      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.calledOnce).to.be.true;

      // Update props with different search string
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        searchString: 'Denver, CO',
      };
      rerender();

      // Second submission with different data
      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.calledTwice).to.be.true;
    });
  });

  describe('validation - missing searchString', () => {
    it('should not submit when searchString is empty', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        searchString: '',
      };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.called).to.be.false;
      expect(props.onChange.called).to.be.false;
    });

    it('should set locationChanged and isValid flags', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        searchString: '',
      };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.setDraftFormState.calledOnce).to.be.true;
      const updater = props.setDraftFormState.firstCall.args[0];
      const newState = updater(props.draftFormState);
      expect(newState.locationChanged).to.be.true;
      expect(newState.isValid).to.be.false;
    });
  });

  describe('validation - missing facilityType', () => {
    it('should not submit when facilityType is empty', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: null,
      };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.called).to.be.false;
      expect(props.onChange.called).to.be.false;
    });

    it('should set facilityTypeChanged and isValid flags', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: null,
      };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.setDraftFormState.calledOnce).to.be.true;
      const updater = props.setDraftFormState.firstCall.args[0];
      const newState = updater(props.draftFormState);
      expect(newState.facilityTypeChanged).to.be.true;
      expect(newState.isValid).to.be.false;
    });
  });

  describe('validation - CC_PROVIDER requires serviceType', () => {
    it('should not submit when CC_PROVIDER has no serviceType', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: LocationType.CC_PROVIDER,
        serviceType: null,
      };
      props.selectedServiceType = null;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.called).to.be.false;
    });

    it('should not submit when CC_PROVIDER has no selectedServiceType', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: LocationType.CC_PROVIDER,
        serviceType: 'dentist',
      };
      props.selectedServiceType = null;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.called).to.be.false;
    });

    it('should set serviceTypeChanged and isValid flags', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: LocationType.CC_PROVIDER,
        serviceType: null,
      };
      props.selectedServiceType = null;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.setDraftFormState.calledOnce).to.be.true;
      const updater = props.setDraftFormState.firstCall.args[0];
      const newState = updater(props.draftFormState);
      expect(newState.serviceTypeChanged).to.be.true;
      expect(newState.isValid).to.be.false;
    });

    it('should submit when CC_PROVIDER has valid serviceType', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: LocationType.CC_PROVIDER,
        serviceType: 'dentist',
      };
      props.selectedServiceType = { id: 'dentist', name: 'Dentist' };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.onSubmit.calledOnce).to.be.true;
    });
  });

  describe('analytics - CC_PROVIDER specialty name', () => {
    it('should use specialty display name for CC_PROVIDER analytics', () => {
      const props = getDefaultProps();
      props.draftFormState = {
        ...getDefaultDraftFormState(),
        facilityType: LocationType.CC_PROVIDER,
        serviceType: '101YA0400X',
      };
      props.selectedServiceType = { id: '101YA0400X', name: 'Counselor' };
      props.currentQuery = {
        ...getDefaultCurrentQuery(),
        specialties: {
          '101YA0400X': 'Counselor - Addiction',
        },
      };
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(
        recordStub.calledWith({
          event: 'fl-search',
          'fl-search-fac-type': LocationType.CC_PROVIDER,
          'fl-search-svc-type': 'Counselor - Addiction',
          'fl-current-zoom-depth': 10,
        }),
      ).to.be.true;
    });
  });

  describe('mobile map pin clearing', () => {
    it('should clear mobile map pin when isMobile and mobileMapUpdateEnabled', () => {
      const props = getDefaultProps();
      props.isMobile = true;
      props.mobileMapUpdateEnabled = true;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.selectMobileMapPin.calledOnce).to.be.true;
      expect(props.selectMobileMapPin.calledWith(null)).to.be.true;
    });

    it('should not clear mobile map pin when not isMobile', () => {
      const props = getDefaultProps();
      props.isMobile = false;
      props.mobileMapUpdateEnabled = true;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.selectMobileMapPin.called).to.be.false;
    });

    it('should not clear mobile map pin when mobileMapUpdateEnabled is false', () => {
      const props = getDefaultProps();
      props.isMobile = true;
      props.mobileMapUpdateEnabled = false;
      const { result } = renderHook(() => useSearchSubmit(props));

      act(() => {
        result.current.handleSubmit(createMockEvent());
      });

      expect(props.selectMobileMapPin.called).to.be.false;
    });
  });
});
