#!/bin/bash


rm -rf builds
mkdir builds


# config
git config user.email "nobody@nobody.com"
git config user.name "Travis CI"

# build
npm run build
npm run deploy

# deploy
git checkout $TRAVIS_BRANCH
git add .
git commit -m"New bundles created"
git push -q "https://${GITHUB_TOKEN}@github.com/Rostlab/JS16_ProjectC_Group10.git" $TRAVIS_BRANCH