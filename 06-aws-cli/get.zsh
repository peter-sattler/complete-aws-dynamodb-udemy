#!/bin/zsh -x
aws dynamodb get-item --table-name td_notes_test --key file://read-key.json
exit $?
