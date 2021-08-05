const selectFolders = state => state.health?.msg?.folders;
export const selectUnreadCount = state => state.health?.msg?.unreadCount;
export const selectFolder = state => selectFolders(state)?.data?.currentItem;
