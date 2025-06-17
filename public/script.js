document.getElementById('playerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user_name = document.getElementById('user_name').value;
    const points = document.getElementById('points').value;
    const id_weapon = document.getElementById('id_weapon').value;

    const response = await fetch('/add-player', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name, points, id_weapon }),
    });

    const message = await response.text();
    document.getElementById('responseMsg').innerText = message;
});