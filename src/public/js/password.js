
const form = document.getElementById('password-form');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password')
const errorMessage = document.getElementById('password-error');

form.addEventListener('submit', (e) => {

    if (password.value !== confirmPassword.value) {
  
      errorMessage.textContent = 'Las contraseñas no coinciden.';
      confirmPassword.classList.add('error-border');
    } else {
      errorMessage.textContent = '';
      confirmPassword.classList.remove('error-border');
    }
  })