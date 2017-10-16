var font = {
    THSarabun: {
        normal: 'THSarabun.ttf',
        bold: 'THSarabunBold.ttf',
        italics: 'THSarabunItalics.ttf'
    }
};

var downloadprintout = function () {
    var docDefinition = {
        pageMargins: [20, 90, 50, 70],
        header: {
            image: 'nhso_logo',
            width: 200
        },
        content: [], //add content this
        defaultStyle: {
            font: 'THSarabun',
            fontSize: 14
        },
        styles: {
            bigheader: {
                bold: true,
                fontSize: 22
            },
            header: {
                bold: true,
                fontSize: 14 + 2
            },
            subheader: {
                bold: true,
                fontSize: 14
            }
        }
      }
  };
docDefinition['content'].push({
    text: 'รายงานความต้องการด้านสวัสดิการสังคมและอาชีพ',
    style: 'header',
    alignment: 'center',
    margin: [10, 8, 0, 0]
  },
  {
    width: 16,
    table: {
      widths: [4],
      body: [
        ['1'],
      ], width: 16
    }
}
);
pdfMake.fonts = font;
pdfMake.createPdf(docDefinition).open('testing.pdf');
sessionStorage.removeItem('PDF_TYPE')
