import createCommonStore from '../../../platform/startup/store';
import reducer from '../reducers';

const calculatorConstants = require('./data/calculator-constants.json');

const calculatorConstantsList = () => {
  const constantsList = [];
  calculatorConstants.data.forEach(c => {
    constantsList[c.attributes.name] = c.attributes.value;
  });
  return constantsList;
};

const getDefaultState = () => {
  const defaultState = createCommonStore(reducer).getState();

  defaultState.constants = {
    constants: {},
    version: calculatorConstants.meta.version,
    inProgress: false,
  };

  calculatorConstants.data.forEach(c => {
    defaultState.constants.constants[c.attributes.name] = c.attributes.value;
  });
  return defaultState;
};

module.exports = {
  calculatorConstantsList,
  getDefaultState,
};
