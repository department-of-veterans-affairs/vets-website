import React from 'react';

class GlossaryList extends React.Component {
  render() {
    let termsList = [];
    let tKey = 0;
    const terms = this.props.terms;

    for (const o in terms) {
      if (terms.hasOwnProperty(o)) {
        termsList.push(<dt key={++tKey}>{terms[o].term}</dt>);
        termsList.push(<dd key={++tKey}>{terms[o].definition}</dd>);
      }
    }

    return (
      <section>
        <h2 className="rx-pgroup-title va-h-ruled">{this.props.title}</h2>
        <dl className="rx-glossary">
          {termsList}
        </dl>
      </section>
    );
  }
}

GlossaryList.propTypes = {
  terms: React.PropTypes.arrayOf(React.PropTypes.shape({
    term: React.PropTypes.string.isRequired,
    definition: React.PropTypes.string.isRequired
  })).isRequired,
};

export default GlossaryList;
