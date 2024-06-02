let currentPlayer = 'X';
let noPartida = 1;
const cells = document.querySelectorAll('.celda');
const imagen = document.getElementById('arbolPrincipal');
const btn_reiniciar = document.getElementById('reiniciar');
const btn_formatear = document.getElementById('formatear')
const txt_no_partida = document.getElementById('noPartida');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

document.getElementById('reiniciar').addEventListener('click', resetGame);

document.getElementById('formatear').addEventListener('click', formatGame);

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    const celda_usada = document.querySelector(`.celda[data-index="${index}"]`);
    if (celda_usada.textContent == '') {
        checkWin(index, event);
    }
}

function checkWin(index, event) {
    fetch('http://localhost:3000/add_movement', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cell: index,
            cpu_first_player: false
        })
    })
    .then(response => response.json())
    .then(data => {
        imagen.setAttribute('src', data['tree_url'])
        event.target.textContent = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if(data['isWinner'] == false && data['cpu_movement'] != -1){
            const celda_usada_dos = document.querySelector(`.celda[data-index="${data['cpu_movement']}"]`);
            if(celda_usada_dos){
                celda_usada_dos.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            } else{
                console.log('La celda no existe')
            }
        } else if(data['isWinner'] == true && data['cpu_movement'] == -1){
            btn_reiniciar.classList.remove('hideBtn');
            btn_formatear.classList.remove('hideBtn');
            setTimeout(() => alert(`X ha ganado!`), 100);
        } else if(data['isWinner'] == false && data['cpu_movement'] == -1){
            btn_reiniciar.classList.remove('hideBtn');
            btn_formatear.classList.remove('hideBtn');
            setTimeout(() => alert(`Empate!`), 100);
        } else{
            const celda_usada_dos = document.querySelector(`.celda[data-index="${data['cpu_movement']}"]`);
            if(celda_usada_dos){
                celda_usada_dos.textContent = currentPlayer;
            } else{
                console.log('La celda no existe')
            }
            btn_reiniciar.classList.remove('hideBtn');
            btn_formatear.classList.remove('hideBtn');
            setTimeout(() => alert(`O ha ganado!`), 100);
        }
    })
    .catch((error)=> console.error('Error: ', error))
}

function resetGame() {
    fetch('http://localhost:3000/reset_game')
    .then(response => response.json())
    .then(data => {
        imagen.setAttribute('src', data['tree_url'])
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick);
        });
        currentPlayer = 'X';
        noPartida += 1;
        btn_reiniciar.classList.add('hideBtn')
        btn_formatear.classList.add('hideBtn')
        txt_no_partida.textContent = "Partida #" + noPartida;
    })
    .catch((error)=> console.error('Error: ', error))
}

function formatGame() {
    fetch('http://localhost:3000/format_game')
    .then(response => response.json())
    .then(data => {
        imagen.setAttribute('src', data['tree_url'])
        cells.forEach(cell => {
            cell.textContent = '';
            cell.addEventListener('click', handleCellClick);
        });
        currentPlayer = 'X';
        noPartida = 1;
        btn_reiniciar.classList.add('hideBtn')
        btn_formatear.classList.add('hideBtn')
        txt_no_partida.textContent = "Partida #" + noPartida;
    })
    .catch((error)=> console.error('Error: ', error))
}
