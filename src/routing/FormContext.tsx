import { createContext } from 'react';
import { IFormContextType } from './types';

const defaultState = {
  formData: {},
  handleUpdate: () => {
    console.log('submitting');
  },
};

export const FormContext = createContext<IFormContextType>(defaultState);
