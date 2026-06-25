/**
 * ============================================================================
 *  PREMIUM CARS · Archivado automático de contratos firmados
 * ============================================================================
 *
 *  QUÉ HACE
 *  --------
 *  Cada pocos minutos revisa el correo. Cuando llega un email con un contrato
 *  firmado adjunto, detecta a qué CLIENTE pertenece (por el nombre que aparece
 *  en el asunto o el cuerpo) y guarda el adjunto dentro de la carpeta de ese
 *  cliente en Google Drive, dentro de "PREMIUM CARS VERA".
 *
 *  EJEMPLO
 *  -------
 *    Asunto:  "Contrato firmado - WADRIA GUERRERO"   (+ PDF adjunto)
 *        |
 *        v
 *    Se guarda en:  PREMIUM CARS VERA / WADRIA GUERRERO / <contrato>.pdf
 *
 *  CÓMO SE INSTALA (una sola vez)
 *  ------------------------------
 *  1. Entra en https://script.google.com con la cuenta donde RECIBES los
 *     correos y donde está la carpeta  ->  adriaguerrerohdez@gmail.com
 *  2. "Proyecto nuevo", borra lo que haya y pega este archivo entero.
 *  3. En CONFIG, pon el ID de tu carpeta "PREMIUM CARS VERA" (abajo se explica
 *     cómo sacarlo).
 *  4. Arriba, en el selector de función elige  "instalar"  y pulsa Ejecutar.
 *     Acepta los permisos que pida Google.
 *     (Eso deja el robot funcionando solo cada 5 minutos.)
 *  5. Listo. Manda un correo de prueba y mira la carpeta del cliente.
 *
 *  CÓMO SE SACA EL ID DE LA CARPETA
 *  --------------------------------
 *  Abre "PREMIUM CARS VERA" en Drive y mira la barra de direcciones:
 *    https://drive.google.com/drive/folders/XXXXXXXXXXXXXXXXXXX
 *  Ese trozo  XXXXXXXXXXXXXXXXXXX  es el ID que tienes que pegar abajo.
 * ============================================================================
 */

// ============================== CONFIG ======================================

var CONFIG = {
  // ID de la carpeta "PREMIUM CARS VERA" (pega el tuyo aquí):
  CARPETA_PREMIUMCARS_ID: 'PEGA_AQUI_EL_ID_DE_LA_CARPETA',

  // Solo procesa correos ENVIADOS DESDE esta dirección (cambia REMITENTE si
  // quieres otra), con adjunto y no procesados. El cliente se decide por el
  // nombre detectado (asunto/cuerpo). Así solo entra "lo de los clientes".
  REMITENTE: 'adriaguerrero314@gmail.com',
  CONSULTA: 'has:attachment ' +
            '-label:premiumcars-archivado -label:premiumcars-revisar newer_than:30d',

  // Etiquetas que pone Gmail para no repetir trabajo.
  ETIQUETA_OK: 'premiumcars-archivado',      // archivado correctamente
  ETIQUETA_REVISAR: 'premiumcars-revisar',   // no se supo a qué cliente iba

  // Cada cuántos minutos se ejecuta solo (1, 5, 10, 15 o 30).
  MINUTOS: 5
};

// ============================ FUNCIÓN PRINCIPAL =============================

function archivarContratos() {
  var raiz = DriveApp.getFolderById(CONFIG.CARPETA_PREMIUMCARS_ID);
  var nombresCliente = listarNombresDeCarpetas_(raiz);   // ["WADRIA GUERRERO", ...]
  var consulta = 'from:' + CONFIG.REMITENTE + ' ' + CONFIG.CONSULTA;
  var hilos = GmailApp.search(consulta);

  Logger.log('Correos a revisar: ' + hilos.length);

  hilos.forEach(function (hilo) {
    var algoArchivado = false;

    hilo.getMessages().forEach(function (msg) {
      var adjuntos = adjuntosUtiles_(msg);
      if (adjuntos.length === 0) return;

      var cliente = detectarCliente_(msg, nombresCliente);
      if (!cliente) {
        Logger.log('  [!] Sin cliente detectado en: "' + msg.getSubject() + '"');
        return;
      }

      var carpeta = obtenerOcrearCarpeta_(raiz, cliente);
      adjuntos.forEach(function (adj) {
        carpeta.createFile(adj.copyBlob()).setName(adj.getName());
        Logger.log('  [OK] "' + adj.getName() + '"  ->  ' + cliente);
      });
      algoArchivado = true;
    });

    // Marca el hilo para no volver a procesarlo.
    hilo.addLabel(obtenerEtiqueta_(algoArchivado ? CONFIG.ETIQUETA_OK
                                                 : CONFIG.ETIQUETA_REVISAR));
  });
}

// ============================= DETECCIÓN ====================================

/**
 * Decide a qué cliente pertenece el correo.
 *
 * Estrategia principal: busca, entre los nombres de carpeta que YA existen,
 * cuál aparece escrito en el asunto o el cuerpo del correo. Si encajan varios,
 * gana el más largo (así "MARTINA CARRASCO LOBATO" gana a "LOBATO").
 *
 * Plan B: si no encuentra ninguno, usa la convención de asunto
 * "Contrato firmado - NOMBRE" y se queda con lo que va tras el guion.
 */
function detectarCliente_(msg, nombresCliente) {
  var texto = normalizar_(msg.getSubject() + ' \n ' + msg.getPlainBody());

  var mejor = '';
  nombresCliente.forEach(function (nombre) {
    var clave = normalizar_(nombre);
    if (clave.length >= 3 && texto.indexOf(clave) !== -1 &&
        clave.length > normalizar_(mejor).length) {
      mejor = nombre;
    }
  });
  if (mejor) return mejor;

  // Plan B: el nombre va tras un guion / dos puntos en el asunto.
  var partes = msg.getSubject().split(/[-–—:]/);
  if (partes.length > 1) {
    var posible = partes[partes.length - 1].trim();
    if (posible.length >= 3) return posible;
  }
  return '';
}

/** MAYÚSCULAS + sin tildes + espacios normalizados, para comparar sin líos. */
function normalizar_(s) {
  return (s || '')
    .toString()
    .toUpperCase()
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U')
    .replace(/Ñ/g, 'N')
    .replace(/Ç/g, 'C')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================ AYUDANTES DRIVE ===============================

function listarNombresDeCarpetas_(raiz) {
  var nombres = [];
  var it = raiz.getFolders();
  while (it.hasNext()) nombres.push(it.next().getName());
  return nombres;
}

function obtenerOcrearCarpeta_(raiz, nombre) {
  var it = raiz.getFoldersByName(nombre);
  return it.hasNext() ? it.next() : raiz.createFolder(nombre);
}

// ============================ AYUDANTES GMAIL ===============================

/** Adjuntos reales (descarta imágenes incrustadas y ficheros minúsculos). */
function adjuntosUtiles_(msg) {
  return msg
    .getAttachments({ includeInlineImages: false, includeAttachments: true })
    .filter(function (a) { return a.getSize() > 3000; });
}

function obtenerEtiqueta_(nombre) {
  return GmailApp.getUserLabelByName(nombre) || GmailApp.createLabel(nombre);
}

// ====================== INSTALACIÓN (ejecútalo 1 vez) ======================

/**
 * Ejecuta ESTA función una sola vez (selector de función -> "instalar").
 * Acepta los permisos y deja programado el archivado automático.
 */
function instalar() {
  // Evita disparadores duplicados si lo ejecutas más de una vez.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'archivarContratos') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('archivarContratos')
    .timeBased()
    .everyMinutes(CONFIG.MINUTOS)
    .create();

  // Lánzalo una vez ahora para procesar lo que ya haya en la bandeja.
  archivarContratos();
  Logger.log('Instalado. Se ejecutará solo cada ' + CONFIG.MINUTOS + ' minutos.');
}
