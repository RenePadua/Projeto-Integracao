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


const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

if (navigator.share) {
    console.log("Web Share API é suportada!");
} else {
    console.log("Web Share API não é suportada neste navegador.");
}

const shareButtons = document.getElementsByClassName('shareButton');

// Handle multiple elements with the same class
for (let i = 0; i < shareButtons.length; i++) {
    shareButtons[i].addEventListener('click', function() {
        if (navigator.share) {
            navigator.share({
                title: 'Confira este site interessante!',
                text: 'Trata-se de uma Consultoria para Líderes em Saúde:',
                url: 'https://integracaoconsultoria.com.br/'
            })
            .then(() => console.log('Compartilhamento realizado com sucesso!'))
            .catch((error) => console.error('Erro ao compartilhar:', error));
        } else {
            alert('Compartilhamento não suportado neste navegador.');
        }
    });
}
