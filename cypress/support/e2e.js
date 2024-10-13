// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'


import { th, Faker } from '@faker-js/faker';
import thaiIdCard from "thai-id-card"

const fakerTh = new Faker({
  locale: [th]
})

export const PlanFix = {
  PACKAGE_30: '144 ชม. / 30 วัน',
  PACKAGE_90: '360 ชม. / 90 วัน',
  PACKAGE_120: '480 ชม. / 120 วัน',
  PACKAGE_180: '600 ชม. / 180 วัน',
  PACKAGE_365:'960 ชม. / 365 วัน',
  TOPUP_1: '50 ชม. / 365 วัน',
  TOPUP_2: '70 ชม. / 730 วัน',
  YEAR: '1 ปี'
};

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

export function selectCar(element) {  
  let carYear = element.car_year.toString().trim();
  let carBrand = element.brand.toString().trim();
  let carModel = element.veh_desc.toString().trim();
  
  var plus = ""
  var carUnit = ""
  
  if (element.type > 1) { plus = '-plus' }
  if (element.car_cc_max == "999,999") {
    carUnit = "Watt"
  } else if (element.capacity_code == 'K') {
    carUnit = "Kg."
  } else { 
    carUnit = "CC"
  } 
  
  // let model = `${carBrand.toUpperCase()} ${carModel.toUpperCase()} ${element.car_cc_min.replace(",", "")} - ${element.car_cc_max.replace(",", "")} ${carUnit}`
  let model = `${carBrand.toUpperCase()} ${carModel.toUpperCase()}`
  
  cy.wait(1000);
  cy.get(`[data-test="button-planType-${element.type}${plus}"]`, { timeout: 3000 }).click();

  cy.get('[data-test="input-car-year"]').focus().clear().type(carYear).type('{downArrow}{enter}')

  cy.get('[data-test="input-car-brand"]').focus().clear().type(carBrand)
  cy.get('[data-test="input-car-brand"]').type('{downArrow}{enter}')
// 
  cy.wait(1000);
  cy.get('[data-test="input-car-model"]', { timeout: 1000 })
    .invoke('val')
    .then(text => {
      if (text.trim() == '') {
        cy.get('[data-test="input-car-model"]').focus().clear().type(model)
        cy.get('[data-test="input-car-model"]').type('{downArrow}{enter}')
      }
      cy.get('[data-test="button-check-price"]').click();
    });
}

export function selectPlan(element) {
  cy.get("body").then($body => {
    if ($body.find('[id="onetrust-accept-btn-handler"]').length > 0) {   
      cy.get('[id="onetrust-accept-btn-handler"]').click();
    }
  });

  var planFix = "";
  var planDate = "";

  if (element.plan_fix == "PACKAGE_30") planFix = PlanFix.PACKAGE_30
  else if (element.plan_fix == "PACKAGE_90")  planFix = PlanFix.PACKAGE_90
  else if (element.plan_fix == "PACKAGE_120")  planFix = PlanFix.PACKAGE_120
  else if (element.plan_fix == "PACKAGE_180")  planFix = PlanFix.PACKAGE_180
  else if (element.plan_fix == "PACKAGE_365")  planFix = PlanFix.PACKAGE_365
  else if (element.plan_fix == "TOPUP_1")  planFix = PlanFix.TOPUP_1
  else if (element.plan_fix == "TOPUP_2")  planFix = PlanFix.TOPUP_2
  else if (element.plan_fix == "YEAR")  planFix = PlanFix.YEAR

  if (element.plan_fix == "PACKAGE_30") planDate = "30"
  else if (element.plan_fix == "PACKAGE_90")  planDate = "90"
  else if (element.plan_fix == "PACKAGE_120")  planDate = "120"
  else if (element.plan_fix == "PACKAGE_180")  planDate = "180"
  else if (element.plan_fix == "PACKAGE_365")  planDate = "365"
  else if (element.plan_fix == "TOPUP_1")  planDate = "365"
  else if (element.plan_fix == "TOPUP_2")  planDate = "730"
  else if (element.plan_fix == "YEAR")  planDate = "365"

  let url = 'https://uat2012.thaivivat.co.th/ecommerce/th/ajax_get_plan_for_automate.php?' + 
  'brand=' + element.brand +
  '&model=' + element.veh_desc +
  '&year=' + element.car_year +
  '&type=' + element.type +
  '&planDate=' + planDate +
  '&planFix=' + planFix;

  cy.log("URL=" + url)
  cy.request({
    method: 'GET',
    url: url
  }).then((response) => {
    let plans = JSON.parse(response.body)[0]

    const id = `${plans.campaign}-${plans.sum_insure}`
    cy.contains("แนะนำแผนประกัน", { timeout: 25000 }).then(() => {
      if (planFix == PlanFix.PACKAGE_30)      { cy.get('[id="hour1"]').click(); } 
      else if (planFix == PlanFix.PACKAGE_90) { cy.get('[id="hour2"]').click(); }

      cy.get("#select-plan-" + id).click({ force: true, timeout: 25000 })
      cy.get('[id="purchase-order"]').click();
    })
  })
}

export function purchaseInfo(element, info) {
  let value = {
    chassis: randomNumber(),
    licensePlateNo: randomPlateNumber(),
    licensePlateProvince: "กรุงเทพมหานคร",
    displacement: "1500",
    insurePrename: "นางสาว",
    insureName: `${fakerTh.person.firstName()} ${fakerTh.person.lastName()}`,
    insureIdCardNo: thaiIdCard.generate(),
    insureMobileNo: "0923239376",
    insureEmail: "thanaruktvi@gmail.com",
    address: "98/32 หมู่บ้านศุภาลัย ไพร์ด บางใหญ่ ถนนประชาอุทิศ",
    province: "จ.นนทบุรี",
    district: "อ.บางใหญ่",
    subDistrict: "บ้านใหม่",
    addresshome: "98/32 หมู่บ้านศุภาลัย ไพร์ด บางใหญ่ ถนนประชาอุทิศ",
    provincehome: "จ.นนทบุรี",
    districthome: "อ.บางใหญ่",
    subDistricthome: "บ้านใหม่",
    homeType: "ห้องแถวไม้"
  }

      cy.get('[id="onetrust-accept-btn-handler"]').click();

  //HomePlus/ExtraPlus 
  cy.wait(1000)
  cy.log("HOME=" + info.homePlus)
  cy.log("EXTRA=" + info.extraPlus)
  
  cy.log("Plan date: " + element.plan_date )
  if(info.homePlus) {
    cy.get('[class="checkbox-btn pull-left"]', { timeout: 5000 }).should('be.visible');
    cy.get('[id="home_flag"]').check()
    cy.get('[id="confirm_owner_flag"]').click()
    cy.get('[id="btn-confirm-owner-home"]').click()
  }
  
  if(info.extraPlus) {
    cy.get('[class="checkbox-btn pull-left"]', { timeout: 5000 }).should('be.visible');
    cy.get('[id="extra_flag"]').check()
  }
  
   //PromocodepurchaseData
   if (info.promoCode != undefined) cy.get('[id="promocode"]').type(info.promoCode)
  
  //vehicle info
  cy.get('[id="car_plate_number"]').type(value.licensePlateNo);
  cy.get('[name="car_plate_province"]').select(value.licensePlateProvince);

  cy.get('[id="chassis_number"]').type(value.chassis);
  cy.get('[id="re_chassis_number"]').type(value.chassis);


  cy.get("body").then($body => {
    if ($body.find('[id="displacement"]').length > 0) {   
      cy.get('[id="displacement"]').type(value.displacement)
    }
  });

  cy.get('#boxFillform > :nth-child(1) > :nth-child(3)').screenshot(`../capture/vehicle_${getFileName(element)}`, {
    timeout: 1000
  });

  //insure info
  cy.get('[id="insured_title"]').select(value.insurePrename);
  cy.get('[id="insured_name"]').focus().clear().invoke('val', value.insureName);
  cy.get('[id="insured_national_id"]').focus().clear().invoke('val', value.insureIdCardNo);
  cy.get('[id="insured_mobile"]').focus().clear().invoke('val', value.insureMobileNo);
  cy.get('[id="insured_email"]').focus().clear().invoke('val', value.insureEmail)

  //addr info
  cy.get('[id="address"]').focus().clear().invoke('val', value.address);
  cy.get('[id="province"]').select(value.province);
  cy.get('[id="district"]').select(value.district);
  cy.get('[id="subdistrict"]').select(value.subDistrict);

  if (info.homePlus) {
    //addr home
    cy.get('[id="home_address"]').type(value.addresshome);
    cy.get('[id="home_province"]').select(value.provincehome);
    cy.get('[id="home_district"]').select(value.districthome);
    cy.get('[id="home_subdistrict"]').select(value.subDistricthome);
    cy.get('[id="home_type"]').select(value.homeType);
  }

  //contract info
  //used same insure info
  cy.get('[id="contact_flag"]').click();



  //ScreenShot
  cy.get('#boxFillform > :nth-child(2) > :nth-child(1)').screenshot(`../capture/insure_${getFileName(element)}`, {
    timeout: 1000
  });

  cy.get('[id="onetrust-accept-btn-handler"]').should(($el) => {
    if ($el.is('visible') && $el.length > 0) {
      cy.get('[id="onetrust-accept-btn-handler"]', {force: true}).click();
    }
  })
  cy.screenshot(`../capture/fullscreen_${getFileName(element)}`);


  //submit purchase insure
  cy.get('[id="button-submit"]').click();

  // //read policy
  // cy.get('[class="box_policy"]').scrollTo('bottom');

  // //accept policy
  // cy.get('[id="policy"]').click();
  
  // // cy.screenshot(`${plan.planFix}/purchaseInfo`);
  // //cy.screenshot(`${plan.planFix}/${plan.model}/purchaseInfo`);
  
  // //submit purchase insure
  // cy.wait(1000);
  // cy.get('[id="button-submit"]').click();
  // cy.get('[class="swal2-actions"]').contains("ยืนยัน").click();


  //read policy
   cy.get('[id="consent-box-modal-body"]').scrollTo('bottom')

   //accept policy
   cy.get('[id="consent-checkbox"]').click();

   //click next
   cy.get('[id="consent-button"]').click();

   cy.get('[class="swal2-confirm swal2-styled"]').contains("ยืนยัน").click();
  
  cy.get("body").then($body => {
    if (element.type > 1) {
      cy.get('[id="button-confirm"]').click();
      paymentInfo(element)
    } else {
      if ($body.find('[id="button-back"]').length > 0) {   
        cy.get('[id="button-back"]').click();
      } else {
        cy.get('.botton_submit').click();
      }
    }
  });
}


function paymentInfo(element) {

  cy.screenshot(`../capture/fullscreenpayment_${getFileName(element)}`);

  const payment = {
    cardName: "test",
    cardNo: '4242424242424242',
    expMonth: "01",
    expYear: "2030",
    ccv: "123"
  }

  cy.wait(1000)
  cy.get('#card-number').focus().clear().invoke('val', payment.cardNo).should('have.value', payment.cardNo);
  cy.get('select[id="card-expiration-month"]').select(payment.expMonth).should('have.value', payment.expMonth) ;    
  cy.get('select[id="card-expiration-year"]').select(payment.expYear).should('have.value', payment.expYear);
  cy.get ('[id="card-name"]').type(payment.cardName).should('have.value', payment.cardName);

  cy.get ('[ id="card-ccv"]').type(payment.ccv).should('have.value', payment.ccv);
  cy.get ('[id="button-confirm"]').click();

  confirm()
}

function confirm() {
  cy.wait(1000)
  cy.get ('[class="btn btn-success btn-confirm"]', { timeout: 5000 }).click();
}



// ***********************************************************************************


const randomNumber = () => {
  const randomDigits = Math.floor(Math.random() *1000000)
  .toString()
  .padStart(10, "0");
  return randomDigits.toString()
}

function randomPlateNumber() {
  var char = Math.floor(Math.random() * 10)
  for (var i = 0; i < 2; i++) {
      const maxChar = 'ฮ'.charCodeAt(0)
      const minChar = 'ก'.charCodeAt(0)
      char += String.fromCharCode(Math.random() * (maxChar - minChar) + minChar)
  }
  char +=  Math.floor(Math.random() * 10000)
  return char
}

function getFileName(element) {
  const filename = [];

  if (element.home_plus == "Y") filename.push('HomePlus');
  if (element.extra_plus == "Y") filename.push('ExtraPlus');

  filename.push(element.type);
  filename.push(element.plan_fix);
  filename.push(element.brand);
  filename.push(element.veh_desc);

  return filename.join("_");
}

String.prototype.isNumber = function(){return /^\d+$/.test(this);}