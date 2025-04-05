// Configuración inicial y variables
const synth = window.speechSynthesis
let isSpeaking = false
let currentMarker = null
let isLoading = true
let markerVisible = false

// Elementos del DOM
const speakBtn = document.getElementById("speak-btn")
const textElement = document.getElementById("phoenix-text")
const titleElement = document.getElementById("title")
const statusIndicator = document.getElementById("camera-status")
const loadingUI = document.getElementById("loading-ui")
const infoBox = document.getElementById("info-box")
const modelContainer = document.getElementById("model-container")

// Datos de contenido
const texts = {
  phoenix: {
    title: "Historia del Fénix",
    content:
      "El fénix es un ave mítica que simboliza la inmortalidad, la resurrección y la vida después de la muerte. Se dice que cuando el fénix siente que va a morir, construye un nido de ramas aromáticas y especias, se incendia y renace de sus cenizas.",
  },
  lion: {
    title: "Historia del León",
    content:
      "El león es un símbolo de fuerza, valentía y liderazgo. Ha sido representado en diversas culturas como el rey de los animales, apareciendo en banderas, escudos de armas y mitologías alrededor del mundo.",
  },
  honestidad: {
    title: "Valor Institucional: HONESTIDAD",
    content:
      "La Honestidad les da honor y decoro a las actividades realizadas, porque genera confianza, respeto y consideración por el trabajo. Es el valor que les da decoro y pudor a nuestras acciones y nos hace dignos de merecer honor, respeto y consideración.",
  },
  prudencia: {
    title: "Valor Institucional: PRUDENCIA",
    content:
      "La Prudencia es el ejercicio pensado del ser y del actuar para el respeto de los otros; implica callar cuando no corresponde ni por autoridad ni por trabajo, o delatar o hablar o escribir o dar información sobre lo que no se me pregunta. La Prudencia es el valor del discernimiento sobre el bien y la forma para llevarlo a cabo y permite distinguir entre lo bueno y lo malo.",
  },
  justicia: {
    title: "Valor Institucional: JUSTICIA",
    content:
      "La Justicia corresponde a la Universidad ser depositaria de la aplicación de la Justicia, entendida ésta como todas las acciones públicas y privadas dirigidas a los individuos para garantizar la igualdad, el respeto, la integridad, el libre desarrollo de la personalidad y el respeto por la vida, las creencias, los credos políticos, los derechos humanos, y el disfrute de condiciones de dignidad para estudiantes, profesores y administrativos, a la luz de su misión y visión en el marco legal y constitucional que nos rige. La Justicia considerada por los antiguos como la más excelsa de todas las virtudes, es un valor que nos inclina a dar a cada quien lo que le corresponde como propio según la recta razón.",
  },
}

// Función para actualizar el estado de la aplicación
function updateStatus(message) {
  statusIndicator.textContent = message
}

// Función para mostrar/ocultar la interfaz de carga
function toggleLoading(show) {
  loadingUI.setAttribute("visible", show)
  isLoading = show

  if (show) {
    updateStatus("Cargando modelos...")
  } else {
    updateStatus("Buscando marcadores...")
  }
}

// Función para actualizar el contenido del panel de información
function updateInfoPanel(markerType) {
  if (!texts[markerType]) return

  const { title, content } = texts[markerType]
  titleElement.innerText = title
  textElement.innerText = content

  // Añadir animación de aparición
  infoBox.classList.add("fade-in")
  setTimeout(() => infoBox.classList.remove("fade-in"), 500)

  // Actualizar estado
  updateStatus(`Marcador detectado: ${title}`)

  // Detener cualquier reproducción de voz en curso
  if (isSpeaking) {
    stopSpeaking()
  }

  // Asegurarse de que el panel de información sea visible y desplazable
  infoBox.style.display = "block"
  infoBox.scrollTop = 0
}

// Función para limpiar el panel de información
function clearInfoPanel() {
  titleElement.innerText = ""
  textElement.innerText = ""
  updateStatus("Buscando marcadores...")
}

// Función para iniciar la reproducción de voz
function startSpeaking() {
  if (isSpeaking || !textElement.innerText) return

  const utterance = new SpeechSynthesisUtterance(textElement.innerText)
  utterance.lang = "es-ES"
  utterance.rate = 1.0
  utterance.pitch = 1.0

  utterance.onstart = () => {
    isSpeaking = true
    speakBtn.innerHTML = '<span id="speak-icon">🔇</span> <span id="speak-text">Detener Reproducción</span>'
    speakBtn.classList.add("speaking")
  }

  utterance.onend = () => {
    stopSpeaking()
  }

  utterance.onerror = (event) => {
    console.error("Error de síntesis de voz:", event)
    stopSpeaking()
  }

  synth.speak(utterance)
}

// Función para detener la reproducción de voz
function stopSpeaking() {
  synth.cancel()
  isSpeaking = false
  speakBtn.innerHTML = '<span id="speak-icon">🔊</span> <span id="speak-text">Reproducir Texto</span>'
  speakBtn.classList.remove("speaking")
}

// Función para alternar la reproducción de voz
function toggleSpeech() {
  if (isSpeaking) {
    stopSpeaking()
  } else {
    startSpeaking()
  }
}

// Inicialización de la escena
document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene")

  // Evento de carga de la escena
  scene.addEventListener("loaded", () => {
    toggleLoading(false)
    console.log("Escena AR cargada correctamente")

    // Asegurarse de que los elementos de la interfaz sean visibles
    document.getElementById("back-button").style.display = "flex"
    document.getElementById("status-indicator").style.display = "block"

    // Corregir el canvas de AR.js
    fixARCanvas()
  })

  // Evento de error de carga
  scene.addEventListener("error", (event) => {
    console.error("Error al cargar la escena AR:", event)
    updateStatus("Error al cargar la escena")
  })

  // Ajustar altura del contenedor de modelo según la orientación
  adjustContainerHeights()
})

// Función para corregir el canvas de AR.js
function fixARCanvas() {
  setTimeout(() => {
    const canvas = document.querySelector(".a-canvas")
    if (canvas) {
      canvas.style.width = "100%"
      canvas.style.height = "100%"
      canvas.style.left = "0"
      canvas.style.top = "0"
      canvas.style.position = "absolute"
      canvas.style.objectFit = "cover"
      canvas.style.transform = "none"
    }
  }, 1000)
}

// Función para ajustar las alturas de los contenedores
function adjustContainerHeights() {
  const isLandscape = window.innerWidth > window.innerHeight

  if (isLandscape) {
    modelContainer.style.minHeight = "60%"
    modelContainer.style.maxHeight = "70%"
    infoBox.style.minHeight = "30%"
    infoBox.style.maxHeight = "40%"
  } else {
    modelContainer.style.minHeight = "50%"
    modelContainer.style.maxHeight = "60%"
    infoBox.style.minHeight = "40%"
    infoBox.style.maxHeight = "50%"
  }

  // Corregir el canvas de AR.js
  fixARCanvas()
}

// Gestión de eventos de marcadores
function setupMarkerEvents() {
  // Configurar eventos para cada marcador
  const markers = [
    { id: "marker-phoenix", type: "phoenix" },
    { id: "marker-lion", type: "lion" },
    { id: "marker-honestidad", type: "honestidad" },
    { id: "marker-prudencia", type: "prudencia" },
    { id: "marker-justicia", type: "justicia" },
  ]

  markers.forEach(({ id, type }) => {
    const marker = document.getElementById(id)

    marker.addEventListener("markerFound", () => {
      markerVisible = true
      currentMarker = type
      updateInfoPanel(type)
    })

    marker.addEventListener("markerLost", () => {
      if (currentMarker === type) {
        markerVisible = false
        currentMarker = null
        clearInfoPanel()
      }
    })
  })
}

// Configurar eventos de botón de voz
speakBtn.addEventListener("click", toggleSpeech)

// Configurar eventos de teclas
document.addEventListener("keydown", (event) => {
  // Tecla Espacio para reproducir/detener voz
  if (event.code === "Space" && textElement.innerText) {
    event.preventDefault()
    toggleSpeech()
  }
})

// Inicializar eventos de marcadores cuando la escena esté lista
window.addEventListener("load", () => {
  setTimeout(setupMarkerEvents, 1000)

  // Asegurarse de que los elementos de la interfaz sean visibles
  document.getElementById("back-button").style.display = "flex"
  document.getElementById("status-indicator").style.display = "block"

  // Corregir el canvas de AR.js
  fixARCanvas()
})

// Gestión de visibilidad de la página
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isSpeaking) {
    stopSpeaking()
  }
})

// Gestión de errores
window.addEventListener("error", (event) => {
  console.error("Error en la aplicación:", event.message)
  updateStatus("Error en la aplicación")
})

// Optimización para dispositivos móviles
function checkMobileDevice() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  if (isMobile) {
    // Ajustes específicos para móviles
    document.body.classList.add("mobile-device")

    // Prevenir zoom en iOS
    document.addEventListener("gesturestart", (e) => {
      e.preventDefault()
    })

    // Ajustar tamaños para móviles
    adjustContainerHeights()
  }
}

checkMobileDevice()

// Gestión de orientación del dispositivo
window.addEventListener("orientationchange", () => {
  // Pequeña pausa para permitir que el navegador actualice las dimensiones
  setTimeout(() => {
    // Ajustar la altura del contenedor de información según la orientación
    adjustContainerHeights()

    // Corregir el canvas de AR.js
    fixARCanvas()
  }, 100)
})

// También ajustar en cambio de tamaño de ventana
window.addEventListener("resize", () => {
  adjustContainerHeights()
  fixARCanvas()
})

// Inicializar altura personalizada
const vh = window.innerHeight * 0.01
document.documentElement.style.setProperty("--vh", `${vh}px`)

// Observador de mutaciones para corregir el canvas cuando cambie
const observer = new MutationObserver((mutations) => {
  fixARCanvas()
})

// Iniciar observación después de que la página esté cargada
window.addEventListener("load", () => {
  const sceneEl = document.querySelector("a-scene")
  if (sceneEl) {
    observer.observe(sceneEl, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }
})

