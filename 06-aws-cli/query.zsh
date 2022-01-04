#!/bin/zsh -x
aws dynamodb query --table-name td_notes_test \
                   --key-condition-expression "user_id = :uid and #t > :t" \
                   --expression-attribute-values file://expression-attribute-values.json \
                   --expression-attribute-names file://expression-attribute-names.json \
                   --filter-expression "cat = :cat" \
                   --return-consumed-capacity INDEXES \
                   --consistent-read \
                   --no-scan-index-forward
exit $?
