import PropTypes from 'prop-types';
import React from 'react';

class GlossaryList extends React.Component {
  render() {
    const termsList = [];
    let tKey = 0;
    const terms = this.props.terms;

    Object.keys(terms).forEach(o => {
      const id = terms[o].term.toLowerCase().replace(/\s/g, '');
      termsList.push(<dt id={id} key={++tKey}>{terms[o].term}</dt>);
      termsList.push(<dd key={++tKey}>{terms[o].definition}</dd>);
    });

    let title;
    if (this.props.title) {
      title = <h2 className="rx-pgroup-title va-h-ruled">{this.props.title}</h2>;
    }

    return (
      <section className="rx-glossary-section">
        {title}
        <dl className="rx-glossary">
          {termsList}
        </dl>
      </section>
    );
  }
}

GlossaryList.propTypes = {
  title: PropTypes.string,
  terms: PropTypes.arrayOf(PropTypes.shape({
    term: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired
  })).isRequired,
};

export default GlossaryList;
