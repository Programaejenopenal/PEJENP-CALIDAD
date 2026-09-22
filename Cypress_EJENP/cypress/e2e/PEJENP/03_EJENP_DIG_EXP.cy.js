// Captura errores de Cypress
Cypress.on('fail', (err) => {
  console.error('ERROR CYPRESS:', err.message);
  throw err;
});

describe('Digitalizacion de Expediente', () => {

 beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('ResizeObserver loop')) {
        return false
      }
    })
  })


  it('Registro de nuevo expediente', () => {
    // Entrar al portal
    cy.visit('https://panel-preprd-sideju.pj.gob.pe/');
    cy.screenshot('01-portal-inicial');

    // Validar redirección a identidad
    cy.location('origin', { timeout: 20000 })
      .should('include', 'identidad-preprd-sideju');

    // Manejar login
    cy.origin('https://identidad-preprd-sideju.pj.gob.pe', () => {
      cy.get('#hiddenUsername', { timeout: 10000 })
        .invoke('val', Cypress.env('username'));
      cy.get('#hiddenPassword')
        .invoke('val', Cypress.env('password'));
      cy.screenshot('02-login-credenciales');
      cy.get('#kc-login').click();
    });

    // Validar regreso al portal
    cy.location('origin', { timeout: 20000 })
      .should('include', 'panel-preprd-sideju');
    cy.screenshot('03-regreso-portal');

    // Digitalización de expediente
    cy.readFile('cypress/fixtures/expediente.json').then((data) => {
      const expediente = data.numeroExpediente;
      expect(expediente).to.not.be.undefined;

      cy.get('#search-process', { timeout: 10000 })
        .scrollIntoView()
        .clear()
        .type(expediente);
    });

    // Hacer clic en el botón de búsqueda
    cy.get('#search-button', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.screenshot('04-busqueda-expediente');

    // Interceptar apertura de nueva pestaña y capturar la URL
    let nuevaUrl;
    cy.window().then((win) => {
      cy.stub(win, 'open').callsFake((url) => {
        nuevaUrl = url; // guardar la URL
      }).as('windowOpen');
    });

    // Hacer clic en el botón "Expediente digital"
    cy.get('button[data-testid="button-open-pasta"]', { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();

    // Leer el PDF como base64 ANTES de entrar al cy.origin(),
    // porque dentro del origin no hay acceso al filesystem del proyecto.
    cy.fixture('documento_expediente.pdf', 'base64').then((fileContent) => {

      // Ahora visitar la URL capturada en el mismo navegador
      cy.then(() => {
        expect(nuevaUrl, 'La URL del expediente digital debe estar definida').to.not.be.undefined;

        // Visitar el nuevo dominio
        cy.visit(nuevaUrl);

        // 🔑 Usar cy.origin para comandos en el nuevo dominio,
        // pasando fileContent como argumento serializado (args)
        cy.origin(
          'https://npd-preprd-sideju.pj.gob.pe',
          { args: { fileContent } },
          ({ fileContent }) => {
            // Los listeners de uncaught:exception registrados fuera de cy.origin()
            // NO se propagan a este contexto aislado (spec bridge de otro dominio).
            // Hay que registrarlo aquí dentro, y usar cy.on (no Cypress.on).
            cy.on('uncaught:exception', (err) => {
              if (
                err.message.includes('ResizeObserver loop') ||
                err.message.includes('pattern')
              ) {
                return false;
              }
            });

            cy.url().should('include', 'npd-preprd-sideju.pj.gob.pe');

            // Ajustar validación: buscar un elemento confiable en lugar de texto
            cy.get('body', { timeout: 10000 }).should('be.visible'); // asegura que cargó la página
            cy.get('button, h1, h2', { timeout: 10000 }).should('exist'); // valida que hay contenido interactivo

            cy.screenshot('05-expediente-digital');

            // Hacer clic en el botón "Importar archivos" con data-testid ImportaOpenModalrId
            cy.get('[data-testid="ImportaOpenModalrId"]', { timeout: 10000 })
              .should('be.visible')
              .click();

            // Hacer clic en el botón "Importar archivos" con data-testid ImportarArquivos
            cy.get('[data-testid="ImportarArquivos"]', { timeout: 10000 })
              .should('be.visible')
              .click();

            // Hacer clic en el botón "PDF" dentro del modal
            cy.get('label[for="inputFilesDESKTOP"]', { timeout: 10000 })
              .should('be.visible')
              .click();

            // Adjuntar el archivo PDF reconstruido desde base64
            // (dentro de cy.origin() no se pueden usar rutas relativas del proyecto)
            cy.get('input#inputFilesDESKTOP', { timeout: 10000 })
              .should('exist')
              .selectFile(
                {
                  contents: Cypress.Buffer.from(fileContent, 'base64'),
                  fileName: 'documento_expediente.pdf',
                  mimeType: 'application/pdf',
                },
                { force: true }
              );

            // Hacer clic en el botón "Enviar"
            cy.get('[data-testid="botaoEnviar"]', { timeout: 10000 })
              .should('be.visible')
              .click();

            // Esperar hasta que el contenedor se muestre
            cy.get('[data-testid="collapseContainer"]', { timeout: 30000 }) // espera hasta 30 segundos
              .should('be.visible');

         // Esperar hasta que aparezca el checkbox y hacer clic
            // Nota: el input real de MUI está oculto con opacity:0 (el cuadro visible
            // es el <svg> hermano), por eso NO se valida .should('be.visible') aquí:
            // siempre fallaría aunque el checkbox exista y sea funcional.
            cy.get('[data-testid="checkboxAgLiberacao"]', { timeout: 40000 })
              .should('exist') // asegura que esté en el DOM
              .check({ force: true }); // marca el checkbox aunque esté renderizado con estilos ocultos
       
                  // Esperar hasta que aparezca el botón "Firmar e incorporar" y hacer clic
            cy.contains('button', 'Firmar e incorporar', { timeout: 20000 }).as('btnFirmarIncorporar');
            cy.get('@btnFirmarIncorporar').should('be.visible');
            cy.get('@btnFirmarIncorporar').click({ force: true });


           // Una vez visible, hacer clic en el botón "Confirmar posición"
            cy.contains('button', 'Confirmar posición', { timeout: 20000 })
              .should('be.visible')
              .click();
                          
  // Esperar hasta que aparezca el modal "Firmar documentos"
            cy.get('[role="dialog"] [data-testid="bit4id-iframe-modal-title"]', { timeout: 30000 })
              .should('be.visible')
              .and('contain.text', 'Firmar documentos');

            // Abrir el combo "Motivo de la firma digital"
            // 👉 Rompemos la cadena: react-select re-renderiza el wrapper al abrir el menú,
            // así que si encadenamos should().click() en el mismo comando, Cypress puede
            // terminar clickeando una referencia del DOM que ya fue reemplazada.
            cy.get('[data-testid="bit4id-reason-select"]', { timeout: 20000 }).as('reasonSelect');
            cy.get('@reasonSelect').should('be.visible');
            cy.get('@reasonSelect').click();

            // Esperar a que aparezca el menú desplegable
            cy.get('div.bit4id-reason-select__menu', { timeout: 10000 })
              .should('be.visible');

            // Seleccionar la opción "Soy titular"
            // 👉 Rompemos la cadena y volvemos a obtener el elemento
            cy.contains('div', 'Soy titular', { timeout: 10000 })
              .as('opcionTitular');
            cy.get('@opcionTitular').click();

// Hacer clic en el botón "Firmar"
// 👉 Evitamos depender de clases dinámicas de JSS/MUI (jss580, jss590, etc.),
// que cambian entre builds/cargas. En su lugar, acotamos la búsqueda al
// diálogo visible actual y usamos match EXACTO de texto (/^Firmar$/) para no
// confundirlo con "Firmar e incorporar" u otros botones que contengan "Firmar".
//cy.get('[role="dialog"]')
  //.filter(':visible')
  //.last()
  //.contains('button', /^Firmar$/, { timeout: 20000 })
  //.as('btnFirmar');

//cy.get('@btnFirmar').should('be.visible');
//cy.get('@btnFirmar').click({ force: true });

            }
        );
      });
    });
  });
});