describe('Todo app', () => {
    beforeEach(() => {
        cy.task('resetDb');
    });

    it('should have right element visible', () => {
        cy.visit('http://localhost:3000');

        cy.findByText('TODOs tRPC').should('exist');

        // No todo yet
        cy.findByText('0 item(s) left').should('exist');

        // Check the available action when not logged in
        cy.findByRole('button', { name: 'Sign-in' }).should('exist');
        cy.findByRole('button', { name: 'Upload a file' }).should('exist');
        // The clear button is not available because not logged in
        cy.findByRole('button', { name: 'Clear todos' }).should('not.exist');
    })

    it('should be able to add todo and complete it', () => {
        cy.visit('http://localhost:3000');

        cy.findByText('0 item(s) left').should('exist');

        // Let's add a todo
        cy.findByPlaceholderText('What do you need to do?').type('New todo{enter}');

        cy.findByText('1 item(s) left').should('exist');
        cy.findByRole('listitem').findByText('New todo').should('exist');

        // The input should be cleared after posting the new todo
        cy.findByPlaceholderText('What do you need to do?').should('have.value', '');

        cy.findByRole('listitem').findByRole('checkbox').should('not.be.checked');

        // Let's mark the todo as completed
        cy.findByRole('listitem').findByRole('checkbox').check();

        cy.findByRole('listitem').findByRole('checkbox').should('be.checked');

        // No more todo to do
        cy.findByText('0 item(s) left').should('exist');
    });

    it('should be able to upload a file', () => {
        cy.visit('http://localhost:3000');

        // cy.findByRole('button', { name: 'Upload a file' }).selectFile('files/exampleTodosImport.csv');
        cy.get('input[type=file]').selectFile('files/exampleTodosImport.csv', { force: true });

        cy.findAllByRole('listitem').should('have.length', 3);
        cy.findByText('3 item(s) left').should('exist');
    });

    it('when logged in should be able to clear the list', () => {
        cy.visit('http://localhost:3000');

        // Let's add a todo
        cy.findByPlaceholderText('What do you need to do?').type('New todo{enter}');

        cy.findByText('1 item(s) left').should('exist');
        cy.findByRole('listitem').findByText('New todo').should('exist');

        cy.findByRole('button', { name: 'Sign-in' }).click();
    });
});

// No isolated module
export { };
