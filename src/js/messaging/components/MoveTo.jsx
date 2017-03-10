import React from 'react';

import ButtonCreateFolder from './buttons/ButtonCreateFolder';
import ButtonMove from './buttons/ButtonMove';
import MoveToOption from './MoveToOption';

class MoveTo extends React.Component {
  constructor(props) {
    super(props);
    this.handleChooseFolder = this.handleChooseFolder.bind(this);
    this.openCreateFolderModal = this.openCreateFolderModal.bind(this);
  }

  openCreateFolderModal() {
    this.props.onCreateFolder(this.props.messageId);
  }

  handleChooseFolder(domEvent) {
    // domEvent will bubble up from the radio button
    // to the form, which is why we're using currentTarget.
    // instead of target.
    const folderId = +domEvent.currentTarget.messagingMoveToFolder.value;
    const moveToFolder = this.props.folders.find((folder) => {
      return folder.folderId === folderId;
    });

    this.props.onChooseFolder(this.props.messageId, moveToFolder);
  }

  render() {
    // Only list Inbox, and veteran-defined folders
    // and exclude the current folder.
    const folders = this.props.folders.filter((folder) => {
      const folderId = folder.folderId;
      const isEligibleFolder =
        folderId >= 0 &&
        folderId !== this.props.currentFolder.folderId;
      return isEligibleFolder;
    });

    const folderOptions = folders.map((folder) => {
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
            hidden={!this.props.isOpen}
            onChange={this.handleChooseFolder}>
          <fieldset>
            <legend className="usa-sr-only">
              Move this message to
            </legend>
            <ul className="msg-move-to-options">
              {folderOptions}
              <li>
                <ButtonCreateFolder
                    onClick={this.openCreateFolderModal}/>
              </li>
            </ul>
          </fieldset>
        </form>
      </div>
    );
  }
}

MoveTo.propTypes = {
  currentFolder: React.PropTypes.shape({
    folderId: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    count: React.PropTypes.number.isRequired,
    unreadCount: React.PropTypes.number.isRequired
  }),
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  isOpen: React.PropTypes.bool,
  messageId: React.PropTypes.number,
  onChooseFolder: React.PropTypes.func.isRequired,
  onCreateFolder: React.PropTypes.func.isRequired,
  onToggleMoveTo: React.PropTypes.func.isRequired,
};

export default MoveTo;
