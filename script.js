// Configuración inicial y variables
const synth = window.speechSynthesis
let isSpeaking = false
const speakBtn = document.getElementById("speak-btn")
const textElement = document.getElementById("phoenix-text")
const titleElement = document.getElementById("title")
const statusIndicator = document.getElementById("camera-status")

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

// Detectar cuándo un marcador es visible
document.querySelector("#marker-phoenix").addEventListener("markerFound", () => {
  titleElement.innerText = texts.phoenix.title
  textElement.innerText = texts.phoenix.content
  statusIndicator.textContent = "Marcador detectado: " + texts.phoenix.title
  document.querySelector("#bird-model").setAttribute("scale", "0.006 0.006 0.006")
})

document.querySelector("#marker-lion").addEventListener("markerFound", () => {
  titleElement.innerText = texts.lion.title
  textElement.innerText = texts.lion.content
  statusIndicator.textContent = "Marcador detectado: " + texts.lion.title
  document.querySelector("#lion-model").setAttribute("scale", "0.006 0.006 0.006")
})

document.querySelector("#marker-honestidad").addEventListener("markerFound", () => {
  titleElement.innerText = texts.honestidad.title
  textElement.innerText = texts.honestidad.content
  statusIndicator.textContent = "Marcador detectado: " + texts.honestidad.title
  document.querySelector("#honestidad-model").setAttribute("scale", "1 1 1")
})

document.querySelector("#marker-prudencia").addEventListener("markerFound", () => {
  titleElement.innerText = texts.prudencia.title
  textElement.innerText = texts.prudencia.content
  statusIndicator.textContent = "Marcador detectado: " + texts.prudencia.title
  document.querySelector("#prudencia-model").setAttribute("scale", "1 1 1")
})

document.querySelector("#marker-justicia").addEventListener("markerFound", () => {
  titleElement.innerText = texts.justicia.title
  textElement.innerText = texts.justicia.content
  statusIndicator.textContent = "Marcador detectado: " + texts.justicia.title
  document.querySelector("#justicia-model").setAttribute("scale", "1 1 1")
})

// Opción: Puedes hacer que desaparezca el texto cuando no haya marcador detectado
document.querySelector("#marker-phoenix").addEventListener("markerLost", () => {
  if (titleElement.innerText === texts.phoenix.title) {
    titleElement.innerText = ""
    textElement.innerText = ""
    statusIndicator.textContent = "Buscando marcadores..."
  }
})

document.querySelector("#marker-lion").addEventListener("markerLost", () => {
  if (titleElement.innerText === texts.lion.title) {
    titleElement.innerText = ""
    textElement.innerText = ""
    statusIndicator.textContent = "Buscando marcadores..."
  }
})

document.querySelector("#marker-honestidad").addEventListener("markerLost", () => {
  if (titleElement.innerText === texts.honestidad.title) {
    titleElement.innerText = ""
    textElement.innerText = ""
    statusIndicator.textContent = "Buscando marcadores..."
  }
})

document.querySelector("#marker-prudencia").addEventListener("markerLost", () => {
  if (titleElement.innerText === texts.prudencia.title) {
    titleElement.innerText = ""
    textElement.innerText = ""
    statusIndicator.textContent = "Buscando marcadores..."
  }
})

document.querySelector("#marker-justicia").addEventListener("markerLost", () => {
  if (titleElement.innerText === texts.justicia.title) {
    titleElement.innerText = ""
    textElement.innerText = ""
    statusIndicator.textContent = "Buscando marcadores..."
  }
})

// Función de texto a voz
speakBtn.addEventListener("click", () => {
  if (isSpeaking) {
    synth.cancel()
    isSpeaking = false
    speakBtn.innerText = "Reproducir Texto"
  } else {
    const utterance = new SpeechSynthesisUtterance(textElement.innerText)
    utterance.lang = "es-ES"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => {
      isSpeaking = true
      speakBtn.innerText = "Detener Reproducción"
    }

    utterance.onend = () => {
      isSpeaking = false
      speakBtn.innerText = "Reproducir Texto"
    }

    synth.speak(utterance)
  }
})

// Ajustar el tamaño de la cámara cuando la página se carga
window.addEventListener("load", () => {
  // Dar tiempo a que AR.js inicialice
  setTimeout(() => {
    const arCanvas = document.querySelector(".a-canvas")
    if (arCanvas) {
      arCanvas.style.width = "100%"
      arCanvas.style.height = "100%"
      arCanvas.style.objectFit = "cover"
      arCanvas.style.position = "absolute"
      arCanvas.style.top = "0"
      arCanvas.style.left = "0"
      console.log("Canvas ajustado")
    }
  }, 1000)
})

// Detectar si es un dispositivo móvil
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
if (isMobile) {
  // Prevenir zoom en iOS
  document.addEventListener("gesturestart", (e) => {
    e.preventDefault()
  })
}



