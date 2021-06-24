## Component migration script

The name of the script is `migrate-component`. It has two required arguments:

- `--dir` - The directory you wish to migrate
- `--component` - The name of the component you wish to migrate

If these aren't provided or `--help` is passed, the script will print out some help text describing how to use the arguments.

Once the script finishes a `post-` hook will run to lint any changed files. The migration may have introduced unwanted whitespace, so this will clean that up and (hopefully) get your files ready to be committed.

## Caveats

The script may not be able to perfectly migrate every comopnent, so before you merge your PR be sure to inspect the diff. Additionally the script does not migrate test files - you will have to do those by hand.
