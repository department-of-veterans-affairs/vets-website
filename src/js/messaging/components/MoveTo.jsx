import React from 'react';

import ButtonCreateFolder from './buttons/ButtonCreateFolder';
import ButtonMove from './buttons/ButtonMove';
import MoveToOption from './MoveToOption';

class MoveTo extends React.Component {
  render() {
    const folderOptions = this.props.folders.map((folder) => {
      return (
        <li key={folder.folderId}>
          <MoveToOption
              folderName={folder.name}
              folderId={folder.folderId}/>
        </li>
      );
    });

    return (
      <div className="msg-move-to">
        <ButtonMove onClick={this.props.onToggleMoveTo}/>
        <form
            hidden={this.props.isOpen}
            onChange={this.props.onChooseFolder}>
          <input
              name="threadId"
              type="hidden"
              value={this.props.threadId}/>
          <fieldset>
            <legend className="usa-sr-only">
              Move this message to
            </legend>
            <ul className="msg-move-to-options">
              {folderOptions}
              <li><ButtonCreateFolder onClick={this.props.onCreateFolder}/></li>
            </ul>
          </fieldset>
        </form>
      </div>
    );
  }
}

MoveTo.propTypes = {
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  isOpen: React.PropTypes.bool,
  threadId: React.PropTypes.string.isRequired,
  onChooseFolder: React.PropTypes.func.isRequired,
  onCreateFolder: React.PropTypes.func.isRequired,
  onToggleMoveTo: React.PropTypes.func.isRequired,
};

export default MoveTo;
