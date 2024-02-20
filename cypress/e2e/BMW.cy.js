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

  bmw.forEach(el => {
    it(`Test brand: ${el.brand} car: ${el.veh_desc}, year: ${el.car_year}, campaign: ${el.campaign},sum_insure: ${el.sum_insure}` , () => {
      let info = {
        promoCode: null,
        homePlus: false,
        extraPlus: false
      }

      e2e.selectCar(el)
      e2e.selectPlan(el)
      e2e.purchaseInfo(el, info)

      cy.log(`Plan code -> ${el.code}: SUCCESS!`)
    })
  });
})