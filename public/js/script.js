// ========= Utility Functions ========= //
function $(id) {
  return document.getElementById(id);
}

function showResponseMessage(message, success = true) {
  const box = $('response');
  if (!box) return;
  box.className = `alert mt-4 ${success ? 'alert-success' : 'alert-danger'}`;
  box.textContent = message;
  box.classList.remove('d-none');
}

// ========= DOM Ready ========= //
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = $('loginForm');
  const playerForm = $('playerForm');
  const weaponForm = $('weaponForm');
  const reloadBtn = $('reloadPlayersBtn');
  const weaponButtons = $('weaponButtons');
  const playerCards = $('playerCards');

  // ========= Login Page Logic ========= //
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = $('dbUser').value;
      const password = $('dbPassword').value;
      const box = $('loginStatus');

      box.classList.remove('d-none', 'alert-success', 'alert-danger');

      try {
        const res = await fetch('/connect-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, password })
        });

        const result = await res.text();
        box.textContent = result;
        box.classList.add(res.ok ? 'alert-success' : 'alert-danger');

        if (res.ok) {
          setTimeout(() => {
            window.location.href = 'app.html';
          }, 1000);
        }
      } catch (err) {
        console.error(err);
        box.textContent = 'Connection error. Check console.';
        box.classList.add('alert-danger');
      }
    });
  }

  // ========= Main App Logic ========= //
  if (playerForm) {
    playerForm.addEventListener('submit', async e => {
      e.preventDefault();

      const player = {
        user_name: $('user_name').value,
        points: parseInt($('points').value),
        id_weapon: parseInt($('selectedWeaponId').value),
      };

      if (!player.id_weapon) {
        showResponseMessage('Please select a weapon.', false);
        return;
      }

      try {
        const res = await fetch('/create-player', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(player),
        });

        const result = await res.text();
        showResponseMessage(result, res.ok);

        if (res.ok) {
          e.target.reset();
          // Reset selected weapon buttons
          [...$('weaponButtons').children].forEach(b => b.classList.remove('btn-primary'));
          $('selectedWeaponId').value = '';
          loadPlayers();
        }
      } catch (err) {
        console.error(err);
        showResponseMessage('Network or server error', false);
      }
    });
  }

  if (weaponForm) {
    weaponForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const weapon = {
        name_weapon: $('name_weapon').value,
        damage: parseFloat($('damage').value),
        range: parseFloat($('range').value),
        cooldown: parseFloat($('cooldown').value),
        sprite: $('sprite').value,
        material: $('material').value,
        skill: {
          skill_name: $('skill_name').value,
          active: $('skill_active').value === 'true',
        },
        type_weapon: $('type_weapon').value,
        level: {
          multiplier_damage: parseFloat($('multiplier_damage').value),
          multiplier_range: parseFloat($('multiplier_range').value),
          multiplier_cooldown: parseFloat($('multiplier_cooldown').value),
        },
      };

      try {
        const res = await fetch('/create-weapon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(weapon),
        });

        const result = await res.text();
        showResponseMessage(result, res.ok);
        if (res.ok) {
          e.target.reset();
          loadWeapons();
        }
      } catch (err) {
        console.error(err);
        showResponseMessage('Network or server error', false);
      }
    });
  }

  if (reloadBtn) {
    reloadBtn.addEventListener('click', loadPlayers);
  }

  if (weaponButtons) {
    loadWeapons();
  }

  if (playerCards) {
    loadPlayers();
  }
});

// ========= Load Weapons ========= //
async function loadWeapons() {
  try {
    const response = await fetch('/weapons');
    const weapons = await response.json();

    const container = document.getElementById('weaponButtons');
    const selectedInput = document.getElementById('selectedWeaponId');
    container.innerHTML = '';
    selectedInput.value = ''; // clear selection on reload

    weapons.forEach(w => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-dark d-flex align-items-center gap-2'; // flex for image + text
      btn.style.color = white;
      btn.dataset.weaponId = w.id_weapon;

      // Create image element inside button
      const img = document.createElement('img');
      img.src = w.path_sprite;  // assuming your /weapons endpoint returns path_sprite field now
      img.alt = w.name_weapon;
      img.style.width = '40px';  // adjust size
      img.style.height = '40px';
      img.style.objectFit = 'contain';
      
      btn.appendChild(img);

      // Add weapon name text after image
      const textNode = document.createTextNode(w.name_weapon);
      btn.appendChild(textNode);

      btn.addEventListener('click', () => {
        [...container.children].forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
        selectedInput.value = w.id_weapon;
      });

      container.appendChild(btn);
    });
  } catch (err) {
    console.error('Error loading weapons:', err);
  }
}


// ========= Load Players ========= //
async function loadPlayers() {
  const container = $('playerCards');
  if (!container) return;

  try {
    const res = await fetch('/players');
    const players = await res.json();
    container.innerHTML = '';

    players.forEach(p => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Player: ${p.user_name}</h5>
            <p class="card-text">Points: ${p.points}</p>
            <hr>
            <h6>Weapon: ${p.name_weapon}</h6>
            <ul>
              <li>Damage: ${p.damage}</li>
              <li>Range: ${p.range}</li>
              <li>Cooldown: ${p.cooldown}</li>
              <li>Type: ${p.name_type_weapon}</li>
            </ul>
            <hr>
            <h6>Skill: ${p.skill_name}</h6>
            <p>Active: ${p.active ? '✅' : '❌'}</p>
            <hr>
            <small>Level Multipliers — D: ${p.multiplier_damage}, R: ${p.multiplier_range}, C: ${p.multiplier_cooldown}</small>
            <button class="btn btn-danger mt-3 delete-player-btn">Delete Player</button>
          </div>
        </div>
      `;

      card.querySelector('.delete-player-btn').addEventListener('click', () => {
        if (confirm(`Delete player "${p.user_name}"?`)) {
          deletePlayer(p.user_name);
        }
      });

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading players:', err);
  }
}

// ========= Delete Player ========= //
async function deletePlayer(user_name) {
  try {
    const res = await fetch(`/player/${encodeURIComponent(user_name)}`, {
      method: 'DELETE',
    });
    const result = await res.text();
    showResponseMessage(result, res.ok);
    if (res.ok) loadPlayers();
  } catch (err) {
    console.error(err);
    showResponseMessage('Network or server error', false);
  }
}
