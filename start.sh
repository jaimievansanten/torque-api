#!/bin/bash

forever start --uid "torque_api" -m 5 -w -a index.js
