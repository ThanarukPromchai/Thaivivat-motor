import * as e2e from "../support/e2e";
import * as dateUtils from "../utils/dateUtils";
import * as logUtils from "../utils/logUtils";

const runNo = Cypress.env('runNo')
const planList = Cypress.env('plan')

describe('fuction spec', () => {

  beforeEach(() => {
    cy.viewport(1920, 1024)
    cy.wrap({
      timestamp: dateUtils.formatPad2(new Date())
    }).as('init')
    cy.visit("https://beta.thaivivat.co.th/campaign/prepaid");
  })

  afterEach(() => {
    cy.clearCookies()
  })

  planList.forEach((el, idx) => {
    it(`Test No: ${idx}, brand: ${el.brand} car: ${el.veh_desc}, year: ${el.car_year}, campaign: ${el.campaign}, sum_insure: ${el.sum_insure}, plain_id: ${el.code}` ,
      {
        retries: {
          runMode: 2,
          openMode: 0,
        },
      },
     () => {
      let info = {
        promoCode: null,
        homePlus: false,
        extraPlus: true
      }

      var logPath = `cypress/log/${runNo}.json`
      logUtils.read(logPath, (log)=>{
        var duplicateRec = log != null && log.find((v) => {
          return v.brand == el.brand &&
           v.model == el.veh_desc && 
           v.car_year == el.car_year && 
           v.code == el.code && 
           v.check_campaign == el.check_campaign &&
           v.car_cc_min == el.car_cc_min &&
           v.car_cc_max == el.car_cc_max 
        }) != undefined

        if (!duplicateRec) {
          e2e.selectCar(el)
          e2e.selectPlan(el)
          e2e.purchaseInfo(el, info)

          logUtils.write({
            brand: el.brand,
            model: el.veh_desc,
            car_year: el.car_year,
            code: el.code,
            check_campaign: el.check_campaign,
            car_cc_min: el.car_cc_min,
            car_cc_max: el.car_cc_max
          })  
          logUtils.save(logPath)
        }
      })
    })
  });
})