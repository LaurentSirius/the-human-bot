/* The Human Bot — personnalisation de l'admin Decap CMS
 * - widget "notice" (encadré d'aide, n'enregistre rien)
 * - aperçus en direct au style du site (fond noir, typo pixel)
 */
(function () {
  var CMS = window.CMS;
  var h = window.h;
  var createClass = window.createClass;
  if (!CMS || !h || !createClass) return;

  // ---------- Utilitaires ----------
  function extractYoutubeId(input) {
    if (!input) return null;
    var value = String(input).trim();
    if (/^[\w-]{11}$/.test(value)) return value;
    var url;
    try {
      url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value);
    } catch (e) {
      return null;
    }
    var host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
    var id = null;
    if (host === 'youtu.be') id = url.pathname.split('/')[1] || null;
    else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      id = url.searchParams.get('v');
      if (!id) {
        var m = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/);
        id = m ? m[1] : null;
      }
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  }

  function video(id, title) {
    if (!id) {
      return h('div', { className: 'video-frame video-empty' },
        h('p', null, 'Colle un lien YouTube valide pour voir la vidéo ici'));
    }
    return h('div', { className: 'video-frame' },
      h('iframe', {
        src: 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0',
        title: title || 'Vidéo',
        allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        allowFullScreen: true,
      }));
  }

  function siteShell(current, children) {
    function nav(key, label) {
      return h('a', { href: '#', 'aria-current': current === key ? 'page' : undefined }, label);
    }
    return h('div', { className: 'site' },
      h('div', { className: 'preview-badge' }, 'APERÇU — ' + ({ home: 'Accueil', music: 'Page Music', links: 'Page Links' }[current])),
      h('header', { className: 'site-header' },
        h('h1', { className: 'site-title' }, h('a', { href: '#' }, 'THE\nHUMAN\nBOT')),
        h('nav', { className: 'nav' },
          nav('home', 'Home'), h('span', { className: 'sep' }, '·'),
          nav('music', 'Music'), h('span', { className: 'sep' }, '·'),
          nav('links', 'Links'))),
      h('main', { className: 'main' }, children),
      h('footer', { className: 'site-footer' }, '© THE HUMAN BOT'));
  }

  // ---------- Widget "notice" : encadré d'aide en lecture seule ----------
  var GUIDE = [
    ['Se repérer', [
      'Accueil & réglages : la vidéo principale, la phrase d’accroche et les boutons de la page d’accueil.',
      'Sorties / Morceaux : les clips de la page Music.',
      'Liens : les cadres cliquables de la page Links.',
    ]],
    ['Ajouter un morceau', [
      'Va dans Sorties / Morceaux → bouton « + Sortie » en haut à droite.',
      'Écris le titre, colle le lien YouTube (sur YouTube : « Partager » → « Copier »).',
      'Facultatif : date, description, « Mettre en avant » (= tout en haut de la page Music).',
      'Clique sur « Publier » en haut (puis « Publier maintenant » si on te le demande). C’est en ligne !',
    ]],
    ['Changer la vidéo de l’accueil', [
      'Accueil & réglages → Page d’accueil → colle le nouveau lien dans « Vidéo de l’accueil », change le titre, puis « Publier ».',
    ]],
    ['Gérer les boutons de l’accueil', [
      'Accueil & réglages → Page d’accueil → « Boutons de l’accueil ».',
      'Clique sur un bouton pour l’ouvrir et changer son texte ou son lien.',
      '« Ajouter bouton » pour en créer un, la croix × pour en supprimer, la poignée ═ (glisser-déposer) pour changer l’ordre.',
      'Aucun bouton = la rangée de boutons disparaît de l’accueil.',
    ]],
    ['Bon à savoir', [
      'L’aperçu à droite montre le rendu en direct (icône en forme d’œil en haut à droite pour l’afficher / le cacher).',
      'Après « Publier », le site se met à jour tout seul en 1 à 2 minutes. Rafraîchis la page du site pour voir.',
      'Un champ marqué « requis » doit être rempli, le reste est facultatif.',
      'Position dans la liste : 1 = en haut, 2 = juste après…',
      'Ajouter un lien : Liens → « + Lien ».',
      'Pour supprimer : ouvre l’élément → bouton rouge « Supprimer l’entrée » en haut.',
      'Une erreur ? Rien n’est perdu : chaque publication est sauvegardée dans l’historique, Zin peut revenir en arrière.',
    ]],
  ];

  var boxStyle = {
    background: '#f3f6ff', border: '1px solid #c9d4ff', borderRadius: '6px',
    padding: '14px 16px', color: '#1e2a4a', fontSize: '14px', lineHeight: '1.55',
  };

  // Cache le libellé « … (optionnel) » au-dessus des encadrés d'aide
  function hideNoticeLabels() {
    var labels = document.querySelectorAll('label[for^="_help-field"], label[for^="_guide-field"]');
    for (var i = 0; i < labels.length; i++) labels[i].style.display = 'none';
  }

  var NoticeControl = createClass({
    componentDidMount: function () { setTimeout(hideNoticeLabels, 0); },
    componentDidUpdate: function () { hideNoticeLabels(); },
    render: function () {
      var field = this.props.field;
      if (field.get('guide')) {
        return h('div', { style: Object.assign({}, boxStyle, { fontSize: '15px', padding: '20px 24px' }) },
          h('h2', { style: { fontSize: '20px', margin: '0 0 14px' } }, "Mode d'emploi de l'admin"),
          GUIDE.map(function (section, i) {
            return h('div', { key: i, style: { marginBottom: i < GUIDE.length - 1 ? '14px' : 0 } },
              h('strong', { style: { display: 'block', marginBottom: '4px', fontSize: '15px' } }, section[0]),
              h('ul', { style: { margin: 0, paddingLeft: '20px' } },
                section[1].map(function (line, j) { return h('li', { key: j }, line); })));
          }));
      }
      return h('div', { style: boxStyle },
        h('strong', { style: { display: 'block', marginBottom: '4px' } }, field.get('label')),
        field.get('text') || '');
    },
  });
  CMS.registerWidget('notice', NoticeControl, function () { return null; });

  // ---------- Aperçus ----------
  CMS.registerPreviewStyle('/admin/preview.css');

  var ReleasePreview = createClass({
    render: function () {
      var d = this.props.entry.get('data');
      var title = d.get('title') || 'Titre du morceau';
      var id = extractYoutubeId(d.get('youtube'));
      return siteShell('music', [
        h('h2', { className: 'page-heading', key: 'h' }, 'Music'),
        h('div', { className: 'list', key: 'l' },
          h('article', { className: 'card' },
            h('h2', null, title),
            d.get('description') ? h('p', null, d.get('description')) : null,
            video(id, title),
            h('p', { className: 'meta' }, h('a', { href: '#' }, 'Watch on YouTube >')))),
      ]);
    },
  });
  CMS.registerPreviewTemplate('releases', ReleasePreview);

  var LinkPreview = createClass({
    render: function () {
      var d = this.props.entry.get('data');
      return siteShell('links', [
        h('h2', { className: 'page-heading', key: 'h' }, 'Links'),
        h('div', { className: 'links-list', key: 'l' },
          h('div', { className: 'link-item' },
            h('a', { className: 'title', href: d.get('url') || '#', target: '_blank', rel: 'noopener noreferrer' },
              d.get('title') || 'Nom du lien'),
            d.get('note') ? h('p', { className: 'note' }, d.get('note')) : null,
            h('p', { className: 'url-hint' }, d.get('url') || 'https://…'))),
      ]);
    },
  });
  CMS.registerPreviewTemplate('links', LinkPreview);

  var HomePreview = createClass({
    render: function () {
      var d = this.props.entry.get('data');
      var title = d.get('featuredVideoTitle') || '';
      var list = d.get('buttons');
      var buttons = [];
      if (list && list.size !== undefined) {
        list.forEach(function (b, i) {
          if (b && b.get && (b.get('label') || b.get('url'))) buttons.push(h('a', { className: 'outlined-btn', href: '#', key: i }, b.get('label') || '…'));
        });
      }
      return siteShell('home', [
        h('section', { className: 'video-block', key: 'v' },
          video(extractYoutubeId(d.get('featuredYoutube')), title),
          h('p', { className: 'video-caption' }, title),
          h('p', { className: 'tagline' }, d.get('tagline') || '')),
        buttons.length ? h('div', { className: 'cta-row', key: 'c' }, buttons) : null,
      ]);
    },
  });
  CMS.registerPreviewTemplate('site', HomePreview);
  CMS.registerPreviewTemplate('settings', HomePreview);
})();
