import React from 'react';

class StatsBar extends React.Component {
  render() {
    const { percent, color } = this.props;

    return (
      <div className="fl-stats-bar">
        <div className={`fl-stats-bar-inner ${color}`} style={{ width: `${percent}%` }}/>
      </div>
    );
  }
}

StatsBar.propTypes = {
  percent: React.PropTypes.number.isRequired,
  color: React.PropTypes.oneOf(['blue', 'grey']),
};

StatsBar.defaultProps = {
  color: 'blue',
};

export default StatsBar;
