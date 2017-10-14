pdfMake.fonts = {
  THSarabun: {
    normal: 'THSarabun.ttf',
    bold: 'THSarabunBold.ttf',
    italics: 'THSarabunItalics.ttf'
  }
};
  var _content = [];
  var docDefinition = {
    pageSize: 'A4',
    content: [], //add content this
    /*content: [
      {
        table: {
          headerRows: 1,
          widths: [ '*', 'auto', 100, '*' ],

          body: [
            [ 'ทดสอบ TH', 'Second', 'Third', 'The last one' ],
            [ 'Value 1', 'Value 2', 'Value 3', 'Value 4' ],
            [ { text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4' ]
          ]
        }
      }
    ],*/
    defaultStyle: {
      font: 'THSarabun',
      fontSize: 14
    },
    styles: {
      bigheader: {
        bold: true,
        fontSize: 20
      },
      header: {
        bold: true,
        fontSize: 16
      },
      subheader: {
        bold: true,
        fontSize: 14
      }
    }
  };

  _content.push({
    columns: [
      { width: 150, text: 'ชื่อ-นามสกุล ผู้สำรวจ/สอบข้อเท็จจริง' }
      , {
        stack: [{ width: 2, text: " " }
          , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 150, y2: 0, lineWidth: 0.75 }] }]
      }
      , { width: 40, text: 'ตำแหน่ง' }
      , {
        stack: [{ width: 100, text: ' ' }
          , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 150, y2: 0, lineWidth: 0.75 }] }]
      }
    ], margin: [0, 1, 0, 1]
  });
  docDefinition['content'].push({ table: { widths: [500], body: [[_content]] }, margin: [0, -10, 0, 20] });
pdfMake.createPdf(docDefinition).download('optionalName.pdf');
