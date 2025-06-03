# 📱 IMEIs Asignados

Aplicación web construida con **React** (frontend) y **Node.js** (backend) para gestionar y asignar rangos de IMEIs automáticamente desde archivos Excel.

---

## 🚀 Instalación

1. **Clona el repositorio:**

```bash
git clone https://github.com/sanler/imeis-asignados.git
cd imeis-asignados
```

2. **Instala las dependencias del backend:**

```bash
npm install
```

3. **Ejecuta el servidor backend (Node.js):**

```bash
node server.js
```

4. **Inicia el frontend (React):**

```bash
cd imeis-asignados
npm start
```

⚠️ *Asegúrate de tener Node.js instalado (recomendado v18 o superior).*

---

## 🛠️ Funcionalidad

- 📥 Lee archivos Excel (`entradas.xlsx`) con códigos.
- 🔢 Genera números de IMEI válidos según el algoritmo de Luhn.
- 📝 Inserta y modifica datos en `IMEIS.xlsx`.
- 🖥️ Interfaz web amigable para realizar el proceso con un solo clic.

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](https://opensource.org/licenses/MIT).  
Hecho con ❤️ por [sanler](https://github.com/sanler)
