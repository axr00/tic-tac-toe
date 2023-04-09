/**
 * @author axr 2023
 * @version 1.0
 * @description player_human.js - player human class, inherits from player class
 */

import Player from "./player";

'use strict';

export default class PlayerHuman extends Player {

    constructor(mode, type, name) {
        super(mode, type, name);
    }
}