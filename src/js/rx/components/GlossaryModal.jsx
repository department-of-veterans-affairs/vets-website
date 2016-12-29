import React from 'react';
import { Link } from 'react-router';
import GlossaryList from './GlossaryList';

class GlossaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      document.getElementById('rx-glossary-modal').focus();
    }
  }

  handleCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    let element;
    if (this.props.isVisible) {
      element = (
        <section className="va-modal rx-modal" id="rx-glossary-modal" role="dialog" aria-labelledby="Glossary">
          <div className="va-modal-inner">
            <h3 className="va-modal-title">Glossary</h3>
            <div className="va-modal-body rx-modal-body">
              <GlossaryList terms={this.props.content}/>
              <div className="va-modal-button-group cf">
                <button type="button" onClick={this.handleCloseModal}>Close</button>
                <Link
                    to="/glossary"
                    onClick={this.props.onCloseModal}>
                  See all status definitions
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    } else {
      element = (<div/>);
    }

    return element;
  }
}

GlossaryModal.propTypes = {
  content: React.PropTypes.arrayOf(React.PropTypes.shape({
    term: React.PropTypes.string,
    definition: React.PropTypes.string
  })),
  onCloseModal: React.PropTypes.func
};

export default GlossaryModal;
