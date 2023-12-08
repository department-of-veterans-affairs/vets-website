import React from 'react';

export const ExampleForDevTools = (props = { data: 'no props passed' }) => {
  const {
    data: { exampleBool, exampleStr, exampleArr },
    extraProp,
  } = props;
  return (
    <div data-devtools="exampleForDevTools">
      <h4>Example child inside DevTools</h4>
      <p>exampleBool: {exampleBool ? 'Yes' : 'No'}</p>
      <p>exampleStr: {exampleStr}</p>
      <p>exampleArr is {exampleArr.length} long</p>
      <p>extraProp: {extraProp.toUpperCase()}</p>
    </div>
  );
};
