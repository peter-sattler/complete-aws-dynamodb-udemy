#!/bin/zsh -x
aws dynamodb scan --table-name td_notes_test \
                  --filter-expression "username = :uname" \
                  --expression-attribute-values file://uname.json \
                  --return-consumed-capacity TOTAL \
                  --consistent-read
exit $?
