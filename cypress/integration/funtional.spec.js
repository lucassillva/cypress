/// <reference types='cypress'/>

describe('Tests Functional', () => {
    before(() => {
        cy.visit('https://barrigareact.wcaquino.me/')
    })

    it('Login', () => {
        cy.get('.input-group > .form-control').type('lucassillva.eng@gmail.com')
        cy.get(':nth-child(2) > .form-control').type('sa134625')
        cy.get('.btn').click()
        cy.get('.toast-message').should('exist')
    })

    it('Inserir Conta', () => {
        cy.get('.dropdown-toggle').click()
        cy.get('[href="/contas"]').click()
        cy.get('.form-control').type('Teste Lucas')
        cy.get('.btn').click()
        cy.get('.table > :nth-child(2) > :nth-child(1) > :nth-child(1)').should('have.text', 'Teste Lucas')
    })

    it('Alterar Conta', () => {
        cy.wait(5000)
        cy.get(':nth-child(1) > :nth-child(2) > :nth-child(1) > .far').click()
        cy.get('.form-control').clear().type('Teste Lucas')
        cy.get('[Alt="Salvar"]').click()
        cy.get('.toast').should('exist')
    })

})