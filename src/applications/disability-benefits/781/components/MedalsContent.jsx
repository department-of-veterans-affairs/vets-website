import React from 'react';

export default class MedalsContent extends React.Component {
  render() {
    const items = Object.keys(this.props.items);

    return (
      <aside className="c-modal-cover">
        <div className="c-modal">
          <div className="c-modal__body">
            {items.map((item, index) => (
              <div key={index}>
                <input type="checkbox" id={index} name={item} />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}

            <button onClick={this.props.onClose}>Confirm</button>
            <button
              className="usa-button-secondary"
              onClick={this.props.onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </aside>
    );
  }
}
