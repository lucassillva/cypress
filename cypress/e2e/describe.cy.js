/// <reference types='cypress'/>

it.only('A external test...', () => {

})

describe('should group teste...', () => {
    describe('should group more specific test...', () => {
        it('A specific test...', () => {

        })
    })
    describe('should group more specific test...', () => {
        it('A specific test 2...', () => {

        })
    })

    it.only('A internal test...', () => {

    })
})