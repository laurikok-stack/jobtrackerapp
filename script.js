const form = document.getElementById("jobForm");
const countHaettu = document.getElementById("countHaettu");
const countHaastattelu = document.getElementById("countHaastattelu");
const countHylatty = document.getElementById("countHylatty");

const countTotal = document.getElementById("countTotal");
const percentHaettu = document.getElementById("percentHaettu");
const percentHaastattelu = document.getElementById("percentHaastattelu");
const percentHylatty = document.getElementById("percentHylatty");

const countTarjous = document.getElementById("countTarjous");
const percentTarjous = document.getElementById("percentTarjous");
const barTarjous = document.getElementById("barTarjous");

const columnHaettu = document.getElementById("columnHaettu");
const columnHaastattelu = document.getElementById("columnHaastattelu");
const columnTarjous = document.getElementById("columnTarjous");
const columnHylatty = document.getElementById("columnHylatty");

let jobs = loadJobs();

function loadJobs() {
  return JSON.parse(localStorage.getItem("jobs")) || [];
}

function saveJobs() {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

function updateStats() {
  const total = jobs.length;
  const haettu = jobs.filter(job => job.status === "Haettu").length;
  const haastattelu = jobs.filter(job => job.status === "Haastattelu").length;
  const tarjous = jobs.filter(job => job.status === "Tarjous").length;
  const hylatty = jobs.filter(job => job.status === "Hylätty").length;

  const haettuPercent = total > 0 ? Math.round((haettu / total) * 100) : 0;
  const haastatteluPercent = total > 0 ? Math.round((haastattelu / total) * 100) : 0;
  const tarjousPercent = total > 0 ? Math.round((tarjous / total) * 100) : 0;
  const hylattyPercent = total > 0 ? Math.round((hylatty / total) * 100) : 0;

  if (countTotal) countTotal.textContent = total;
  if (countHaettu) countHaettu.textContent = haettu;
  if (countHaastattelu) countHaastattelu.textContent = haastattelu;
  if (countTarjous) countTarjous.textContent = tarjous;
  if (countHylatty) countHylatty.textContent = hylatty;

  if (percentHaettu) percentHaettu.textContent = haettuPercent;
  if (percentHaastattelu) percentHaastattelu.textContent = haastatteluPercent;
  if (percentTarjous) percentTarjous.textContent = tarjousPercent;
  if (percentHylatty) percentHylatty.textContent = hylattyPercent;
}

function createPipelineCard(job, index) {
  const card = document.createElement("div");
  card.className = "pipeline-card";
  card.draggable = true;
  card.dataset.index = index;

  const title = document.createElement("strong");
  title.textContent = job.title;

  const company = document.createElement("p");
  company.textContent = job.company;

  const select = document.createElement("select");
  ["Haettu", "Haastattelu", "Tarjous", "Hylätty"].forEach(status => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    if (status === job.status) option.selected = true;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    jobs[index].status = select.value;
    saveJobs();
    renderJobs();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Poista";
  deleteBtn.addEventListener("click", () => {
    jobs.splice(index, 1);
    saveJobs();
    renderJobs();
  });

  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", index);
  });

  card.appendChild(title);
  card.appendChild(company);
  card.appendChild(select);
  card.appendChild(deleteBtn);

  return card;
}

function renderPipeline() {
  if (!columnHaettu || !columnHaastattelu || !columnTarjous || !columnHylatty) return;

  columnHaettu.innerHTML = "";
  columnHaastattelu.innerHTML = "";
  columnTarjous.innerHTML = "";
  columnHylatty.innerHTML = "";

  if (jobs.length === 0) {
    columnHaettu.innerHTML = "<p class='empty'>Ei hakemuksia vielä</p>";
    return;
  }

  jobs.forEach((job, index) => {
    const card = createPipelineCard(job, index);

    if (job.status === "Haettu") {
      columnHaettu.appendChild(card);
    } else if (job.status === "Haastattelu") {
      columnHaastattelu.appendChild(card);
    } else if (job.status === "Tarjous") {
      columnTarjous.appendChild(card);
    } else if (job.status === "Hylätty") {
      columnHylatty.appendChild(card);
    }
  });
}
function renderJobs() {
  renderPipeline();
  updateStats();
}

if (form) {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const company = document.getElementById("company").value;
    const status = document.getElementById("status").value;

    jobs.push({ title: jobTitle, company, status });
    saveJobs();
    renderJobs();
    form.reset();
  });
}

function setupDropZone(column, newStatus) {
  if (!column) return;

  column.addEventListener("dragover", (event) => {
    event.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (event) => {
    event.preventDefault();

    column.classList.remove("drag-over");

    const index = event.dataTransfer.getData("text/plain");
    if (index === "") return;

    jobs[index].status = newStatus;
    saveJobs();
    renderJobs();
  });
}
