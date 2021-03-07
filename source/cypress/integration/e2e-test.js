/**
 * To see code coverage report, follow the instructions:
 * 1. Run <npm install -D @cypress/code-coverage> in /source folder
 * 2. Run <npx nyc instrument --compact=false js instrumented> in /source folder
 * 3. Uncomment certain lines in cypress/plugins/index.js and cypress/support/index.js (details in corresponding files)
 * 4. Change the following lines in index.html: 
 *      <script src="js/project.js"></script>
        <script src="js/timer.js"></script>
        <script src="js/pomodoro.js"></script>
    to 
        <script src="instrumented/project.js"></script>
        <script src="instrumented/timer.js"></script>
        <script src="instrumented/pomodoro.js"></script>
*  5. Code report can be found in /source/coverage 
 */


describe('Tests for pomodoro', () => {
    beforeEach(() => {
      cy.visit('index.html');
    });
  
    it('Dummy Test', () => {
      expect(true).to.equal(true);
    });

    it('Clicking on hamburger button shows the task list', () => {
        cy.get("#hamburger").click();
        cy.get("#project-list").then(function($el) {
            expect($el).to.have.attr("style", "opacity: 1; pointer-events: all;")
        });
    });

    it('Clicking on hamburger button twice hides the task list', () => {
        cy.get("#hamburger").click();
        cy.get("#hamburger").click();
        cy.get("#project-list").then(function($el) {
            expect($el).to.have.attr("style", "opacity: 0; pointer-events: none;")
        });
    });

    it('Task list is not visible at default', () => {
        cy.get("#create-modal").should("not.be.visible");
    });


    it('Clicking on add-project button opens the pop up window', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#create-modal").should("be.visible");
    });

    it('Add a new task', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();
        cy.get("#project-list").eq(0).should("contain.text", "Test");
    });

    it('Edit the name of a task', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();
        cy.get("ion-icon[name='create-outline']").eq(1).click();
        cy.get("#edit-modal").should("be.visible");

        cy.get("#edit-project-name").clear().type("Edit");
        cy.get("#edit-project").click();
        cy.get("#project-list").eq(0).should("contain.text", "Edit");
    });

    it('Delete a task', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();
        cy.get("ion-icon[name='trash-outline']").eq(1).click();
        cy.get("#project-list").eq(0).should("contain.text", "My Project"); // This project is default in list
    });


    it('Clicking on start button starts the timer', () => {
        cy.clock();
        cy.get("#start").click();
        cy.tick(1000 * 60);
        cy.get("#time").should("have.text", "24:00"); // Now work session is set for 00:06
        // TODO: Change this to dynamically get time left from settings menu
    });

    it('Clicking on reset button resets the clock', () => {
        cy.get("#start").click();
        cy.wait(500);
        cy.get("#reset").click();
        cy.get("#time").should("have.text", "00:00");
    });



});