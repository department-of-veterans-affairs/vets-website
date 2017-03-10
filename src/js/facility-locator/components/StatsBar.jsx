import React from 'react';

class StatsBar extends React.Component {
  render() {
    const { color, label, percent } = this.props;

    return (
      <div className="fl-stats-bar-container">
        <div className="fl-stats-label">{label}</div>
        <div className="fl-stats-bar">
          <div className={`fl-stats-bar-inner ${color}`} style={{ width: `${Math.min(percent, 100)}%` }}/>
        </div>
        <div><strong>{percent.toFixed(0)} %</strong></div>
      </div>
    );
  }
}

StatsBar.propTypes = {
  percent: React.PropTypes.number.isRequired,
  color: React.PropTypes.oneOf(['blue', 'grey']),
  label: React.PropTypes.string,
};

StatsBar.defaultProps = {
  color: 'blue',
};

export default StatsBar;
