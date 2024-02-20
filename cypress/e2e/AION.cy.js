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
})