import React from 'react';
import BackLink from '../components/BackLink';
import GlossaryList from '../components/GlossaryList';
import { getGlossary } from '../glossary.js';

class GlossaryPage extends React.Component {
  render() {
    return (
      <section className="rx-app row">
        <BackLink text="Back to detail page"/>
        <h1>Glossary</h1>
        <GlossaryList terms={getGlossary()}/>
      </section>
    );
  }
}

export default GlossaryPage;
