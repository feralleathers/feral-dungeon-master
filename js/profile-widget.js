import { profileStore } from './profile-store.js';

const widgetId = 'fdm-profile-widget';
const photoId = 'fdm-profile-widget-photo';
const nameId = 'fdm-profile-widget-name';
const positionId = 'fdm-profile-widget-position';
const tagsId = 'fdm-profile-widget-tags';

function mountStyles() {
  if (document.getElementById('profile-widget-styles')) return;
  const style = document.createElement('style');
  style.id = 'profile-widget-styles';
  style.textContent = `
    .profile-widget{
      position:fixed;
      bottom:18px;
      right:18px;
      width:260px;
      background:rgba(15,18,23,.92);
      border:1px solid #1f232a;
      border-radius:18px;
      padding:16px;
      box-shadow:0 25px 40px rgba(0,0,0,.65);
      font:500 12px 'Inter',system-ui,sans-serif;
      color:#e7e9f1;
      z-index:999;
    }
    .profile-widget.hidden{
      display:none;
    }
    .profile-widget-header{
      display:flex;
      align-items:center;
      gap:10px;
    }
    .profile-widget-photo{
      width:54px;
      height:54px;
      border-radius:999px;
      background:linear-gradient(135deg,#2d2f35,#0b0f14);
      border:1px solid rgba(255,255,255,.1);
      background-size:cover;
      background-position:center;
      position:relative;
      overflow:hidden;
    }
    .profile-widget-title{
      font:600 14px 'Playfair Display',serif;
      margin:0;
      line-height:1.2;
    }
    .profile-widget-subtitle{
      font:600 11px 'Inter',sans-serif;
      letter-spacing:.25em;
      text-transform:uppercase;
      color:#9ea1b0;
    }
    .profile-widget-tags{
      margin-top:10px;
      display:flex;
      flex-wrap:wrap;
      gap:6px;
    }
    .profile-widget-tag{
      border-radius:999px;
      padding:4px 10px;
      border:1px solid rgba(255,255,255,.1);
      font:600 11px 'Inter',sans-serif;
    }

    @media (max-width:700px){
      .profile-widget{
        bottom:auto;
        top:18px;
        right:18px;
        width:auto;
      }
    }
  `;
  document.head.appendChild(style);
}

function buildWidget() {
  if (document.getElementById(widgetId)) return;
  const widget = document.createElement('aside');
  widget.id = widgetId;
  widget.className = 'profile-widget';
  widget.innerHTML = `
    <div class="profile-widget-header">
      <div class="profile-widget-photo" id="${photoId}"></div>
      <div>
        <p class="profile-widget-title" id="${nameId}">Unnamed</p>
        <p class="profile-widget-subtitle" id="${positionId}">Position / Dynamic</p>
      </div>
    </div>
    <div class="profile-widget-tags" id="${tagsId}">
    </div>
  `;
  document.body.appendChild(widget);
}

function renderWidget() {
  const profile = profileStore.getActiveProfile();
  const widget = document.getElementById(widgetId);
  if (!widget) return;
  if (!profile) {
    widget.classList.add('hidden');
    return;
  }
  widget.classList.remove('hidden');
  const photoEl = document.getElementById(photoId);
  const nameEl = document.getElementById(nameId);
  const positionEl = document.getElementById(positionId);
  const tagsEl = document.getElementById(tagsId);
  if (photoEl) {
    const photo = profile.profilePhotos?.main || '';
    photoEl.style.backgroundImage = photo ? `url(${photo})` : '';
  }
  if (nameEl) {
    nameEl.textContent = profile.profileName || 'Unnamed';
  }
  if (positionEl) {
    const persona = profile.questionnaire?.persona || {};
    const personaPosition = persona.sexualPosition || 'Top';
    const personaDynamic = persona.sexualDynamic || 'Dom';
    positionEl.textContent = `${personaPosition} / ${personaDynamic}`;
  }
  if (tagsEl) {
    const tags = profile.publicProfile?.tags || [];
    tagsEl.innerHTML = tags.slice(0, 5)
      .map((tag) => `<span class="profile-widget-tag">${escapeHtml(tag)}</span>`)
      .join('') || '<span class="profile-widget-tag">Tags saved here</span>';
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function init() {
  profileStore.init();
  mountStyles();
  buildWidget();
  renderWidget();
  profileStore.on('profile:updated', renderWidget);
  window.addEventListener('focus', renderWidget);
}

init();
