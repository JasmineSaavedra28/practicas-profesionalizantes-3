class WCLoginFormView extends HTMLElement {
	constructor() {
		super();
		this._onSubmit = this.onSubmit.bind(this);
	}

	connectedCallback() {
		this.innerHTML = `
			<div class="wc-auth-card w3-white w3-padding-large">
				<div class="wc-auth-header">
					<h2>INICIO DE SESIÓN</h2>
					<p>Accede a los endpoints protegidos de la API.</p>
				</div>
				<div class="wc-auth-field">
					<input type="text" id="loginUsername" class="w3-input w3-round" placeholder="Usuario">
				</div>
				<div class="wc-auth-field">
					<input type="password" id="loginPassword" class="w3-input w3-round" placeholder="Contraseña">
				</div>
				<button id="loginSubmit" class="w3-button w3-primary w3-round w3-block wc-auth-action">Iniciar Sesión</button>
				<div class="wc-auth-footer">¿No tienes cuenta? Regístrate en el panel de la derecha.</div>
			</div>
		`;
		this.querySelector('#loginSubmit').addEventListener('click', this._onSubmit);
	}

	disconnectedCallback() {
		this.querySelector('#loginSubmit')?.removeEventListener('click', this._onSubmit);
	}

	onSubmit() {
		const username = this.querySelector('#loginUsername').value.trim();
		const password = this.querySelector('#loginPassword').value;
		this.dispatchEvent(new CustomEvent('login', {
			detail: { username, password },
			bubbles: true,
			composed: true
		}));
	}

	static get observedAttributes() {
		return ['disabled'];
	}

	attributeChangedCallback(name) {
		if (name === 'disabled') {
			const disabled = this.hasAttribute('disabled');
			this.querySelectorAll('input, button').forEach(el => el.disabled = disabled);
		}
	}
}

customElements.define('wc-login-form-view', WCLoginFormView);
