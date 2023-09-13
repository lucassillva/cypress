/// <reference types='cypress'/>

describe('Work with clock', () => {
    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    it('Clock', () => {
        cy.get('#buttonNow').click()
        cy.get('#resultado > :nth-child(1)').should('contain', '08/09/2023')

        // cy.clock()
        // cy.get('#buttonNow').click()
        // cy.get('#resultado > :nth-child(1)').should('contain', '08/09/2023')

        const data = new Date(2023, 1, 10, 20, 30, 10)
        cy.clock(data.getTime())
        cy.get('#buttonNow').click()
        cy.get('#resultado > :nth-child(1)').should('contain', '10/05/2023')
    })

    it.only('Ticks...', () => {
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > :nth-child(1)').should('contain', '0')
        cy.get('#resultado > :nth-child(1)').invoke('text').should('gte', '0')

        cy.clock()
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > :nth-child(1)').invoke('text').should('lte', '0')
        // cy.wait(1000)
        // cy.get('#buttonTimePassed').click()
        // cy.get('#resultado > :nth-child(1)').invoke('text').should('lte', '16942045')

        cy.tick(5000)
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > :nth-child(1)').invoke('text').should('gte', '3000')

        cy.tick(10000)
        cy.get('#buttonTimePassed').click()
        cy.get('#resultado > :nth-child(1)').invoke('text').should('lte', '15000')

    })
})