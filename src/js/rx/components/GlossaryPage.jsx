import React from 'react';
import BackLink from '../components/BackLink';
import GlossaryList from '../components/GlossaryList';
import { glossary } from '../config.js';

class GlossaryPage extends React.Component {
  componentDidMount() {
    scrollTo(0, 0);
  }

  render() {
    let key = 0;
    const sections = Object.keys(glossary).map((sect) => {
      return (<GlossaryList
          key={key++}
          title={`${sect} statuses`}
          terms={glossary[sect]}/>);
    });

    return (
      <section>
        <BackLink text="Back to detail page"/>
        <h1>Glossary</h1>
        {sections}
      </section>
    );
  }
}

export default GlossaryPage;
