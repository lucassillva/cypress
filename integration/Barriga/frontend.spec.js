/// <reference types='cypress'/>

import loc from '../../support/locators'
import '../../support/commandsContas'
import buildEnv from '../../support/buildEnv'

describe('Tests Functional', () => {
    after(() => {
        cy.clearLocalStorage()
    })
    
    beforeEach(() => {
        buildEnv()
        cy.login('a@a.com', 'a')
        cy.get(loc.MENU.INICIAL).click()
        cy.wait(2000)
    })

    it('Should create an account', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response:
                {"id":3, "nome":"Teste Lucas","visivel":true,"usuario_id":1}
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { "id": 1, "nome": "Conta falsa recuperada", "visivel": true, "usuario_id": 1 },
                { "id": 2, "nome": "Conta falsa 2", "visivel": true, "usuario_id": 1 },
                { "id": 3, "nome": "Teste Lucas", "visivel": true, "usuario_id": 1 }
            ]
        }).as('contasSave')

        cy.inserirConta('Teste Lucas')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.route({
            method: 'PUT',
            url: '/contas/**',
            response:
                { "id": 1, "nome": "Conta alterada", "visivel": true, "usuario_id": 1 },
        })

        cy.acessarMenuConta()
        cy.get(loc.CONTAS.BTN_ALTERAR).click()
        cy.get(loc.CONTAS.NOME).clear().type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('have.text', 'Conta atualizada com sucesso!')
    })

    it('Should not create an account with same name', () => {
        cy.route({
            method: 'POST',
            url: '/contas',
            response:
                {error: "Já existe uma conta com esse nome!"},
                status: 400
        }).as('saveContaMesmoNome')

        cy.acessarMenuConta()
        cy.get(loc.CONTAS.NOME).type('Conta mesmo nome')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'code 400')
    })

    it('Should create a transaction', () => {
        cy.route({
            method: 'POST',
            url: '/transacoes',
            response: {"id": 1792952,"descricao": "teste","envolvido": "lucas","observacao": null,"tipo": "REC","data_transacao": "2023-09-25T03:00:00.000Z","data_pagamento": "2023-09-25T03:00:00.000Z","valor": "10000.00","status": false,"conta_id": 1911587,"usuario_id": 41241,"transferencia_id": null,"parcelamento_id": null}
        })

        cy.route({
            method: 'GET',
            url: '/extrato/**',
            response: 'fixture:movimentacaoSalva'
        })

        cy.get(loc.MENU.MOVIMENT).click()
        cy.get(loc.MOVIMENTAÇÃO.DESCRICAO).type('Teste Movimento')
        cy.get(loc.MOVIMENTAÇÃO.VALOR).type('1000')
        cy.get(loc.MOVIMENTAÇÃO.INTERESSADO).type('Teste Interessado')
        cy.get(loc.MOVIMENTAÇÃO.CONTA).select('Conta falsa recuperada')
        cy.get(loc.MOVIMENTAÇÃO.BTN_STATUS).click()
        cy.get(loc.MOVIMENTAÇÃO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Movimentação inserida com sucesso!')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.get(loc.EXTRATO.LINHAS).should('contain', 'Teste Movimento')
    })

    it('Should get balance', () => {
        cy.route({
            method: 'GET',
            url: '/transacoes/**',
            response: 
            {"conta": "Conta para saldo","id": 1791436,"descricao": "Movimentacao 1, calculo saldo","envolvido": "CCC","observacao": null,"tipo": "REC","data_transacao": "2023-09-22T03:00:00.000Z","data_pagamento": "2023-09-22T03:00:00.000Z","valor": "3500.00","status": false,"conta_id": 1911590,"usuario_id": 41241,"transferencia_id": null,"parcelamento_id": null},
        })

        cy.route({
            method: 'PUT',
            url: '/transacoes/**',
            response: 
            {"conta": "Conta para saldo","id": 1791436,"descricao": "Movimentacao 1, calculo saldo","envolvido": "CCC","observacao": null,"tipo": "REC","data_transacao": "2023-09-22T03:00:00.000Z","data_pagamento": "2023-09-22T03:00:00.000Z","valor": "3500.00","status": false,"conta_id": 1911590,"usuario_id": 41241,"transferencia_id": null,"parcelamento_id": null},
        })

        cy.get(loc.MENU.INICIAL).click()
        cy.get(loc.SALDO.TABLE_CONTAS).contains('Carteira').should('exist')
        cy.get(loc.SALDO.TABLE_CONTAS).contains('100,00').should('exist')

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
        cy.route({
            method: 'DELETE',
            url: 'transacoes/**',
            response: {},
            status: 204
        }).as('del')

        cy.get(loc.MENU.EXTRATO).click()
        cy.get(loc.EXTRATO.LINHAS).should('contain', 'Movimentacao 2, calculo saldo')
        cy.get(loc.EXTRATO.BTN_EXCLUIR).click()


        cy.get(loc.MESSAGE).should('contain', 'Movimentação removida com sucesso!')
    })

    it.only('Should validate data send to create an account', () => {
        const reqStub = cy.stub()
        cy.route({
            method: 'POST',
            url: '/contas',
            response:
                {"id":3, "nome":"Teste Lucas","visivel":true,"usuario_id":1},
            // onRequest: req => {
            //     console.log(req)
            //     expect(req.request.body.nome).to.be.empty
            //     expect(req.request.headers).to.have.property('Authorization')
            // }    
            onRequest: reqStub
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.route({
            method: 'GET',
            url: '/contas',
            response: [
                { "id": 1, "nome": "Conta falsa recuperada", "visivel": true, "usuario_id": 1 },
                { "id": 2, "nome": "Conta falsa 2", "visivel": true, "usuario_id": 1 },
                { "id": 3, "nome": "Teste Lucas", "visivel": true, "usuario_id": 1 }
            ]
        }).as('contasSave')

        cy.inserirConta('{CONTROL}')
        // cy.wait('@saveConta').its('request.body.nome').should('not.be.empty')
        cy.wait('@saveConta').then(() => {
            console.log(reqStub.args[0][0])
            expect(reqStub.args[0][0].request.body.nome).to.be.empty
            expect(reqStub.args[0][0].request.headers).to.have.property('Authorization')
        })
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it.only('Should test the responsiveness', () => {
        cy.get('[data-test=menu-home]').should('exist')
            .and('be.visible')
        cy.viewport(500, 700)
        cy.get('[data-test=menu-home]').should('exist')
        .and('be.not.visible')
        cy.viewport('iphone-5')
        cy.get('[data-test=menu-home]').should('exist')
        .and('be.not.visible')
        cy.viewport('ipad-2')
        cy.get('[data-test=menu-home]').should('exist')
        .and('be.visible')
    })
})