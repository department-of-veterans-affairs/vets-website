## Component migration script
The purpose of this script is to do the bulk of the grunt work of migrating from an existing React component in the `@department-of-veterans-affairs/component-library` to its replacement web component.

To run the script, use `yarn migrate-component`. It accepts two required arguments:

- `--dir` - The directory you wish to migrate
- `--component` - The name of the component you wish to migrate

If these aren't provided or `--help` is passed, the script will print out some help text describing how to use the arguments.

Once the script finishes a `post-` hook will run to lint any changed files. The migration may have introduced unwanted whitespace, so this will clean that up and (hopefully) get your files ready to be committed.

## Caveats

**The script may not be able to perfectly migrate every component.** Before you merge your PR be sure to inspect the diff. Additionally the script does not migrate test files, so you'll have to do those by hand.
