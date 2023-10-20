/// <reference types='cypress'/>

import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Tests Functional', () => {
    before(() => {
        cy.login('a@a.com', 'a')
        cy.resetApp()
    })

    beforeEach(() => {
        cy.get(loc.MENU.INICIAL).click()
        cy.resetApp()
        cy.wait(2000)
    })

    it('Should create an account', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Teste Lucas')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.BTN_ALTERAR).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('have.text', 'Conta atualizada com sucesso!')
    })

    it('Should not create an account with same name', () => {
        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should create a transaction', () => {
        cy.get(loc.MENU.MOVIMENT).click()
        cy.get(loc.MOVIMENTAÇÃO.DESCRICAO).type('Teste Movimento')
        cy.get(loc.MOVIMENTAÇÃO.VALOR).type('1000')
        cy.get(loc.MOVIMENTAÇÃO.INTERESSADO).type('Teste Interessado')
        cy.get(loc.MOVIMENTAÇÃO.CONTA).select('Conta para movimentacoes')
        cy.get(loc.MOVIMENTAÇÃO.BTN_STATUS).click()
        cy.get(loc.MOVIMENTAÇÃO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.get(loc.EXTRATO.LINHAS).should('contain', 'Teste Movimento')
    })

    it('Should get balance', () => {
        cy.get(loc.MENU.INICIAL).click()
        cy.get(loc.SALDO.TABLE_CONTAS).contains('Conta para saldo').should('exist')
        cy.get(loc.SALDO.TABLE_CONTAS).contains('534,00').should('exist')

        cy.get(loc.MENU.EXTRATO).click()
        cy.findButtonAlterar()

        cy.get(loc.MOVIMENTAÇÃO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo')
        cy.get(loc.MOVIMENTAÇÃO.BTN_STATUS).click()
        cy.get(loc.MOVIMENTAÇÃO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.wait(100)
        cy.get(loc.MENU.INICIAL).click()

    })

    it('Should remove a transaction', () => {
        cy.get(loc.MENU.EXTRATO).click()
        cy.get(loc.EXTRATO.LINHAS).should('contain', 'Movimentacao 2, calculo saldo')
        cy.get(loc.EXTRATO.BTN_EXCLUIR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
        cy.get(loc.EXTRATO.LINHAS).should('not.contain', 'Movimentacao 2, calculo saldo')
    })
})