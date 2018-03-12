function initBoard () {
	//fonction d'initialisation
	//cree le tableau et toutes les pieces en tant qu'objet correpondants
	for (var i = 0; i < 8; ++i) {
		var tabL = new Array();
		var checkTabL = new Array();
		for (var j = 0; j < 8; ++j) {
			if (i==1) { //black_pawn
				var piece = {player:"black", type:"pawn", x:i, y:j, img:imgCreator("resBis/black_pawn.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==6) { //white_pawn
				var piece = {player:"white", type:"pawn", x:i, y:j, img:imgCreator("resBis/white_pawn.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==0 && (j==0 || j==7)) { //black_tower
				var piece = {player:"black", type:"tower", x:i, y:j, img:imgCreator("resBis/black_tower.png",i,j), init:true, nb:1};
				tabL[j] = piece;
			}
			if (i==7 && (j==0 || j==7)) {//white_tower
				var piece = {player:"white", type:"tower", x:i, y:j, img:imgCreator("resBis/white_tower.png",i,j), init:true, nb:1};
				tabL[j] = piece;
			}
			if (i==0 && (j==1 || j==6)) {//black_horse
				var piece = {player:"black", type:"horse", x:i, y:j, img:imgCreator("resBis/black_horse.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==7 && (j==1 || j==6)) {//white_horse
				var piece = {player:"white", type:"horse", x:i, y:j, img:imgCreator("resBis/white_horse.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==0 && (j==2 || j==5)) {//black_bishop
				var piece = {player:"black", type:"bishop", x:i, y:j, img:imgCreator("resBis/black_bishop.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==7 && (j==2 || j==5)) {//white_bishop
				var piece = {player:"white", type:"bishop", x:i, y:j, img:imgCreator("resBis/white_bishop.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==0 && j==3) {//black_queen
				var piece = {player:"black", type:"queen", x:i, y:j, img:imgCreator("resBis/black_queen.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==7 && j==3) {//white_queen
				var piece = {player:"white", type:"queen", x:i, y:j, img:imgCreator("resBis/white_queen.png",i,j), nb:1};
				tabL[j] = piece;
			}
			if (i==0 && j==4) {//black_king
				var piece = {player:"black", type:"king", x:i, y:j, img:imgCreator("resBis/black_king.png",i,j), init:true, nb:1};
				tabL[j] = piece;
				blackKing=piece;
			}
			if (i==7 && j==4) {//white_king
				var piece = {player:"white", type:"king", x:i, y:j, img:imgCreator("resBis/white_king.png",i,j), init:true, nb:1};
				tabL[j] = piece;
				whiteKing=piece;
			}
			checkTabL[j] = false;
		}
		tab[i]=tabL;
		checkTab[i]=checkTabL;
	}
}

function initCoordonate () {
	document.getElementById("body")
	for (var i = 0; i<8; i++) {
		var chr = String.fromCharCode(97 + i);
		var y = document.createElement('p');
		y.style.zIndex=5;
		y.style.position="absolute";
		y.style.top = "-10px";
		y.style.left = (i+1)*67+"px";
		y.style.fontWeight = "bold";
		y.innerHTML = chr;
		document.getElementById("body").appendChild(y);

		var x = document.createElement('p');
		x.style.zIndex=5;
		x.style.position="absolute";
		x.style.top = (8-i)*67-22+"px";
		x.style.left = "12px";
		x.style.fontWeight = "bold";
		x.innerHTML = ""+(i+1);
		document.getElementById("body").appendChild(x);
	};
	//img.style.left = 39+y*67+"px"; 
}

function imgCreator (res, x, y) {
	//fonction qui crée une image
	var img = document.createElement('img');
	img.id = "piece";
	img.src = res;
	img.style.zIndex = 3;
	img.style.position = "absolute";
	img.style.top = 44+x*67+"px";
	img.style.left = 39+y*67+"px"; 
	img.style.transition = "1s";
	document.getElementById("body").appendChild(img);
	return img;
}

function addListener () {
	//fonction qui ajoutes des listener sur chaque piece du jeu
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) (function (piece) {
			if (tab[i][j] != null) {
				if (typeof tab[i][j] == 'object') {
					if (tab[i][j] != "deleted") {
						var piece = tab[i][j];
						if (tab[i][j].player == "white" && tab[i][j].type == "pawn") {
								tab[i][j].img.onclick = function() {
									deleteGreen();
									checkWhitePawnMove(piece);
							}
						}
						if (tab[i][j].player == "black" && tab[i][j].type == "pawn") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								checkBlackPawnMove(piece);
							}
						}
						if (tab[i][j].type == "tower") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								checkTowerMove(piece);
							};
						}
						if (tab[i][j].type == "horse") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								checkHorseMove (piece);
							};
						}
						if (tab[i][j].type == "bishop") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								checkBishopMove(piece);
							};
						}
						if (tab[i][j].type == "queen") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								checkQueenMove(piece);
							};
						}
						if (tab[i][j].type == "king") {
							tab[i][j].img.onclick = function() {
								deleteGreen();
								if (piece.init) {roque(piece);};
								checkKingMove(piece);
							};
						}
					}
				} 
			}else {
				tab[i][j] = "";
			}
		})(i,j);
	}
}


function addEnemyClickVert (piece, i, j) {
	//ajoutes une case verte a l'endroit spécifié si la case n'est pas un allié
	if (typeof tab[piece.x+i][piece.y+j] == "object") {

		if (tab[piece.x+i][piece.y+j].player != piece.player) {
				ajouteClickVert(piece,piece.x+i,piece.y+j);
		} 
		return false;
	} else {
			ajouteClickVert(piece,piece.x+i,piece.y+j);
			return true;
	}
} 

function checkTowerMove (piece) {
	//création des mouvements possibles pour la tour
	var up = true;
	var down = true;
	var left = true;
	var right = true;
	for (var i = 1; i < 8; i++) {
		if (up && piece.x-i>=0 && piece.x-i<8) {
			up = addEnemyClickVert (piece, -i, 0);
		} 
		if (down && piece.x+i>=0 && piece.x+i<8) {
			down = addEnemyClickVert (piece, i, 0);
		} 
		if (left && piece.y-i>=0 && piece.y-i<8) {
			left = addEnemyClickVert (piece, 0, -i);	
		}
		if (right && piece.y+i>=0 && piece.y+i<8) {
			right = addEnemyClickVert (piece, 0, i);	
		}
	}
}

function checkQueenMove (piece) {
	//création des mouvements possibles pour la renne
	checkTowerMove (piece);
	checkBishopMove(piece);
}

function checkBishopMove (piece) {
	//création des mouvements possibles pour le fou
	var upright = true;
	var downleft = true;
	var upleft = true;
	var downright = true;

	for (var i = 1; i < 8; i++) {
		if (upright && piece.x-i>=0 && piece.x-i<8 && piece.y+i>=0 && piece.y+i<8) {
			upright = addEnemyClickVert (piece, -i, i);		
		} 
		if (downleft && piece.x+i>=0 && piece.x+i<8 && piece.y-i>=0 && piece.y-i<8) {
			downleft = addEnemyClickVert (piece, i, -i);		
		} 
		if (upleft && piece.y-i>=0 && piece.y-i<8 && piece.x-i>=0 && piece.x-i<8) {
			upleft = addEnemyClickVert (piece, -i, -i);
		}
		if (downright && piece.y+i>=0 && piece.y+i<8 && piece.x+i>=0 && piece.x+i<8) {
			downright = addEnemyClickVert (piece, i, i);
		}
	}
}

function checkWhitePawnMove (piece) {
	//création des mouvements possibles pour le pion blanc
        if (piece.x != 0) {//tant qu'on n'est pas sur la derniere ligne
                if(typeof tab[piece.x-1][piece.y] != "object"){
                        ajouteClickVert(piece,piece.x-1,piece.y);
                }
                if (piece.x==6 && typeof tab[piece.x-2][piece.y] != "object" && typeof tab[piece.x-1][piece.y] != "object") {//si c'est la premiere ligne
                        ajouteClickVert(piece,piece.x-2,piece.y);
                }
                if((typeof tab[piece.x-1][piece.y+1] =="object") && (tab[piece.x-1][piece.y+1].player =="black")){//verification pions adverses possible de manger a droite
                        ajouteClickVert(piece,piece.x-1,piece.y+1);
                }
                if((typeof tab[piece.x-1][piece.y-1] =="object") && (tab[piece.x-1][piece.y-1].player =="black")){//verification pions adverses possible de manger a gauche
                        ajouteClickVert(piece,piece.x-1,piece.y-1);
                }
        }

        //ce code commenté n'existes aue pour le fun. Il n'a aucune utilité
        /*if(piece.x == 0){
                console.log("vous etes arrivés au bout. Choisis ce que tu veux wesh. Et demandes au dev de coder la fonctionnalité");
                console.log("bonjour, c'est le mcdrive. Que voulez vous ?");
        }*/
}

function checkBlackPawnMove (piece) {
	//création des mouvements possibles pour le pion noir
        if (piece.x != 7) {//tant qu'on n'est pas sur la derniere ligne
                if(typeof tab[piece.x+1][piece.y] != "object"){
                        ajouteClickVert(piece,piece.x+1,piece.y);
                }
                if (piece.x==1 && typeof tab[piece.x+2][piece.y] != "object" && typeof tab[piece.x+1][piece.y] != "object") {//si c'est la premiere ligne
                        ajouteClickVert(piece,piece.x+2,piece.y);
                }
                if((typeof tab[piece.x+1][piece.y+1] =="object") && (tab[piece.x+1][piece.y+1].player =="white")){//verification pions adverses possible de manger a droite
                        ajouteClickVert(piece,piece.x+1,piece.y+1);
                }
                if((typeof tab[piece.x+1][piece.y-1] =="object") && (tab[piece.x+1][piece.y-1].player =="white")){//verification pions adverses possible de manger a gauche
                        ajouteClickVert(piece,piece.x+1,piece.y-1);
                }
        }
        /*if(piece.x == 7){
                console.log("vous etes arrivés au bout. Choisis ce que tu veux wesh. Et demandes au dev de coder la fonctionnalité");
                console.log("bonjour, c'est le mcdrive. Que voulez vous ?");
        }*/
}

function checkHorseMove (piece){
	//création des mouvements possibles pour le cavalier
	if (piece.x+2<8) {
		if (piece.y+1<8) {addEnemyClickVert (piece, 2, 1);}
		if (piece.y-1>=0) {addEnemyClickVert (piece, 2, -1);}
	}
	if (piece.x+1<8) {
		if (piece.y+2<8) {addEnemyClickVert (piece, 1, 2);}
		if (piece.y-2>=0) {addEnemyClickVert (piece, 1, -2);}
	}
	if (piece.x-1>=0) {
		if (piece.y+2<8) {addEnemyClickVert (piece, -1, 2);}
		if (piece.y-2>=0) {addEnemyClickVert (piece, -1, -2);}
	}
	if (piece.x-2>=0) {
		if (piece.y+1<8) {addEnemyClickVert (piece, -2, 1);}
		if (piece.y-1>=0) {addEnemyClickVert (piece, -2, -1);}
	}
}

function deadPiece (piece) {
	//fonction qui tue une piece
	if (typeof piece =="object") {
		//piece.img.style.webkitTransform = 'rotate(360deg)'; 
		piece.img.style.transform = 'rotate('+360*piece.nb+'deg)';  
		piece.nb++;
		if (piece.player == "black") {
			blackDead.push(piece);
			piece.img.style.top = (blackDead.length-1)*60+"px";
			piece.img.style.left = 80+8*67+"px";
			piece.img.onclick = function() {return false;};
			tab[piece.x][piece.y]="deleted";
		}

		if (piece.player == "white") {
			whiteDead.push(piece);
			piece.img.style.top = (whiteDead.length-1)*60+"px";
			piece.img.style.left = 80+9*67+"px";
			piece.img.onclick = function() {return false;};
			tab[piece.x][piece.y]="deleted";
		}
	}
}

function moveto (piece, i, j) {
	//fonction qui déplace un pion vers i,j
 	var temp = piece;
	tab[piece.x][piece.y] = "deleted";
	tab[i][j] = temp;
	piece.x = i;
	piece.y = j;
	piece.img.style.top = 44+i*67+"px";
	piece.img.style.left = 39+j*67+"px"; 
	tourBlanc = (!tourBlanc);
	if (!backMove) {
		if (piece.player=="white" && !check) {
			echec = dangerousPlace(blackKing, blackKing.x, blackKing.y);
			mat = isAnyPossibility(piece);
		} 
		if (piece.player=="black" && !check) {
			echec = dangerousPlace(whiteKing, whiteKing.x, whiteKing.y);
			mat = isAnyPossibility(piece);
		}
	} 
	if (!check && piece.type=="pawn" && (piece.x == 0 || piece.x == 7)) {//verification fin du plateau pions
		changePawn(piece);
	}
	changeInfo();
}

function changePawn (pawn) {
	var queen = document.getElementById("queen");
	var bishop = document.getElementById("bishop");
	var horse = document.getElementById("horse");
	var tower = document.getElementById("tower");
	var div = document.getElementById("changePawn");
	queen.src = "resBis/"+pawn.player+"_queen.png";
	bishop.src = "resBis/"+pawn.player+"_bishop.png";
	horse.src = "resBis/"+pawn.player+"_horse.png";
	tower.src = "resBis/"+pawn.player+"_tower.png";
	queen.onclick = function() {
		pawn.img.src = queen.src;
		pawn.type = "queen";
		div.style.visibility = "hidden";
		pawn.img.onclick = function() {
			deleteGreen();
			checkQueenMove(pawn);
		}
	}
	bishop.onclick = function() {
		pawn.img.src = bishop.src;
		pawn.type = "bishop";
		div.style.visibility = "hidden";
		bishop.img.onclick = function() {
			deleteGreen();
			checkBishopMove(pawn);
		}
	}
	horse.onclick = function() {
		pawn.img.src = horse.src;
		pawn.type = "horse";
		div.style.visibility = "hidden";
		pawn.img.onclick = function() {
			deleteGreen();
			checkHorseMove(pawn);
		}
	}
	tower.onclick = function() {
		pawn.img.src = tower.src;
		pawn.type = "tower";
		div.style.visibility = "hidden";
		pawn.img.onclick = function() {
			deleteGreen();
			checkTowerMove(pawn);
		}
	}
	div.style.top = 44+(pawn.x+1)*67+"px";
	div.style.left = 39+(pawn.y)*67+"px";
	div.style.visibility = "visible";
}

function ajouteClickVert(piece, i, j){
	//fonction qui ajoutes une cases clickable verte a l'endroit spécifié
        if(!check && ((piece.player=="white" && tourBlanc)||(piece.player=="black" && !tourBlanc))){//si c'est bien le tour du joueur
            if (!deserterGuy(piece,i,j)) {
            greenCpt++;
            document.getElementById(""+(i)+(j)).style.visibility = "visible";
            document.getElementById(""+(i)+j).onclick = (function(piece) {return function() {
	            	if (typeof tab[i][j] == "object"){//si on bouge sur une piece, on la mange
	            		if (piece.type=="pawn" && (i == 0 || j == 7)){
	            			backTab.push({piece:piece, x:piece.x, y:piece.y, eated:true, type:"pawn"});
	            		}
	            		else {
	            			if ((piece.type == "tower" || piece.type == "king") && piece.init) {
	            				backTab.push({piece:piece, x:piece.x, y:piece.y, eated:true, type:"init"});
	            			}
	            			else {
	            				backTab.push({piece:piece, x:piece.x, y:piece.y, eated:true, type:"none"});
	            			}
	            		}
	            		deadPiece(tab[i][j]);
	            	} else {
	            		if (piece.type=="pawn" && (i == 0 || j == 7)){
	            			backTab.push({piece:piece, x:piece.x, y:piece.y, eated:false, type:"pawn"});
	            		}
	            		else {
	            			if ((piece.type == "tower" || piece.type == "king") && piece.init) {
	            				backTab.push({piece:piece, x:piece.x, y:piece.y, eated:false, type:"init"});
	            			} else {
	            				backTab.push({piece:piece, x:piece.x, y:piece.y, eated:false, type:"none"});
	            			}
	            		}
	            	}
	            deleteGreen();
	            moveto(piece, i, j);
		        if ((piece.type == "king" || piece.type == "tower") && !check) {//Dans le cas où la tour ou le roi a bougé
		        	piece.init = false;
		        };
            };})(piece);
        }
    };
        if (check) {//si on appelle cette fonction pour dangerous place, on ne bouge pas réellement les pieces, on simule juste le mouvement
        	checkTab[i][j] = true;
        };
}

function deleteGreen () {
	//fonction qui supprimes (caches) toutes les cases vertes du plateau
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			document.getElementById(""+i+j).style.visibility = "hidden";
		}
	}
}

function initCheckTab () {
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			checkTab[i][j] = false;
		}
	}
}

function greenInit () {
	//initialisation des cases vertes
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			var img = document.createElement('img');
			img.id = ""+i+j;
			img.src = "res/green.png";
			img.style.zIndex = 4;
			img.style.position = "absolute";
			img.style.top = 40+i*67+"px";
			img.style.left = 40+j*67+"px"; 
			img.style.opacity = "0.2";
			img.style.visibility = "hidden";
		    document.getElementById("body").appendChild(img);
		}
	}
}

function selected () {
	//renvoies true si une case est selectionnée
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			if (checkTab[i][j]) {
				console.log("i : "+i+" j :"+j+"bool : "+checkTab[i][j])
				return true;
			}
		}
	}
	return false;
}

function countTimer() {
	//avancement du timer
	++totalSeconds;
	var hour = Math.floor(totalSeconds /3600);
	var minute = Math.floor((totalSeconds - hour*3600)/60);
	var seconds = totalSeconds - (hour*3600 + minute*60);
	var echoHour = hour; var echoMinute = minute; var echoSeconds = seconds;
	if (hour<10) {echoHour = "0"+hour}
	if (minute<10) {echoMinute = "0"+minute}
	if (seconds<10) {echoSeconds = "0"+seconds}
		var timer = document.getElementById("timer");
		//timer.style.border = "solid 2px";
		timer.style.fontSize = "20px";
		timer.style.font = "bold 20px arial,serif";
		timer.innerHTML = echoHour + ":" + echoMinute + ":" + echoSeconds;
}

function dangerousPlace (piece, x, y) {
	//fonction qui renvoie true si le mouvement proposé en x,y met en danger immédiat la piece et false sinon
	check = true;
	var temp = tab [x][y];
	var oldX = piece.x;
	var oldY = piece.y;
	moveto(piece, x, y);
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			if (typeof tab[i][j] == 'object') {
				if (tab[i][j] != "deleted") {
					if (tab[i][j].player == "black" && piece.player == "white") {
						if (tab[i][j].type == "bishop") {checkBishopMove(tab[i][j]);}
						if (tab[i][j].type == "tower") {checkTowerMove(tab[i][j]);}
						if (tab[i][j].type == "pawn") {checkBlackPawnMove(tab[i][j]);}
						if (tab[i][j].type == "horse") {checkHorseMove(tab[i][j]);}
						if (tab[i][j].type == "queen") {checkQueenMove(tab[i][j]);}

						//la fonction checkKingMove normale ne peut etre utilisée car cette fonction utilises dangerousPlace(). Cela crée donc une boucle non voulue
						if (tab[i][j].type == "king") {oldCheckKingMove(tab[i][j]);}
					}
					if (tab[i][j].player == "white" && piece.player == "black") {
						if (tab[i][j].type == "bishop") {checkBishopMove(tab[i][j]);}
						if (tab[i][j].type == "tower") {checkTowerMove(tab[i][j]);}
						if (tab[i][j].type == "pawn") {checkWhitePawnMove(tab[i][j]);}
						if (tab[i][j].type == "horse") {checkHorseMove(tab[i][j]);}
						if (tab[i][j].type == "queen") {checkQueenMove(tab[i][j]);}
						if (tab[i][j].type == "king") {oldCheckKingMove(tab[i][j]);}
					}
				}
			}
		}
	}
	moveto(piece, oldX, oldY);
	check = false;
	var result = checkTab[x][y];
	initCheckTab();
	tab [x][y] = temp;
	return result;
}

function isAnyPossibility (piece) {
	//fonction qui renvoie true si le mouvement proposé en x,y met en danger immédiat la piece et false sinon
	greenCpt = 0;
	for (var i = 0; i < 8; ++i) {
		for (var j = 0; j < 8; ++j) {
			if (typeof tab[i][j] == 'object') {
				if (tab[i][j] != "deleted") {
					if (tab[i][j].player == "black" && piece.player == "white") {
						if (tab[i][j].type == "bishop") {checkBishopMove(tab[i][j]);}
						if (tab[i][j].type == "tower") {checkTowerMove(tab[i][j]);}
						if (tab[i][j].type == "pawn") {checkBlackPawnMove(tab[i][j]);}
						if (tab[i][j].type == "horse") {checkHorseMove(tab[i][j]);}
						if (tab[i][j].type == "queen") {checkQueenMove(tab[i][j]);}

						//la fonction checkKingMove normale ne peut etre utilisée car cette fonction utilises dangerousPlace(). Cela crée donc une boucle non voulue
						if (tab[i][j].type == "king") {oldCheckKingMove(tab[i][j]);}
					}
					if (tab[i][j].player == "white" && piece.player == "black") {
						if (tab[i][j].type == "bishop") {checkBishopMove(tab[i][j]);}
						if (tab[i][j].type == "tower") {checkTowerMove(tab[i][j]);}
						if (tab[i][j].type == "pawn") {checkWhitePawnMove(tab[i][j]);}
						if (tab[i][j].type == "horse") {checkHorseMove(tab[i][j]);}
						if (tab[i][j].type == "queen") {checkQueenMove(tab[i][j]);}
						if (tab[i][j].type == "king") {oldCheckKingMove(tab[i][j]);}
					}
				}
			}
		}
	}
	deleteGreen();
	return (greenCpt==0);
}

function deserterGuy (piece, x, y) {
	check = true;
	var result=false;
	var temp = tab [x][y];
	var oldX = piece.x;
	var oldY = piece.y;
	moveto(piece, x, y);
	//console.log(dangerousPlace(whiteKing,whiteKing.x, whiteKing.y));
	if(piece.player=="white") {result = dangerousPlace(whiteKing,whiteKing.x, whiteKing.y)}
	if(piece.player=="black") {result = dangerousPlace(blackKing,blackKing.x, blackKing.y)}
	check = true;
	moveto(piece, oldX, oldY);
	check = false;
	tab [x][y] = temp;
	return result;
}

function changeInfo(){
	//fonction qui geres l'affichage des informations dans le hud en dessous du plateau d'echecs
	var info = document.getElementById("info");
	if (tourBlanc){info.innerHTML="Au tour des Blancs !"}
	if (!tourBlanc){info.innerHTML="Au tour des Noirs !"}
		var pat = (!echec && mat);
	if (pat){info.innerHTML = info.innerHTML + "   <b>PAT !</b>"}
		else{ if (mat) {info.innerHTML = info.innerHTML + "   <b>ECHEC ET MAT !</b>"}
				else{ if (echec) {info.innerHTML = info.innerHTML + "   <b>ECHEC</b>"}}}

	if (mat && tourBlanc && blackKing.img.src!="http://infolimon.iutmontp.univ-montp2.fr/~aboulincp/chess/resBis/mat.gif-c200" && blackKing.img.src!="file:///C:/Users/ABOULINC/Documents/IUT/Java%20Script/chess/resBis/mat.gif-c200") {
		whiteKing.img.src = "resBis/mat.gif-c200";
		whiteKing.img.style.width="60px"
	}
	if (mat && !tourBlanc && whiteKing.img.src!="http://infolimon.iutmontp.univ-montp2.fr/~aboulincp/chess/resBis/mat.gif-c200" && whiteKing.img.src!="file:///C:/Users/ABOULINC/Documents/IUT/Java%20Script/chess/resBis/mat.gif-c200") {
		blackKing.img.src = "resBis/mat.gif-c200";
		blackKing.img.style.width="60px"
	}
	if (!mat) {
		blackKing.img.src = "resBis/black_king.png";
		whiteKing.img.src = "resBis/white_king.png";
	};
}

function isRoquable (roi, tour) {
	//fonction qui fais les verifications necessaire pour voir si le roque est possible

	if (!roi.init || !tour.init) {return false;} //Le roi et la tour n'ont pas bougé
	if (dangerousPlace(roi,roi.x,roi.y)) {return false;}; //Le roi n'est pas en échec
	for (var i = 1; i < Math.abs(roi.y-tour.y); i++) { //Parcourt des cases entre le roi et la tour
		if (roi.y>tour.y) {
			if (typeof tab[roi.x][roi.y-i] == "object") {return false}; //Vérifie s'il y a une piece entre le roi et la tour
			if (dangerousPlace(roi,roi.x,roi.y-1)) {return false;}; //Le roi ne doit pas traverser une cas ou il est en échec
			if (dangerousPlace(roi,roi.x,roi.y-2)) {return false;}; //Le roi ne doit pas traverser une cas ou il est en échec
		} 
		if (roi.y<tour.y) {
			if (typeof tab[roi.x][roi.y+i] == "object") {return false}; //Vérifie s'il y a une piece entre le roi et la tour
			if (dangerousPlace(roi,roi.x,roi.y+1)) {return false;}; //Le roi ne doit pas traverser une cas ou il est en échec
			if (dangerousPlace(roi,roi.x,roi.y+2)) {return false;}; //Le roi ne doit pas traverser une cas ou il est en échec
		}
	}
	return true;
}

function roque (roi) {
	//fonction qui geres le roque du roi
	var firstTower = false;
	if (typeof tab[roi.x][0] == "object") {
		if (tab[roi.x][0].player == roi.player && tab[roi.x][0].type == "tower") {
			if (isRoquable(roi, tab[roi.x][0])) {
				if ((roi.player=="white" && tourBlanc)||(roi.player=="black" && !tourBlanc)) {
					firstTower = true;
					document.getElementById(""+(roi.x)+(0)).style.visibility = "visible";
					document.getElementById(""+(roi.x)+0).onclick = (function(roi) {return function() {
						backTab.push({piece:roi, x:roi.x, y:roi.y, eated:false, type:"roque"});
						backTab.push({piece:tab[roi.x][0], x:tab[roi.x][0].x, y:tab[roi.x][0].y, eated:false, type:"roque"});
			            moveto(tab[roi.x][0], tab[roi.x][0].x, roi.y-1); //Déplacement de la tour
						tourBlanc = (!tourBlanc);
						moveto(roi, roi.x, roi.y-2); //Déplacement du roi
			            deleteGreen();
	            	};})(roi);
	            }
			}
		}
	}	
	if (typeof tab[roi.x][7] == "object") {
		if (tab[roi.x][7].player == roi.player && tab[roi.x][7].type == "tower") {
			if (isRoquable(roi, tab[roi.x][7])) {
				if ((roi.player=="white" && tourBlanc)||(roi.player=="black" && !tourBlanc)) {
					document.getElementById(""+(roi.x)+(7)).style.visibility = "visible";
					if (firstTower) {document.getElementById(""+(roi.x)+(0)).style.visibility = "visible";};
					document.getElementById(""+(roi.x)+7).onclick = (function(roi) {return function() {
						backTab.push({piece:roi, x:roi.x, y:roi.y, eated:false, type:"roque"});
						backTab.push({piece:tab[roi.x][7], x:tab[roi.x][7].x, y:tab[roi.x][7].y, eated:false, type:"roque"});
			            moveto(tab[roi.x][7], tab[roi.x][7].x, roi.y+1); //Déplacement de la tour
						tourBlanc = (!tourBlanc);
						moveto(roi, roi.x, roi.y+2); //Déplacement du roi
			            deleteGreen();
	            	};})(roi);
            	}
			}
		}
	}
}

function addKingClickVert (piece, i, j) {
	//version modifiée de addClick vert. utilisé par checkKingMove
	//cette version verifie si le roi peut se mettre en danger lors du movement proposé
	if (typeof tab[piece.x+i][piece.y+j] == "object") {
		if (tab[piece.x+i][piece.y+j].player != piece.player) {
			if (!check && !dangerousPlace (piece, piece.x+i, piece.y+j)) {
				ajouteClickVert(piece,piece.x+i,piece.y+j);
			}
		} 
		return false;
	} else {
		if (!check && !dangerousPlace (piece, piece.x+i, piece.y+j)) {
			ajouteClickVert(piece,piece.x+i,piece.y+j);
			return true;
		}
	}	
}

function checkKingMove(piece){
	//fonction verifiant en totalité les possibilités de jeu du roi
	//cette version empeches les mouvements mettant le roi en danger
    if (piece.x-1 >= 0) {
    	addKingClickVert (piece, -1, 0);
	}
    if (piece.x+1<8) {
    	addKingClickVert (piece, 1, 0);
    }
    if (piece.y-1 >= 0) {
   		addKingClickVert (piece, 0, -1);
    }
    if (piece.y+1<8) {
    	addKingClickVert (piece, 0, 1);
	}

    if ((piece.x-1 >= 0) && (piece.y-1 >= 0)) {
    	addKingClickVert (piece, -1, -1);
	}

    if ((piece.x+1<8) && (piece.y+1<8)) {
    	addKingClickVert (piece, 1, 1);
    }

    if ((piece.x-1 >= 0) && (piece.y+1<8)) {
    	addKingClickVert (piece, -1, 1);
	}
    if ((piece.x+1<8) && (piece.y-1 >= 0)) {
    	addKingClickVert (piece, 1, -1);
    }
}

function oldCheckKingMove(piece){
        //fonction utilisée dans dagerous place uniquement.
        //car la fonction checkKingMove utilise dangerous place et dangerous place utilise checkKingMove ( boucle infinie)
        if (piece.x-1 >= 0) {
            addEnemyClickVert (piece, -1, 0);
        }
        if (piece.x+1<8) {
            addEnemyClickVert (piece, 1, 0);
        }
        if (piece.y-1 >= 0) {
            addEnemyClickVert (piece, 0, -1);
        }
        if (piece.y+1<8) {
            addEnemyClickVert (piece, 0, 1);
        }

        if ((piece.x-1 >= 0) && (piece.y-1 >= 0 )) {
            addEnemyClickVert (piece, -1, -1);
        }

        if ((piece.x + 1<8) && (piece.y+1 <8)) {
            addEnemyClickVert (piece, 1, 1);
        }

        if ((piece.x-1 >= 0) && (piece.y+1 <8)) {
            addEnemyClickVert (piece, -1, 1);
        }
        if ((piece.x+1<8) && (piece.y-1 >= 0)) {
            addEnemyClickVert (piece, 1, -1);
        }
}

function goBackward () {
	document.getElementById("back").onclick = function() {
		if (backTab.length-1 >= 0) {
			deleteGreen();
			backMove = true;
			var lastPiece = backTab[backTab.length-1];
			moveto(lastPiece.piece, lastPiece.x, lastPiece.y);
			lastPiece.piece.init = (lastPiece.type == "init");
			if (lastPiece.eated) {
				if (lastPiece.piece.player == "white") {
					var eatenPiece = blackDead[blackDead.length-1];
					tourBlanc = (!tourBlanc);
					moveto(eatenPiece, eatenPiece.x, eatenPiece.y);
					addListener();
					blackDead.pop();
				}
				if (lastPiece.piece.player == "black") {
					var eatenPiece = whiteDead[whiteDead.length-1];
					tourBlanc = (!tourBlanc);
					moveto(eatenPiece, eatenPiece.x, eatenPiece.y);
					addListener();
					whiteDead.pop();
				}
			};
			if (lastPiece.type == "pawn") {
				lastPiece.piece.img.src = "resBis/"+lastPiece.piece.player+"_pawn.png";
				lastPiece.piece.type = "pawn";
				lastPiece.piece.img.onclick = function() {
					deleteGreen();
					if (lastPiece.piece.player == "white") {checkWhitePawnMove(lastPiece.piece);}
					if (lastPiece.piece.player == "black") {checkBlackPawnMove(lastPiece.piece);}
				}
			};
			if (lastPiece.type == "roque") {
				secondPiece = backTab[backTab.length-2];
				secondPiece.piece.init = true;
				lastPiece.piece.init = true;
				tourBlanc = (!tourBlanc);
				moveto(secondPiece.piece, secondPiece.x, secondPiece.y);
				backTab.pop();
			};
			if (lastPiece.piece.player == "black") {
				echec = dangerousPlace(blackKing, blackKing.x, blackKing.y);
				mat = isAnyPossibility(whiteKing);
			} else {
				echec = dangerousPlace(whiteKing, whiteKing.x, whiteKing.y);
				mat = isAnyPossibility(blackKing);
			}
			changeInfo();
			backTab.pop();
			backMove = false;
		}
	};
}

function loadBoard (newtab, newWhiteDead, newBlackDead, newBackTab, time, info) {
	for (var i = 0; i < 32; i++) {
		var myNode = document.getElementById("piece");
		myNode.parentNode.removeChild(myNode);
	}
	tab = newtab;
	whiteDead = newWhiteDead;
	blackDead = newBlackDead;
	backTab = newBackTab;

	for (var i=0; i < 8; i++) {
		for (var j=0; j < 8; j++) {
			if (typeof tab[i][j] == "object" && tab[i][j] != null) {
				tab[i][j].img = imgCreator("resBis/"+tab[i][j].player+"_"+tab[i][j].type+".png",i,j);
				document.getElementById("body").appendChild(tab[i][j].img);
			}
		}
	}

	for (var i=0; i < whiteDead.length; i++) {
		whiteDead[i].img = imgCreator("resBis/"+whiteDead[i].player+"_"+whiteDead[i].type+".png",i,i);
		whiteDead[i].img.style.top = i*60+"px";
		whiteDead[i].img.style.left = 80+9*67+"px";
		document.getElementById("body").appendChild(whiteDead[i].img);
		console.log(i);
	}

	for (var i=0; i < blackDead.length; i++) {
		blackDead[i].img = imgCreator("resBis/"+blackDead[i].player+"_"+blackDead[i].type+".png",i,i);
		blackDead[i].img.style.top = i*60+"px";
		blackDead[i].img.style.left = 80+8*67+"px";
		document.getElementById("body").appendChild(blackDead[i].img);
		console.log(i);
	}
	document.getElementById("info").innerHTML = info;
	totalSeconds = time;
	addListener();
}

function saveGame () {
	var id = document.getElementById("saveInput").value;
	var object = JSON.stringify({tab:tab, whiteDead:whiteDead, blackDead:blackDead, backTab:backTab});
	var info = document.getElementById("info").innerHTML;
	var url = 'http://infolimon.iutmontp.univ-montp2.fr/~aboulincp/chess/loadGame.php?action=save&id='+id+'&object='+object+'&time='+totalSeconds+'&info='+info;
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", url);
	httpRequest.send();
}

function load () {
	var id = document.getElementById("loadInput").value;
	getBoard (id, loadBoard);
}

function getBoard (id, callback) {
	var url = 'http://infolimon.iutmontp.univ-montp2.fr/~aboulincp/chess/loadGame.php?action=load&id='+id;
	var httpRequest = new XMLHttpRequest();
	httpRequest.open("GET", url); 
	httpRequest.addEventListener("load", function () {
		var jsonResponse = JSON.parse(httpRequest.responseText);
		object = jsonResponse;
		var obj = JSON.parse(object[0].object);
		console.log(obj);
		callback(obj.tab, obj.whiteDead, obj.blackDead, obj.backTab, object[0].time, object[0].info);
	});
	httpRequest.send(null);
}

                
//----------------------------main-----------------------
var whiteKing;//nous avons besoin d'enregistrer les rois a part pour calculer leur état (echec, roque, mat...)
var blackKing;

var object;
var echec = false;
var mat = false;
var check = false;
var backMove = false;
var greenCpt = 0;

var tab = new Array();
var checkTab = new Array();
var backTab = new Array();
var whiteDead = new Array();
var blackDead = new Array();

var tourBlanc = true;//variable qui geres a quel joueur c'est le tour

initBoard();//initialisation du tableau
greenInit();//initalisation des cases temporaires vertes apparentes au click
addListener();//a chaque piece nous mettons un listener pour faire avancer le jeu en fonction du joueur
initCoordonate();//Initialise les coordonnées sur le bord du plateau (1-8 et a-h)
goBackward();//Permet le retour en arrière

document.getElementById("fond").onclick = function() {deleteGreen();};//les cases vertes sont temporaires et doivent etres supprimées a chaque fois


var totalSeconds = 0;//initalisation et début du timer
var timerVar = setInterval(countTimer, 1000);

changeInfo();//informations sur le status du jeu
