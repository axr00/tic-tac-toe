/**
 * @author axr 2023
 * @version 1.0
 * @description board.js - game logic & board creation
 */

import Game from "./game";

'use strict';

/**
 * define the Baord class
 */
export default class Board {

    constructor() {
        this.tiles = [
            [ { tileID: 'a0', symbol: 'E' }, { tileID: 'b0', symbol: 'E' }, { tileID: 'c0', symbol: 'E' } ],
            [ { tileID: 'a1', symbol: 'E' }, { tileID: 'b1', symbol: 'E' }, { tileID: 'c1', symbol: 'E' } ],
            [ { tileID: 'a2', symbol: 'E' }, { tileID: 'b2', symbol: 'E' }, { tileID: 'c2', symbol: 'E' } ]
        ];
        this.rectangles = document.querySelectorAll('.canvas-tile');
    }

/**
* called from Game class, human turn logic as promise
*/
    forceTurnHuman(player, playerMode) {
        return new Promise( (resolve, reject) => {

            /* get all canvas elements & setup draw logic */
            this.rectangles.forEach( (item) => {
                let context = item.getContext('2d');
                let handler = (e) => {
                    //console.log('canvas-offset: ' + e.offsetX + '/' + e.offsetY);
                    //console.log("canvas-ID: " + e.target.id);

                    e.stopPropagation();
                    e.preventDefault();
    
                    context.clearRect(0, 0, item.width, item.height);
                    context.fillStyle = '#ffffff';
                    this.updateBoardArray(e.target.id, 'X');
                    this.drawCross(context, 25, 25, 75, 75);
                    this.drawCross(context, 75, 25, 25, 75);
                    item.style.backgroundColor = '#cccccc';
                    item.style.pointerEvents = 'none';
                    item.removeEventListener('click', handler, false);
                    checkHumanWin(this.tiles, playerMode, this.tilesGetEmptySpaces());
                    resolve(console.log("forceTurnHuman() finished..."));
                };
                item.addEventListener('click', handler, { once: true });
            })
            
            /* check the tiles array & define win combinations */
            function checkHumanWin(tiles, playerMode, emptySpaces) {
                let winner = null;
                
                if (tiles[0][0].symbol == playerMode && tiles[0][1].symbol == playerMode && tiles[0][2].symbol == playerMode) { // 1
                    winner = 1;
                } else if (tiles[1][0].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[1][2].symbol == playerMode) { // 2
                    winner = 1;
                } else if (tiles[2][0].symbol == playerMode && tiles[2][1].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 3
                    winner = 1;
                } else if (tiles[0][0].symbol == playerMode && tiles[1][0].symbol == playerMode && tiles[2][0].symbol == playerMode) { // 4
                    winner = 1;
                } else if (tiles[0][1].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][1].symbol == playerMode) { // 5
                    winner = 1;
                } else if (tiles[0][2].symbol == playerMode && tiles[1][2].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 6
                    winner = 1;
                } else if (tiles[0][0].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 7
                    winner = 1;
                } else if (tiles[0][2].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][0].symbol == playerMode) { // 8
                    winner = 1;
                }

                if ((winner != 1) && (emptySpaces <= 0)) {
                    winner = 2;
                }

                if (winner == 1) {
                    console.log("GAME OVER - The Winner is: " + player.name);
                    Game.setGameState(winner);
                    Game.setWinnerType(player.type);
                    Game.checkWinnerType();
                    this.disableTiles(true);
                    return winner;
                } else if (winner == 2) {
                    console.log("GAME OVER - TIE");
                    Game.setGameState(winner);
                    let tie = document.querySelector('#hidden-link-results-tie');
                    tie.click();
                    return winner;
                } else {
                    return 0;
                }
            }

        });
    }

/**
* called from Game class, ai turn logic as promise
*/
    forceTurnAI(player, playerMode) {
        return new Promise( (resolve, reject) => {

            var nextFreeIndex = [];

            /* minimax algo first initial round (maximizing) */
            let newMove = -Infinity;
            let turn;
            for(let i = 0; i < this.tiles.length; i++) {
                for(let j = 0; j < this.tiles[i].length; j++) {
                    if (this.tiles[i][j].symbol == 'E') {
                        nextFreeIndex[0] = i;
                        nextFreeIndex[1] = j;
                        let move = minimax(this.tiles, 0, false, playerMode);
                        this.tiles[i][j].symbol = 'E';
                        if (move > newMove) {
                            newMove = move;
                            turn = {i, j};
                        }
                    }
                }
            }
    
            nextFreeIndex[0] = turn.i;
            nextFreeIndex[1] = turn.j;
    
            /* setup the specific canvas id & get the element, setup draw logic */
            var canvasID = this.getCanvasID(nextFreeIndex[0], nextFreeIndex[1]);
            let c1 = document.querySelector(canvasID);
            let ctx = c1.getContext('2d');
    
            this.updateBoardArray(c1.id, 'O');
            this.drawCircle(ctx, 50, 50);
            c1.style.backgroundColor = '#cccccc';
            c1.style.pointerEvents = 'none';
            checkAIWin(this.tiles, playerMode, this.tilesGetEmptySpaces());
            resolve("forceTurnAI() finished...");
    
            /* minimax algo  */
            function minimax(tiles, depth, switchBool, playerMode) {

                let cAW = checkAIWin(tiles, playerMode);
                if (cAW != null) { return cAW;}
    
                // maximizing
                if (switchBool) {
                    let newMove = -Infinity;
                    for(let i = 0; i < tiles.length; i++) {
                        for(let j = 0; j < tiles[i].length; j++) {
                            if (tiles[i][j].symbol == 'E') {
                                nextFreeIndex[0] = i;
                                nextFreeIndex[1] = j;
                                let move = minimax(tiles, depth + 1, false);
                                tiles[i][j].symbol = 'E';
                                if (move > newMove) {
                                    newMove = move;
                                }
                            }
                        }
                    }
                    return newMove;
                } else { 
                    // minimizing
                    let newMove = Infinity;
                    for(let i = 0; i < tiles.length; i++) {
                        for(let j = 0; j < tiles[i].length; j++) {
                            if (tiles[i][j].symbol == 'E') {
                                nextFreeIndex[0] = i;
                                nextFreeIndex[1] = j;
                                let move = minimax(tiles, depth + 1, true);
                                tiles[i][j].symbol = 'E';
                                if (move < newMove) {
                                    newMove = move;
                                }
                            }
                        }
                    }
                    return newMove;
                }          
            }
    
            /* check the tiles array & define win combinations */
            function checkAIWin(tiles, playerMode, emptySpaces) {
                let winner = null;
                    
                if (tiles[0][0].symbol == playerMode && tiles[0][1].symbol == playerMode && tiles[0][2].symbol == playerMode) { // 1
                    winner = 1;
                } else if (tiles[1][0].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[1][2].symbol == playerMode) { // 2
                    winner = 1;
                } else if (tiles[2][0].symbol == playerMode && tiles[2][1].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 3
                    winner = 1;
                } else if (tiles[0][0].symbol == playerMode && tiles[1][0].symbol == playerMode && tiles[2][0].symbol == playerMode) { // 4
                    winner = 1;
                } else if (tiles[0][1].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][1].symbol == playerMode) { // 5
                    winner = 1;
                } else if (tiles[0][2].symbol == playerMode && tiles[1][2].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 6
                    winner = 1;
                } else if (tiles[0][0].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][2].symbol == playerMode) { // 7
                    winner = 1;
                } else if (tiles[0][2].symbol == playerMode && tiles[1][1].symbol == playerMode && tiles[2][0].symbol == playerMode) { // 8
                    winner = 1;
                }
                if ((winner != 1) && (emptySpaces <= 0)) {
                    winner = 2;
                }

                if (winner == 1) {
                    console.log("GAME OVER - The Winner is:: " + player.name);
                    Game.setGameState(winner);
                    Game.setWinnerType(player.type);
                    Game.checkWinnerType();
                    this.disableTiles(true);
                    return winner;
                } else if (winner == 2) {
                    console.log("GAME OVER - TIE");
                    Game.setGameState(winner);
                    let tie = document.querySelector('#hidden-link-results-tie');
                    tie.click();
                    return winner;
                } else {
                    return 0;
                }
            }

        });
    }

    /* ***************** */
    /* Utils *************/
    /* ***************** */

/**
* draw a simple circle on the canvas
*/
    drawCircle(context, x, y) {
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.beginPath();
        context.arc(x, y, 25, 0, 2 * Math.PI);
        context.stroke();
    }

/**
* draw two lines as 'X' on the canvas, exec twice
*/
    drawCross(context, mTx, mTy, lTx, lTy) {
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(mTx, mTy);
        context.lineTo(lTx, lTy);
        context.stroke();
    }

/**
* updates the tiles array & compare to elements id's
*/
    updateBoardArray(id, symbol) {
        switch(true) {
            // row 0
            case id == 'a0':
                this.tiles[0][0].symbol = symbol;
                break;
            case id == 'b0':
                this.tiles[0][1].symbol = symbol;
                break;
            case id == 'c0':
                this.tiles[0][2].symbol = symbol;
                break;
            // row 1
            case id == 'a1':
                this.tiles[1][0].symbol = symbol;
                break;
            case id == 'b1':
                this.tiles[1][1].symbol = symbol;
                break;
            case id == 'c1':
                this.tiles[1][2].symbol = symbol;
                break;
            // row 2
            case id == 'a2':
                this.tiles[2][0].symbol = symbol;
                break;
            case id == 'b2':
                this.tiles[2][1].symbol = symbol;
                break;
            case id == 'c2':
                this.tiles[2][2].symbol = symbol;
                break;
        }
    }

/**
* getter for the canvas id's
*/
    getCanvasID(x, y) {
        let id = '';
        let array = [];
        array.push(x, y);
        for(let i = 0; i < array.length; i++) {
            if(array[i] === 0 && array[array.length -1] === 0) {
                id = '#a0';
                return id;
            } else if (array[i] === 0 && array[array.length -1] === 1) {
                id = '#b0';
                return id;
            } else if (array[i] === 0 && array[array.length -1] === 2) {
                id = '#c0';
                return id;
            } else if (array[i] === 1 && array[array.length -1] === 0) {
                id = '#a1';
                return id;
            } else if (array[i] === 1 && array[array.length -1] === 1) {
                id = '#b1';
                return id;
            } else if (array[i] === 1 && array[array.length -1] === 2) {
                id = '#c1';
                return id;
            } else if (array[i] === 2 && array[array.length -1] === 0) {
                id = '#a2';
                return id;
            } else if (array[i] === 2 && array[array.length -1] === 1) {
                id = '#b2';
                return id;
            } else if (array[i] === 2 && array[array.length -1] === 2) {
                id = '#c2';
                return id;
            }
        }
        return id;
    }

/**
* check for empty spaces 'E' in the tiles array
*/
    tilesGetEmptySpaces() {
        let storage = [];
        Object.values(this.tiles).forEach(val => {
            for(let i = 0; i < val.length; i++) {
                if (val[i].symbol == 'E') {
                    let slot = val[i].symbol;
                    storage.push(slot);
                    //console.log("spaces-full: " + storage);  
                    //console.log("spaces-length: " + storage.length);
                }
            }
        });
        return storage.length;
    }

/**
* disable/enable cancas tiles with css
*/
    disableTiles(isDisabled) {
        let rects = document.querySelectorAll('.canvas-tile');
        if (isDisabled) {
            rects.forEach( (item) => {
                item.style.backgroundColor = '#cccccc';
                item.style.pointerEvents = 'none';
            });
        } else {
            rects.forEach( (item) => {
                item.style.backgroundColor = '#ffffff';
                item.style.pointerEvents = 'initial';
            });
        }
    }
}