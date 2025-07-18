//Script-SobreNos Seleciona todas as content-box
const contentBoxes = document.querySelectorAll(".content-box");

// Adiciona evento de clique
contentBoxes.forEach(box => {
    box.addEventListener("click", () => {
        contentBoxes.forEach(otherBox => {
            if (otherBox !== box) {
                otherBox.classList.remove("active");
            }
        });
        box.classList.toggle("active");
    });
});


//Scroll Screen:
const myArrow = document.getElementById("downPage");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  myArrow.classList.toggle("hidden", scrollTop >= 20);
});

//Scroll Back To Top Button
// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0;
};

// Slide dos Logos (versão otimizada)
document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".slider-track");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slider-btn.prev");
  const nextBtn = document.querySelector(".slider-btn.next");
  const indicatorsContainer = document.getElementById("customIndicators");

  // Segurança: garante que todos os elementos existem
  if (!track || !slides.length || !prevBtn || !nextBtn || !indicatorsContainer) {
    console.warn("Slider não iniciado: elementos obrigatórios ausentes.");
    return;
  }

  let currentIndex = 0;
  const totalSlides = slides.length;

  // Criar os indicadores estilo Bootstrap
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("data-bs-slide-to", i);
    dot.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) {
      dot.classList.add("active");
      dot.setAttribute("aria-current", "true");
    }
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateSlider();
    });
    indicatorsContainer.appendChild(dot);
  });

  const indicators = indicatorsContainer.querySelectorAll("button");

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    indicators.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
      if (i === currentIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();

  // === AUTOPLAY ===
let autoplayInterval = setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlider();
}, 5000); // muda a cada 5 segundos

// Pausar autoplay ao passar o mouse
track.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
track.addEventListener("mouseleave", () => {
  autoplayInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  }, 5000);
});


// Verifica suporte à Web Share API apenas uma vez
const isShareSupported = !!navigator.share;

if (isShareSupported) {
    console.log("Web Share API é suportada!");
} else {
    console.log("Web Share API não é suportada neste navegador.");
}

const shareButtons = document.getElementsByClassName('shareButton');

// Adiciona o listener a cada botão
for (let i = 0; i < shareButtons.length; i++) {
    shareButtons[i].addEventListener('click', () => {
        if (!isShareSupported) {
            alert('Compartilhamento não suportado neste navegador.');
            return;
        }

        navigator.share({
            title: 'Confira este site interessante!',
            text: 'Trata-se de uma Consultoria para Líderes em Saúde:',
            url: 'https://integracaoconsultoria.com.br/'
        })
        .then(() => console.log('Compartilhamento realizado com sucesso!'))
        .catch((error) => console.error('Erro ao compartilhar:', error));
    });
}})