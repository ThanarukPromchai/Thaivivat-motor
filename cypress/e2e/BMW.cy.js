import * as e2e from "../support/e2e";
import * as dateUtils from "../utils/dateUtils";

const bmw = Cypress.env('bmw')

describe('fuction spec', () => {

  beforeEach(() => {
    cy.viewport(1920, 1024)
    cy.wrap({
      timestamp: dateUtils.formatPad2(new Date())
    }).as('init')
    cy.visit("https://beta.thaivivat.co.th/campaign/prepaid");
  })

  bmw.forEach(element => {
    it(`Test car: ${element.veh_desc}`, () => {
      let info = {
        promoCode: null,
        homePlus: false,
        extraPlus: false
      }

      e2e.selectCar(element)
      e2e.selectPlan(element)
      e2e.purchaseInfo(element, info)

      cy.log(`Plan code -> ${element.code}: SUCCESS!`)
    })
  });
})