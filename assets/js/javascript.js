// Seleciona todas as content-box
const contentBoxes = document.querySelectorAll(".content-box");

// Adiciona evento de clique
contentBoxes.forEach(box => {
    box.addEventListener("click", () => {
        // Remove a classe 'active' de outras boxes
        contentBoxes.forEach(otherBox => {
            if (otherBox !== box) {
                otherBox.classList.remove("active");
            }
        });
        // Alterna a classe 'active' na box clicada
        box.classList.toggle("active");
    });
});
