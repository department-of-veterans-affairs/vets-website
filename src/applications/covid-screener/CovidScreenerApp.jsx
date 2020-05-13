import React from 'react';
import FormQuestion from './components/FormQuestion';
import FormOption from './components/FormOption';

export default function CovidScreenerApp({ children }) {
  return (
  <main>
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--12 large-screen:vads-l-col--12">
          <h1>COVID Screener Questionaire</h1>
          <FormQuestion question="Do you have COVID?">
            <FormOption>Yes</FormOption>
            <FormOption>No</FormOption>
          </FormQuestion>
        </div>
      </div>
    </div>
  </main>
  );
}