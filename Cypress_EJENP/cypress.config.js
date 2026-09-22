const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // habilita grabación de video
    video: true,
    // toma screenshots automáticamente en caso de fallo
    screenshotOnRunFailure: true,

    // configuración de Mochawesome
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports", // carpeta donde se guardan los reportes
      overwrite: false,             // no sobrescribir reportes anteriores
      html: true,                   // generar reporte en HTML
      json: true                    // generar reporte en JSON
    },

    setupNodeEvents(on, config) {
      // Captura screenshots en cada test exitoso
      on("after:screenshot", (details) => {
        console.log("Screenshot guardado en:", details.path);
      });

      // Captura screenshots en cada test fallido
      on("after:spec", (spec, results) => {
        if (results && results.stats.failures > 0) {
          console.log(`⚠️ Fallos detectados en: ${spec.relative}`);
        }
      });

      return config;
    },
  },
});
