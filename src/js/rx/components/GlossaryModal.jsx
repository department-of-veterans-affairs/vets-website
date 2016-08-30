import React from 'react';
import GlossaryList from './GlossaryList';

class GlossaryModal extends React.Component {
  constructor(props) {
    super(props);
    this.handlerCloseModal = this.handlerCloseModal.bind(this);
  }

  handlerCloseModal(event) {
    event.preventDefault();
    this.props.onCloseModal();
  }

  render() {
    let element;

    if (this.props.isVisible) {
      element = (
        <section className="rx-modal" id="rx-glossary-modal">
          <div className="rx-modal-inner">
            <h3 className="rx-modal-title">Glossary</h3>
            <div className="rx-modal-body">
              <GlossaryList terms={this.props.content}/>
              <div className="rx-button-group cf">
                <button type="button" onClick={this.handlerCloseModal}>Close</button>
                <a href="/rx/glossary/">See all status definitions</a>
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
