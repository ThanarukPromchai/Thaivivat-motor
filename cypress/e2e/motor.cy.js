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

  it('Extra plus AION type 2 plan 365, 730', ()=>{
    let info = {
      brand: "AION",
      planType: "2",
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

  it('BMW type 2 plan 365, 730', ()=>{
    let info = {
      brand: "BMW",
      planType: "2",
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

  it('CHEVROLET type 2 plan 365, 730', ()=>{
    let info = {
      brand: "CHEVROLET",
      planType: "2",
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

  it('FIAT type 2 plan 365, 730', ()=>{
    let info = {
      brand: "FIAT",
      planType: "2",
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

  it('FORD type 2 plan 365, 730', ()=>{
    let info = {
      brand: "FORD",
      planType: "2",
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

  it('HONDA type 2 plan 365, 730', ()=>{
    let info = {
      brand: "HONDA",
      planType: "2",
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