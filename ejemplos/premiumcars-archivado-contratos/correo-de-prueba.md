# Correo de prueba (para la demo)

Manda este correo **desde** `adriaguerrero314@gmail.com` **a**
`adriaguerrerohdez@gmail.com` y adjunta un PDF cualquiera (hará de contrato).

---

**Para:** adriaguerrerohdez@gmail.com
**Asunto:** Contrato firmado - WADRIA GUERRERO
**Adjunto:** contrato.pdf  *(cualquier PDF sirve para la prueba)*

**Cuerpo:**

```
Hola,

Adjunto el contrato de compraventa firmado del cliente WADRIA GUERRERO.

Un saludo.
```

---

### Qué pasará

1. El robot ve el correo (asunto contiene "contrato"/"firmado" + adjunto).
2. Detecta al cliente **WADRIA GUERRERO** (porque esa carpeta existe).
3. Guarda el PDF en `PREMIUM CARS VERA / WADRIA GUERRERO`.
4. Etiqueta el correo como `premiumcars-archivado` para no repetirlo.

### Para probar con otro cliente

Cambia el nombre del asunto por cualquiera de tus carpetas, p. ej.:

- `Contrato firmado - FERNANDO ALONSO`
- `Contrato firmado - SERGIO VILCHES`
- `Contrato firmado - MARTINA CARRASCO LOBATO`
