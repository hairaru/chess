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

function checkMove(idpiece, id){
    return true;
}