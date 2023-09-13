/// <reference types='cypress'/>

it.only('Fixture tests', () => {
    it('Get data form fixture file', () => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })
})