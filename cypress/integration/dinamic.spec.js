/// <reference types='cypress'/>

describe('Work with dinamics', () => {
    beforeEach(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    const foods = ['carne', 'frango', 'pizza', 'vegetariano']
    foods.forEach(food => {
        it(`Dinamics tests, comida ${food}`, () => {
            cy.get('#formNome').type('Lucas')
            cy.get('#formSobrenome').type('teste')
            cy.get('[name=formSexo][value=F]').click()
            cy.get(`[name=formComidaFavorita][value=${food}]`).click()
            cy.get('#formEscolaridade').select('Doutorado')
            cy.get('#formEsportes').select('Corrida')
            cy.get('#formCadastrar').click()
            cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
        })

        it.only('Working with each', () => {
            cy.get('#formNome').type('Lucas')
            cy.get('#formSobrenome').type('teste')
            cy.get('[name=formSexo][value=F]').click()
            cy.get('[name=formComidaFavorita]').each($el => {
                if ($el.val() != 'vegetariano') {
                    cy.wrap($el).click()
                }
            })
            cy.get('#formEscolaridade').select('Doutorado')
            cy.get('#formEsportes').select('Corrida')
            cy.get('#formCadastrar').click()
            cy.get('#resultado > :nth-child(1)').should('contain', 'Cadastrado!')
        })
    })

})  