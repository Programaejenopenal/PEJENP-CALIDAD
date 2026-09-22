
// Captura errores de Cypress
Cypress.on('fail', (err) => {
  console.error('ERROR CYPRESS:', err.message);
  throw err; 
});


describe('Registro de Expediente', () => {

  it('Registro de nuevo expediente', () => {

    // Entrar al portal

    // ambiente preproductivo
   cy.visit('https://panel-preprd-sideju.pj.gob.pe/')
//ambiente de pruebas
        //cy.visit('https://panel-pruebas-sideju.pj.gob.pe/')
    // Esperar redirección a identidad
    cy.location('origin', { timeout: 20000 })
    //ambiente preproductivo 
    .should('include', 'identidad-preprd-sideju')
//ambiente pruebas
//.should('include', 'identidad-pruebas-sideju')

    // Manejar login
    
    //ambiente preproductivo
    cy.origin('https://identidad-preprd-sideju.pj.gob.pe', () => {
//ambiente de pruebas
//cy.origin('https://identidad-pruebas-sideju.pj.gob.pe', () => {
cy.screenshot('Ingresando al Panel de Pruebas para el Login');
      cy.get('#hiddenUsername', { timeout: 10000 })
        .invoke('val', Cypress.env('username'))

      cy.get('#hiddenPassword')
        .invoke('val', Cypress.env('password'))
cy.screenshot('Ingresando Usuario y Contraseña');
      cy.get('#kc-login').click()
    })

    // Validar regreso al portal
    cy.location('origin', { timeout: 20000 })

    //ambiente preproductivo     
     .should('include', 'panel-preprd-sideju')
//ambiente de pruebas
//.should('include', 'panel-pruebas-sideju')

    //Click en registrar nuevo expediente  
    //cy.get('[data-testid="NEW_PROCESS"]', { timeout: 20000 })
    cy.get('[data-testid="new-dropdown"]', { timeout: 20000 })
      .should('be.visible')
      .click()

    //  cy.contains('[role="option"]', 'Nuevo expediente digital')  .click();

  //cy.get('[data-testid="NEW_PROCESS"] > .MuiButton-label > .jss331').click();
  cy.get('[data-testid="NEW_PROCESS"]', { timeout: 10000 }).click();
  cy.screenshot('Ingresando a la pantalla principal del EJE');


 //  seleccionando instancia
  //Seleccionar Instancia: Juzgado Paz Letrado
//cy.get('[data-testid="select-codigo_instancia"]').click();
//cy.contains('[role="option"]', '2 - Juzgado paz letrado').should('be.visible').click();



// seleccionando especialidad
cy.get('[data-testid="select-competence"]')
  .first()
  .click();

cy.contains('[role="option"]', '1 - LABORAL')
  .click();
      //seleccionando subespecialidad

// Abrir combo de Subespecialidad
cy.get('[data-testid="select-competence"]')
  .last()
  .click();

// Seleccionar opción Subespecialidad
cy.contains('[role="option"]', '1 - Nueva Ley Procesal del Trabajo')
  .should('be.visible')
  .click();

// seleccionando motivo de ingreso
cy.get('[data-testid="select-codigo_motivo_distribuicao"]')
  .click();
//ambiente de pruebas
//cy.contains('[role="option"]', '53 - DEMANDA')

//ambiente Pre-productivo
//cy.contains('[role="option"]', '21 - DEMANDA')
//.click();

cy.contains('[role="option"]', '325 - DEMANDA')
.click();

  //seleccionando via procedimental
 // Hace clic en el combo (input con id="select-class")
    cy.get('#select-class').click();

    // Selecciona la opción por su texto visible
    //cy.contains('[role="option"]','1004 - Abreviado').click();
    cy.contains('[role="option"]','4 - Abreviado').click();

 // Hace clic en el combo de Materia principal
    cy.get('#select-main-subject').click();

    // Selecciona la opción por su texto visible dentro de role="option"
   //ambiente PRUEBAS
    //cy.contains('[role="option"]', '10524 - Créditos Laborales').click();
    //ambiente PRE-productivo
   //  cy.contains('[role="option"]', '10076 - Actos de Hostilidad del Empleador').click();
   //cy.contains('[role="option"]', '11314 - Pago de Honorarios').click();
      cy.contains('[role="option"]', '486 - Pago de Honorarios').click();



 // Hace clic en el combo de Submateria
    cy.get('#select-complementary-subject').click();

    // Selecciona la opción por su texto visible dentro de role="option"
//    cy.contains('[role="option"]', '10071 - Actos Contra la Moral').click();
  //  cy.contains('[role="option"]', '84012 - Pago de Honorarios').click();
        cy.contains('[role="option"]', '486 - Pago de Honorarios').click();

//Hacer click en el check 
// Hacer check en el checkbox "cuantia-indeterminada"
//cy.get('[data-testid="checkbox-cuantia-indeterminada"]', { timeout: 10000 }) .should('be.visible') .check();

// Hacer check en el checkbox "cuantia-indeterminada"
cy.get('[data-testid="checkbox-cuantia-indeterminada"]', { timeout: 10000 })
  .check({ force: true });


    //Ingresando la sumilla
// Hacer clic en el textarea y escribir "xxx"
cy.get('[data-testid="textarea-sumilla"]', { timeout: 10000 })
  .should('be.visible')
  .click()
  .clear()
  .type('xxx');
//Ingresando folio
  // Hacer clic en el textbox y escribir "1"
cy.get('[data-testid="input-numero-folhas"]', { timeout: 10000 })
  .should('be.visible')
  .click()
  .clear()
  .type('1');


    cy.screenshot('Ingresando datos para el Ingreso de Expediente');
 // ------------Seleccionando Opcion Agregar parte DEMANDANTE

  // Paso 1: clic en Proseguir
    cy.get('[data-testid="save-button"]').click();

    // Paso 2: esperar hasta que el botón "Agregar parte" esté habilitado
    cy.get('[data-testid="dropdown-adicionar-parte"]', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 3: clic en el combo
    cy.get('[data-testid="dropdown-adicionar-parte"]').click();

    // Paso 4: seleccionar la opción Demandante usando el data-testid estable
    cy.get('[data-testid="dropdownitem-adicionar-parte-ATIVO"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

  // seleccionando datos de demandante

      // Paso 1: clic en el combo "Tipo de persona"
    cy.get('#react-select-13-input').click();


      // Paso 2: seleccionar la opción "Persona Natural"
    cy.contains('[role="option"]', 'Persona Natural').click({ force: true });

       // Paso 3: localizar el input por su id y escribir el documento
    cy.get('#numero_documento_principal')
      .should('be.visible')
      .type('29086619');

      // Paso 4: hacer clic en el label
    cy.get('label[for="numero_documento_principal"]').click({ force: true });

      // Paso 5: esperar hasta que el botón Consultar Reniec esté visible y habilitado
    cy.get('[data-testid="button-consultar-reniec"]', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 6: hacer clic en el botón
    cy.get('[data-testid="button-consultar-reniec"]').click();
  
  
    // Paso 7: esperar hasta que el botón Guardar esté visible y habilitado
    //cy.get('[data-testid="button-salvar-parte"]', { timeout: 10000 })
     // .should('be.visible')
      //.and('not.be.disabled');
cy.screenshot('Ingresando la parte Demandante');
    // Paso 8: hacer clic en el botón Guardar
    cy.get('[data-testid="button-salvar-parte"]').click();

    //cy.get('[data-testid="button-salvar-parte"] > .MuiButton-label > .jss46').click();
    

    // Paso 9: verificar que aparezca el bloque HTML esperado
    cy.get('ul.global-list', { timeout: 20000 }).should('be.visible');

    // Paso 10: verificar que el documento ingresado esté presente
    cy.contains('29086619', { timeout: 20000 }).should('be.visible');




// --------------Seleccionando Opcion Agregar parte DEMANDADO

  // Paso 1: clic en Proseguir
    //cy.get('[data-testid="save-button"]').click();

    // Paso 2: esperar hasta que el botón "Agregar parte" esté habilitado
    cy.get('[data-testid="dropdown-adicionar-parte"]', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 3: clic en el combo
    cy.get('[data-testid="dropdown-adicionar-parte"]').click();

    // Paso 4: seleccionar la opción Demandante usando el data-testid estable
    cy.get('[data-testid="dropdownitem-adicionar-parte-PASSIVO"]', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });

  // seleccionando datos de demandante

      // Paso 1: clic en el combo "Tipo de persona"
        //cy.get('#react-select-12-input').click();
cy.get('[data-testid="select-tipo-pessoa"] > .css-11ecpbf-control').click();
      // Paso 2: seleccionar la opción "Persona Natural"
    cy.contains('[role="option"]', 'Persona Natural').click({ force: true });

       // Paso 3: localizar el input por su id y escribir el documento
    cy.get('#numero_documento_principal')
      .should('be.visible')
      .type('29086626');

      // Paso 4: hacer clic en el label
    cy.get('label[for="numero_documento_principal"]').click({ force: true });

      // Paso 5: esperar hasta que el botón Consultar Reniec esté visible y habilitado
    cy.get('[data-testid="button-consultar-reniec"]', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled');

    // Paso 6: hacer clic en el botón
    cy.get('[data-testid="button-consultar-reniec"]').click();
  
  
    // Paso 7: esperar hasta que el botón Guardar esté visible y habilitado
    //cy.get('[data-testid="button-salvar-parte"]', { timeout: 10000 })
     // .should('be.visible')
      //.and('not.be.disabled');
cy.screenshot('Ingresando la parte Demandado');
    // Paso 8: hacer clic en el botón Guardar
    cy.get('[data-testid="button-salvar-parte"]').dblclick();

    //cy.get('[data-testid="button-salvar-parte"] > .MuiButton-label > .jss46').click();
    
// Realizando la distribucion
   // Esperar 10 segundos para que se muestren los mensajes de éxito
cy.wait(10000);


// Hacer check en el checkbox "Presentante"
cy.get('input[aria-label="Presentante"]', { timeout: 10000 })
  .check({ force: true });

  cy.wait(10000);

// Paso extra: hacer scroll hasta el botón Distribuir
cy.get('[data-testid="button-distribute"]', { timeout: 30000 })
  .scrollIntoView()
  .should('be.visible')
  .and('not.be.disabled')
  .click();

  cy.screenshot('No hay Arancel ni deposito');

// Esperar a que aparezca el modal
cy.get('[role="dialog"]', { timeout: 20000 }).should('be.visible');

// Marcar el checkbox "No se adjunta arancel"
cy.get('[data-testid="confirma-sin-arancel"]', { timeout: 10000 })
  .check({ force: true });

// Marcar el checkbox "No se adjunta depósito judicial"
cy.get('[data-testid="confirma-sin-deposito"]', { timeout: 10000 })
  .check({ force: true });

// Finalmente hacer clic en el botón Confirmar
cy.get('[data-testid="pagos-confirmar"]', { timeout: 10000 })
  .should('not.be.disabled')
  .click();

  cy.screenshot('Realizando la distribucion');

// Capturar el número de expediente después de la distribución
//cy.get('[data-testid="number-process"]', { timeout: 20000 })
  //.scrollIntoView() // mover la vista hasta el elemento
  //.should('be.visible')
  //.invoke('text')
  //.then((expediente) => {
   // cy.log('Número de expediente generado:', expediente);
    //Cypress.env('numeroExpediente', expediente); // guardar en variable global
 // });


function esperarExpediente() {
  cy.get('[data-testid="number-process"]', { timeout: 60000 })
    .invoke('text')
    .then((text) => {
      if (text.includes('Esperando')) {
        cy.wait(1000); // esperar 1 segundo
        esperarExpediente(); // reintentar
      } else {
        cy.log('Número de expediente generado:', text);
        cy.writeFile('cypress/fixtures/expediente.json', { numeroExpediente: text });
      }
    });
}

esperarExpediente();






})
})