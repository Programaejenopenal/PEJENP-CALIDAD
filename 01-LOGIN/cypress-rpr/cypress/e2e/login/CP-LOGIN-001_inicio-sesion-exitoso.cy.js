// ============================================================
// Caso de Prueba : CP-LOGIN-001 – Inicio de Sesión Exitoso en SAJ
// Sistema        : SIDEJU – Poder Judicial del Perú
// URL            : https://panel-pruebas-sideju.pj.gob.pe/
// Tipo           : Happy Path / Funcional
// Prioridad      : Alta
// ============================================================

describe('CP-LOGIN-001 | Inicio de Sesión Exitoso en SIDEJU', () => {

  const URL      = 'https://panel-pruebas-sideju.pj.gob.pe/';
  const USUARIO  = '42579832';
  const PASSWORD = 'Liese130884#';

  beforeEach(() => {
    // Paso 1: Abrir el navegador y navegar a la URL de pruebas
    cy.visit(URL);
  });

  it('[CP-LOGIN-001] Inicio de sesión exitoso con credenciales válidas', () => {

    // Paso 2: Verificar logotipo y título de la pantalla de login
    cy.get('img[alt*="Poder Judicial"], img[src*="logo"]')
      .should('be.visible');

    cy.contains('Iniciar sesión con identificación')
      .should('be.visible');

    // Paso 3: Ingresar el usuario
    cy.get('input[name="username"], input[placeholder*="Usuario"], input[id*="user"]')
      .should('be.visible')
      .clear()
      .type(USUARIO);

    // Paso 4: Ingresar la contraseña
    cy.get('input[type="password"]')
      .should('be.visible')
      .clear()
      .type(PASSWORD);

    // Paso 5: Hacer clic en el botón naranja "Entrar"
    cy.get('button[type="submit"], input[type="submit"]')
      .filter(':contains("Entrar")')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // Resultado esperado 1: No aparecen mensajes de error de autenticación
    cy.get('.alert-danger, [class*="error"], [class*="invalid"]')
      .should('not.exist');

    // Resultado esperado 2: El usuario es redirigido al Dashboard / panel principal
    cy.url().should('not.eq', URL);

    // Resultado esperado 3: El panel principal del SIDEJU es visible
    cy.get('[class*="dashboard"], [class*="panel"], [class*="main"], nav, header')
      .should('be.visible');
  });

});
