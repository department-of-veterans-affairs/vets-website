import React from 'react';
import FormQuestion from '../components/FormQuestion';
import CustomFormQuestion from '../components/CustomFormQuestion';
import FormOption from '../components/FormOption';
import FormInfo from '../components/FormInfo';

export default function App({ children }) {
  return (
  <main>
    <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
      <div className="vads-l-row vads-u-margin-x--neg2p5">
        <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--12 large-screen:vads-l-col--12">
          <h1>COVID Screener</h1>
          <p>Each time you enter a VA facility, you'll need to answer 6 questions first as part of our coronavirus symptom screening.</p>
          <p>We won't store or share any of your data.</p>
          <CustomFormQuestion question="Are you a...">
            <FormOption>Patient</FormOption>
            <FormOption>Visitor</FormOption>
            <FormOption>Employee or contractor</FormOption>
          </CustomFormQuestion>
          <FormQuestion>
            In the past 24 hours, have you had a fever?
          </FormQuestion>
          <FormQuestion>
            In the past week, have you had a cough or shortness of breath
            that's new or getting worse?
          </FormQuestion>
          <FormQuestion>
            In the last 3 days, have you had flu-like symptoms?
            <FormInfo>These may include: fever or feeling feverish/chills, cough, sore throat, runny or stuffy nose, muscle or body aches, headaches, fatigue (tiredness), vomiting or diarrhea (less common in adults)
            </FormInfo>
          </FormQuestion>
          <FormQuestion>
            In the past 2 weeks, have you been exposed to someone who has a confirmed coronavirus diagnosis when you weren't wearing personal protective equipment (PPE)?
          </FormQuestion>
          <FormQuestion>
            Do you currently have a sore throat, runny nose, or nasal congestion?
          </FormQuestion>
        </div>
      </div>
    </div>
  </main>
  );
}