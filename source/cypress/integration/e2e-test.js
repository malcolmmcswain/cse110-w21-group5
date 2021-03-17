/**
 * To run test, go in /source folder then run command: <../node_modules/.bin/cypress open>
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


describe('Keyboard shortcuts', () => {
    beforeEach(() => {
        cy.visit('index.html');
    });

    it('Press enter key to start', () => {
        cy.get('body').trigger('keydown', { keycode: 13, release: true });
        cy.clock();
        cy.get("#time").should("have.text", "00:00");
        cy.get("#start").click();
        cy.tick(1000 * 60);
        cy.get("#time").should("have.text", "24:00");
    });

    it('Press "l" key to log', () => {
        cy.clock();
        cy.get("#start").click();
        cy.tick(1000);
        cy.get('body').type("l")
        cy.get("#log-modal").should("be.visible");
    });

    it('Press "r" key to reset', () => {
        cy.clock();
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#time").should("have.text", "24:59");
        cy.get('body').type("r");
        cy.get("#time").should("have.text", "00:00");
    });


    it('Press "t" key to open task list', () => {
        cy.get('body').type("t");
        cy.get("#project-list").should("be.visible");
        
    });






});


describe('Info page', () => {
    beforeEach(() => {
        cy.visit('index.html');
    });

    it('Info page is closed at default', () => {
        cy.get("#thematic-modal").should("not.be.visible");
        cy.get("#explicit-modal").should("not.be.visible");
    });

    it('Clicking on info button opens the thematic info page', () => {
        cy.get("#info-btn").click();
        cy.get("#thematic-modal").should("be.visible");

        cy.get("#close-thematic-modal").click();
        cy.get("#thematic-modal").should("not.be.visible");
    });

    it('Clicking on next button the thematic info page leads to the explicit info page', () => {
        cy.get("#info-btn").click();
        cy.get("#to-explicit-modal").click();
        cy.get("#thematic-modal").should("not.be.visible");
        cy.get("#explicit-modal").should("be.visible");

        cy.get("#close-explicit-modal").click();
        cy.get("#explicit-modal").should("not.be.visible");
    });

    it('Clicking on "Got it" button closes the info page', () => {
        cy.get("#info-btn").click();
        cy.get("#to-explicit-modal").click();
        cy.get("#finish-info").click();
        cy.get("#explicit-modal").should("not.be.visible");
        cy.get("#thematic-modal").should("not.be.visible");
    });    
});

describe('Tests for start button', () => {
    beforeEach(() => {
        cy.visit('index.html');
      });
    
      it('Dummy Test', () => {
        expect(true).to.equal(true);
      });

    it('Clicking on start button starts the timer', () => {

        cy.get("#options-btn").click();
        cy.get("#pom-length").clear().type("25");
        cy.get("#save-options").click();
        cy.clock();
        cy.get("#time").should("have.text", "00:00");
        cy.get("#start").click();
        cy.tick(1000 * 60);
        cy.get("#time").should("have.text", "24:00");
    });
});


describe('Tests for options menu', () => {
    beforeEach(() => {
      cy.visit('index.html');
    });


    it('Alert sound button turns off alert correctly', () => {
        cy.get("#options-btn").click();
        cy.get("#alert-sound-wrap").click();
        cy.get("#save-options").click().should(() => {
            expect(localStorage.getItem("alertSound")).to.eq("false");
        });
    });

    it('Ticking sound button turns off ticking correctly', () => {
        cy.get("#options-btn").click();
        cy.get("#ticking-sound-wrap").click();
        cy.get("#save-options").click().should(() => {
            expect(localStorage.getItem("tickingSound")).to.eq("false");
        });
    });

    it('Alert sound button turns off alert correctly', () => {
        cy.get("#options-btn").click();
        cy.get("#alert-sound-wrap").click();
        cy.get("#save-options").click().should(() => {
            expect(localStorage.getItem("alertSound")).to.eq("false");
        });
    });




    it('Clicking on options button opens and closes the options menu', () => {
        cy.get("#options-btn").click();
        cy.get("#options-panel").should("be.visible");

        cy.get("#options-btn").click();
        cy.get("#options-panel").should("not.be.visible");
    });


    it('Options menu correctly controls timer settings & timer transitions between sessions correctly', () => {
        cy.get("#options-btn").click();
        cy.get("#pom-length").clear().type("5");
        cy.get("#short-length").clear().type("1");
        cy.get("#long-length").clear().type("2");
        cy.get("#cycle-length").clear().type("2");
        cy.get("#save-options").click();
        cy.clock();

        cy.get("#start").click();

        // Working session 1
        cy.tick(1000);
        cy.get("#time").should("have.text", "04:59");
        cy.tick(1000 * (60 * 5 - 1));

        // Short break session
        cy.tick(1000);
        cy.get("#time").should("have.text", "00:59");
        cy.tick(1000 * (60 * 1 - 1));

        // Working session 2
        cy.tick(1000);
        cy.get("#time").should("have.text", "04:59");
        cy.tick(1000 * (60 * 5 - 1));

        // Long break session 
        cy.tick(1000);
        cy.get("#time").should("have.text", "01:59");
        cy.tick(1000 * (60 * 2 - 1));

        // New working session
        cy.tick(1000);
        cy.get("#time").should("have.text", "04:59");
    });


    it('Reduce motion functions correctly', () => {
        cy.get("#options-btn").click();
        cy.get("#reduce-motion-wrap").click();
        cy.get("#save-options").click();
        cy.get("#rings").then(function($el) {
            expect($el).to.have.css("display", "none");
        });
        cy.get("#start").click();
        cy.clock();

        cy.tick(1000);
        cy.get("#rings").then(function($el) {
            expect($el).to.have.css("display", "none");
        });
        cy.get("#reduce-motion-wrap").click();
        cy.get("#save-options").click();
        cy.get("#rings").then(function($el) {
            expect($el).to.have.css("display", "block");
        });

        cy.tick(1000);
        cy.get("#rings").then(function($el) {
            expect($el).to.have.css("display", "block");
        });
        cy.get("#reduce-motion-wrap").click();
        cy.get("#save-options").click();
        cy.get("#rings").then(function($el) {
            expect($el).to.have.css("display", "none");
        });



    });

});

describe('Tests for status icon', () => {
    beforeEach(() => {
        cy.visit('index.html');
        cy.get("#options-btn").click();
        cy.get("#pom-length").clear().type("1");
        cy.get("#short-length").clear().type("1");
        cy.get("#long-length").clear().type("1");
        cy.get("#cycle-length").clear().type("2");
        cy.get("#save-options").click();
        cy.clock();

    });

    it('Default is stopped', () => {
        cy.get("#pomodoro-state-icon").should("have.attr","src", "./media/pomodoro.png");
    });

    it('Working session', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#pomodoro-state-icon").should("have.attr", "src", "./media/pomodoro.png");
    });

    it('Short break session', () => {
        cy.get("#start").click();
        cy.tick(1000 * (1 * 60));

        cy.tick(1000);
        cy.get("#pomodoro-state-icon").should("have.attr", "src", "./media/short-break.png");
    });

    it('Long break session', () => {
        cy.get("#start").click();
        cy.tick(1000 * (3 * 60));

        cy.tick(1000);
        cy.get("#pomodoro-state-icon").should("have.attr", "src", "./media/long-break.png");
    });

    it('Press reset', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#reset").click()
        cy.get("#pomodoro-state-icon").should("have.attr", "src", "./media/pomodoro.png");
    });


});


describe('Tests for task list', () => {

    beforeEach(() => {
        cy.visit('index.html');
    });

    it('Clicking on hamburger button shows the task list', () => {
        cy.get("#hamburger").click();
        cy.get("#project-list").should("be.visible");
    });

    it('Clicking on hamburger button twice hides the task list', () => {
        cy.get("#hamburger").click();
        cy.get("#hamburger").click();
        cy.get("#project-list").should("not.be.visible");
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
        cy.get(".project-item").should("have.length", 2)
        cy.get(".project-item").eq(0).should("contain.text", "My Project");
        cy.get(".project-item").eq(1).should("contain.text", "Test");
    });

    it('Add multiple new tasks', () => {
        cy.get("#hamburger").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test1");
        cy.get("#add-new-project").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test2");
        cy.get("#add-new-project").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test3");
        cy.get("#add-new-project").click();

        cy.get(".project-item").should("have.length", 4);
        cy.get(".project-item").eq(0).should("contain.text", "My Project");
        cy.get(".project-item").eq(1).should("contain.text", "Test1");
        cy.get(".project-item").eq(2).should("contain.text", "Test2");
        cy.get(".project-item").eq(3).should("contain.text", "Test3");
    });


    it('Edit the name of a task', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();
        cy.get(".edit-task").eq(1).click();
        cy.get("#edit-modal").should("be.visible");

        cy.get("#edit-project-name").clear().type("Edit");
        cy.get("#edit-project").click();
        cy.get(".project-item").eq(1).should("contain.text", "Edit");
    });

    it('Delete a task', () => {
        cy.get("#hamburger").click();
        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();
        cy.get(".delete-task").eq(1).click();
        cy.get(".project-item").should("have.length", 1);
        cy.get(".project-item").eq(0).should("contain.text", "My Project"); // This project is default in list
    });

    it('Adding duplicate project should show an alert', () => {
        cy.get("#hamburger").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test1");
        cy.get("#add-new-project").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test1");
        cy.get("#add-new-project").click();

        cy.on("window:alert", (txt) => {
            expect(txt).to.contains("Project already exists!");
        });
    });

    it('Change project should switch to another project and restore corresponding timer', () => {
        cy.get("#options-btn").click();
        cy.get("#pom-length").clear().type("1");
        cy.get("#short-length").clear().type("1");
        cy.get("#long-length").clear().type("1");
        cy.get("#cycle-length").clear().type("2");
        cy.get("#save-options").click();
        cy.clock();


        cy.get("#hamburger").click();

        cy.get("#add-project").click();
        cy.get("#project-name").clear().type("Test");
        cy.get("#add-new-project").click();

        cy.get("#start").click();
        cy.tick(1000 * 1 * 60); // Pass first working session
        cy.tick(1000 * 1 * 60); // Pass first short break

        cy.get(".project-item").eq(1).click(); // Click "Test"
        cy.get("#pomodoro-state-text").should("contain.text", "0");

        cy.get(".project-item").eq(0).click(); // Click "My Project"
        cy.get("#pomodoro-state-text").should("contain.text", "2");
    });

});

describe('Tests for distraction log', () => {

    beforeEach(() => {
        cy.visit('index.html');
        cy.get("#options-btn").click();
        cy.get("#pom-length").clear().type("1");
        cy.get("#short-length").clear().type("1");
        cy.get("#long-length").clear().type("1");
        cy.get("#cycle-length").clear().type("2");
        cy.get("#save-options").click();
        cy.clock();
    });

    it('Log button is hided when stopped', () => {
        cy.get("#stop").should("not.be.visible");
    });

    it('Clicking on log button opens a pop up to log distraction', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#stop").should("be.visible");
        cy.get("#stop").click();
        cy.get("#log-modal").should("be.visible");
    });

    it('Clicking on close button closes the pop up window for log', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#stop").click();
        cy.get("#close-log-modal").should("be.visible");
        cy.get("#close-log-modal").click();
        cy.get("#log-modal").should("not.be.visible");
    });


    it('Add a log message', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test1");
        cy.get("#log-btn").click();
        cy.get("#log-modal").should("not.be.visible");

        cy.tick(1000 * (1 * 60 - 1));

        cy.tick(1000);
        cy.get("#distraction-container").should("be.visible");
        cy.get("#log-list").should("have.length", 1);
        cy.get("#log-list").eq(0).should("contain.text", "Test1");
    });


    it('Add more than 5 log messages, then log list should only contain the most recently added 5 items', () => {
        cy.get("#start").click();
        cy.tick(1000);
        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test1");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test2");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test3");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test4");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test5");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test6");
        cy.get("#log-btn").click();

        cy.get("#stop").click();
        cy.get("#distraction").clear().type("Test7");
        cy.get("#log-btn").click();

        cy.tick(1000 * (1 * 60 - 1));

        cy.tick(1000);
        cy.get("#distraction-container").should("be.visible");
        cy.get(".log-item").should("have.length", 5);
        cy.get(".log-item").eq(0).should("contain.text", "Test3");
        cy.get(".log-item").eq(1).should("contain.text", "Test4");
        cy.get(".log-item").eq(2).should("contain.text", "Test5");
        cy.get(".log-item").eq(3).should("contain.text", "Test6");
        cy.get(".log-item").eq(4).should("contain.text", "Test7");

    });



});