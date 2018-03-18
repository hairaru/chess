var plateau;
var turn;

function init(){
    //Init l'affichage et le plateau
    initGame();
    //Init les listeners
    initListeners();
}

//Initialise l'affichage et le plateau
function initGame(){
    //Initialise le plateau
    createPlateau();
    //Afficher le plateau
    refreshDisplay();
    //Initialisation du système de tours
    turn = new Turn();
    document.getElementById("whiteTurnDisplay").style.display = "inline";
}

function initListeners(){
        //Ajout des listeners sur les pièces
    document.addEventListener("dragstart", function(event){
        if(event.target.classList.contains('piece')){
            var img = new Image();
            img.src = event.target.src;
            event.dataTransfer.setDragImage(img, 40, 40);
            event.dataTransfer.setData('text/plain', event.target.parentElement.id);
            lightCases(event.target.parentElement.id);
        }
    }, false);
    document.addEventListener("dragend", function(event){
        unlightCases();
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
            var old = event.dataTransfer.getData('text/plain');
            movePiece(parseInt(old.charAt(1)), old.charAt(0), parseInt(element.id.charAt(1)), element.id.charAt(0));
            unlightCases();
        });
    });
}

//Créer le plateau avec toutes les pièces initiales
function createPlateau(){
    //Initialiser le tableau
    //Pions
    plateau = [];
    for(var i = 1; i <= 8; i++){
        plateau.push(new Piece("b","p", i, "G"),
            new Piece("n","p", i, "B"));
    }
    //Tours
    plateau.push(new Piece("b","t", 1, "H"),
        new Piece("n","t", 1, "A"),
        new Piece("b","t", 8, "H"),
        new Piece("n","t", 8, "A"));
    //Cavaliers
    plateau.push(new Piece("b","c", 2, "H"),
        new Piece("n","c", 2, "A"),
        new Piece("b","c", 7, "H"),
        new Piece("n","c", 7, "A"));
    //Fous
    plateau.push(new Piece("b","f", 3, "H"),
        new Piece("n","f", 3, "A"),
        new Piece("b","f", 6, "H"),
        new Piece("n","f", 6, "A"));
    //Reines
    plateau.push(new Piece("b","q", 4, "H"),
        new Piece("n","q", 4, "A"));
    //Rois
    plateau.push(new Piece("b","k", 5, "H"),
        new Piece("n","k", 5, "A"));
    
}

//Sert à afficher toutes les pièces sur le plateau
function refreshDisplay(){
    plateau.forEach(function(element){displayPiece(element);});
}

//Sert à initialiser le plateau en ajoutant la pièce demandée
function displayPiece(piece){
    document.getElementById(piece.y+piece.x).innerHTML = 
        '<img draggable="true" class="piece" src="./assets/images/' + piece.color + piece.type + '.png" id="' + piece.y+piece.x + 'P"></img>';
}

function movePiece(oldX, oldY, newX, newY){ //Les ids des cases sont en paramètre
    //On vérifie que ce soit le tour de la bonne personne, que le mouvement est valide et que la case soit vide ou avec un ennemi
    //On vérifie également que personne n'est mat
    var piece = findPieceByPosition(oldX, oldY, plateau);
    if(piece !== null && turn.echec !== 4 && piece.color === turn.color && checkMove(oldX, oldY, newX, newY, plateau)){
        //Si c'est un roque, on déplace la tour avant tout. (Le roque est vérifié dans checkMove->getPossiblePositions->getPossiblePositionsKing)
        if(piece.type === "k" && !piece.moved && (newX === 3 || newX === 7)){
            moveTowerForRoque(piece, newX);
        }
        //Si l'ennemi existe, on le mange, à part si on fait un roque
        var otherPiece = findPieceByPosition(newX, newY, plateau);
        if(otherPiece !== null)
            eatEnemy(otherPiece);
        //On modifie l'objet piece
        piece.x = newX; piece.y = newY;
        //On déplace l'image
        moveImg(oldX, oldY, newX, newY);
        //Y a t il une promotion ?
        promote(piece);
        //On passe au tour suivant
        passTurn();
        piece.moved = true;
    }
}

//Vérifie si l'on peut bouger la pièce se trouvant en oldX oldY en newX newY
function checkMove(oldX, oldY, newX, newY, plateau){
    var pos = getPossiblePositions(oldX, oldY, plateau);
    return pos.includes(newY+newX) && !kingWillBeInDanger(oldX, oldY, newX, newY);
}

//Permet de déplacer l'image d'une pièce d'une case Old à une case New
function moveImg(oldX, oldY, newX, newY){
    var pieceImg = document.getElementById(oldY+oldX+"P");
    var newPos = document.getElementById(newY+newX);
    pieceImg.id = newY+newX+"P";
    newPos.appendChild(pieceImg);
}

//Renvoie un tableau de positions possibles pour la pièce qui se trouve en x y
function getPossiblePositions(x, y, plateau){
    //Si la pièce qu l'on veut bouger n'existe pas ou n'est pas de la couleur de la personne qui joue, on renvoie false
    var piece = findPieceByPosition(x, y, plateau);
    if(piece === null)
        return [];
    //On obtient le tableau de position des déplacements possibles pour la pièce
    var pos = [];
    if(piece.type === "t")
        pos = getPossiblePositionsTower(piece, plateau);
    else if(piece.type === "p")
        pos = getPossiblePositionsPawn(piece, plateau);
    else if(piece.type === "c")
        pos = getPossiblePositionsCav(piece, plateau);
    else if(piece.type === "f")
        pos = getPossiblePositionsFou(piece, plateau);
    else if(piece.type === "q")
        pos = getPossiblePositionsQueen(piece, plateau);
    else if(piece.type === "k")
        pos = getPossiblePositionsKing(piece, plateau);
    return pos;
}

//Renvoie les positions possibles pour le déplacement d'un pion
function getPossiblePositionsPawn(piece, plateau){
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
        var tmp = findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+avancer), plateau);
        //Si la case est vide, on peut avancer
        if(tmp === null){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + piece.x);
            //De plus, si on est sur la case de départ, on peut avancer de deux cases
            tmp = findPieceByPosition(piece.x, String.fromCharCode(piece.y.charCodeAt(0)+avancer*2), plateau);
            if(piece.y === pawnline && tmp === null){
                pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer*2) + piece.x);
            }
        }
        //On vérifie qu'on ne peut pas prendre latéralement
        tmp = findPieceByPosition((piece.x*1+1), String.fromCharCode(piece.y.charCodeAt(0)+avancer), plateau);
        if(tmp !== null && tmp.color === enemy){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + (piece.x*1+1));
        }
        tmp = findPieceByPosition(piece.x-1, String.fromCharCode(piece.y.charCodeAt(0)+avancer), plateau);
        if(tmp !== null && tmp.color === enemy){
            pos.push(String.fromCharCode(piece.y.charCodeAt(0)+avancer) + (piece.x-1));
        }
    }
    return pos;
}

//Renvoie les positions possibles pour le déplacement d'une tour
function getPossiblePositionsTower(piece, plateau){
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
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]*j), plateau);
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

//Renvoie les positions possibles pour le déplacement d'un cavalier
function getPossiblePositionsCav(piece, plateau){
    var pos = [];
    var dirx = [2, 2, -2, -2, 1, 1, -1, -1];
    var diry = [1, -1, -1, 1, 2, -2, -2, 2];
    var tmpPiece = null;
    var enemy = getEnemy(piece);
    for(var i = 0; i < 8; i++){
        if(validCase(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0) + diry[i]))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]), plateau);
            if(tmpPiece === null || tmpPiece.color === enemy)
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]) + (piece.x*1 + dirx[i]))
        }
    }
    return pos;
}

//Renvoie les positions possibles pour le déplacement d'un fou
function getPossiblePositionsFou(piece, plateau){
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
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i]*j, String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]*j), plateau);
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

//Renvoie les positions possibles pour le déplacement d'une reine
function getPossiblePositionsQueen(piece, plateau){
    return getPossiblePositionsFou(piece, plateau).concat(getPossiblePositionsTower(piece, plateau));
}

//Renvoie les positions possibles pour le déplacement d'un roi
function getPossiblePositionsKing(piece, plateau){
    var pos = [];
    var dirx = [1, 1, 1, 0, -1, -1, -1, 0];
    var diry = [1, 0, -1, -1, -1, 0, 1, 1];
    var tmpPiece = null;
    var enemy = getEnemy(piece);
    for(var i = 0; i < 8; i++){
        if(validCase(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0) + diry[i]))){
            tmpPiece = findPieceByPosition(piece.x*1 + dirx[i], String.fromCharCode(piece.y.charCodeAt(0)+ diry[i]), plateau);
            if(tmpPiece === null || tmpPiece.color === enemy)
                pos.push(String.fromCharCode(piece.y.charCodeAt(0) + diry[i]) + (piece.x*1 + dirx[i]))
        }
    }
    //Prenons en compte le roque
    var y = "H"; //Blanc par défaut
    if(piece.color === "n")
        y = "A";
    //Le roi a-t-il bougé ?
    if(piece.color === "n" && !piece.moved || piece.color === "b" && !piece.moved){
        //La tour de droite a-t-elle bougé et le chemin est-il libre ?
        var tower = findPieceByPosition(8, y, plateau);
        var c1 = findPieceByPosition(7, y, plateau);
        var c2 = findPieceByPosition(6, y, plateau);
        if(tower !== null && c1 ===null && c2 === null && tower.type === "t" && !tower.moved)
            pos.push(y+7);
        //La tour de gauche a-t-elle bougé et le chemin est-il libre ?
        tower = findPieceByPosition(1, y, plateau);
        c1 = findPieceByPosition(2, y, plateau);
        c2 = findPieceByPosition(3, y, plateau);
        var c3 = findPieceByPosition(4, y, plateau);
        if(tower !== null && c1 ===null && c2 === null && c3 === null && tower.type === "t" && !tower.moved)
            pos.push(y+3);
    }
    return pos;
}

//Renvoie, si elle existe, la pièce sur la case dont l'ID est en paramètre, sinon renvoie null
function findPieceByPosition(x, y, plateau){
    var piece = null;
    plateau.forEach(function(element){if(element.y==y && element.x==x)piece = element;});
    return piece;
}

//Renvoie la piece du roi de la couleur donnée dans un plateau donné
function findKing(color, plateau){
    var piece = null;
    plateau.forEach(function(element){if(element.color === color && element.type === "k")piece = element;});
    return piece;
}

//Vérifie si les coordonnées rentrées sont valides
function validCase(x, y){
    return x >= 1 && x <= 8 && y.toUpperCase().charCodeAt(0)>="A".charCodeAt(0) && y.toUpperCase().charCodeAt(0)<="H".charCodeAt(0);
}

//Renvoie la couleur ennemie à la pièce en paramètre
function getEnemy(piece){
    var enemy;
    if(piece.color === "b")
        enemy = "n";
    else
        enemy = "b";
    return enemy;
}

//Quand un ennemi est mangé, il est envoyé dans une colonne de pion 
//et sa position est définie à (0,0) afin qu'il soit considéré en dehors du plateau
function eatEnemy(pieceToEat){
    var piece = document.getElementById(pieceToEat.y + pieceToEat.x + "P");
    var stack = document.getElementById("stack"+pieceToEat.color);
    stack.appendChild(piece);
    piece.classList.remove("piece");
    var objPiece = findPieceByPosition(pieceToEat.x, pieceToEat.y, plateau);
    objPiece.x = 0;
    objPiece.y = "Z";
}

//Nécessite les prérequis d'un roque. Bouge la tour pour laisser le roi faire un roque
function moveTowerForRoque(piece, kingX){
    var tower;
    //On obtient y de la ligne
    var y = "H"; //Blanc par défaut
    if(piece.color === "n")
        y = "A";
    //On obtient le x de la tour
    var x = 8;
    if(kingX === 3)
        x = 1;
    //On cherche la tour
    tower = findPieceByPosition(x, y, plateau);
    var newX = 6; //On fait le petit roque par défaut
    if(tower.x === 1)
        newX = 4; //Le grand roque
    moveImg(tower.x, tower.y, newX, y);
    tower.x = newX;
}

function passTurn(){
    //On notifie les joueurs que le tour change
    if(turn.color === "n"){
        turn.color = "b";
        document.getElementById("whiteTurnDisplay").style.display = "inline";
        document.getElementById("blackTurnDisplay").style.display = "none";
    } else {
        turn.color = "n";
        turn.nb++;
        document.getElementById("whiteTurnDisplay").style.display = "none";
        document.getElementById("blackTurnDisplay").style.display = "inline";
    }
    unlightThreats(); //Sert à reset les cases rouges
    turn.echec = checkGameState(); //On regarde si la situation est particulière
    //Si il y a échec, on illume en rouge le roi et les menaces
    if(turn.echec > 0){
        lightThreats();
        //S'il y a mat, on termine la partie
        if(turn.echec === 4){
            var dsp;
            if(turn.color === "n"){
                dsp = document.getElementById("whiteVictoryDisplay");
            } else {
                dsp = document.getElementById("blackVictoryDisplay");
            }
            dsp.style.display = "inline";
        }
    }
}

//Vérifie si un échec est en cours ou même si un mat est en cours
function checkGameState(){
    var echec = 0;
    var king = findKing(turn.color, plateau);
    var threats = getThreats(king, plateau);
    //Si on ne peut pas bouger, on est directement mat
    if(noMoveLeft(king.color))
        return 4;
    //Si on est en échec...
    //On utilise la règle du PIF. Prendre, interposer, fuir.
    if(threats.length === 0)
        return 0;
    else if (canTake(king, threats))
        return 1;
    else if (canInter(king, threats))
        return 2;
    else if (canFlee(king))
        return 3;
    else
        return 4;
}

//Sous-fonction de checkGameState qui détermine si le roi peut prendre ou non
function canTake(king, threats){
    //Peut-ont prendre sans être pris ?
    var prendre = false;
    threats.forEach(function(element){
        if(checkMove(king.x, king.y, element.x, element.y, plateau)){
            //On copie le plateau pour réaliser la situation voulue
            var copyBoard = getCopyPlateau();
            var eaten = element;
            //On retire le pion que le roi doit manger
            copyBoard.forEach(function(element){
                if(eaten.x === element.x && eaten.y === element.y){
                    element.x = 0;
                    element.y = "Z";
                }
            });
            //Le roi prend sa place
            copyBoard.forEach(function(element){
                if(king.x === element.x && king.y === element.y){
                    element.x = eaten.x;
                    element.y = eaten.y;
                }
            });
            //On teste ensuite s'il existe une menace pour le roi dans cette situation
            //Si oui, cette situation n'est pas une solution, sinon c'est une situation jouable
            var threatsAfter = getThreats(element, copyBoard);
            if(threatsAfter.length === 0)
                prendre = true;
        }
    });
    return prendre;
}

//Sous-fonction de checkGameState qui détermine si une pièece peut s'interposer entre le roi et les menaces
function canInter(king, threats){
    var inter = false;
    var pos = getPossiblePositions(threats[0].charAt(1), threats[0].charAt(0), plateau);
    for(var i = 1; i < threats.length; i++){
        var intersect = [];
        getPossiblePositions(threats[i].charAt(1), threats[i].charAt(0), plateau).forEach(function(element){
            if(pos.incldues(element))
                intersect.push(element);
        });
        pos = intersect;
    }
    plateau.forEach(function(element){
        if(element.color === king.color){
            var tmp = getPossiblePositions(element.x, element.y, plateau);
            for(var i = 0; i < pos.length; i++){
                if(tmp.includes(pos[i])){
                    var x = parseInt(pos[i].charAt(1));
                    var y = pos[i].charAt(0);
                    var copyBoard = getCopyPlateau();
                    var pieceEnemy = findPieceByPosition(x, y, copyBoard);
                    if(pieceEnemy !== null){
                        pieceEnemy.x = 0;
                        pieceEnemy.y = "Z";
                    }
                    var piece = findPieceByPosition(element.x, element.y, copyBoard);
                    piece.x = x;
                    piece.y
                    var copyKing = findKing(turn.color, copyBoard);
                    if(getThreats(copyKing, copyBoard).length === 0)
                        inter = true;
                }
            }
        }
    });
    return inter;
}

//Sous-fonction de checkGameState qui détermine si le roi peut fuir ou non
function canFlee(king){
    var fuir = false;
    getPossiblePositions(king.x, king.y, plateau).forEach(function(element){
        var copyBoard = getCopyPlateau();
        var copyKing = findKing(king.color, copyBoard);
        copyKing.x = element.charAt(1);
        copyKing.y = element.charAt(0);
        if(getThreats(copyKing, copyBoard).length === 0)
            fuir = true;
    });
    return fuir;
}

//Renvoie la liste des pieces (sous forme de coordonnées) qui peuvent prendre la pièce en paramètre au prochain tour
function getThreats(piece, plateau){
    var threats = [];
    plateau.forEach(function(element){
        if(element.color != piece.color && checkMove(element.x, element.y, piece.x, piece.y, plateau)){
            threats.push(element.y+element.x);
        }
    });
    return threats;
}

function getCopyPlateau(){
    var copy = [];
    plateau.forEach(function(element){
        copy.push(copyPiece(element));
    });
    return copy;
}

//Renvoie true si le déplacement demandé mettra le roi (de la couleur de la piece en oldX oldY) en danger
function kingWillBeInDanger(oldX, oldY, newX, newY){
    var copyBoard = getCopyPlateau();
    var piece = findPieceByPosition(oldX, oldY, copyBoard);
    var enemyPiece = findPieceByPosition(newX, newY, copyBoard);
    if(enemyPiece !== null){
        enemyPiece.x = 0;
        enemyPiece.y = "Z";
    }
    piece.x = newX;
    piece.y = newY;
    var king = findKing(piece.color, copyBoard);
    var threats = getThreats(king, copyBoard);
    return threats.length > 0;
}

//Renvoie true si le joueur ne peut plus bouger
function noMoveLeft(color){
    var nomoveleft = true;
    var i = 0;
    var pos;
    var copyBoard;
    var enemy;
    var copyKing;
    while(nomoveleft && i < plateau.length){
        if(plateau[i].color === color){
            pos = getPossiblePositions(plateau[i].x, plateau[i].y, plateau);
            var j = 0;
            while(nomoveleft && j < pos.length){
                copyBoard = getCopyPlateau();
                enemy = findPieceByPosition(pos[j].charAt(1), pos[j].charAt(0), copyBoard);
                if(enemy !== null){
                    enemy.x = 0; enemy.y = "Z";
                }
                copyBoard[i].x = parseInt(pos[j].charAt(1)); copyBoard[i].y = pos[j].charAt(0);
                copyKing = findKing(color, copyBoard);
                nomoveleft = getThreats(copyKing, copyBoard).length > 0;
                j++;
            }
        }
        i++;
    }
    return nomoveleft;
}

//Renvoie true si la piece en paramètre peut être promue
function checkPromotion(piece){
    return piece.type === "p" && 
            (piece.color === "n" && piece.y === "H" || 
            piece.color === "b" && piece.y === "A");
}

function promote(piece){
    if(checkPromotion(piece)) {
        var res = "";
        while(res !== "Q" && res !== "B" && res !== "K" && res !== "T")
            res = prompt("Quelle pièece voulait vous ? Q(ueen), B(ishop), K(night) ou T(ower) ?", "Q").charAt(0);
        switch (res){
            case "B":
                piece.type = "f";
                break;
            case "K":
                piece.type = "c";
                break;
            case "T":
                piece.type = "t";
                break;
            default:
                piece.type = "q";
                break;
        }
        pieceImg.src = "./assets/images/"+piece.color+piece.type+".png";
    }
}

//Illumine les cases où les déplacements sont possibles
function lightCases(id){
    var piece = findPieceByPosition(id.charAt(1), id.charAt(0), plateau);
    if(piece.color === turn.color){
        var pos = getPossiblePositions(id.charAt(1), id.charAt(0), plateau);
        pos.forEach(function(element){
        document.getElementById(element).innerHTML +=  "<div class=\"light\"></div>";
        });
    }
}

//Désillumine les cases
function unlightCases(){
    var light = document.getElementsByClassName("light");
    while(light[0]){
        light[0].parentNode.removeChild(light[0]);
    }
}

//Illumine le roi menacé et ses menaces
function lightThreats(){
    var king = findKing(turn.color, plateau);
    document.getElementById(king.y+king.x).innerHTML +=  "<div class=\"redlight\"></div>";
    var threats = getThreats(king, plateau);
    threats.forEach(function(element){
        document.getElementById(element).innerHTML +=  "<div class=\"redlight\"></div>";
    })
}

//Désillumine le roi menacé et ses menaces
function unlightThreats(){
    var light = document.getElementsByClassName("redlight");
    while(light[0]){
        light[0].parentNode.removeChild(light[0]);
    }
}

//Permet de reset la partie
function reset(){
    var fields = document.getElementsByClassName("field");
    for(var i = 0; i < fields.length; i++){
        fields[i].innerHTML = "";
    }
    document.getElementById("whiteTurnDisplay").style.display = "none";
    document.getElementById("blackTurnDisplay").style.display = "none";
    document.getElementById("whiteVictoryDisplay").style.display = "none";
    document.getElementById("blackVictoryDisplay").style.display = "none";
    
    initGame();
}