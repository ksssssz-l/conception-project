document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('js-appointments-list');
    
    // 1. Charger les données depuis le localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // 2. Fonction pour calculer l'heure de fin (esthétique PDF)
    function getEndTime(startTime, motif) {
        let [hours, minutes] = startTime.split(':').map(Number);
        // Durée : 1h pour couple, 45min pour femme enceinte
        if (motif === 'couple') {
            hours += 1;
        } else {
            minutes += 45;
            if (minutes >= 60) {
                hours += 1;
                minutes -= 60;
            }
        }
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    }

    // 3. Fonction pour générer le HTML d'une ligne selon les assets du PDF
    function renderLine(app) {
        // Couleurs basées sur les assets : bleu foncé pour couple, orange pour enceinte 
        const isCouple = app.motif === 'couple';
        const typeClass = isCouple ? 'row-couple' : 'row-enceinte';
        const timeLabel = app.heure.replace(':', 'h');
        const endTime = getEndTime(app.heure, app.motif);
        const labelAction = "GÉRER LE RENDEZ-VOUS"; [cite: 1]

        return `
            <div class="appointment-row ${typeClass}">
                <span class="time">${timeLabel} - ${endTime}</span>
                <span class="patient">${app.patientName}</span>
                <button class="btn-manage">${labelAction}</button>
            </div>
        `;
    }

    // 4. Logique d'affichage
    if (appointments.length === 0) {
        // État vide conforme au PDF 
        listContainer.innerHTML = `
            <div class="appointment-row row-empty">
                <span class="time">09h00 - 10h00</span>
                <span class="patient">Aucun rendez-vous enregistré</span>
                <button class="btn-manage">GÉRER LE CRÉNEAU</button>
            </div>
            <div class="appointment-row row-repos">
                <span class="time">12h00 - 14h00</span>
                <span class="patient">PAUSE DÉJEUNER</span>
            </div>
        `;
    } else {
        // Tri par heure chronologique
        appointments.sort((a, b) => a.heure.localeCompare(b.heure));

        let htmlContent = "";
        let pauseAdded = false;

        appointments.forEach(app => {
            // Insertion de la pause déjeuner visuelle à 12h 
            if (!pauseAdded && app.heure >= "12:00") {
                htmlContent += `
                    <div class="appointment-row row-repos">
                        <span class="time">12h00 - 14h00</span>
                        <span class="patient">PAUSE DÉJEUNER</span>
                    </div>
                `;
                pauseAdded = true;
            }
            htmlContent += renderLine(app);
        });

        // Si la pause n'a pas été ajoutée (pas de RDV l'après-midi)
        if (!pauseAdded) {
            htmlContent += `
                <div class="appointment-row row-repos">
                    <span class="time">12h00 - 14h00</span>
                    <span class="patient">PAUSE DÉJEUNER</span>
                </div>
            `;
        }

        listContainer.innerHTML = htmlContent;
    }
});