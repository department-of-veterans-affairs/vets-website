export const getRecentThreads = (threadList, monthsAgo = 6) => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);

  return threadList.filter(message => {
    const sentDate = new Date(message.sentDate);
    return sentDate >= cutoffDate;
  });
};
