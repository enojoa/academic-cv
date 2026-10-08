const $ = id => document.getElementById(id);
const text = (el, value) => { if (el && value) el.textContent = value; };
function makeLink(label, url) {
  if (!url) return null;
  const a = document.createElement('a');
  a.href = url; a.textContent = label; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
}
function addEntry(target, item) {
  const row = document.createElement('article'); row.className = 'entry';
  const date = document.createElement('div'); date.className = 'date'; date.textContent = item.dates || item.year || item.date || '';
  const body = document.createElement('div');
  const title = document.createElement('p'); title.className = 'entry-title';
  const titleText = item.title || item.degree || item.position || item.name || '';
  const titleLink = makeLink(titleText, item.url);
  if (titleLink) title.append(titleLink); else title.textContent = titleText;
  body.append(title);
  const sub = document.createElement('p'); sub.className = 'entry-sub';
  sub.textContent = [item.authors, item.institution || item.venue || item.organization || item.course].filter(Boolean).join(' · ');
  if (sub.textContent) body.append(sub);
  const detail = document.createElement('p'); detail.className = 'entry-detail';
  detail.textContent = [item.details, item.detail, item.location].filter(Boolean).join(' · ');
  if (detail.textContent) body.append(detail);
  row.append(date, body); target.append(row);
}
fetch('cv-data.json').then(response => response.json()).then(d => {
  document.title = (d.name || 'Academic CV') + ' — CV';
  text($('name'), d.name); text($('footer-name'), d.name); text($('role'), d.role);
  text($('institution'), d.institution); text($('location'), d.location); text($('summary'), d.summary);
  text($('profile'), d.summary);
  if (!d.summary) $('profile').classList.add('hidden');
  $('initials').textContent = (d.name || 'YN').split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
  $('year').textContent = new Date().getFullYear();
  if (d.email) { const emails = d.email.split('/').map(x => x.trim()).filter(Boolean); const first = $('email-link'); first.href = 'mailto:' + emails[0]; first.textContent = emails[0]; if (emails[1]) { const second = document.createElement('a'); second.className = 'email'; second.href = 'mailto:' + emails[1]; second.textContent = emails[1]; first.after(document.createElement('br'), second); } }
  else $('contact').classList.add('hidden');
  for (const [label, url] of [['Email', d.email && 'mailto:' + d.email], ['Google Scholar', d.scholar], ['ORCID', d.orcid && 'https://orcid.org/' + d.orcid], ['Website', d.website]]) {
    const a = makeLink(label, url); if (a) $('links').append(a);
  }
  const lists = [
    ['education', 'education-list'], ['appointments', 'appointments-list'], ['publications', 'publications-list'],
    ['presentations', 'presentations-list'], ['awards', 'awards-list'], ['teaching', 'teaching-list'],
    ['service', 'service-list'], ['additional_information', 'additional-information-list'], ['reports', 'reports-list'], ['research_experience', 'research-experience-list'],
    ['professional_experience', 'professional-experience-list']
  ];
  for (const [key, id] of lists) {
    const section = $(id);
    if (!section) continue;
    (d[key] || []).forEach(item => addEntry(section, item));
    if (!(d[key] || []).length) section.closest('section').classList.add('hidden');
  }
  for (const interest of d.interests || []) {
    const span = document.createElement('span'); span.className = 'fact'; span.textContent = interest; $('facts').append(span);
  }
  if (!(d.interests || []).length) $('facts').classList.add('hidden');
  for (const skill of d.skills || []) {
    const span = document.createElement('span'); span.className = 'chip'; span.textContent = skill; $('skills').append(span);
  }
}).catch(() => { document.querySelector('main').innerHTML = '<p>Please ensure cv-data.json is available alongside this page.</p>'; });
