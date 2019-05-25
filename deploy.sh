# exit when any command fails
set -e

# keep track of the last executed command
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
# echo an error message before exiting
trap 'echo "\"${last_command}\" command faied with exit code $?."' ERR

npm run build

##First upload to s3 website
aws s3 cp ./build/ s3://up71.me --recursive