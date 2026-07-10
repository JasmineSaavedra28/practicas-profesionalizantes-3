class WCRegisterFormView extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="wc-auth-card w3-white w3-padding-large">
				<div class="wc-auth-header">
					<h2>REGISTRO</h2>
					<p>Crea un usuario para acceder a las pruebas de autorización.</p>
				</div>
				<div class="wc-auth-field">
					<input type="text" id="registerUsername" class="w3-input w3-round" placeholder="Usuario">
				</div>
				<div class="wc-auth-field">
					<input type="password" id="registerPassword" class="w3-input w3-round" placeholder="Contraseña">
				</div>
				<button id="registerSubmit" class="w3-button w3-secondary w3-round w3-block wc-auth-action">Registrarse</button>
				<div class="wc-auth-footer">El registro no requiere datos personales adicionales.</div>
			</div>
		`;
		this.querySelector('#registerSubmit').addEventListener('click', () => this.onSubmit());
	}

	onSubmit() {
		const username = this.querySelector('#registerUsername').value.trim();
		const password = this.querySelector('#registerPassword').value;
		this.dispatchEvent(new CustomEvent('register', {
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

customElements.define('wc-register-form-view', WCRegisterFormView);
