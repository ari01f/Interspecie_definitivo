document.addEventListener('DOMContentLoaded', () => {
  const imageContainer = document.getElementById('image-container');

  // Crea il contenitore del messaggio categoria
  const categoryMessage = document.createElement('div');
  categoryMessage.id = 'categoryMessage';
  categoryMessage.style.position = 'fixed';
  categoryMessage.style.top = '80%';
  categoryMessage.style.left = '50%';
  categoryMessage.style.transform = 'translate(-50%, -50%)';
  categoryMessage.style.zIndex = '100';
  categoryMessage.style.display = 'none';
  categoryMessage.style.textAlign = 'left';
  categoryMessage.style.fontFamily = '"Arial Narrow", Helvetica, sans-serif';
  categoryMessage.style.fontSize = '25px';
  categoryMessage.style.fontWeight = '400';
  categoryMessage.style.color = '#000';

  // Titolo e descrizione
  const categoryTitle = document.createElement('p');
  const categoryDescription = document.createElement('p');

  [categoryTitle, categoryDescription].forEach(el => {
    el.style.margin = '0 0 20px 0';
    el.style.fontFamily = '"Arial Narrow", Helvetica, sans-serif';
    el.style.fontSize = '25px';
    el.style.fontWeight = '400';
    el.style.color = '#000';
    el.style.lineHeight = '1.25';
  });

  // Bottone continua
  const continueBtn = document.createElement('button');
  continueBtn.textContent = '[Continua]';
  continueBtn.className = 'highlight-button';
  continueBtn.style.textAlign = 'left';

  // Aggiunge gli elementi al contenitore
  categoryMessage.appendChild(categoryTitle);
  categoryMessage.appendChild(categoryDescription);
  categoryMessage.appendChild(continueBtn);
  document.body.appendChild(categoryMessage);

  // Stile evidenziatore
  const style = document.createElement('style');
  style.textContent = `
    .highlight {
      background: #00fb10;
      padding: 0 4px;
      border-radius: 0;
    }
    .highlight-button {
      background: #00fb10;
      color: #000;
      border: none;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 25px;
      font-family: "Arial Narrow", Helvetica, sans-serif;
      font-weight: 400;
      text-align: left;
      margin-top: 20px;
      display: inline-block;
      border-radius: 0;
    }
    .highlight-button:hover {
      background: #00e60c;
    }
  `;
  document.head.appendChild(style);

  // Variabili generali
  let images = [];
  let currentIndex = 0;
  const imagesPerRow = 20;
  let currentRow;
  let imagesInCurrentRow = 0;
  let currentCategory = '';
  let isPaused = false;

  // Messaggi categoria
  const categoryMessages = {
    cielo: {
      title: 'Cielo',
      text: `osservazioni di animali in volo durante le migrazioni e i loro spostamenti sopra il Parco Regionale del Fiume Sile. Nel periodo autunnale e invernale, numerose specie di uccelli si spostano attraversando l’area, utilizzando il cielo come via di passaggio.`
    },
    antenna: {
      title: 'Antenne',
      text: `Osservazioni delle specie che sostano sulle antenne delle abitazioni circostanti il Parco del Sile. Punti sopraelevati vengono usati come appoggio temporaneo, ma risultano inadatti alla nidificazione. Questo evidenzia come certe strutture dell’uomo possano essere potenzialmente dannose per gli altri esseri viventi.`
    },
    tetto: {
      title: 'Infrastrutture',
      text: `Osservazioni delle specie che sostano temporaneamente sulle antenne delle abitazioni e degli edifici che circondano il Parco Regionale del Fiume Sile. Punti sopraelevati utilizzati per riposare, sorvegliare il territorio o evitare predatori. Tuttavia, queste strutture, pur offrendo appoggio, risultano inadatte alla nidificazione e, talvolta, potenzialmente pericolose per gli animali, che possono ferirsi o rimanere impigliati. Un esempio di come le infrastrutture umane, se non progettate in armonia con l’ambiente, possano interferire con i bisogni ecologici delle specie locali.`
    },
    alberi: {
      title: 'Alberi',
      text: `Osservazioni delle specie che usano gli alberi come rifugio, spazio di nidificazione, punto di appostamento e fonte di nutrimento. Nel Parco del Sile, querce, pioppi, salici e ontani offrono riparo a picchi, scoiattoli, insetti xilofagi e numerose specie di funghi simbionti. Gli alberi diventano veri e propri microcosmi verticali, ambienti complessi capaci di ospitare differenti comunità biologiche, proteggendo e sostenendo molteplici forme di vita durante tutte le stagioni.`
    },
    erba: {
      title: 'Vegetazione',
      text: `Osservazioni delle specie che abitano, formano e attraversano l’ambiente vegetale del Parco Regionale del Fiume Sile. Piante, arbusti, alberi secolari e il sottobosco costituiscono una rete vitale di relazioni ecologiche. Questo ecosistema vegetale ospita insetti impollinatori, uccelli nidificanti, piccoli mammiferi e funghi che collaborano nel ciclo di scambio di risorse, decomposizione e rigenerazione.`
    },
    acqua: {
      title: 'Acqua',
      text: `Osservazioni di esseri viventi che abitano le zone umide, le sorgenti e le rive del fiume Sile, uno degli ambienti più delicati e biodiversi del territorio. Il Sile, con le sue risorgive e il suo corso tranquillo, rappresenta un habitat essenziale per anfibi, pesci, rettili, insetti acquatici e numerose specie vegetali tipiche delle acque dolci. Qui, l’acqua genera un ecosistema complesso in cui le specie interagiscono in stretta interdipendenza, contribuendo a mantenere l’equilibrio ecologico e a filtrare naturalmente l’ambiente`
    },
    mani: {
      title: 'Mani',
      text: `Osservazioni di specie raccolte direttamente con le mani, testimonianza del rapporto profondo e ambiguo tra l’essere umano e gli altri esseri viventi. Attraverso il contatto fisico, si racconta un’interazione che può essere di cura, protezione, ma anche di controllo e manipolazione. Nel territorio del Parco del Sile, dove natura e presenza umana convivono da secoli, questi gesti raccontano una storia di coesistenza quotidiana, fatta di raccolte, liberazioni, salvataggi e a volte appropriazioni di organismi vegetali e animali.`
    },
    cemento: {
      title: 'Cemento',
      text: `Osservazioni di specie che popolano gli spazi artificiali della città: marciapiedi, pareti di edifici, sottotetti e aree industriali dismesse. Organismi come licheni, piccioni, rondoni e insetti trovano tra il cemento nuove strategie di sopravvivenza, adattandosi a un ambiente modellato dall’essere umano. In queste crepe e interstizi, la vita si riappropria dello spazio, trasformando il paesaggio urbano in un habitat inatteso. Anche nel contesto del Parco Regionale del Fiume Sile, le zone urbanizzate limitrofe diventano estensioni ecologiche marginali, luoghi di rifugio e passaggio per specie adattabili.`
    }
  };

  // Carica CSV
  async function loadCSV() {
    try {
      const res = await fetch('picarrange.csv');
      const text = await res.text();
      const rows = text.trim().split('\n');
      const headers = rows[0].split(',');

      const imgIndex = headers.indexOf('image_url_small');
      const folderIndex = headers.indexOf('cartella');

      if (imgIndex === -1 || folderIndex === -1) {
        console.error('Colonne richieste non trovate nel CSV');
        return;
      }

      images = rows.slice(1).map(r => {
        const cols = r.split(',');
        return {
          url: cols[imgIndex],
          folder: cols[folderIndex]
        };
      }).reverse();

      loadNextImage();
    } catch (error) {
      console.error('Errore nel caricare il CSV:', error);
    }
  }

  // Aggiunge immagine alla griglia
  function addImage(url) {
    if (!currentRow || imagesInCurrentRow >= imagesPerRow) {
      currentRow = document.createElement('div');
      currentRow.className = 'image-row';
      imageContainer.appendChild(currentRow);
      imagesInCurrentRow = 0;
    }

    const imgElement = document.createElement('img');
    imgElement.src = url;
    imgElement.alt = 'Image';

    imgElement.onload = () => {
      setTimeout(() => {
        imgElement.classList.add('fade-in');
      }, 100);
    };

    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    imageItem.appendChild(imgElement);

    currentRow.appendChild(imageItem);
    imagesInCurrentRow++;
  }

  function loadNextImage() {
    if (currentIndex >= images.length) {
      console.log('Fatto');
      setTimeout(() => window.location.href = 'index.html', 100);
      return;
    }

    if (isPaused) return;

    const { url, folder } = images[currentIndex];

    const isFastCategory = folder === 'acqua' || folder === 'erba';
    const loadDelay = isFastCategory ? 5 : 10;

    if (folder !== currentCategory) {
      currentCategory = folder;
      pauseAnimation();
      showCategoryMessage(folder);
      return;
    }

    addImage(url);
    currentIndex++;
    setTimeout(loadNextImage, loadDelay);
  }

  function pauseAnimation() {
    isPaused = true;
  }

  function resumeAnimation() {
    isPaused = false;
    categoryMessage.style.display = 'none';
    loadNextImage();
  }

  function showCategoryMessage(category) {
    const normalizedCategory = category.trim().toLowerCase();
    const message = categoryMessages[normalizedCategory];

    if (message) {
      categoryTitle.innerHTML = `<span class="highlight">${message.title}</span>`;
      categoryDescription.innerHTML = `<span class="highlight">${message.text}</span>`;
      categoryMessage.style.display = 'block';
    } else {
      console.error(`Categoria non trovata: ${category}`);
      resumeAnimation();
    }
  }

  continueBtn.addEventListener('click', resumeAnimation);

  loadCSV();
});