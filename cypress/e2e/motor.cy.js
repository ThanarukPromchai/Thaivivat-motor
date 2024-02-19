import * as e2e from "../support/e2e";
import * as dateUtils from "../utils/dateUtils";



describe('template spec', () => {

  let timestamp = ""

  beforeEach(() => {
    cy.viewport(1920, 1024)

    cy.wrap({
      timestamp: dateUtils.formatPad2(new Date())
    }).as('init')

    cy.visit("https://beta.thaivivat.co.th/campaign/prepaid");
  })

  it.skip('mysql connection', ()=>{
    cy.task("queryDb", "SELECT * from car_model c WHERE c.brand = 'AION';")
      .then(res => {
        cy.log(res[0].veh_cat)
      })
  })

  it('Extra plus AION type 1 plan 365, 730', ()=>{
    let info = {
      brand: "AION",
      planType: "1",
      planDate: [
        "365", 
        "730"
      ],
      // promoCode: "",
      homePlus: false,
      extraPlus: true,
    }

    e2e.promoMotor(info)
  })

  it.only('BMW type 1 plan 365, 730', ()=>{
    let info = {
      brand: "BMW",
      planType: "1",
      planDate: [
        "365", 
        "730"
      ],
      // promoCode: "",
      homePlus: false,
      extraPlus: false,
    }

    e2e.promoMotor(info)
  })
})