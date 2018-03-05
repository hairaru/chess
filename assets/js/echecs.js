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
    document.addEventListener("dragstart", function(event){dragPiece(event)}, false);
    //Ajout des listeners sur les cases
    var cases = Array.from(document.getElementsByClassName("field"));
    cases.forEach(function(element){
        element.addEventListener('drop', function(event){
            console.log('mdr');
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        });
        element.addEventListener('dragover', function(event){
            event.preventDefault();
        });
        element.addEventListener('dragenter', function() {
            element.style.opacity = 0.5;
        });

        element.addEventListener('dragleave', function() {
            element.style.opacity = 1;
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

function dragPiece(event){
    console.log(event);
    if(event.target.classList.contains('piece')){
        console.log(event.target.src);
        var img = new Image();
        img.src = event.target.src;
        event.dataTransfer.setDragImage(img, 40, 40); 
         event.dataTransfer.setData('text/plain', '');
    }
}

function movePiece(event){
    var pieces = Array.from(document.getElementsByClassName("dragged"));
    if(pieces.length === 1){
        //pieces[0].style.position = "absolute";
        //pieces[0].style.left = event.clientX + 'px';
        //pieces[0].style.top = event.clientY + 'px';
    }
}

function playPiece(event){
    event.target.classList.remove('dragged');
}

function receivePiece(event){
    event.preventDefault();
    alert("lol");
}