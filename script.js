document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".quiz-step");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("quizForm");
  const resultadoDiv = document.getElementById("resultado");

  let currentStep = 0;

  function showStep(step) {
    steps.forEach((s, i) => {
      s.classList.remove("active");
      if (i === step) s.classList.add("active");
    });

    prevBtn.style.display = step === 0 ? "none" : "inline-block";
    nextBtn.style.display = step === steps.length - 1 ? "none" : "inline-block";
    submitBtn.style.display = step === steps.length - 1 ? "inline-block" : "none";
  }

  function validateStep(step) {
    const inputs = steps[step].querySelectorAll("input, select");
    for (let input of inputs) {
      if ((input.type === "radio" || input.type === "checkbox") && input.checked) return true;
      if (input.tagName === "SELECT" && input.value !== "") return true;
    }
    alert("Por favor, responde esta pregunta antes de continuar.");
    return false;
  }

  nextBtn.addEventListener("click", function () {
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  });

  prevBtn.addEventListener("click", function () {
    currentStep--;
    showStep(currentStep);
  });

  const descripcionesProductos = {
    "Tónico Minoxidil": "Estimula el crecimiento capilar y fortalece el cuero cabelludo.",
    "Keracrece": "Nutre el folículo y ayuda a evitar la caída del cabello.",
    "Shampoo neutro recomendado": "Ideal para todo tipo de cabello, limpia suavemente sin agredir la fibra capilar.",
    "Mascarilla Proteína de Leche": "Hidrata profundamente y mejora la elasticidad del cabello seco.",
    "Ácido Hialurónico 30G": "Hidrata y rellena la fibra capilar desde adentro.",
    "Repolarizante 40G": "Reestructura el cabello dañado por químicos o calor.",
    "Bond-Plex 40G": "Reparación intensa para cabellos muy procesados.",
    "Reestructurarte Capilar BTX": "Controla el frizz y suaviza desde la primera aplicación.",
    "Chocokeratin": "Aporta suavidad, brillo y efecto antifrizz prolongado.",
    "Loción de Crespos": "Define y mantiene rizos elásticos y nutridos.",
    "Ácido Hialurónico SAYI": "Aporta hidratación ligera ideal para rizos o cabello mixto.",
    "Ampolla Semillas de Lino": "Regula el sebo, nutre y da brillo.",
    "18 en 1 30G": "Tratamiento multifunción para todo tipo de daño.",
    "Vitamina E 15ml": "Fortalece y sella las puntas evitando la resequedad.",
    "Tratamiento con Jalea Real": "Aporta brillo, suavidad y nutrición profunda.",
    "Fitoplex 15ml": "Protege y repara tras tintes, alisados o decoloraciones.",
    "Antiorquilla 40G": "Ideal para prevenir y sellar puntas abiertas.",
    "Gotas con aceite de argán": "Alivia puntas abiertas y consta de hidratación libre de grasa"
  };

  function obtenerRutaImagen(producto) {
    const nombre = producto
      .toLowerCase() // pasa todo a minúscula
      .normalize("NFD") // separa acentos (é → e + ́)
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .replace(/[^a-z0-9]/gi, "-") // reemplaza todo lo que no sea letra o número por guión
      .replace(/-+/g, "-"); // evita guiones duplicados
  
    return `img/productos/${nombre}.jpg`;
  }  

  function mostrarProductos(lista) {
    return `
      <div class="productos-grid">
        ${lista.map(p => `
          <div class="producto-card">
            <img src="img/productos/${p}.jpg" alt="${p}" />
            <div class="producto-info">
              <strong>${p}</strong>
              <p class="descripcion">${descripcionesProductos[p] || "Descripción no disponible."}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }
  

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const tipoCabello = form.tipoCabello.value;
    const cabelloSeco = form.cabelloSeco.value;
    const puntas = form.puntas.value;
    const grasa = form.grasa.value;
    const procesos = Array.from(document.querySelectorAll('input[name="procesos"]:checked')).map(cb => cb.value);
    const frizz = form.frizz.value;
    const tacto = form.tacto.value;
    const objetivo = form.objetivo.value;

    // Detectar necesidades
    let necesidades = [];

    if (cabelloSeco === "si" || tacto === "aspero") necesidades.push("hidratacion");
    if (puntas === "si" || procesos.includes("tintura") || procesos.includes("alisado")) necesidades.push("reparacion");
    if (grasa === "si" || tacto === "mixto") necesidades.push("equilibrio");
    if (frizz === "si" || objetivo === "frizz") necesidades.push("frizz");
    if (tipoCabello === "rizado" || tipoCabello === "crespo" || objetivo === "rizos") necesidades.push("rizos");
    if (objetivo === "brillo") necesidades.push("brillo");

    const pasos = {
      limpiar: [],
      tratar: [],
      reparar: []
    };

    const catalogo = {
      limpiar: {
        hidratacion: ["Shampoo neutro recomendado"],
        equilibrio: ["Keracrece"],
        frizz: ["Shampoo neutro recomendado"],
        brillo: ["Shampoo neutro recomendado"],
        rizos: ["Keracrece"],
        reparacion: ["Keracrece"]
      },
      tratar: {
        hidratacion: ["Mascarilla Proteína de Leche", "Ácido Hialurónico 30G"],
        reparacion: ["Repolarizante 40G", "Bond-Plex 40G"],
        frizz: ["Reestructurarte Capilar BTX", "Chocokeratin"],
        rizos: ["Loción de Crespos"],
        equilibrio: ["Ampolla Semillas de Lino", "18 en 1 30G"],
        brillo: ["Chocokeratin"]
      },
      reparar: {
        hidratacion: ["Vitamina E 15ml", "Tratamiento con Jalea Real"],
        reparacion: ["Fitoplex 15ml"],
        frizz: ["Gotas con aceite de argán"],
        rizos: ["Ácido Hialurónico SAYI"],
        brillo: ["Antiorquilla 40G"]
      }
    };

    // Función para seleccionar al menos 1 producto por necesidad (máx 2 en total)
    function productosPorPaso(paso, limite = 2) {
      const usados = new Set();
      const seleccionados = [];

      for (let necesidad of necesidades) {
        const productos = catalogo[paso][necesidad];
        if (productos) {
          for (let producto of productos) {
            if (!usados.has(producto)) {
              seleccionados.push(producto);
              usados.add(producto);
              break; // solo uno por necesidad
            }
          }
        }
        if (seleccionados.length >= limite) break;
      }

      return seleccionados;
    }

    pasos.limpiar = productosPorPaso("limpiar", 2);
    pasos.tratar = productosPorPaso("tratar", 2);
    pasos.reparar = productosPorPaso("reparar", 2);

    resultadoDiv.innerHTML = `
      <h2>✨ Tu rutina capilar personalizada:</h2>

      <h3>🧴 Paso 1: Limpiar</h3>
      ${mostrarProductos(pasos.limpiar)}

      <h3>🧪 Paso 2: Tratar</h3>
      ${mostrarProductos(pasos.tratar)}

      <h3>💧 Paso 3: Reparar y Sellar</h3>
      ${mostrarProductos(pasos.reparar)}

      <p><strong>Consejo:</strong> Usa esta rutina de 1 a 2 veces por semana para ver mejores resultados. Personalizada para tus necesidades: <em>${necesidades.join(", ")}</em>.</p>
    `;

    form.style.display = "none";
  });

  showStep(currentStep);

  // Toggle modo oscuro
const darkBtn = document.getElementById("darkModeToggle");
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

});
