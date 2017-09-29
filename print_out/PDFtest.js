var font = {
  THSarabun: {
    normal: 'THSarabun.ttf',
    bold: 'THSarabunBold.ttf',
    italics: 'THSarabunItalics.ttf'
  }
};

var docDefinition = {
  content: [
    {
      table: {
        headerRows: 1,
        widths: [ '*', 'auto', 100, '*' ],

        body: [
          [ 'First', 'Second', 'Third', 'The last one' ],
          [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
          [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
        ]
      }
    }
  ]
};
pdfMake.createPdf(docDefinition).download('optionalName.pdf');