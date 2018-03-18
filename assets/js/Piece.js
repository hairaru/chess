//Un piece est définie par une valeur clef sous la forme :
//n ou b (selon la couleur du joueur) et p, t, c, f, k, q (selon son type)
//ex : nk ou bp
function Piece(color, type, x, y){
    this.color = color;
    this.type = type;
    this.x = x;
    this.y = y;
    this.moved = false;
}

function copyPiece(piece){
    return new Piece(piece.color, piece.type, piece.x, piece.y);
}