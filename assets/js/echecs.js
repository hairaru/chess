/* 

 */
function init(){
    //Initialiser le tableau
    blancs = [];
    noirs = [];
    //Pions
    for(var i = 1; i <= 8; i++){
        blancs.push(new Piece("bp", i, "G"));
        noirs.push(new Piece("np", i, "B"));
    }
    //Tours
    blancs.push(new Piece("bt", 1, "H"));
    noirs.push(new Piece("nt", 1, "A"));
    blancs.push(new Piece("bt", 8, "H"));
    noirs.push(new Piece("nt", 8, "A"));
    //Cavaliers
    blancs.push(new Piece("bc", 2, "H"));
    noirs.push(new Piece("nc", 2, "A"));
    blancs.push(new Piece("bc", 7, "H"));
    noirs.push(new Piece("nc", 7, "A"));
    //Fous
    blancs.push(new Piece("bf", 3, "H"));
    noirs.push(new Piece("nf", 3, "A"));
    blancs.push(new Piece("bf", 6, "H"));
    noirs.push(new Piece("nf", 6, "A"));
    //Reines
    blancs.push(new Piece("bq", 4, "H"));
    noirs.push(new Piece("nq", 4, "A"));
    //Rois
    blancs.push(new Piece("bk", 5, "H"));
    noirs.push(new Piece("nk", 5, "A"));
    
    //Afficher le plateau
    refreshDisplay();
    
    //Ajout des listeners sur les pièces
    document.addEventListener("dragstart", function(event){
        console.log(event);
        if(event.target.classList.contains('piece')){
            console.log(event.target.src);
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
            movePiece(event.dataTransfer.getData('text/plain'), element);
        });
    });
}

function refreshDisplay(){
    blancs.forEach(function(element){displayPiece(element);});
    noirs.forEach(function(element){displayPiece(element);});
}

function displayPiece(piece){
    document.getElementById(piece.y+piece.x).innerHTML = 
            '<img draggable="true" class="piece" src="./assets/images/' + piece.key + '.png" id="' + piece.y+piece.x + 'P"></img>';
}

function movePiece(oldCase, newCase){
    if(checkMove(oldCase, newCase)){
        var piece = document.getElementById(oldCase+"P");
        piece.id = newCase.id+"P";
        newCase.appendChild(piece);
    } else{
        //Some error code
    }
}

function checkMove(oldCase, newCase){
    var piece = findPieceByPosition(oldCase.charAt(1), oldCase.charAt(0));
    if(piece === null)
        return false;
    var res = false;
    if(piece.key.charAt(1) === "t")
        res = checkMoveTower(piece, newCase);
    else if(piece.key.charAt(1) === "p")
        res = checkMovePawn(piece, newCase);
    else if(piece.key.charAt(1) === "c")
        res = checkMoveCav(piece, newCase);
    else if(piece.key.charAt(1) === "f")
        res = checkMoveFou(piece, newCase);
    else if(piece.key.charAt(1) === "q")
        res = checkMoveQueen(piece, newCase);
    else if(piece.key.charAt(1) === "k")
        res = checkMoveKing(piece, newCase);
    return res;
}

//Vérifie si le pion en question peut se déplacer sur la newCase
function checkMovePawn(piece, newCase){
    var avant1 = null;
    var avant2 = null;
    if(piece.key.charAt(0)==="n"){
        //Les cases avants
        if(validCase(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+1)) 
         && findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+1)) === null)
            avant1 = String.fromCharCode(piece.y.charCodeAt(0)+1) + piece.x;
        if(validCase(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+2)) 
         && findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+2)) === null)
            avant2 = String.fromCharCode(piece.y.charCodeAt(0)+2) + piece.x;
        //Les cases latérales
        
    } else {
        //Les cases avants
        if(validCase(piece.x, String.fromCharCode(piece.y.charCodeAt(0)-1)) 
         && findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)-1)) === null)
            avant1 = String.fromCharCode(piece.y.charCodeAt(0)-1) + piece.x;
        if(validCase(piece.x, String.fromCharCode(piece.y.charCodeAt(0)-2)) 
         && findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)-2)) === null)
            avant2 = String.fromCharCode(piece.y.charCodeAt(0)-2) + piece.x;
        //Les cases latérales
    }
}

//Vérifie si la tour en question peut se déplacer sur la newCase
function checkMoveTower(piece, newCase){
    
}

//Vérifie si le cavalier en question peut se déplacer sur la newCase
function checkMoveCav(piece, newCase){
    
}

//Vérifie si le fou en question peut se déplacer sur la newCase
function checkMoveFou(piece, newCase){
    
}

//Vérifie si la reine en question peut se déplacer sur la newCase
function checkMoveQueen(piece, newCase){
    
}

//Vérifie si le roi en question peut se déplacer sur la newCase
function checkMoveKing(piece, newCase){
    
}

//Renvoie, si elle existe, la pièce sur la case dont l'ID est en paramètre, sinon renvoie null
function findPieceByPosition(x, y){
    var piece = null;
    noirs.forEach(function(element){if(element.y===y && element.x===x) piece = element});
    if(piece === null) blancs.forEach(function(element){if(element.y===y && element.x===x) piece = element});
    return piece;
}

//Vérifie si les coordonnées rentrées sont valides
function validCase(x, y){
    //Y va de a à h donc de 97 à 104 selon les CharacCodes
    return x>=1 && x<=8 && y.charCodeAt(0)>=97 && y.charCodeAt(0)<=104;
}