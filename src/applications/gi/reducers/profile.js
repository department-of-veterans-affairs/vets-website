/* eslint-disable no-case-declarations */
import {
  CALCULATOR_INPUTS_CHANGED,
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_FAILED,
  FETCH_PROFILE_SUCCEEDED } from '../actions';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

const INITIAL_STATE = {
  attributes: {},
  version: {},
  inProgress: false,
};

function normalizedAttributes(attributes) {
  const name = attributes.name ? attributes.name.toUpperCase() : attributes.name;
  const city = attributes.city ? attributes.city.toUpperCase() : attributes.city;
  const state = attributes.state ? attributes.state.toUpperCase() : attributes.state;
  return {
    ...attributes,
    name,
    city,
    state,
  };
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CALCULATOR_INPUTS_CHANGED:
      const { field, value } = action;
      if (field === 'yellowRibbonDegreeLevel') {
        const yellowRibbonDivisionOptions = state.attributes.yellowRibbonPrograms.length > 0 ?
          [...new Set(state.attributes.yellowRibbonPrograms
            .filter(program => program.degreeLevel === value)
            .map(program => program.divisionProfessionalSchool))] :
          [];
        return {
          ...state,
          attributes: {
            ...state.attributes,
            yellowRibbonDivisionOptions
          }
        };
      }

      return state;
    case FETCH_PROFILE_STARTED:
      return {
        ...state,
        inProgress: true
      };
    case FETCH_PROFILE_FAILED:
      return {
        ...state,
        ...action.err,
        inProgress: false
      };
    case FETCH_PROFILE_SUCCEEDED:
      const camelPayload = camelCaseKeysRecursive(action.payload);
      // const { yellowRibbonPrograms } = camelPayload.data.attributes;
      const yellowRibbonPrograms = [
        {
          divisionProfessionalSchool: 'division1',
          numberOfStudents: 5,
          degreeLevel: 'graduate',
          contributionAmount: 5000
        },
        {
          divisionProfessionalSchool: 'division2',
          numberOfStudents: 3000,
          degreeLevel: 'undergraduate',
          contributionAmount: 5
        },
        {
          divisionProfessionalSchool: 'division3',
          numberOfStudents: 20,
          degreeLevel: 'undergraduate',
          contributionAmount: 25
        }
      ];
      const yellowRibbonDegreeLevelOptions = yellowRibbonPrograms.length > 0 ?
        [...new Set(yellowRibbonPrograms.map(program => program.degreeLevel))] :
        [];
      // first value of degree level is selected by default; only display division options associated with this degree level
      const yellowRibbonDivisionOptions = yellowRibbonPrograms.length > 0 ?
        [...new Set(yellowRibbonPrograms
          .filter(program => program.degreeLevel === yellowRibbonDegreeLevelOptions[0])
          .map(program => program.divisionProfessionalSchool))] :
        [];

      const attributes = normalizedAttributes({
        ...camelPayload.data.attributes,
        ...camelPayload.data.links,
        yellowRibbonDegreeLevelOptions,
        yellowRibbonDivisionOptions,
        yellowRibbonPrograms
      });
      // delete attributes.self;
      const version = camelPayload.meta.version;
      return {
        ...state,
        attributes,
        version,
        inProgress: false,
      };
    default:
      return state;
  }
}
