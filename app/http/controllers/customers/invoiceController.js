const fs = require("fs");
const PDFDocument = require("pdfkit");
function createInvoice(invoice, path, callback) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);

  doc.end();
  doc.pipe(fs.createWriteStream(path)).on('close', function() {
    return callback({success:true});
  });

}

function generateHeader(doc) {
  doc
    .image("public/img/logo.png", 10, 15, { scale: 0.35,
      align: 'center',
      valign: 'center'})
    .stroke("red", "#900")
    .fillColor("#444444")
    .fontSize(20)
    //.text("BuyIT", 110, 57)
    .fontSize(10)
    .text("BuyIT India Pvt. Limited", 200, 50, { align: "right" })
    .text("207, GM Road, LMT marg, Ghatkopar West,", 200, 65, { align: "right" })
    .text("Mumbai, Maharashtra 400086", 200, 80, { align: "right" })
    .text("Phone: 9702940769 / 22208467 ",200,95,{ align:"right"})
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
    .text("Order Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice._id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date:", 50, customerInformationTop + 15)
    .text(formatDate(invoice.createdAt), 150, customerInformationTop + 15)
    //.text("Balance Due:", 50, customerInformationTop + 30)
    //.text(
      //formatCurrency(invoice.subtotal - invoice.paid),
     // 150,
     // customerInformationTop + 30
    //)

    .font("Helvetica-Bold")
    .text(invoice.name, 400, customerInformationTop)
    .font("Helvetica")
    .text(invoice.address, 400, customerInformationTop + 15)
    .text(
      invoice.phone ,
      400,
      customerInformationTop + 30
    )
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
    "Item",
    "Unit Cost",
    "Quantity",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");
  i=0;  
  let position;
  for (abc in invoice.items) {
    const item = invoice.items[abc].item
    position = invoiceTableTop + (i + 1) * 30;

    generateTableRow(
      doc,
      position,
      item.name,
      formatCurrency(item.price),
      invoice.items[abc].qty,
      formatCurrency(item.price*invoice.items[abc].qty)
    );

    generateHr(doc, position + 20);
    i++;
  }
  generateFooter(doc,formatCurrency(invoice.totalPrice),position+40);

  doc.font("Helvetica");
}

function generateFooter(doc,price,y) {

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text(
      "Sum total: "+price,
      50,
      y,
      { align: "right", width: 500 }
    );
  
}

function generateTableRow(
  doc,
  y,
  item,
  price,
  qty,
  total
) {


  doc.fontSize(10).text(item, 50, y)
    .text(price, 280, y, { width: 90, align: "right" })
    .text(qty, 370, y, { width: 90, align: "right" })
    .text(total, 0, y, { align: "right" });
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

  return day+ "/" + month + "/" + year;
}
function formatCurrency(inr) {
  
  return "Rs. "+inr.toString();
}
module.exports = {
  createInvoice
};
