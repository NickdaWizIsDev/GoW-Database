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

  const sortDropdown = $('sortWeapons');
  if (sortDropdown) {
    sortDropdown.addEventListener('change', () => {
      loadWeapons(sortDropdown.value);
    });
  }


  // ========= Login Page Logic ========= //
  if (loginForm) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/connect-db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, password })
        });

        if (!res.ok) throw new Error(await res.text());

        localStorage.setItem('dbConnected', 'true');
        window.location.href = 'app.html';
      } catch (err) {
        alert('Login failed: ' + err.message);
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
        material: $('material').value,
        skill_name: $('skill_name').value,
        skill_active: $('skill_active').value === 'true',
        type_weapon: $('type_weapon').value,
        level: parseInt($('level_select').value),
      };

      const formData = new FormData();
      formData.append('spriteFile', $('spriteFile').files[0]);
      formData.append('weapon', JSON.stringify(weapon));

      try {
        const res = await fetch('/create-weapon', {
          method: 'POST',
          body: formData,
        });
        const result = await res.text();
        showResponseMessage(result, res.ok);
        if (res.ok) {
          e.target.reset();
          loadWeapons();
        }
        } catch (err) {
          console.error(err);
          showResponseMessage('Upload failed', false);
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
async function loadWeapons(sortBy = '') {
  try {
    const response = await fetch('/weapons');
    let weapons = await response.json();

    // Apply client-side sorting
    if (sortBy) {
      const [key, dir] = sortBy.split('-');
      weapons.sort((a, b) => {
        return dir === 'asc' ? a[key] - b[key] : b[key] - a[key];
      });
    }

    const container = $('weaponButtons');
    const selectedInput = $('selectedWeaponId');
    container.innerHTML = '';
    selectedInput.value = ''; // clear selection on reload

    weapons.forEach(w => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-dark d-flex align-items-center gap-2';
      btn.style.color = 'dark';
      btn.dataset.weaponId = w.id_weapon;

      // Tooltip
      btn.title = `Damage: ${w.damage}\nRange: ${w.range}\nCooldown: ${w.cooldown}`;
      btn.setAttribute('data-bs-toggle', 'tooltip');
      btn.setAttribute('data-bs-placement', 'top');


      const img = document.createElement('img');
      img.src = '/assets/sprites/' + w.path_sprite;
      img.alt = w.name_weapon;
      img.style.width = '40px';
      img.style.height = '40px';
      img.style.objectFit = 'contain';
      img.onerror = () => img.remove();
      btn.appendChild(img);

      btn.appendChild(document.createTextNode(w.name_weapon));
      btn.addEventListener('click', () => {
        [...container.children].forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
        selectedInput.value = w.id_weapon;
      });

      container.appendChild(btn);
    });

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));

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

// ========= Populate Level Dropdown ========= //
async function populateDropdown(endpoint, selectId, valueField = 'id', textField = 'name') {
  const res = await fetch(`/${endpoint}`);
  const data = await res.json();
  const select = $(selectId);
  select.innerHTML = '';
  data.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item[valueField];
    opt.textContent = item[textField] || item.path_material || item.skill_name || item.name_type_weapon;
    select.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  populateDropdown('materials', 'material', 'id_material', 'path_material');
  populateDropdown('skills', 'skill_name', 'id_skill', 'skill_name');
  populateDropdown('types', 'type_weapon', 'id_type_weapon', 'name_type_weapon');
});
