async function cargarMateriales(){

const res = await fetch("http://localhost:3000/materiales");
const data = await res.json();

const tbody = document.querySelector("#tabla tbody");

tbody.innerHTML="";

data.forEach(m=>{

tbody.innerHTML += `
<tr>
<td>${m.id}</td>
<td>${m.nombre}</td>
<td>${m.cantidad}</td>
<td>${m.unidad}</td>
</tr>
`;

});

}

cargarMateriales();

// Agregar material
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const unidad = document.getElementById('unidad').value;
    await fetch('http://localhost:3000/materiales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, cantidad, unidad })
    });
    cargarMateriales();
    e.target.reset();
});

// Comprar
document.getElementById('buyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('buyId').value;
    const cantidad = parseFloat(document.getElementById('buyCantidad').value);
    await fetch(`http://localhost:3000/comprar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
    });
    cargarMateriales();
    e.target.reset();
});

// Vender
document.getElementById('sellForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('sellId').value;
    const cantidad = parseFloat(document.getElementById('sellCantidad').value);
    await fetch(`http://localhost:3000/vender/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad })
    });
    cargarMateriales();
    e.target.reset();
});