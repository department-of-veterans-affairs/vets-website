import React from 'react';

export default function App({ children }) {
  return <div>{children}</div>;
}

// import React from 'react';

// import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
// import formConfig from '../config/form';

// export default function App({ location, children }) {
//   return (
//     <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
//       {children}
//     </RoutedSavableApp>
//   );
// }
