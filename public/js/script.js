// Weapon creation form
document.getElementById('weaponForm').addEventListener('submit', async e => {
  e.preventDefault();

  const weapon = {
    name_weapon: document.getElementById('name_weapon').value,
    damage: parseFloat(document.getElementById('damage').value),
    range: parseFloat(document.getElementById('range').value),
    cooldown: parseFloat(document.getElementById('cooldown').value),
    sprite: document.getElementById('sprite').value,
    material: document.getElementById('material').value,
    skill: {
      skill_name: document.getElementById('skill_name').value,
      active: document.getElementById('skill_active').value === 'true',
    },
    type_weapon: document.getElementById('type_weapon').value,
    level: {
      multiplier_damage: parseFloat(document.getElementById('multiplier_damage').value),
      multiplier_range: parseFloat(document.getElementById('multiplier_range').value),
      multiplier_cooldown: parseFloat(document.getElementById('multiplier_cooldown').value),
    },
  };

  try {
    const response = await fetch('http://localhost:3000/create-weapon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weapon),
    });

    const result = await response.text();
    showResponseMessage(result, response.ok);

    if (response.ok) {
      // Clear weapon form
      e.target.reset();
      loadWeapons(); // Refresh weapon dropdown
    }
  } catch (err) {
    showResponseMessage('Network or server error', false);
    console.error(err);
  }
});

// Player creation form
document.getElementById('playerForm').addEventListener('submit', async e => {
  e.preventDefault();

  const player = {
    user_name: document.getElementById('user_name').value,
    points: parseInt(document.getElementById('points').value),
    id_weapon: parseInt(document.getElementById('weaponSelect').value),
  };

  try {
    const response = await fetch('http://localhost:3000/create-player', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });

    const result = await response.text();
    showResponseMessage(result, response.ok);

    if (response.ok) {
      e.target.reset();
      loadPlayers();
    }
  } catch (err) {
    showResponseMessage('Network or server error', false);
    console.error(err);
  }
});

// Show feedback message in #response element
function showResponseMessage(message, success) {
  const resBox = document.getElementById('response');
  resBox.className = 'alert mt-4';
  resBox.classList.add(success ? 'alert-success' : 'alert-danger');
  resBox.textContent = message;
  resBox.classList.remove('d-none');
}

// Load existing weapons into dropdown
async function loadWeapons() {
  try {
    const response = await fetch('http://localhost:3000/weapons');
    const weapons = await response.json();

    const select = document.getElementById('weaponSelect');
    select.innerHTML = '<option value="">-- Select a Weapon --</option>';

    weapons.forEach(w => {
      const option = document.createElement('option');
      option.value = w.id_weapon;
      option.textContent = w.name_weapon;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading weapons:', err);
  }
}

// Load players with delete button
async function loadPlayers() {
  try {
    const response = await fetch('http://localhost:3000/players');
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
            <button class="btn btn-danger mt-3 delete-player-btn">Delete Player</button>
          </div>
        </div>
      `;

      // Delete button handler
      card.querySelector('.delete-player-btn').addEventListener('click', () => {
        if (confirm(`Delete player "${player.user_name}"?`)) {
          deletePlayer(player.user_name);
        }
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

// Delete player by username
async function deletePlayer(user_name) {
  try {
    const response = await fetch(`http://localhost:3000/player/${encodeURIComponent(user_name)}`, {
      method: 'DELETE',
    });

    const result = await response.text();
    showResponseMessage(result, response.ok);

    if (response.ok) loadPlayers();
  } catch (err) {
    showResponseMessage('Network or server error', false);
    console.error(err);
  }
}

// Initial loads
loadWeapons();
loadPlayers();
