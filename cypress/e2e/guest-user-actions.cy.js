/// <reference types="cypress" />

describe("not logged in user navigation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("displays the title", () => {
    cy.get("h1").should("have.text", "Welcome in Family Expenses Web App!");
  });

  it("displays all links and their urls", () => {
    cy.get("#login-link")
      .should("have.text", "login")
      .and("be.visible")
      .and("have.attr", "href", "/login");
    cy.get("#register-link")
      .should("have.text", "register")
      .and("be.visible")
      .and("have.attr", "href", "/account");
    cy.get("#expenses-panel-link")
      .should("have.text", "here")
      .and("have.attr", "href", "/expenses");
    cy.get("#home-link")
      .should("have.text", "home")
      .and("have.attr", "href", "/");
  });

  it("checks all routes for not-logged-in users including admin panel", () => {
    cy.get("#login-link").click();
    cy.url().should("include", "/login");
    cy.get("#register-link").click();
    cy.url().should("include", "/account");
    cy.get("#home-link").click();
    cy.url().should("include", "/");
    cy.get("#expenses-panel-link").click();
    cy.url().should("include", "/login");
    cy.get("#home-link").click();
    cy.url().should("include", "/");
    cy.get("#admin-panel-link").should("not.exist");
  });
});

describe("register user", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("register user, then login", () => {
    cy.get("#register-link").click();
    cy.url().should("include", "/account");
    cy.get("#admin-btn").should("exist").and("be.visible");
    cy.get("#user-btn").should("exist").and("be.visible");
    cy.get("#back-btn").should("exist").and("be.visible");
    cy.get("#user-btn").click();
    cy.url().should("include", "/account/user");
    cy.get("input[name='name']").type("Automated User");
    cy.get("input[name='lastName']").type("Automated User");
    const email = `${Math.random() * 100}@autoTest.com`;
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("123");
    cy.get("select[name='family']").select("User");
    cy.get("#create-btn").click();
    cy.url().should("include", "?success=true");
    cy.login(email, "123");
  });

  it("register admin, then login", () => {
    cy.get("#register-link").click();
    cy.url().should("include", "/account");
    cy.get("#admin-btn").should("exist").and("be.visible");
    cy.get("#user-btn").should("exist").and("be.visible");
    cy.get("#back-btn").should("exist").and("be.visible");
    cy.get("#admin-btn").click();
    cy.url().should("include", "/account/admin");
    cy.get("input[name='name']").type("Automated User");
    cy.get("input[name='lastName']").type("Automated User");
    const email = `${Math.random() * 100}@autoTest.com`;
    cy.get("input[name='email']").type(email);
    cy.get("input[name='password']").type("123");
    cy.get("#create-btn").click();
    cy.url().should("include", "?success=true");
    cy.login(email, "123");
  });
});
