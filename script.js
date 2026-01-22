// ==========================================
// JAVASCRIPT FOR WEDDING PAGE
// ==========================================

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // ACTIVE NAVIGATION
    // ==========================================
    
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // ==========================================
    // SHOW/HIDE GUESTS FIELD
    // ==========================================
    
    const attendanceSelect = document.getElementById('attendance');
    const guestsGroup = document.getElementById('guestsGroup');
    
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            guestsGroup.style.display = 'block';
        } else {
            guestsGroup.style.display = 'none';
            document.getElementById('guests').value = 0;
        }
    });
    
    // ==========================================
    // RSVP FORM HANDLING (CON FORMSUBMIT AJAX)
    // ==========================================
    
    const rsvpForm = document.getElementById('rsvpForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const submitButton = document.querySelector('.submit-button'); // Para efecto de carga
    
    rsvpForm.addEventListener('submit', function(e) {
        // 1. Prevenir el envío tradicional (recarga de página)
        e.preventDefault();
        
        // 2. Efecto visual de "Cargando"
        const originalBtnText = submitButton.innerText;
        submitButton.innerText = "ENVIANDO...";
        submitButton.disabled = true;
        submitButton.style.opacity = "0.7";
        
        // 3. Recolectar datos y formatearlos para el correo
        const formData = {
            // Configuraciones de FormSubmit
            _subject: "Nueva Confirmación: Boda Valeria & Manuel",
            _template: "table", // Llega como tabla bonita
            _captcha: "false",  // Desactiva captcha para prueba rápida
            
            // Datos del formulario (Nombres en español para el correo)
            Nombre: document.getElementById('name').value,
            Email: document.getElementById('email').value,
            Telefono: document.getElementById('phone').value,
            Asistencia: document.getElementById('attendance').value,
            Invitados_Extra: document.getElementById('guests').value,
            Alergias: document.getElementById('dietary').value,
            Mensaje: document.getElementById('message').value,
            Cancion: document.getElementById('song').value
        };
        
        // 4. Enviar usando Fetch (AJAX)
        fetch('https://formsubmit.co/ajax/fbaezvaleria@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            
            // 5. Éxito: Ocultar form y mostrar mensaje
            rsvpForm.style.display = 'none';
            confirmationMessage.style.display = 'block';
            confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Hubo un error al enviar tu confirmación. Por favor intenta de nuevo.');
            
            // Restaurar el botón si falló
            submitButton.innerText = originalBtnText;
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
        });
    });
    
    // ==========================================
    // FADE-IN ANIMATION ON SCROLL
    // ==========================================
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function handleScrollAnimation() {
        const animatedElements = document.querySelectorAll('.timeline-item, .info-card');
        
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configurar estilos iniciales
    document.querySelectorAll('.timeline-item, .info-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation(); // Ejecutar al cargar
    
    // ==========================================
    // FORM VALIDATION (UX)
    // ==========================================
    
    // Validar email al salir del campo
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value) && this.value !== '') {
            this.style.borderColor = 'red';
        } else {
            this.style.borderColor = ''; // Restaurar color por defecto (definido en CSS)
        }
    });
    
    // Limitar teléfono a números
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d\s\-()]/g, '');
    });
    
    // Capitalizar nombre
    document.getElementById('name').addEventListener('blur', function() {
        this.value = capitalizeName(this.value);
    });
    
    // ==========================================
    // COUNTDOWN (CORREGIDO)
    // ==========================================
    
    function updateCountdown() {
        // FECHA CORRECTA: 9 de Mayo 2026, 4:30 PM
        const weddingDate = new Date('2026-05-09T16:30:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            if (distance > 0) {
                countdownElement.innerHTML = `
                    <div class="countdown-item"><span class="countdown-number">${days}</span><span class="countdown-label">Días</span></div>
                    <div class="countdown-item"><span class="countdown-number">${hours}</span><span class="countdown-label">Hrs</span></div>
                    <div class="countdown-item"><span class="countdown-number">${minutes}</span><span class="countdown-label">Min</span></div>
                    <div class="countdown-item"><span class="countdown-number">${seconds}</span><span class="countdown-label">Seg</span></div>
                `;
            } else {
                countdownElement.innerHTML = "¡Hoy es el gran día!";
            }
        }
    }
    
    if (document.getElementById('countdown')) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }
    
    // ==========================================
    // PRELOADER
    // ==========================================
    
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });
    
});

// ==========================================
// GLOBAL FUNCTIONS (OUTSIDE DOMContentLoaded)
// ==========================================

// Función para copiar CLABE (Llamada desde HTML onclick)
function copyToClipboard() {
    const clabeElement = document.getElementById("clabeText");
    if(!clabeElement) return; // Seguridad

    const clabe = clabeElement.innerText;
    
    navigator.clipboard.writeText(clabe).then(function() {
        const btn = document.querySelector(".copy-btn");
        const originalText = btn.innerHTML;
        
        // Feedback visual
        btn.innerHTML = "¡Copiado!";
        btn.style.backgroundColor = "var(--color-accent)";
        btn.style.color = "var(--color-bg-main)";
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--color-accent)";
        }, 2000); 
    }).catch(function(err) {
        console.error('Error al copiar: ', err);
        alert("No se pudo copiar automáticamente. La CLABE es: " + clabe);
    });
}

// Utilidad para capitalizar nombres
function capitalizeName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

