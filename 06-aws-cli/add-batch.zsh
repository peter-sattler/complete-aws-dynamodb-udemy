#!/bin/zsh -x
aws dynamodb batch-write-item --request-items file://more-items.json
exit $?
