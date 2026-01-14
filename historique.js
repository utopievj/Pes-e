/* ===== HISTORIQUE LOCAL ===== */

const HISTO_KEY = "pesees";

function getHistorique() {
  return JSON.parse(localStorage.getItem(HISTO_KEY) || "[]");
}

function saveHistorique(data) {
  localStorage.setItem(HISTO_KEY, JSON.stringify(data));
}

function ajouterHistorique(ligne) {
  const data = getHistorique();
  data.unshift(ligne);
  saveHistorique(data);
  afficherHistorique();
}

function afficherHistorique() {
  const tbody = document.getElementById("historique");
  if (!tbody) return;

  const data = getHistorique();
  tbody.innerHTML = "";

  data.forEach(ligne => {
    tbody.innerHTML += `
      <tr>
        <td>${new Date(ligne.date).toLocaleString()}</td>
        <td>${ligne.ville}</td>
        <td>${ligne.type}</td>
        <td class="right">${ligne.nb}</td>
        <td class="right">${ligne.net}</td>
      </tr>
    `;
  });
}

/* INIT */
document.addEventListener("DOMContentLoaded", afficherHistorique);