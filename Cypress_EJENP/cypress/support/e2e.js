Cypress.on('uncaught:exception', (err) => {
  // Ignora error de Keycloak
  if (err.message.includes('pattern')) {
    return false
  }

  // Ignora específicamente los errores de ResizeObserver
  if (err.message.includes('ResizeObserver loop completed')) {
    return false
  }

  // Para otros errores, deja que Cypress falle (no pongas return false global)
})
