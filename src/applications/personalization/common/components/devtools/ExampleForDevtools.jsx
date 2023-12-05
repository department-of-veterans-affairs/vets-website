import React from 'react';

export const ExampleForDevTools = (props = { data: 'no props passed' }) => {
  return (
    <div data-devtools="exampleForDevTools">
      <pre>{JSON.stringify(props, 2, null)}</pre>
    </div>
  );
};
