#!/bin/zsh -x
aws dynamodb create-table --table-name td_notes_test \
                          --attribute-definitions AttributeName=user_id,AttributeType=S AttributeName=timestamp,AttributeType=N \
                          --key-schema AttributeName=user_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
                          --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
exit $?
