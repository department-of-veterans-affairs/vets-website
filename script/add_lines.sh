#! usr/bin/env bash

# From this SO answer:
#   https://stackoverflow.com/a/12179492
diff-lines() {
  local path=
  local position=
  while read; do
	  esc=$'\033'
	  if [[ $REPLY =~ ---\ (a/)?.* ]]; then
		  continue
	  elif [[ $REPLY =~ \+\+\+\ (b/)?([^[:blank:]$esc]+).* ]]; then
		  path=${BASH_REMATCH[2]}
	  elif [[ $REPLY =~ @@\ -[0-9]+(,[0-9]+)?\ \+([0-9]+)(,[0-9]+)?\ @@$ ]]; then
		  position=1
	  elif [[ $REPLY =~ @@\ -[0-9]+(,[0-9]+)?\ \+([0-9]+)(,[0-9]+)?\ @@.* ]]; then
		  ((position++))
	  elif [[ $REPLY =~ ^($esc\[[0-9;]+m)*([\ +-]) ]]; then
		  echo "$path:$position:$REPLY"
		  # if [[ ${BASH_REMATCH[2]} != - ]]; then
			 ((position++))
		  # fi
	  fi
  done
}

diff-lines
