
document.addEventListener("DOMContentLoaded", () => {
    fetch("libros.json")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#books-table tbody");
            data.forEach(libro => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.ano}</td>
                    <td>${libro.genero}</td>
                `;
                tbody.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al cargar los libros:", error));
});
