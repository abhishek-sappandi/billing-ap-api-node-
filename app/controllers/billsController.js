const Bill = require('../models/bill')
const Product = require('../models/product')
const Customer = require('../models/customer')
const PDFDocument = require('pdfkit')
var fs = require('fs')
var nodemailer = require('nodemailer')
const billsController = {}

billsController.list = (req, res) => {
    Bill.find()
        .then((bills) => {
            res.json(bills)
        })
        .catch((err) => {
            res.json(err)
        })
}

billsController.show = (req, res) => {
    const id = req.params.id
    Bill.findById(id).populate('customer').populate('orderItems.product')
        .then((bill) => {
            if (bill) {
                res.json(bill)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

billsController.create = (req, res) => {

const body = req.body
// finding the customer email
let customer_email 
Customer.findById(body.customer)
.then((customer)=>{
  customer_email = customer.email
})

const bill = new Bill(body)
bill.save()
    .then((bill) => {
        //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
            var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'abhishekbusiness199@gmail.com',
                pass: 'placement'
            }
            });
            
            var mailOptions = {
            from: 'abhishekbusiness199@gmail.com',
            to: customer_email,
            subject: 'e-Bill',
            text: `ths bill of your order is Rs.${bill.total}/-`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            })
        //////////////////////////////////// NODEMAILER /////////////////////////////////////////////////////////////////
        res.json(bill)
    })
    .catch((err) => {
        res.json(err)
    })
}

billsController.destroy = (req, res) => {
    const id = req.params.id
    Bill.findByIdAndDelete(id)
        .then((bill) => {
            if (bill) {
                res.json(bill)
            } else {
                res.json({})
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

billsController.pdf =(req,res) =>{
    const id = req.params.id
    Bill.findById(id)
        .then((bill)=>{
        //////////////////////////////////// PDFKIT /////////////////////////////////////////////////////////////////
         // Sub Query
                            const products = bill.orderItems.map(e => e.product)
                            let abhis = []
                            for(let k=0; k< products.length ; k++){
                            Product.findById(products[k])
                                .then((product)=>{
                                    abhis.push(product.name)
                                    })
                            }
            Customer.findById(bill.customer)
            .then((customer)=>{
            let doc = new PDFDocument({ margin: 50 });
          
             generateHeader(doc);
             generateCustomerInformation(doc, bill);
             generateInvoiceTable(doc, bill);
             generateFooter(doc);
            doc.pipe(fs.createWriteStream(`C:/Users/abhis/node/billing-app-api/${customer.name}.pdf`))
            doc.pipe(res)
            doc.end()

            function generateHeader(doc) {
                doc
                  .image('logo.jfif', 50, 45, { width: 50 })
                  .fillColor("#444444")
                  .fontSize(20)
                  .text("Billing System Inc.", 110, 57)
                  .fontSize(10)
                  .text("Billing System Inc.", 200, 50, { align: "right" })
                  .text("123 Main Street", 200, 65, { align: "right" })
                  .text("Bangalore, Karnataka ,560070", 200, 80, { align: "right" })
                  .moveDown();
              }
              
              function generateCustomerInformation(doc, invoice) {
                doc
                  .fillColor("#444444")
                  .fontSize(20)
                  .text("Invoice", 50, 160);
              
                generateHr(doc, 185);
              
                const customerInformationTop = 200;
              
                doc
                  .fontSize(10)
                  .text("Invoice Number:", 50, customerInformationTop)
                  .font("Helvetica-Bold")
                  .text(`:  ${bill._id}`, 150, customerInformationTop)
                  .font("Helvetica")
                  .text("Invoice Date:", 50, customerInformationTop + 15)
                  .text(`:  ${formatDate(new Date())}`, 150, customerInformationTop + 15)
                  .text("Balance Due:", 50, customerInformationTop + 30)
                  .text(`:  Rs.${bill.total}/-`,
                    150,
                    customerInformationTop + 30
                  )

                  .fontSize(10)
                  .text("Name", 300, customerInformationTop)
                  .font("Helvetica-Bold")
                  .text(`:  ${customer.name}`, 350, customerInformationTop)
                  .font("Helvetica")
                  .text("Gender:", 300, customerInformationTop + 15)
                  .font("Helvetica")
                  .text(`:  ${customer.gender}`, 350, customerInformationTop + 15)
                  .font("Helvetica")
                  .text("Ph:", 300, customerInformationTop + 30)
                  .text(`:  ${customer.mobile}` , 350, customerInformationTop + 30)
                  .moveDown();
              
                generateHr(doc, 252);
              }

              function generateInvoiceTable(doc, invoice) {
                let i;
                const invoiceTableTop = 330;
              
                doc.font("Helvetica-Bold");
                generateTableRow(
                  doc,
                  invoiceTableTop,
                  "id",
                  "Item",
                  "Unit Cost",
                  "Quantity",
                  "Line Total"
                );
                generateHr(doc, invoiceTableTop + 20);
                doc.font("Helvetica");
              
                for (i = 0; i < bill.orderItems.length ; i++) {
                  const item = bill.orderItems[i];
                  const position = invoiceTableTop + (i + 1) * 30;
                  generateTableRow(
                    doc,
                    position,
                    `${i+1}.`,
                    abhis[i],
                    item.price,
                    item.quantity,
                    item.quantity * item.price
                  )
                  generateHr(doc, position + 20);
                }
              
                const subtotalPosition = invoiceTableTop + (i + 1) * 30;
                generateTableRow(
                  doc,
                  subtotalPosition,
                  "",
                  "",
                  "Subtotal",
                  "",
                  `Rs.${bill.total}/-`
                )
              }
              
              function generateFooter(doc) {
                doc
                  .fontSize(12)
                  .text(
                    "Payment is has to be done within 15 days. Thank you for your business.",
                    50,
                    700,
                    { align: "center", width: 500 }
                  );
              }

              function generateTableRow(
                doc,
                y,
                item,
                description,
                unitCost,
                quantity,
                lineTotal
              ) {
                doc
                  .fontSize(10)
                  .text(item, 50, y)
                  .text(description, 150, y)
                  .text(unitCost, 280, y, { width: 90, align: "right" })
                  .text(quantity, 370, y, { width: 90, align: "right" })
                  .text(lineTotal, 0, y, { align: "right" });
              }
              function generateHr(doc, y) {
                doc
                  .strokeColor("#aaaaaa")
                  .lineWidth(1)
                  .moveTo(50, y)
                  .lineTo(550, y)
                  .stroke();
              }
              function formatDate(date) { 
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
              
                return day + "-" + month + "-" + year;
              }

            })
            
              
          //createInvoice(bill,'C:/Users/abhis/node/billing-app-api/file.pdf')
            // const doc = new PDFDocument
            // doc.pipe(fs.createWriteStream('C:/Users/abhis/node/billing-app-api/file.pdf')); // write to PDF
                    
            //         // Add an image, constrain it to a given size, and center it vertically and horizontally
            //         doc.image('C:/Users/abhis/Desktop/robo pics/3.jpg', {
            //         fit: [250, 300],
            //         align: 'center',
            //         valign: 'center'
            //         });
                    
            //         // Add another page
            //         doc
            //         .addPage()
            //         .fontSize(25)
            //         .text('Here is some vector graphics...', 100, 100);
                    
            //         // Draw a triangle
            //         doc
            //         .save()
            //         .moveTo(100, 150)
            //         .lineTo(100, 250)
            //         .lineTo(200, 250)
            //         .fill('#FF3300');
                    
            //         // Apply some transforms and render an SVG path with the 'even-odd' fill rule
            //         doc
            //         .scale(0.6)
            //         .translate(470, -380)
            //         .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
            //         .fill('red', 'even-odd')
            //         .restore();
                    
            //         // Add some text with annotations
            //         doc
            //         .addPage()
            //         .fillColor('blue')
            //         .text('link to Our website..!!', 100, 100)
            //         .underline(100, 100, 160, 27, { color: '#0000FF' })
            //         .link(100, 100, 160, 27, 'http://google.com/');
            // doc.pipe(res); 
            // 	// finalize the PDF and end the stream
            // doc.end()
            

            //////////////////////////////////// PDFKIT /////////////////////////////////////////////////////////////////

        })
        .catch((err)=>{
            console.log(err);
        })
}

module.exports = billsController