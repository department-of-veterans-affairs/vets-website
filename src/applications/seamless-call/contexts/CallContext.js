import React from 'react';

export const CallContext = React.createContext({
  connect: () => {},
  disconnect: () => {},
  call: () => {},
  hangUp: () => {},
});
