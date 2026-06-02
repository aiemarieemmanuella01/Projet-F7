// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

var $$ = Dom7;

var app = new Framework7({
    el: '#app',
    name: 'MaToDo',
    theme: 'auto',
});

// ------------------------------------------------------------
// SÉANCE 3 
// ------------------------------------------------------------

var CLE = 'ma-todo-taches';


function chargerTaches() {
    var data = localStorage.getItem(CLE);

    if (data) {
        return JSON.parse(data);
    }

    return [
        {
            id: 1,
            texte: "Réviser l'algorithmique",
            fait: false
        }
    ];
}

// Sauvegarder les tâches
function sauvegarder() {
    localStorage.setItem(CLE, JSON.stringify(taches));
}

// Tableau des tâches
var taches = chargerTaches();

// Filtre actif
var filtreActif = 'toutes';

// ------------------------------------------------------------
// SÉANCE 2
// ------------------------------------------------------------

function ligneTache(t) {
    return (
        '<li class="item-content" data-id="' + t.id + '">' +

            '<div class="item-media">' +
                '<label class="checkbox">' +
                    '<input type="checkbox" ' + (t.fait ? 'checked' : '') + '>' +
                    '<i class="icon-checkbox"></i>' +
                '</label>' +
            '</div>' +

            '<div class="item-inner">' +
                '<div class="item-title ' + (t.fait ? 'tache-faite' : '') + '">' +
                t.texte +
                '</div>' +

                '<div class="item-after">' +
                    '<a href="#" class="btn-suppr">' +
                        '<i class="icon f7-icons text-color-red">trash</i>' +
                    '</a>' +
                '</div>' +
            '</div>' +

        '</li>'
    );
}

// Filtre des tâches
function tachesVisibles() {
    if (filtreActif === 'afaire') {
        return taches.filter(function (t) {
            return !t.fait;
        });
    }

    if (filtreActif === 'faites') {
        return taches.filter(function (t) {
            return t.fait;
        });
    }

    return taches;
}

// Affichage
function afficher() {
    
    $$('.liste-taches').html(
        tachesVisibles().map(ligneTache).join('')
    );

    
    var restantes = taches.filter(function (t) {
        return !t.fait;
    }).length;

    $$('.compteur').text(
        restantes + ' tâche(s) restante(s)'
    );
}

// Premier affichage
afficher();

// Ajouter une tâche
function ajouterTache(texte) {
    if (texte.trim() === '') {
        return;
    }

    var nouvelId = taches.reduce(function (max, t) {
        return Math.max(max, t.id);
    }, 0) + 1;

    taches.push({
        id: nouvelId,
        texte: texte.trim(),
        fait: false
    });

    sauvegarder();
    afficher();

    app.toast.create({
        text: 'Tâche ajoutée !',
        closeTimeout: 1200
    }).open();
}

// Supprimer une tâche
function supprimerTache(id) {
    taches = taches.filter(function (t) {
        return t.id !== parseInt(id, 10);
    });

    sauvegarder();
    afficher();
}

// Cocher / décocher
function basculerTache(id) {
    var t = taches.find(function (x) {
        return x.id === parseInt(id, 10);
    });

    if (t) {
        t.fait = !t.fait;
        sauvegarder();
        afficher();
    }
}



// Ajouter
$$(document).on('click', '#btn-ajouter', function (e) {
    e.preventDefault();
    var champ = $$('#champ-tache');
    ajouterTache(champ.val());
    champ.val('');
});

// Supprimer
$$(document).on('click', '.btn-suppr', function (e) {
    e.preventDefault();
    var id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

// Cocher / décocher
$$(document).on('change', '.liste-taches input[type="checkbox"]', function () {
    var id = $$(this).parents('.item-content').attr('data-id');
    basculerTache(id);
});

// Filtres
$$(document).on('click', '.filtre-btn', function () {
    $$('.filtre-btn').removeClass('button-active');
    $$(this).addClass('button-active');
    filtreActif = $$(this).attr('data-filtre');
    afficher();
});
