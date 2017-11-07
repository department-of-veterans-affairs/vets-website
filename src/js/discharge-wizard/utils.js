module.exports = {
  shouldShowQuestion: (currentKey, validQuestions) => {
    const num = currentKey.split('_')[0];
    const nextNum = validQuestions[validQuestions.length - 1].split('_')[0];
    return validQuestions.indexOf(currentKey) > -1 && parseInt(num, 10) <= parseInt(nextNum, 10);
  }
};
