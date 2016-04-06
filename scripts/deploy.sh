#!/bin/bash
set -o errexit


rm -rf builds
mkdir builds


# config
git config user.email "oleksii.moroz@tum.de"
git config user.name "AlexMoroz"

# build
npm run build
npm run deploy

# deploy
git add .
git commit -m"Travis automatic deployment"
git push "https://${GITHUB_TOKEN}@github.com/Rostlab/JS16_ProjectC_Group10.git" $TRAVIS_BRANCH