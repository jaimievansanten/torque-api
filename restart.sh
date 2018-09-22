#!/bin/bash

forever stopall && forever start --uid "torque_api" -m 5 -w -a `pwd`/index.js
