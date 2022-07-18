Cypress.Commands.add("login", (email, password) => {
  cy.get("#login-link").click();
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#login-button").click();
  cy.url().should("include", "/");
});
