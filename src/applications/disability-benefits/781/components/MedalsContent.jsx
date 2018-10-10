import React from 'react';

export default class MedalsContent extends React.Component {
  state = { awardedMedals: {} };

  onChange = (index, event) => {
    this.setState({
      awardedMedals: {
        ...this.state.awardedMedals,
        [event.target.name]: event.target.checked,
      },
    });
  };

  confirm = () => {
    const { awardedMedals } = this.state;

    const medals = Object.keys(awardedMedals).filter(
      key => awardedMedals[key] === true,
    );
    this.props.props.onChange(medals);

    this.props.onClose();
  };

  render() {
    const { items } = this.props;

    return (
      <aside className="medal-modal__cover">
        <div className="medal-modal">
          <div className="medal-modal__body">
            {items.map((item, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={index}
                  name={item}
                  value={item}
                  checked={this.state.isChecked}
                  onChange={event => this.onChange(index, event)}
                />
                <label htmlFor={item}>{item}</label>
              </div>
            ))}
            <button onClick={this.confirm}>Confirm</button>
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
