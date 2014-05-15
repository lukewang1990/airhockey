#!/bin/bash

$IP="54.186.241.95"

if [ $1 = "1" ]
then
	sed -i 's/$IP/localhost/g' ../js/game-client.js ../js/game-ui.js ../js/matching.js
else
	sed -i 's/localhost/$IP/g' ../js/game-client.js ../js/game-ui.js ../js/matching.js
fi

