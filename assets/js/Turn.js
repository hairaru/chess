/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//color désigne la couleur qui doit jouer actuellement
//nb désigne le nombre de tours. Il s'incrément à chaque fois que le joueur blanc doit jouer
function Turn(){
    this.color = "b";
    this.nb = 1;
    this.echec = 0; //0 non, 1 oui mais on peut prendr, 
                    //2 oui mais on peut interposer
                    //3 oui mais on peut fuir
                    //4 mat !
}