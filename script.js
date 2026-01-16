// =========================================================
// 1. DATA CENTER
// =========================================================

const db = {
    // --- DONNÉES INVENTÉES (MÉDECIN) ---
    medecin: {
        label: "Médecin Généraliste",
        praticiens: [
            { id: "martin", nom: "Dr. Martin" },
            { id: "bernard", nom: "Dr. Bernard" },
            { id: "dubois", nom: "Dr. Dubois" }
        ],
        motifs: [
            { id: "consultation", label: "Consultation" },
            { id: "certificat", label: "Certificat médical" },
            { id: "vaccination", label: "Vaccination" }
        ],
        natures: [
            { id: "premier", label: "Premier rendez-vous" },
            { id: "suivi", label: "Rendez-vous de suivi" }
        ],
        horaires: { default: ["09:00", "09:30", "10:00", "11:00", "14:00", "15:00", "16:30"] }
    },

    // --- DONNÉES PSYCHOLOGUE (BASÉES SUR PDF) ---
    psy: {
        label: "Psychologue",
        praticiens: [
            { id: "lemaire", nom: "Madame Lemaire" },
            { id: "andre", nom: "Monsieur André" },
            { id: "honore", nom: "Madame Honoré" },
            { id: "garnier", nom: "Madame Garnier" }
        ],
        // Le motif ici détermine le créneau horaire selon le PDF
        motifs: [
            { id: "couple", label: "Rendez-vous en couple" },
            { id: "grossesse", label: "Rendez-vous femme enceinte" }
        ],
        natures: [
            { id: "premier", label: "Premier rendez-vous" },
            { id: "suivi", label: "Rendez-vous de suivi" }
        ],
        horaires: {
            lemaire: {
                couple: ["07:00", "09:00", "12:00", "14:00"],
                grossesse: ["08:00", "10:00", "13:00"]
            },
            andre: {
                couple: ["09:00", "11:00", "13:30", "15:30"],
                grossesse: ["10:00", "14:30", "16:30", "17:15"]
            },
            honore: {
                couple: ["11:00", "13:00", "15:00", "17:00"],
                grossesse: ["12:00", "14:00", "16:00", "18:00"]
            },
            garnier: {
                couple: ["09:00", "13:30", "15:30", "17:30"],
                grossesse: ["10:00", "10:45", "14:30", "16:30"]
            }
        }
    },

    // --- DONNÉES INVENTÉES (GYNÉCO) ---
    gyneco: {
        label: "Gynécologue",
        praticiens: [
            { id: "petit", nom: "Dr. Petit" },
            { id: "rousseau", nom: "Dr. Rousseau" }
        ],
        motifs: [
            { id: "suivi", label: "Suivi annuel" },
            { id: "grossesse", label: "Suivi de grossesse" },
            { id: "echo", label: "Échographie" }
        ],
        natures: [
            { id: "premier", label: "Premier rendez-vous" },
            { id: "suivi", label: "Rendez-vous de suivi" }
        ],
        horaires: { default: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:30"] }
    }
};

// =========================================================
// 2. ÉTAT GLOBAL
// =========================================================
let state = {
    service: null, 
    praticien: null,
    motif: null,
    nature: null,
    date: null,
    heure: null
};

// =========================================================
// 3. LOGIQUE & ANIMATIONS
// =========================================================

// Sélections DOM
const navCards = document.querySelectorAll('.js-nav-card');
const sectionPraticien = document.getElementById('step-praticien');
const sectionMotif = document.getElementById('step-motif');
const sectionNature = document.getElementById('step-nature');
const sectionDate = document.getElementById('step-date');
const sectionSlots = document.getElementById('step-slots');
const sectionRecap = document.getElementById('recap-section');

// Fonction utilitaire pour cacher/reset les étapes suivantes
function resetStepsFrom(stepLevel) {
    // 1: Praticien, 2: Motif, 3: Nature, 4: Date, 5: Slots, 6: Recap
    if(stepLevel <= 1) { hideSection(sectionPraticien); state.praticien = null; }
    if(stepLevel <= 2) { hideSection(sectionMotif); state.motif = null; }
    if(stepLevel <= 3) { hideSection(sectionNature); state.nature = null; }
    if(stepLevel <= 4) { 
        hideSection(sectionDate); 
        state.date = null; 
        document.getElementById('date-input').value = ''; 
    }
    if(stepLevel <= 5) { 
        hideSection(sectionSlots); 
        state.heure = null; 
        document.querySelectorAll('.btn-slot').forEach(b => b.classList.remove('selected', 'disabled'));
    }
    if(stepLevel <= 6) hideSection(sectionRecap);
}

function showSection(element) {
    element.classList.remove('hidden-section');
    element.classList.add('visible-section');
}

function hideSection(element) {
    element.classList.remove('visible-section');
    element.classList.add('hidden-section');
}

// ---------------------------------------------
// ETAPE 0 : CLICK SERVICE (Nav du haut)
// ---------------------------------------------
navCards.forEach(card => {
    card.addEventListener('click', () => {
        // UI Active
        navCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update State
        state.service = card.dataset.service;
        
        // Reset tout le reste
        resetStepsFrom(1);

        // Injecter les Praticiens correspondant au service
        renderPraticiens(state.service);
        showSection(sectionPraticien);
    });
});

// ---------------------------------------------
// ETAPE 1 : GENERATION ET CHOIX PRATICIEN
// ---------------------------------------------
function renderPraticiens(serviceKey) {
    const container = document.getElementById('container-praticien');
    container.innerHTML = ''; 

    const dataService = db[serviceKey];
    document.getElementById('title-praticien').textContent = "Choisissez votre " + dataService.label;

    dataService.praticiens.forEach(p => {
        const btn = document.createElement('button');
        btn.className = 'btn-rdv';
        btn.textContent = p.nom;
        
        btn.addEventListener('click', () => {
            container.querySelectorAll('.btn-rdv').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            state.praticien = p.id;
            
            // Mise à jour des labels contextuels
            document.getElementById('label-praticien-name-1').textContent = p.nom;
            document.getElementById('label-praticien-name-2').textContent = p.nom;

            resetStepsFrom(2);
            renderMotifs(serviceKey);
            showSection(sectionMotif);
        });
        container.appendChild(btn);
    });
}

// ---------------------------------------------
// ETAPE 2 : CHOIX MOTIF (Couple/Enceinte...)
// ---------------------------------------------
function renderMotifs(serviceKey) {
    const container = document.getElementById('container-motif');
    container.innerHTML = '';

    const dataService = db[serviceKey];

    dataService.motifs.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'btn-rdv';
        btn.textContent = m.label;

        btn.addEventListener('click', () => {
            container.querySelectorAll('.btn-rdv').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            state.motif = m.id;

            resetStepsFrom(3);
            renderNature(serviceKey); // On passe à l'étape Nature
            showSection(sectionNature);
        });
        container.appendChild(btn);
    });
}

// ---------------------------------------------
// ETAPE 3 : CHOIX NATURE (Premier / Suivi) - NOUVEAU
// ---------------------------------------------
function renderNature(serviceKey) {
    const container = document.getElementById('container-nature');
    container.innerHTML = '';

    const dataService = db[serviceKey];

    // On utilise les natures définies dans DB (ou des valeurs par défaut)
    const natures = dataService.natures || [
        { id: "premier", label: "Premier rendez-vous" },
        { id: "suivi", label: "Rendez-vous de suivi" }
    ];

    natures.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'btn-rdv';
        btn.textContent = n.label;

        btn.addEventListener('click', () => {
            container.querySelectorAll('.btn-rdv').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            state.nature = n.id;

            resetStepsFrom(4);
            showSection(sectionDate);
        });
        container.appendChild(btn);
    });
}

// ---------------------------------------------
// ETAPE 4 : DATE
// ---------------------------------------------
document.getElementById('date-input').addEventListener('change', (e) => {
    if(e.target.value) {
        state.date = e.target.value;
        resetStepsFrom(5);
        updateAvailableSlots();
        showSection(sectionSlots);
    }
});

// ---------------------------------------------
// ETAPE 5 : LOGIQUE HORAIRES
// ---------------------------------------------
function updateAvailableSlots() {
    const allSlots = document.querySelectorAll('.btn-slot');
    const serviceData = db[state.service];
    
    let validSlots = [];

    // Logique Psy : Dépend du PRATICIEN et du MOTIF (Couple/Grossesse)
    if(state.service === 'psy') {
        const slotsForDoc = serviceData.horaires[state.praticien];
        if(slotsForDoc) {
            validSlots = slotsForDoc[state.motif] || [];
        } else {
            validSlots = ["09:00", "10:00"]; // Fallback
        }
    } else {
        // Médecin/Gynéco : Horaires standards
        validSlots = serviceData.horaires.default || [];
    }

    // Affichage
    allSlots.forEach(btn => {
        btn.classList.remove('selected');
        if(validSlots.includes(btn.value)) {
            btn.classList.remove('disabled');
        } else {
            btn.classList.add('disabled');
        }
    });
}

// Clic sur un horaire
document.querySelectorAll('.btn-slot').forEach(btn => {
    btn.addEventListener('click', () => {
        if(btn.classList.contains('disabled')) return;

        document.querySelectorAll('.btn-slot').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.heure = btn.value;

        showRecap();
    });
});

// ---------------------------------------------
// ETAPE 6 : RECAP
// ---------------------------------------------
function showRecap() {
    const sData = db[state.service];
    
    const pName = sData.praticiens.find(p => p.id === state.praticien).nom;
    const mName = sData.motifs.find(m => m.id === state.motif).label;
    const nName = sData.natures.find(n => n.id === state.nature).label; // "Premier" ou "Suivi"
    
    const dateObj = new Date(state.date);
    const dateStr = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

    document.getElementById('final-psy').textContent = pName;
    document.getElementById('final-motif').textContent = mName;
    document.getElementById('final-nature').textContent = nName;
    document.getElementById('final-date').textContent = dateStr;
    document.getElementById('final-time').textContent = state.heure.replace(':', 'h');

    showSection(sectionRecap);
    setTimeout(() => {
        sectionRecap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}