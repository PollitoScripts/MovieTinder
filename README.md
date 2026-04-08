# 🍿 MovieTinder - PollitoScripts

![Versión](https://img.shields.io/badge/version-1.0.0-orange)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

**MovieTinder** es una aplicación web interactiva diseñada para acabar con el dilema eterno de: *"¿Qué vemos hoy?"*. Inspirada en la interfaz de Tinder, permite a dos personas conectar en una sala privada, deslizar películas y encontrar un **Match** instantáneo cuando ambos coinciden en una elección.

---

## ✨ Características Principales

-   **Salas en Tiempo Real:** Crea una sala única y compártela con tu pareja o amigos mediante un código o enlace directo.
-   **Validación de Salas:** Sistema de seguridad que impide entrar en salas no creadas previamente.
-   **Filtros Inteligentes:** Busca por plataforma de streaming (Netflix, Disney+, HBO, Prime Video, Crunchyroll) y por género (Acción, Terror, Sci-Fi, etc.).
-   **Interfaz Swipe:** Desliza a la derecha para ❤️ y a la izquierda para ✕.
-   **Historial de Matches:** Consulta en cualquier momento las películas en las que habéis coincidido durante la sesión.
-   **Detalles Expandibles:** Toca cualquier tarjeta para leer la sinopsis y ver detalles adicionales de la película.

---

## 🛠️ Tecnologías Utilizadas

-   **Frontend:** [React.js](https://reactjs.org/) con Hooks (`useState`, `useEffect`, `useRef`).
-   **Build Tool:** [Vite](https://vitejs.dev/) para un desarrollo ultra rápido.
-   **Base de Datos:** [Firebase Realtime Database](https://firebase.google.com/) para la sincronización de "likes" entre usuarios.
-   **API de Películas:** [The Movie Database (TMDB)](https://www.themoviedb.org/) para obtener el catálogo actualizado.
-   **Librerías:** `react-tinder-card` para la mecánica de las tarjetas.

---

## 📖 Cómo usar la App
Crear Sala: Pulsa en "CREAR SALA NUEVA" para generar un código único.

Compartir: Envía el código a la otra persona. Ella deberá introducirlo en "UNIRSE".

Filtrar: Seleccionad vuestras plataformas y géneros favoritos.

Swipe: ¡Empezad a deslizar! Cuando ambos deis "Like" a la misma película, aparecerá una pantalla de ¡MATCH! y la película se guardará en vuestro historial (icono 📜).

---

## 🛡️ Notas de Seguridad
Este proyecto utiliza Firebase Realtime Database con reglas de acceso público limitado a la rama de /rooms. Las API Keys incluidas en el cliente son necesarias para la comunicación directa desde el navegador y están protegidas mediante la lógica de validación del lado del cliente.

---

## 👤 Autor
Desarrollado con ❤️ por Alejandro Tineo Morales.

GitHub: @PollitoScripts

Marca: PollitoScripts © 2026


---
