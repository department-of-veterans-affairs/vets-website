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

    // check if the array has length 1, then render a certain way
    // else render the way it is

    if (termsList.length === 2) {
      return (
        <div>
          <h3>Glossary: {termsList[0]}</h3>
          <button className="va-modal-close" type="button" onClick={this.handleCloseModal}><i className="fa fa-close"></i><span className="usa-sr-only">Close this modal</span></button>
          {termsList[1]}
        </div>
      );
    }
    return (
      <section className="rx-glossary-section">
        {title}
        <div className="rx-glossary">
          <dl>{termsList}</dl>
        </div>
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
