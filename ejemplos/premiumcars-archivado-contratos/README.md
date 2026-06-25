# PREMIUM CARS · Archivado automático de contratos firmados

Ejemplo **sencillo y funcional**: cuando un contrato firmado llega por email, se
guarda **solo** en la carpeta del cliente correcto dentro de Google Drive.

```
   📧  Email con el contrato firmado (PDF)
        Asunto: "Contrato firmado - WADRIA GUERRERO"
                        │
                        ▼
   🤖  La automatización lee el correo y detecta el cliente
                        │
                        ▼
   📁  PREMIUM CARS VERA / WADRIA GUERRERO / contrato.pdf
```

No hace falta ningún servidor ni programa abierto: es un **Google Apps Script**
que vive dentro de tu propia cuenta de Google y se ejecuta solo cada 5 minutos.

---

## 🧠 Cómo decide la carpeta del cliente

Mira el **asunto** y el **cuerpo** del correo y los compara con los nombres de
las carpetas que **ya existen** dentro de `PREMIUM CARS VERA`. Se queda con la
que coincide; si encajan varias, gana la más específica (la más larga), así
`MARTINA CARRASCO LOBATO` gana a `LOBATO`.

- Funciona aunque escribas el nombre en mayúsculas/minúsculas o con tildes.
- Si no reconoce a nadie, no inventa: etiqueta el correo como
  `premiumcars-revisar` para que lo mires a mano.

> Convención recomendada para el asunto: **`Contrato firmado - NOMBRE CLIENTE`**

---

## ⚙️ Instalación (una sola vez, ~3 min)

1. Entra en **https://script.google.com** con la cuenta donde **recibes** los
   correos y donde está la carpeta → **adriaguerrerohdez@gmail.com**.
2. **Proyecto nuevo** → borra el código de ejemplo → pega el contenido de
   [`ArchivarContratos.gs`](./ArchivarContratos.gs).
3. Saca el **ID de la carpeta** `PREMIUM CARS VERA`: ábrela en Drive y copia el
   trozo final de la URL:
   ```
   https://drive.google.com/drive/folders/ESTE_TROZO_ES_EL_ID
   ```
   Pégalo en `CONFIG.CARPETA_PREMIUMCARS_ID`.
4. Arriba, en el selector de función, elige **`instalar`** y pulsa **Ejecutar**.
   Acepta los permisos de Google.
5. ¡Hecho! A partir de ahora archiva solo cada 5 minutos.

---

## ✅ Cómo probarlo (la demo)

1. Desde **adriaguerrero314@gmail.com**, manda un correo a
   **adriaguerrerohdez@gmail.com** con:
   - **Asunto:** `Contrato firmado - WADRIA GUERRERO`
   - **Adjunto:** un PDF cualquiera (hace de contrato firmado).
2. Espera a la siguiente ejecución (máx. 5 min) **o** entra al script y pulsa
   **Ejecutar** sobre la función `archivarContratos` para verlo al instante.
3. Abre en Drive `PREMIUM CARS VERA / WADRIA GUERRERO`: el PDF estará ahí.

Tienes el correo listo para copiar en [`correo-de-prueba.md`](./correo-de-prueba.md).

---

## 🔧 Ajustes rápidos (en `CONFIG`)

| Quieres…                                   | Cambia…                                            |
| ------------------------------------------ | -------------------------------------------------- |
| Que mire otros correos                     | `CONSULTA` (sintaxis de búsqueda de Gmail)         |
| Que se ejecute más a menudo                | `MINUTOS` (1, 5, 10, 15 o 30)                      |
| Otra carpeta raíz                          | `CARPETA_PREMIUMCARS_ID`                            |

---

## 📌 Notas

- Es un **ejemplo**: archiva cualquier adjunto del correo que reconoce. En real
  se puede afinar (solo PDFs, renombrar con la fecha, avisar por email, etc.).
- Si un cliente **no tiene carpeta todavía**, el script se la crea con el nombre
  detectado.
- Todo ocurre dentro de tu cuenta de Google; no se envían datos a terceros.
