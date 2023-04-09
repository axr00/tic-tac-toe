/**
 * @author axr 2023
 * @version 1.0
 * @description game.js - main js start point
 */

import PlayerAI from "./player_ai";
import PlayerHuman from "./player_human";
import Board from "./board";

'use strict';

/**
 * wait until everything is loaded, instantiate the game
 */
window.addEventListener('load', function () {
    console.log("Tic-Tac-Toe | Game ready!");
    let game = new Game();
    game.prepareGame();
});

/**
 * define the Game class
 */
export default class Game {

    constructor() {
        this.board = new Board();
        this.player1 = new PlayerHuman('X', "human", "Player1");
        this.player2 = new PlayerAI('O', "ai", "Computer1");
        this.gameState = 0;
        this.winnerType = '';
    }

/**
* async
* calls the behaviour for the player/ai turn
*/
    async prepareGame() {

        this.board.forceTurnHuman(this.player1, this.player1.mode)
        .then( () => {
            if (Game.getGameState() != 1 && Game.getGameState() != 2) {
                this.board.forceTurnAI(this.player2, this.player2.mode)
                .then( () => { this.prepareGame();})
                .catch( () => { console.log(new Error('error forceTurnAI()- promise')); });
            }
        })
        //.catch( () => { console.log(new Error('error forceTurnHuman() - promise')); });
    }

/**
* checks the winner state & calls flash messages from the symfony controller
*/
    static checkWinnerType() {
        switch(Game.getWinnerType()) {
            case 'human':
                let human = document.querySelector('#hidden-link-results-human');
                human.click();
                break;
            case 'ai':
                let ai = document.querySelector('#hidden-link-results-ai');
                ai.click();
                break;
        }
    }

/**
* static setters & getters
*/
    static setGameState(value) {
        this.gameState = value;
    }

    static getGameState() {
        return this.gameState;
    }

    static setWinnerType(type) {
        this.winnerType = '';
        this.winnerType = type;
    }

    static getWinnerType() {
        return this.winnerType;
    }
}