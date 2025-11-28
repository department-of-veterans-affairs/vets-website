import { createStore } from 'redux';
import { expect } from 'chai';
import { facilitiesReducer } from '../../reducers/facilities';
import { Actions } from '../../util/actionTypes';

describe('facilities reducer', () => {
  it('should return initial state', () => {
    const state = facilitiesReducer(undefined, {});
    
    expect(state).to.have.property('facilities');
    expect(state).to.have.property('cernerFacilities');
    expect(state.facilities).to.be.an('array').that.is.empty;
    expect(state.cernerFacilities).to.be.an('array').that.is.empty;
  });

  const mockStore = (initialState) => {
    return createStore(facilitiesReducer, initialState);
  };

  it('should handle GET_FACILITIES action', () => {
    const store = mockStore();
    const facilitiesData = {
      data: [
        {
          id: '1',
          attributes: {
            id: '1',
            name: 'Facility 1',
            stationNumber: '123',
          },
        },
        {
          id: '2',
          attributes: {
            id: '2',
            name: 'Facility 2',
            stationNumber: '456',
          },
        },
      ],
    };
    
    store.dispatch({
      type: Actions.Facilities.GET_FACILITIES,
      payload: facilitiesData,
    });
    
    const state = store.getState();
    expect(state.facilities).to.have.lengthOf(2);
    expect(state.facilities[0]).to.deep.equal(facilitiesData.data[0].attributes);
    expect(state.facilities[1]).to.deep.equal(facilitiesData.data[1].attributes);
  });

  it('should handle GET_CERNER_FACILITIES action', () => {
    const store = mockStore();
    const cernerFacilitiesData = [
      {
        id: '1',
        attributes: {
          id: '1',
          name: 'Cerner Facility 1',
          facilityType: 'Cerner',
        },
      },
      {
        id: '2',
        attributes: {
          id: '2',
          name: 'Cerner Facility 2',
          facilityType: 'Cerner',
        },
      },
    ];
    
    store.dispatch({
      type: Actions.Facilities.GET_CERNER_FACILITIES,
      payload: cernerFacilitiesData,
    });
    
    const state = store.getState();
    expect(state.cernerFacilities).to.have.lengthOf(2);
    expect(state.cernerFacilities[0]).to.deep.equal(cernerFacilitiesData[0].attributes);
    expect(state.cernerFacilities[1]).to.deep.equal(cernerFacilitiesData[1].attributes);
  });

  it('should handle both GET_FACILITIES and GET_CERNER_FACILITIES', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Facilities.GET_FACILITIES,
      payload: {
        data: [
          { id: '1', attributes: { id: '1', name: 'Regular Facility' } },
        ],
      },
    });
    
    store.dispatch({
      type: Actions.Facilities.GET_CERNER_FACILITIES,
      payload: [
        { id: '2', attributes: { id: '2', name: 'Cerner Facility' } },
      ],
    });
    
    const state = store.getState();
    expect(state.facilities).to.have.lengthOf(1);
    expect(state.cernerFacilities).to.have.lengthOf(1);
    expect(state.facilities[0].name).to.equal('Regular Facility');
    expect(state.cernerFacilities[0].name).to.equal('Cerner Facility');
  });

  it('should handle empty facilities data', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Facilities.GET_FACILITIES,
      payload: { data: [] },
    });
    
    const state = store.getState();
    expect(state.facilities).to.be.an('array').that.is.empty;
  });

  it('should handle empty cerner facilities data', () => {
    const store = mockStore();
    
    store.dispatch({
      type: Actions.Facilities.GET_CERNER_FACILITIES,
      payload: [],
    });
    
    const state = store.getState();
    expect(state.cernerFacilities).to.be.an('array').that.is.empty;
  });

  it('should handle unknown action type', () => {
    const store = mockStore();
    const initialState = store.getState();
    
    store.dispatch({
      type: 'UNKNOWN_ACTION',
      payload: {},
    });
    
    const state = store.getState();
    expect(state).to.deep.equal(initialState);
  });
});
