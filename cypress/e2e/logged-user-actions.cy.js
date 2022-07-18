/// <reference types="cypress" />

describe("logged in user navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("log in", () => {
    cy.login("test@test.pl", "test123");
  });

  it("log out", () => {
    cy.login("test@test.pl", "test123");
    cy.get("#logout-link").click();
    cy.url().should("include", "/");
    cy.get("#login-link").should("be.visible").and("have.text", "login");
  });

  it("displaying expenses panel", () => {
    cy.login("test@test.pl", "test123");
    cy.get("#home-link")
      .should("have.text", "home")
      .and("be.visible")
      .and("have.attr", "href", "/");
    cy.get("#login-link").should("not.exist");
    cy.get("#register-link").should("not.exist");
    cy.get("#userName").should("have.text", "Test");
    cy.get("#home-link").should("exist");
    cy.get("#logout-link").should("exist");
    cy.get("#expenses-panel-link").should("exist");
    cy.get("#admin-panel-link").should("not.exist");
    cy.get("#expenses-panel-link").click();
    cy.url().should("include", "/expenses");
    cy.get(".display-5")
      .should("exist")
      .and("have.text", "Hi,\n          Test\n          ✋");
    cy.get("#back-button").should("exist");
    cy.get("#show-button").should("exist");
    cy.get("#spend-button").should("exist");
    cy.url().should("include", "/");
  });

  it("adding expenses, displaying expenses history", () => {
    cy.login("test@test.pl", "test123");
    cy.get("#expenses-panel-link").click();
    cy.get("#expenseName").type("Test Expense");
    cy.get("#expenseAmount").type("100");
    cy.get("#spend-button").click();
    cy.url().should("include", "/expenses");
    cy.get("#show-button").click();
    cy.get("#exampleModalCenter").should("be.visible");
  });

  it("redirecting to home from expenses", () => {
    cy.login("test@test.pl", "test123");
    cy.get("#expenses-panel-link").click();
    cy.get("#home-link").click();
    cy.url().should("include", "/");
  });
});
