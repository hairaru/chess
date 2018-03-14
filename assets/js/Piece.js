/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Un piece est définie par une valeur clef sous la forme :
//n ou b (selon la couleur du joueur) et p, t, c, f, k, q (selon son type)
//ex : nk ou bp
function Piece(color, type, x, y){
    this.color = color;
    this.type = type;
    this.x = x;
    this.y = y;
}