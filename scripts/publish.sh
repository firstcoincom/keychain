
NEW_VERSION=$(cat package.json \
| grep version \
| head -1 \
| awk -F: '{ print $2 }' \
| sed 's/[",]//g')
CURRENT_VERSION=$(npm show keychain version)

echo $NEW_VERSION
echo $CURRENT_VERSION
if [ $NEW_VERSION != $CURRENT_VERSION ]
then
  npm publish
fi
