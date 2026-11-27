for (const jump of document.querySelectorAll('[data-state-jump]')) {
  if (!(jump instanceof HTMLSelectElement)) continue;
  jump.addEventListener('change', () => {
    if (jump.value) window.location.assign(jump.value);
  });
}

for (const planner of document.querySelectorAll('[data-bridge-planner]')) {
  const budgetInput = planner.querySelector('[data-budget-input]');
  const rows = [...planner.querySelectorAll('[data-opportunity-row]')];
  const checkboxes = rows
    .map((row) => row.querySelector('input[type="checkbox"]'))
    .filter((el) => el instanceof HTMLInputElement);
  const leaveOut = planner.querySelector('[data-stat-leave]');
  const freeOut = planner.querySelector('[data-stat-free]');
  const remainingOut = planner.querySelector('[data-stat-remaining]');
  const ratioOut = planner.querySelector('[data-stat-ratio]');
  const noticeEl = planner.querySelector('[data-planner-notice]');
  const recBtn = planner.querySelector('[data-action-recommended]');
  const clearBtn = planner.querySelector('[data-action-clear]');
  const decBtn = planner.querySelector('[data-budget-dec]');
  const incBtn = planner.querySelector('[data-budget-inc]');
  const locale = planner.getAttribute('data-locale') === 'en' ? 'en' : 'de';
  const overlapText = planner.getAttribute('data-overlap-notice') || '';
  const overBudgetText = planner.getAttribute('data-over-budget-notice') || '';

  if (!checkboxes.length || !leaveOut || !freeOut || !remainingOut || !ratioOut) continue;

  const items = checkboxes.map((input) => {
    const row = input.closest('[data-opportunity-row]');
    return {
      input,
      row,
      start: row?.getAttribute('data-start') || '',
      end: row?.getAttribute('data-end') || '',
      leave: Number(row?.getAttribute('data-leave') || '0'),
      free: Number(row?.getAttribute('data-free') || '0'),
      recommended: row?.getAttribute('data-recommended') === 'true',
    };
  });

  function overlaps(a, b) {
    return !(a.end < b.start || b.end < a.start);
  }

  function formatMultiplier(value) {
    if (!Number.isFinite(value) || value <= 0) return '–';
    const fixed = value.toFixed(1);
    return locale === 'de' ? `${fixed.replace('.', ',')}×` : `${fixed}×`;
  }

  function getBudget() {
    if (!(budgetInput instanceof HTMLInputElement)) return 30;
    const parsed = Number.parseInt(budgetInput.value, 10);
    if (!Number.isFinite(parsed)) return 30;
    return Math.max(0, Math.min(60, parsed));
  }

  function updateSummary(customNotice) {
    let totalLeave = 0;
    let totalFree = 0;
    for (const item of items) {
      const checked = item.input.checked;
      item.row?.classList.toggle('is-selected', checked);
      if (checked) {
        totalLeave += item.leave;
        totalFree += item.free;
      }
    }

    const budget = getBudget();
    const remaining = budget - totalLeave;

    leaveOut.textContent = String(totalLeave);
    freeOut.textContent = String(totalFree);
    remainingOut.textContent = String(remaining);
    remainingOut.classList.toggle('is-warning', remaining < 0);
    ratioOut.textContent = formatMultiplier(totalLeave > 0 ? totalFree / totalLeave : 0);

    if (noticeEl) {
      if (remaining < 0) {
        noticeEl.textContent = overBudgetText;
        noticeEl.hidden = false;
      } else if (customNotice) {
        noticeEl.textContent = customNotice;
        noticeEl.hidden = false;
      } else {
        noticeEl.textContent = '';
        noticeEl.hidden = true;
      }
    }
  }

  for (const item of items) {
    item.input.addEventListener('change', () => {
      let replaced = false;
      if (item.input.checked) {
        for (const other of items) {
          if (other !== item && other.input.checked && overlaps(item, other)) {
            other.input.checked = false;
            replaced = true;
          }
        }
      }
      updateSummary(replaced ? overlapText : '');
    });
  }

  recBtn?.addEventListener('click', () => {
    for (const item of items) item.input.checked = item.recommended;
    updateSummary('');
  });

  clearBtn?.addEventListener('click', () => {
    for (const item of items) item.input.checked = false;
    updateSummary('');
  });

  if (budgetInput instanceof HTMLInputElement) {
    budgetInput.addEventListener('input', () => updateSummary(''));
    decBtn?.addEventListener('click', () => {
      budgetInput.value = String(Math.max(0, getBudget() - 1));
      updateSummary('');
    });
    incBtn?.addEventListener('click', () => {
      budgetInput.value = String(Math.min(60, getBudget() + 1));
      updateSummary('');
    });
  }

  updateSummary('');
}
