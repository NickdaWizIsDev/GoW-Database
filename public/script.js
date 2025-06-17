document.getElementById('playerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    user_name: document.getElementById('user_name').value,
    points: parseInt(document.getElementById('points').value),
    weapon: {
      name_weapon: document.getElementById('name_weapon').value,
      damage: parseFloat(document.getElementById('damage').value),
      range: parseFloat(document.getElementById('range').value),
      cooldown: parseFloat(document.getElementById('cooldown').value),
      sprite: document.getElementById('sprite').value,
      material: document.getElementById('material').value,
      skill: {
        skill_name: document.getElementById('skill_name').value,
        active: document.getElementById('skill_active').value === 'true'
      },
      type_weapon: document.getElementById('type_weapon').value,
      level: {
        multiplier_damage: parseFloat(document.getElementById('multiplier_damage').value),
        multiplier_range: parseFloat(document.getElementById('multiplier_range').value),
        multiplier_cooldown: parseFloat(document.getElementById('multiplier_cooldown').value)
      }
    }
  };

  try {
    const response = await fetch('http://localhost:3000/create-full-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    const resBox = document.getElementById('response');
    resBox.classList.remove('d-none', 'alert-danger', 'alert-success');
    resBox.classList.add(response.ok ? 'alert-success' : 'alert-danger');
    resBox.textContent = result;
  } catch (err) {
    const resBox = document.getElementById('response');
    resBox.classList.remove('d-none');
    resBox.classList.add('alert-danger');
    resBox.textContent = 'Network or server error';
    console.error(err);
  }
});

async function loadPlayers() {
  const response = await fetch('/players');
  const players = await response.json();

  const container = document.getElementById('playerCards');
  container.innerHTML = '';

  players.forEach(player => {
    const card = document.createElement('div');
    card.className = 'col-md-6 col-lg-4';

    card.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">Player: ${player.user_name}</h5>
          <p class="card-text">Points: ${player.points}</p>
          <hr>
          <h6>Weapon: ${player.name_weapon}</h6>
          <ul>
            <li>Damage: ${player.damage}</li>
            <li>Range: ${player.range}</li>
            <li>Cooldown: ${player.cooldown}</li>
            <li>Type: ${player.name_type_weapon}</li>
          </ul>
          <hr>
          <h6>Skill: ${player.skill_name}</h6>
          <p>Active: ${player.active ? '✅' : '❌'}</p>
          <hr>
          <small>Level Multipliers — D: ${player.multiplier_damage}, R: ${player.multiplier_range}, C: ${player.multiplier_cooldown}</small>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Call this once when the page loads:
loadPlayers();

