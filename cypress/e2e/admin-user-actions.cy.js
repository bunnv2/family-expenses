/// <reference types="cypress" />

const { id } = require("@hapi/joi/lib/base");

describe("not logged in user navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("displaying main view", () => {
    cy.login("admin@admin.pl", "admin");
    cy.url().should("include", "/");
    cy.get("h1").should("have.text", "Welcome in Family Expenses Web App!");
    cy.get("#expenses-panel-link").should("not.exist");
    cy.get("#admin-panel-link").should("be.visible").click();
    cy.url().should("include", "/admin");
    cy.get("#add-family-link")
      .should("be.visible")
      .and("have.text", "Add family");
    cy.get("#add-family-members-link")
      .should("be.visible")
      .and("have.text", "Add family member");
    cy.get("#add-family-budget-link")
      .should("be.visible")
      .and("have.text", "Add budget");
    cy.get("#back-link").should("be.visible").and("have.text", "Back").click();
    cy.url().should("include", "/");
  });

  it("adding family", () => {
    cy.login("admin@admin.pl", "admin");
    cy.get("#admin-panel-link").should("be.visible").click();
    cy.get("#add-family-link").should("be.visible").click();
    cy.url().should("include", "/admin/add-family");
    cy.get("input[name='name']").type("Automated User");
    cy.get("input[name='lastName']").type("Automated User Last Name");
    const email = `${Math.random() * 100}@autoTest.com`;
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("123");
    cy.get("input[name='budget']").type("500");
    cy.get("#back-button").should("be.visible");
    cy.get("#add-family-button").should("be.visible").click();
    cy.url().should("include", "/admin");
  });

  it("adding family member", () => {
    cy.login("admin@admin.pl", "admin");
    cy.get("#admin-panel-link").should("be.visible").click();
    cy.get("#add-family-members-link").should("be.visible").click();
    cy.url().should("include", "/admin/add-members");
    cy.get("input[name='name']").type("Automated User");
    cy.get("input[name='lastName']").type("Automated User Last Name");
    const email = `${Math.random() * 100}@autoTest.com`;
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("123");
    cy.get("select[name='family']").select("User");
    cy.get("#back-button").should("be.visible");
    cy.get("#add-family-member-button").should("be.visible").click();
    cy.url().should("include", "/admin");
  });

  it("adding family budget", () => {
    cy.login("admin@admin.pl", "admin");
    cy.get("#admin-panel-link").should("be.visible").click();
    cy.get("#add-family-budget-link").should("be.visible").click();
    cy.url().should("include", "/admin/add-budget");
    cy.get("select[name='family']").select("User");
    cy.get("#addBtn").click();
    cy.get("#addBtn").click();
    cy.get("#addBtn").click();
    cy.get("#subtractBtn").click();
    cy.get("#back-button").should("be.visible");
    cy.get("#save-button").should("be.visible").click();
    cy.url().should("include", "/admin");
  });
});
