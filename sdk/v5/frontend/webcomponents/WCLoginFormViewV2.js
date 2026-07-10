function createLoginField(id, placeholder, type = 'text') {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.className = 'w3-input w3-round';
    input.placeholder = placeholder;

    const field = document.createElement('div');
    field.className = 'wc-auth-field';
    field.appendChild(input);

    field._inputRef = input;
    return field;
}

function createLoginButton() {
    const button = document.createElement('button');
    button.id = 'loginSubmit';
    button.className = 'w3-button w3-primary w3-round w3-block wc-auth-action';
    button.textContent = 'Iniciar Sesión';

    button._btnRef = button;
    return button;
}

class WCLoginFormView extends HTMLElement {
    constructor() {
        super();

        this.usernameField = createLoginField('loginUsername', 'Usuario');
        this.passwordField = createLoginField('loginPassword', 'Contraseña', 'password');
        this.submitButton = createLoginButton();

        this.usernameInput = this.usernameField._inputRef;
        this.passwordInput = this.passwordField._inputRef;
        this.loginBtn = this.submitButton._btnRef;

        const card = document.createElement('div');
        card.className = 'wc-auth-card w3-white w3-padding-large';

        const header = document.createElement('div');
        header.className = 'wc-auth-header';

        const title = document.createElement('h2');
        title.textContent = 'INICIO DE SESIÓN';

        const description = document.createElement('p');
        description.textContent = 'Accede a los endpoints protegidos de la API.';

        header.appendChild(title);
        header.appendChild(description);

        const footer = document.createElement('div');
        footer.className = 'wc-auth-footer';
        footer.textContent = '¿No tienes cuenta? Regístrate en el panel de la derecha.';

        card.appendChild(header);
        card.appendChild(this.usernameField);
        card.appendChild(this.passwordField);
        card.appendChild(this.submitButton);
        card.appendChild(footer);

        this.appendChild(card);
        this._onLoginSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        this.dispatchEvent(new CustomEvent('login', {
            detail: { username, password },
            bubbles: true,
            composed: true
        }));
    }

    connectedCallback() {
        this.loginBtn.addEventListener('click', this._onLoginSubmit);
    }

    disconnectedCallback() {
        this.loginBtn.removeEventListener('click', this._onLoginSubmit);
    }
}

customElements.define('wc-login-form-view', WCLoginFormView);
