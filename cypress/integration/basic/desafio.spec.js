/// <reference types='cypress'/>

describe('Work with alerts', () => {
    before(() => {
        cy.visit('https://www.wcaquino.me/cypress/componentes.html')
    })

    beforeEach(() => {
        cy.reload()
    })

    // it('Cadastrar sem campo obrigatórios', () => {
    //     cy.get('#formCadastrar').click()
    //     cy.on('window:alert', msg => {
    //         expect(msg).to.be.equal('Nome eh obrigatorio')
    //     })

    // })

    // it('Cadastrar com apenas o campo Nome preenchido', () => {
    //     cy.get('#formNome').type('Teste')
    //     cy.get('#formCadastrar').click()
    //     cy.on('window:alert', msg => {
    //         expect(msg).to.be.equal('Sobrenome eh obrigatorio')

    //     })
    // })

    // it('Cadastrar com apenas os campos Nome e Sobrenome preenchidos', () => {
    //     cy.get('#formNome').type('Teste')
    //     cy.get('[data-cy=dataSobrenome]').type('Teste')
    //     cy.get('#formCadastrar').click()
    //     cy.on('window:alert', msg => {
    //         expect(msg).to.be.equal('Sexo eh obrigatorio')

    //     })
    // })

    // it('Cadastrar com os campos Nome, Sobrenome e Sexo Masculino preenchidos', () => {
    //     cy.get('#formNome').type('Teste')
    //     cy.get('[data-cy=dataSobrenome]').type('Teste')
    //     cy.get('#formSexoMasc').click()
    //     cy.get('#formCadastrar').click()
    //     cy.get('#resultado > :nth-child(1)').should('contain.text', 'Cadastrado!')
    // })

    // it('Cadastrar com os campos Nome, Sobrenome e Sexo Feminino preenchidos', () => {
    //     cy.get('#formNome').type('Teste')
    //     cy.get('[data-cy=dataSobrenome]').type('Teste')
    //     cy.get('#formSexoFem').click()
    //     cy.get('#formCadastrar').click()
    //     cy.get('#resultado > :nth-child(1)').should('contain.text', 'Cadastrado!')
    // })

    it.only('Validando Mensagens', () => {
        const stub = cy.stub().as('alert')
        cy.on('window:alert', stub)
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio'))

        cy.get('#formNome').type('Lucas')
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio'))

        cy.get('[data-cy=dataSobrenome]').type('Teste')
        cy.get('#formCadastrar').click()
            .then(() => expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio'))

        cy.get('#formSexoMasc').click()
        cy.get('#formCadastrar').click()
        cy.get('#resultado > :nth-child(1)').should('contain.text', 'Cadastrado!')
    })
})