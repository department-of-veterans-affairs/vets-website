const files = JSON.parse(process.env.CHANGED_FILES || '[]');

function logExports() {
  for (const file of files) {
    // eslint-disable-next-line no-console
    console.log(file);
  }
}

logExports();
