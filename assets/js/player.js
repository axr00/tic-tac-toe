/**
 * @author axr 2023
 * @version 1.0
 * @description player.js - player class for the basics
 */

'use strict';

export default class Player {

    constructor(mode, type, name) {
        this.mode = mode;
        this.type = type;
        this.name = name;
    }

    setMode(newMode) {
        this.mode = newMode;
    }

    setType(newType) {
        this.type = newType;
    }

    setName(newName) {
        this.name = newName;
    }

    getMode() {
        return this.mode;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }
}