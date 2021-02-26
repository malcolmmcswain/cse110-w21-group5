describe('Party Horn Tests', () => {
    beforeEach(() => {
      cy.visit('index.html');
    });
  
    it('Dummy Test', () => {
      expect(true).to.equal(true);
    });

    it('Clicking on start button starts the timer', () => {
        cy.get("#start").click();
        cy.get("#time").then(function($el) {
            expect($el).to.have.value("");
        });
    });
});