#!/bin/bash
# This script is a hacky way to add in a missing declaration in phaser.d.ts.
# Use it if you're getting "Property 'isPaused' does not exist on type 'Arcade'."


ts_path='app/components/phaser/typescript/phaser.d.ts'
if ! $(grep -q 'SCRIPT_INSERT' $ts_path); then
    sed -i "/class Arcade/a isPaused: boolean; // SCRIPT_INSERT" $ts_path;
    echo "Added declaration."
else
    echo "Declaration Already exists";
fi
