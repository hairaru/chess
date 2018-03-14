/* 

 */
function init(){
    //Initialiser le tableau
    plateau = [];
    //Pions
    for(var i = 1; i <= 8; i++){
        plateau.push(new Piece("b","p", i, "G"));
        plateau.push(new Piece("n","p", i, "B"));
    }
    //Tours
    plateau.push(new Piece("b","t", 1, "H"));
    plateau.push(new Piece("n","t", 1, "A"));
    plateau.push(new Piece("b","t", 8, "H"));
    plateau.push(new Piece("n","t", 8, "A"));
    //Cavaliers
    plateau.push(new Piece("b","c", 2, "H"));
    plateau.push(new Piece("n","c", 2, "A"));
    plateau.push(new Piece("b","c", 7, "H"));
    plateau.push(new Piece("n","c", 7, "A"));
    //Fous
    plateau.push(new Piece("b","f", 3, "H"));
    plateau.push(new Piece("n","f", 3, "A"));
    plateau.push(new Piece("b","f", 6, "H"));
    plateau.push(new Piece("n","f", 6, "A"));
    //Reines
    plateau.push(new Piece("b","q", 4, "H"));
    plateau.push(new Piece("n","q", 4, "A"));
    //Rois
    plateau.push(new Piece("b","k", 5, "H"));
    plateau.push(new Piece("n","k", 5, "A"));
    
    //Afficher le plateau
    refreshDisplay();
    
    //Ajout des listeners sur les pièces
    document.addEventListener("dragstart", function(event){
        if(event.target.classList.contains('piece')){
            var img = new Image();
            img.src = event.target.src;
            event.dataTransfer.setDragImage(img, 40, 40);
            event.dataTransfer.setData('text/plain', event.target.parentElement.id);
        }
    }, false);
    //Ajout des listeners sur les cases
    var cases = Array.from(document.getElementsByClassName("field"));
    cases.forEach(function(element){
        //Gère la zone de drop en générale
        element.addEventListener('dragover', function(event){
            event.preventDefault();
        });
        //Gère l'entrée en zone de drop
        element.addEventListener('dragenter', function() {
            element.style.opacity = 0.5;
        });
        //Gère la sortie de la zone de drop
        element.addEventListener('dragleave', function() {
            element.style.opacity = 1;
        });
        //Gère la fin du drop
        element.addEventListener('drop', function(event){
            event.preventDefault();
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            element.style.opacity = 1; 
            movePiece(event.dataTransfer.getData('text/plain'), element.id);
        });
    });
}

function refreshDisplay(){
    plateau.forEach(function(element){displayPiece(element);});
}

function displayPiece(piece){
    document.getElementById(piece.y+piece.x).innerHTML = 
        '<img draggable="true" class="piece" src="./assets/images/' + piece.color + piece.type + '.png" id="' + piece.y+piece.x + 'P"></img>';
}

function movePiece(oldCase, newCase){ //Les ids des cases sont en paramètre
    if(checkMove(oldCase, newCase)){
        var enemyPiece = findPieceByPosition(newCase.charAt(1), newCase.charAt(0));
        if(enemyPiece !== null)
            eatEnemy(enemyPiece);
        //On modifie l'objet piece
        var piece = findPieceByPosition(oldCase.charAt(1), oldCase.charAt(0));
        piece.x = newCase.charAt(1); piece.y = newCase.charAt(0);
        //On déplace l'image
        var pieceImg = document.getElementById(oldCase+"P");
        var newPos = document.getElementById(newCase);
        pieceImg.id = newCase+"P";
        newPos.appendChild(pieceImg);
    } else{
        //Some error code
    }
}

function checkMove(oldCase, newCase){
    var piece = findPieceByPosition(oldCase.charAt(1), oldCase.charAt(0));
    if(piece === null)
        return false;
    var pos = [];
    if(piece.type === "t")
        pos = checkMoveTower(piece, newCase);
    else if(piece.type === "p")
        pos = checkMovePawn(piece, newCase);
    else if(piece.type === "c")
        pos = checkMoveCav(piece, newCase);
    else if(piece.type === "f")
        pos = checkMoveFou(piece, newCase);
    else if(piece.type === "q")
        pos = checkMoveQueen(piece, newCase);
    else if(piece.type === "k")
        pos = checkMoveKing(piece, newCase);
    return pos.includes(newCase);
}

//Vérifie si le pion en question peut se déplacer sur la newCase
function checkMovePawn(piece, newCase){
    //Ces variables seront sous la forme "H8"
    var pos = [];
    var avancer = 1; //Par défaut, noir donc 1pour avancer, on fait +1 sur y
    var pawnline = "B"; //Par défaut, noir donc la ligne des pions est B
    if(piece.color === "b"){ //Si le pion est blanc, on change tout ça
        avancer = -1;
        pawnline = "G";
    }
    var enemy = getEnemy(piece);
    //On vérifie que la ligne avant existe
    if(validCase(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+avancer))){
        //On vérifie si une pièce se trouve en face du pion
        var tmp = findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+avancer));
        //Si la case est vide, on peut avancer
        if(tmp === null){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + piece.x);
            //De plus, si on est sur la case de départ, on peut avancer de deux cases
            tmp = findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+avancer*2));
            if(piece.y === pawnline && tmp === null){
                pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer*2) + piece.x);
            }
        }
        //On vérifie qu'on ne peut pas prendre latéralement
        tmp = findPieceByPosition((piece.x*1+1), String.fromCharCode(piece.y.charCodeAt(0)+avancer));
        if(tmp !== null && tmp.color === enemy){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + (piece.x*1+1));
        }
        tmp = findPieceByPosition(piece.x-1, String.fromCharCode(piece.y.charCodeAt(0)+avancer));
        if(tmp !== null && tmp.color === enemy){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + (piece.x-1));
        }
    }
    return pos;
}

//Vérifie si la tour en question peut se déplacer sur la newCase
function checkMoveTower(piece, newCase){
    var pos = [];
    var dirx = [0, 1, 0, -1];
    var diry = [1, 0, -1, 0];
    var enemy = getEnemy(piece);
    //On parcourt chaque direction verticalement et horizontalement
    for(var i = 0; i < 4; i++){
        var j = 1;
        var continu = true;
        var tmpPiece = null;
        while(continu && validCase(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]*j));
            if(tmpPiece === null){
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j) + (piece.x*1 + dirx[i]*j));
            } else {
                if (tmpPiece.color === enemy)
                    pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j) + (piece.x*1 + dirx[i]*j));
                continu = false;
            }
            j++;
        }
    }
    return pos;
}

//Vérifie si le cavalier en question peut se déplacer sur la newCase
function checkMoveCav(piece, newCase){
    var pos = [];
    var dirx = [2, 2, -2, -2, 1, 1, -1, -1];
    var diry = [1, -1, -1, 1, 2, -2, -2, 2];
    var tmpPiece = null;
    var enemy = getEnemy(piece);
    for(var i = 0; i < 8; i++){
        if(validCase(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0) + diry[i]))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]));
            if(tmpPiece === null || tmpPiece.color === enemy)
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]) + (piece.x*1 + dirx[i]))
        }
    }
    return pos;
}

//Vérifie si le fou en question peut se déplacer sur la newCase
function checkMoveFou(piece, newCase){
    var pos = [];
    var dirx = [1, 1, -1, -1];
    var diry = [1, -1, -1, 1];
    var enemy = getEnemy(piece);
    //On parcourt chaque direction diagonalement
    for(var i = 0; i < 4; i++){
        var j = 1;
        var continu = true;
        var tmpPiece = null;
        while(continu && validCase(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]*j));
            if(tmpPiece === null){
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j) + (piece.x*1 + dirx[i]*j));
            } else {
                if (tmpPiece.color === enemy)
                    pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]*j) + (piece.x*1 + dirx[i]*j));
                continu = false;
            }
            j++;
        }
    }
    return pos;
}

//Vérifie si la reine en question peut se déplacer sur la newCase
function checkMoveQueen(piece, newCase){
    return checkMoveFou(piece, newCase).concat(checkMoveTower(piece, newCase));
}

//Vérifie si le roi en question peut se déplacer sur la newCase
function checkMoveKing(piece, newCase){
    var pos = [];
    var dirx = [1, 1, 1, 0, -1, -1, -1, 0];
    var diry = [1, 0, -1, -1, -1, 0, 1, 1];
    var tmpPiece = null;
    var enemy = getEnemy(piece);
    for(var i = 0; i < 8; i++){
        if(validCase(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0) + diry[i]))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]));
            if(tmpPiece === null || tmpPiece.color === enemy)
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]) + (piece.x*1 + dirx[i]))
        }
    }
    return pos;
}

//Renvoie, si elle existe, la pièce sur la case dont l'ID est en paramètre, sinon renvoie null
function findPieceByPosition(x, y){
    var piece = null;
    plateau.forEach(function(element){if(element.y==y && element.x==x)piece = element;});
    return piece;
}

//Vérifie si les coordonnées rentrées sont valides
function validCase(x, y){
    return x >= 1 && x <= 8 && y.toUpperCase().charCodeAt(0)>="A".charCodeAt(0) && y.toUpperCase().charCodeAt(0)<="H".charCodeAt(0);
}
function getEnemy(piece){
    var enemy;
    if(piece.color === "b")
        enemy = "n";
    else
        enemy = "b";
    return enemy;
}

function eatEnemy(pieceToEat){
    var piece = document.getElementById(pieceToEat.y + pieceToEat.x + "P");
    var stack = document.getElementById("stack"+pieceToEat.color);
    stack.appendChild(piece);
    piece.classList.remove("piece");
}