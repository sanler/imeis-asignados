# 📱 IMEIs Asignados

Aplicación web construida con **React** (frontend) y **Node.js** (backend) para gestionar y asignar rangos de IMEIs automáticamente desde archivos Excel.

---

## 🚀 Instalación (Windows paso a paso)

### 1. Instala Node.js (si no lo tienes)

Opción 1:

- Desde el centro de Software o poniendo en SIETE 'instalar node'.

Opción 2:

- Ve a [https://nodejs.org/](https://nodejs.org/)
- Descarga la **versión LTS** (recomendada)
- Ejecuta el instalador y acepta todo por defecto
- Reinicia el ordenador si te lo pide

### 2. Abre la terminal (consola)

- Presiona `Windows + R`, escribe `cmd` y pulsa Enter  
  *(o escribe `cmd` en el menú de inicio y pulsa Enter)*

---

## ⚙️ Cómo usar la aplicación

### 1. Clona este repositorio

```bash
git clone https://github.com/sanler/imeis-asignados.git
cd imeis-asignados
```

### 2. Instala las dependencias del backend

```bash
npm install
```

## 🚀 Ejecuta el programa

### Opción 1:

```bash
  - Ejecuta el archivo start.bat con doble clic
```



### Opción 2: 
```bash
  - Ejecuta el servidor backend (Node.js):

      node server.js

  - Inicia el frontend (React):

      En otra consola (nueva ventana), ejecuta:
        
        cd imeis-asignados
        npm start
   
```
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
