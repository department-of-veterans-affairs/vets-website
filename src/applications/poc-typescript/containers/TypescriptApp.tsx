import React, { ReactNode } from 'react';
import FooterComponent from '../components/FooterComponent';
import UserComponent from '../components/UserComponent';
import UserFormComponent from '../components/UserFormComponent';

interface AppProps {
  children: ReactNode;
}

export default function TypescriptApp({ children }: AppProps) {
  return (
    <main className="vads-u-padding--3">
      <h1>VA Development with Typescript</h1>
      <UserComponent
        name="John Doe"
        age={26}
        address="87 Summer St, Boston, MA 02110"
        dob={new Date(1997, 4, 3)}
      />
      <UserFormComponent />
      <FooterComponent />
      {children}
    </main>
  );
}
