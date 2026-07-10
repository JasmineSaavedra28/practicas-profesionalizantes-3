function createElement(tag, props = {}) {
    const element = document.createElement(tag);

    for (const key in props) {
        if (key === 'textContent') {
            element.textContent = props[key];
        } else {
            element.setAttribute(key, props[key]);
        }
    }

    return element;
}

function crearCampoNombre() {
    const input = createElement('input', {
        type: 'text',
        id: 'register-name',
        class: 'w3-input w3-border w3-round',
        placeholder: 'Enter Your Name'
    });

    const label = createElement('label', {
        for: 'register-name',
        class: 'w3-col l2',
        textContent: 'Name'
    });

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(input);

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(label);
    rowDiv.appendChild(colDiv);

    rowDiv._inputRef = input;
    return rowDiv;
}

function crearCampoEmail() {
    const input = createElement('input', {
        type: 'text',
        id: 'register-email',
        class: 'w3-input w3-border w3-round',
        placeholder: 'Enter Your Email Address'
    });

    const label = createElement('label', {
        for: 'register-email',
        class: 'w3-col l2',
        textContent: 'Email'
    });

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(input);

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(label);
    rowDiv.appendChild(colDiv);

    rowDiv._inputRef = input;
    return rowDiv;
}

function crearCampoMobile() {
    const input = createElement('input', {
        type: 'text',
        id: 'register-mobile',
        class: 'w3-input w3-border w3-round',
        placeholder: 'Enter Your Mobile Number'
    });

    const label = createElement('label', {
        for: 'register-mobile',
        class: 'w3-col l2',
        textContent: 'Mobile Number'
    });

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(input);

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(label);
    rowDiv.appendChild(colDiv);

    rowDiv._inputRef = input;
    return rowDiv;
}

function crearCampoPassword() {
    const input = createElement('input', {
        type: 'password',
        id: 'register-password',
        class: 'w3-input w3-border w3-round',
        placeholder: 'Enter Password'
    });

    const label = createElement('label', {
        for: 'register-password',
        class: 'w3-col l2',
        textContent: 'Password'
    });

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(input);

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(label);
    rowDiv.appendChild(colDiv);

    rowDiv._inputRef = input;
    return rowDiv;
}

function crearCampoConfirmPassword() {
    const input = createElement('input', {
        type: 'password',
        id: 'register-confirm-password',
        class: 'w3-input w3-border w3-round',
        placeholder: 'Confirm Password'
    });

    const label = createElement('label', {
        for: 'register-confirm-password',
        class: 'w3-col l2',
        textContent: 'Confirm Password'
    });

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(input);

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(label);
    rowDiv.appendChild(colDiv);

    rowDiv._inputRef = input;
    return rowDiv;
}

function crearEspaciador() {
    const colDiv = createElement('div', { class: 'w3-col l2' });
    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(colDiv);
    return rowDiv;
}

function crearBotonRegister() {
    const icon = createElement('i', { class: 'fa fa-fw fa-lock' });
    const btn = createElement('button', { type: 'button', class: 'w3-button w3-primary w3-round' });
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(' Register'));

    const colDiv = createElement('div', { class: 'w3-col l10' });
    colDiv.appendChild(btn);

    const colEmpty = createElement('div', { class: 'w3-col l2' });

    const rowDiv = createElement('div', { class: 'w3-row w3-margin-bottom' });
    rowDiv.appendChild(colEmpty);
    rowDiv.appendChild(colDiv);

    rowDiv._btnRef = btn;
    return rowDiv;
}

class WCRegisterFormView extends HTMLElement {
    constructor() {
        super();

        this.campoNombre = crearCampoNombre();
        this.campoEmail = crearCampoEmail();
        this.campoMobile = crearCampoMobile();
        this.campoPassword = crearCampoPassword();
        this.campoConfirmPassword = crearCampoConfirmPassword();
        this.espaciador = crearEspaciador();
        this.botonRegister = crearBotonRegister();

        this.nombreInput = this.campoNombre._inputRef;
        this.emailInput = this.campoEmail._inputRef;
        this.mobileInput = this.campoMobile._inputRef;
        this.passwordInput = this.campoPassword._inputRef;
        this.confirmPasswordInput = this.campoConfirmPassword._inputRef;
        this.registerBtn = this.botonRegister._btnRef;

        const form = createElement('form', {});
        form.appendChild(this.campoNombre);
        form.appendChild(this.campoEmail);
        form.appendChild(this.campoMobile);
        form.appendChild(this.campoPassword);
        form.appendChild(this.campoConfirmPassword);
        form.appendChild(this.espaciador);
        form.appendChild(this.botonRegister);

        const contentDiv = createElement('div', { class: 'w3-padding-large' });
        contentDiv.appendChild(form);

        const cardDiv = createElement('div', { class: 'w3-white w3-round w3-margin-bottom w3-border' });
        cardDiv.appendChild(contentDiv);

        const colDiv = createElement('div', { class: 'w3-col l6' });
        colDiv.appendChild(cardDiv);

        const rowDiv = createElement('div', { class: 'w3-row-padding w3-stretch' });
        rowDiv.appendChild(colDiv);

        const paddingDiv = createElement('div', { style: 'padding:16px 32px' });
        paddingDiv.appendChild(rowDiv);

        const mainDiv = createElement('div', { class: 'w3-main', style: 'margin-top:54px' });
        mainDiv.appendChild(paddingDiv);

        const appDiv = createElement('div', { id: 'app' });
        appDiv.appendChild(mainDiv);

        this.appendChild(appDiv);

        this._onRegisterClick = this.onRegisterClick.bind(this);
    }

    async onRegisterClick() {
        const name = this.nombreInput.value.trim();
        const email = this.emailInput.value.trim();
        const mobile = this.mobileInput.value.trim();
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (!name || !email || !mobile || !password || !confirmPassword) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        alert(`Intentando registrar:\nNombre: ${name}\nEmail: ${email}\nMobile: ${mobile}`);
    }

    connectedCallback() {
        this.registerBtn.addEventListener('click', this._onRegisterClick);
    }

    disconnectedCallback() {
        this.registerBtn.removeEventListener('click', this._onRegisterClick);
    }
}

customElements.define('wc-register-form-view', WCRegisterFormView);
