import React from 'react';
import BackLink from '../components/BackLink';
import GlossaryList from '../components/GlossaryList';
import { glossary } from '../config.js';

class GlossaryPage extends React.Component {
  componentDidMount() {
    scrollTo(0, 0);
  }

  render() {
    return (
      <section className="rx-app row">
        <BackLink text="Back to detail page"/>
        <h1>Glossary</h1>
        <GlossaryList terms={glossary}/>
      </section>
    );
  }
}

export default GlossaryPage;
