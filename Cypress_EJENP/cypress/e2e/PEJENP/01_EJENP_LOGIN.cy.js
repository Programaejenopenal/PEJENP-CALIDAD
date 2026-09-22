
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


 



})
})