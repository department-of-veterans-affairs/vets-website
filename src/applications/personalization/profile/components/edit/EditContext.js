import { createContext } from 'react';

export const EditContext = createContext({
  onCancel: () => {
    throw new Error('onCancel was not provided to the EditContext.Provider');
  },
});
