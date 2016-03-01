#!/bin/bash
echo "HBO Map Grabber V0.1"
mkdir 6
for x in {0..5}
do
	for y in {0..7}
	do
		p=y${x}x$y
		rp=http://viewers-guide.hbo.com/mapimages/6/${p}.png
		lp=./6/${p}.png
   		curl $rp > $lp
   	done
done
mkdir 7
for x in {0..13}
do
	for y in {0..21}
	do
		p=y${x}x$y
		rp=http://viewers-guide.hbo.com/mapimages/7/${p}.png
		lp=./7/${p}.png
   		curl $rp > $lp
   	done
done
mkdir 8
for x in {0..25}
do
	for y in {0..39}
	do
		p=y${x}x$y
		rp=http://viewers-guide.hbo.com/mapimages/8/${p}.png
		lp=./8/${p}.png
   		curl $rp > $lp
   	done
done