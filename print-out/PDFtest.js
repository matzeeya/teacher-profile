pdfMake.fonts = {
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
          [ 'ทดสอบ 1', 'ทดสอบ 2', 'Third', 'The last one' ],
          [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
          [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
        ]
      }
    }
  ],
  defaultStyle: {
    font: 'THSarabun',
    fontSize: 14
  }
};
pdfMake.createPdf(docDefinition).download('optionalName.pdf');
