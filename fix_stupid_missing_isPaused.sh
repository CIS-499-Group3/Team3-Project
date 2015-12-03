#!/bin/bash
ts_path='app/components/phaser/typescript/phaser.d.ts'
if ! $(grep -q 'SCRIPT_INSERT' $ts_path); then
    sed -i "/class Arcade/a isPaused: boolean; // SCRIPT_INSERT" $ts_path;
    echo "Added declaration."
else
    echo "Declaration Already exists";
fi
