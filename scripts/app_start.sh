#!/bin/bash
export TMDB_KEY=Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MDlmNmRjNWZkM2Q3NGI5NTE0YmU0OTZmNjI4MjU4NiIsInN1YiI6IjYxNzQ5NGU5ODk0ZWQ2MDA2NDcwODgwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.noo-zc3QErQ0IxaqpsVAY5TStiJIK4yfmdARIkbsyxA
export ACCESS_TOKEN_SECRET=a90897c31a11bb8c23ed4a2b69f38ded494c61e63b18941d8c8f28bfcbca413bae4ce0e739d129f49ac9fd79281994498764afca4ab6a71d4beeade6370045ad
export REFRESH_TOKEN_SECRET=ca5ca7161dd353a4391339b3320b18f2b16ae1a45ef3e0574ca6371b315f715bfc71b9c60170a7bfcb594c90355374570f0ac1f068b4271ba9ae828083b2c534
cd ~/MovieFuelBackend
node app.js > /dev/null 2>1 &
