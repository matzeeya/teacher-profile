var font = {
  THSarabun: {
    normal: 'THSarabun.ttf',
    bold: 'THSarabunBold.ttf',
    italics: 'THSarabunItalics.ttf'
  }
};


var urlParams;
(window.onpopstate = function () {
  var match,
    pl = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    query = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
    urlParams[decode(match[1])] = decode(match[2]);
})();

var withContent = function () {
  let houseid = urlParams.houseid;
  let cid = urlParams.cid;
  //console.log(houseid, cid)
  generatePDF(houseid,cid);
 // generatePDF("23040190431", "1100201496141");
}

var generatePDF = function (houseid, cid) {
  get_house(houseid, cid, function (houseInfo) {
    get_child(cid, function (childInfo) {
      downloadPdf(childInfo, houseInfo);
    });
  });
}

var get_house = function (houseid, cid, cb) {
  var endpoint = 'https://thaioosc.org:9000/api/';
  $.ajax({
    method: "POST",
    url: endpoint + 'query/oosc_form/houseid',
    data: {
      "match": [houseid],
      "limit": 1,
      "include_doc": true
    },
    headers: {
      "Authorization": "JWT eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJCb21iIiwiaWF0IjoxNDg5MDM0MTE0fQ.fv0r1vZ9B-i_AG1ogGdvumNDpnE1eowmhETO-Lqrjpyyz884_p423mH6cn-KVaZFhy9Z9Gs-0zljg6d3KUhKhDJzomJspgHiaMzrnqVs838IviD4ig-oFcSgkqCKn6aXULXoLnpb6ueKshvdHX3NIxlNPd_oPCEDOEg8ufPAnLgb78OHcwwKK_YmB7zidrs-7Ltx93lJJSF0-FO_kd3i_H4Z3vKOtKtoAnSdWQqPr2EVilxzHQwyiKrLUnzIGz6Iv3yS2qIDp8OCXVopSRwM0bnESC0tClF-7EO6J0d1NDxamuX6XHKvuujSaoynMTFtICSY0ojUYRYDDESLvXvLzg",
      "contentType": "application/json; charset=utf-8"
    },
    dataType: "json",
    success: function (data) {
      if (data.length == 1) {
        var studentForm = null;
        data[0].value.doc.children.forEach(function (child) {
          if (child.cid === cid) {
            studentForm = child;
            // console.log(studentForm);
          }
        });
        if (studentForm) {
          cb(studentForm);
        } else {
          alert('Not Found Student in this house');
        }
      } else {
        alert('Not found House ' + houseid)
      }
    },
    failure: function (errMsg) {
      alert(errMsg);
    }
  });
}

var get_child = function (cid, cb) {
  var endpoint = 'https://thaioosc.org:9000/api/';
  $.ajax({
    method: "POST",
    url: endpoint + 'query/oosc_child/cid',
    data: {
      "match": [cid],
      "limit": 1,
      "include_doc": true
    },

    headers: {
      "Authorization": "JWT eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJCb21iIiwiaWF0IjoxNDg5MDM0MTE0fQ.fv0r1vZ9B-i_AG1ogGdvumNDpnE1eowmhETO-Lqrjpyyz884_p423mH6cn-KVaZFhy9Z9Gs-0zljg6d3KUhKhDJzomJspgHiaMzrnqVs838IviD4ig-oFcSgkqCKn6aXULXoLnpb6ueKshvdHX3NIxlNPd_oPCEDOEg8ufPAnLgb78OHcwwKK_YmB7zidrs-7Ltx93lJJSF0-FO_kd3i_H4Z3vKOtKtoAnSdWQqPr2EVilxzHQwyiKrLUnzIGz6Iv3yS2qIDp8OCXVopSRwM0bnESC0tClF-7EO6J0d1NDxamuX6XHKvuujSaoynMTFtICSY0ojUYRYDDESLvXvLzg",
      "contentType": "application/json; charset=utf-8"
    },
    dataType: "json",
    success: function (data) {
      if (data.length == 1) {
        cb(data[0].value.doc);
      } else {
        if (data.length > 1) {
          alert('Duplicate CID');
        } else {
          alert('Not found');
        }
      }
    },
    failure: function (errMsg) {
      alert(errMsg);
    }
  });
}

//คำภามสภาพปัญหา
var generate_page_2_section_1 = function (doc, form, options) {
  // console.log(options);
  // console.log(form);
  var _content = [];
  options.forEach(function (row) {
    _content = [];
    var width = 500 / row.length;
    row.forEach(function (obj) {
      var question = { checked: false };
      for (var i = 0; i < form.data.value.length; i++) {
        if (form.data.value[i].value === obj.value) {
          question = form.data.value[i];
          break;
        }
      }
      _content.push({ width: 16, table: { widths: [4], body: [question.checked == true ? ['X'] : [' ']] } });
      _content.push({ width: width, text: obj.text });
    });
    doc.push({ columns: _content, margin: [0, 1, 0, 1] });
  });
}

var generate_help_list_v2 = function (doc, form, options) {
  //console.log(options);
  //console.log(form);
  var form_1 = form.section3[3];
  var form_2 = form.section3[4].data.value[0].checked;
  var _content = [];
  options.forEach(function (row) {
    _content = [];
    var width = 500 / row.length;
    row.forEach(function (obj) {
      var question = { checked: false };

      if (obj.value != '90') {
        for (var i = 0; i < form_1.data.value.length; i++) {
          if (form_1.data.value[i].value === obj.value) {
            question = form_1.data.value[i];
            break;
          }
        }
      }
      else {
        if (form_2) {
          question.checked = true;
        }

      }

      _content.push({ width: 16, table: { widths: [4], body: [question.checked == true ? ['X'] : [' ']] } });
      _content.push({ width: width, text: obj.text });
    });
    doc.push({ columns: _content, margin: [0, 1, 0, 1] });
  });
}

var generate_help_list = function (doc, help) {
  var _content = [];
  help.forEach(function (row) {
    _content = [];
    var width = 500 / row.length;
    row.forEach(function (obj) {
      for (var i = 0; i < help.length; i++) {
        break;
      }
      _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
      _content.push({ width: width, text: obj.text });
    });
    doc.push({ columns: _content, margin: [0, 1, 0, 1] });
  });
}

var downloadPdf = function (studentInfo, formInfo) {
  //console.log(studentInfo);
  //console.log(formInfo);
  var _content = [];
  var docDefinition = {
    // pageMargins: [30, 30, 30, 30],
    pageSize: 'A4',
    content: [], //add content this
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
  //box header
  var datescreen =

    _content.push({
      columns: [
        { width: 50, text: 'แบบเลขที่' }
        , {
          stack: [{ width: 70, text: ' ' }
            , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }]
        }   
        , { width: 20, text: 'วันที่' }
        , {
          stack: [{ width: 70, text: ' ' }
            , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }]
        }
        , { width: 16, table: { widths: [4], body: [['X']] } }
        , { width: 120, text: 'Walk in / ออกหน่วยเคลื่อนที่' }
        , { width: 16, table: { widths: [4], body: [[' ']] } }
        , { width: 50, text: 'สำรวจ' }
      ], margin: [0, 1, 0, 1]
    });
  //
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

  //header
  docDefinition['content'].push(
    {
      text: 'แบบบันทึกข้อมูลผู้ประสบปัญหาทางสังคม',
      style: 'bigheader',
      alignment: 'center',
      bold: true,
      margin: [0, -10, 0, 0]
    }
  );
  //ประวัติบุคคล

  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{
        text: 'ประวัติบุคคล',
        fontSize: 16,
        alignment: 'left',
        bold: true
      }], [{
        text: '',
        fontSize: 1,
        alignment: 'left'
      }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });
  var age = studentInfo.age;
  _content = [];

  _content.push({
    table: {
      widths: [60, 50, 20, 100, 40, 100, 20, 20, 20],
      body: [
        [
          { text: 'คำนำหน้าชื่อ', border: [false, false, false, false], alignment: 'left' },
          { text: studentInfo.title, border: [false, false, false, true], alignment: 'center' },
          { text: 'ชื่อ', border: [false, false, false, false] },
          { text: studentInfo.firstname, border: [false, false, false, true], alignment: 'center' },
          { text: 'นามสกุล', border: [false, false, false, false] },
          { text: studentInfo.lastname, border: [false, false, false, true], alignment: 'center' },
          { text: 'อายุ', border: [false, false, false, false] },
          { text: age.toString(), border: [false, false, false, true] },
          { text: 'ปี', border: [false, false, false, false], alignment: 'center' }
        ]
      ]

    }, margin: [-5, -5, 0, 0]
  });

  docDefinition['content'].push(_content);

  //เลขบัตรปชช
  _content = [];
  _content.push({ width: 80, text: 'เลขที่บัตรประชาชน' });
  for (var index in studentInfo.cid) {
    _content.push({
      width: 16,
      table: {
        body: [
          [[studentInfo.cid[index]]]
        ], margin: [0, 2, 0, 2]
      }
    });
  }
  _content.push({ width: 70, text: 'กรณีไม่มีเนื่องจาก' });
  _content.push({
    stack: [{ width: 70, text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 130, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 2, 0, 2] });

  //วันเกิดเชื่้อชาติ
  moment.locale('th');
  var date = moment(studentInfo.birthday);
  date.add(543, 'years');
  _content = [];
  _content.push({ width: 60, text: 'วัน/เดือน/ปีเกิด' });
  _content.push({
    stack: [{ width: 70, text: date.format('LL'), alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 80, y2: 0, lineWidth: 0.75 }] }]
  });
  var gender = studentInfo.sex;
  let checkmale = ' ' ;
  let checkfemale = ' ';
  if (gender == "ชาย") {
    checkmale = 'X'
  }else{
    checkfemale = 'X'
  }
  _content.push({ width: 20, text: 'เพศ' });
  _content.push({ width: 16, table: { widths: [4], body: [[checkmale]] } });
  _content.push({ width: 20, text: 'ชาย' });
  _content.push({ width: 16, table: { widths: [4], body: [[checkfemale]] } });
  _content.push({ width: 20, text: 'หญิง' });
  _content.push({ width: 30, text: 'เชื้อชาติ' });
  _content.push({
    stack: [{ width: 30, text: ' ' } // race
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 80, y2: 0, lineWidth: 0.75 }] }]
  });
  _content.push({ width: 30, text: 'สัญชาติ' });
  _content.push({
    stack: [{ width: 40, text: studentInfo.nationlity, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 80, y2: 0, lineWidth: 0.75 }] }]
  });
  _content.push({ width: 30, text: 'ศาสนา' });
  _content.push({
    stack: [{ width: 40, text: ' ' } // religion
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 40, y2: 0, lineWidth: 0.75 }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 1] });

  //สถานภาพ
  var status = [];
  var statuscheck = status[0];
  let single = ' ';
  let marry = ' ';
  let separated  = ' ';
  let notsingle = ' ';
  let widow = ' ' ;

  if(statuscheck == 'โสด'){
    single = 'X'
  }
  else if (statuscheck == 'สมรสอยู่ด้วยกัน'){
    marry = 'X';
  }
  else if(statuscheck == 'สมรสแยกกันอยู่') {
    separated = 'X';
  }
  else if(statuscheck == 'ไม่ได้สมรสแต่อยู่ด้วยกัน') {
    notsingle = 'X';
  }
  else if(statuscheck == 'หม้าย(คู่สมรสเสียชีวิต)') {
    widow = 'X';
  }
  _content = [];
  _content.push({ width: 50, text: 'สถานะภาพ' })

  _content.push({ width: 16, table: { widths: [4], body: [[single]] } });
  _content.push({ width: 30, text: 'โสด' })

  _content.push({ width: 16, table: { widths: [4], body: [[marry]] } });
  _content.push({ width: 60, text: 'สมรสอยู่ด้วยกัน' })

  _content.push({ width: 16, table: { widths: [4], body: [[separated]] } });
  _content.push({ width: 70, text: 'สมรสแยกกันอยู่' })

  _content.push({ width: 16, table: { widths: [4], body: [[notsingle]] } });
  _content.push({ width: 90, text: 'ไม่ได้สมรสแต่อยู่ด้วยกัน' })

  _content.push({ width: 16, table: { widths: [4], body: [[widow]] } });
  _content.push({ width: 90, text: 'หม้าย(คู่สมรสเสียชีวิต)' })
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 1] });

  //ที่อยู่ตามทะเบียนบ้าน

  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{
        text: 'ที่อยู่ตามทะเบียนบ้าน',
        fontSize: 16,
        alignment: 'left',
        bold: true
      }], [{
        text: '',
        fontSize: 1,
        alignment: 'left'
      }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });

  //ที่อยู่ตามทะเบียนบ้านบรรทัด1
  _content = [];
  _content.push({ width: 50, text: 'ชื่อสถานที่' });
  _content.push({
    stack: [{ width: 30, text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 70, text: 'รหัสประจำบ้าน' })
  for (var index in studentInfo.houseid) {
    _content.push({
      width: 16,
      table: {
        body: [
          [[studentInfo.houseid[index]]]
        ], margin: [0, 0, 0, 1]
      }
    });
  }
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });

  //ที่อยู่ตามทะเบียนบ้านบรรทัด2
  _content = [];
  _content.push({ width: 40, text: 'บ้านเลขที่' });
  _content.push({
    stack: [{ width: 70, text: studentInfo.housenum, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 20, text: 'หมู่ที่' });
  _content.push({
    stack: [{ width: 70, text: studentInfo.villageno, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 30, text: 'ตรอก' });
  _content.push({
    stack: [{ width: 70, text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 20, text: 'ซอย' });
  _content.push({
    stack: [{ width: 70, text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 70, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });

  //ที่อยู่ตามทะเบียนบ้านบรรทัด3
  _content = [];
  _content.push({ width: 30, text: 'ถนน' });
  _content.push({
    stack: [{ text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 50, text: 'ตำบล/แขวง' });
  _content.push({
    stack: [{ width: 70, text: studentInfo.tumbonname, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 120, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 50, text: 'อำเภอ/เขต' });
  _content.push({
    stack: [{ width: 70, text: studentInfo.cityname, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });

  //ที่อยู่ตามทะเบียนบ้านบรรทัด4
  _content = [];
  _content.push({ width: 30, text: 'จังหวัด' });
  _content.push({
    stack: [{ width: 80, text: studentInfo.provincename, alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 50, text: 'รหัสไปรษณีย์' });
  _content.push({
    stack: [{ text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 1] });

  //ที่อยู่ตามทะเบียนบ้านบรรทัด5
  _content = [];
  _content.push({ width: 70, text: 'เบอร์โทรศัพท์' });
  _content.push({
    stack: [{ text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 50, text: 'เบอร์ต่อ' });
  _content.push({
    stack: [{ text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  _content.push({ width: 50, text: 'โทรสาร' });
  _content.push({
    stack: [{ text: ' ' }
      , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
    ]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 5] });
//legend

  //ที่อยู่ปัจจุบัน
  
  var choiceAdd = [];
  var checkAddr = choiceAdd[0];
  let home = ' ';
  let resident = ' ';
  let rental = ' '; 
  let employer = ' ';
  let noaddr = ' ';
  let checkreg = ' ';
  if(checkAddr == 'บ้านตนเอง'){
    home = 'X';
  }
  else if (checkAddr == 'อาศัยผู้อื่นอยู่'){
    resident = 'X';
  }
  else if (checkAddr == 'บ้านเช่า'){
    rental = 'X';
  }
  else if (checkAddr == 'อยู่กับผู้จ้าง'){
    employer = 'X';
  }
  else if (checkAddr == 'ไม่มีที่อยู่เป็นหลักแหล่ง'){
    noaddr = 'X';
  }
  _content = [];
  _content.push({
    columns: [
      { width: 80, text: 'ที่อยู่ปัจจุบัน' }
      , { width: 16, table: { widths: [4], body: [[home]] } }
      , { width: 50, text: 'บ้านตนเอง' }
      , { width: 16, table: { widths: [4], body: [[resident]] } }
      , { width: 60, text: 'อาศัยผู้อื่นอยู่' }
      , { width: 16, table: { widths: [4], body: [[rental]] } }
      , { width: 40, text: 'บ้านเช่า' }
      , { width: 16, table: { widths: [4], body: [[employer]] } }
      , { width: 50, text: 'อยู่กับผู้จ้าง' }
      , { width: 16, table: { widths: [4], body: [[noaddr]] } }
      , { width: 100, text: 'ไม่มีที่อยู่เป็นหลักแหล่ง' }
    ], margin: [0, 1, 0, 1]
  });
  //
  var address = false;
  if (address == true) {
    checkreg = 'X';
  } else {
    checkreg = ' '
  }
  //
  _content.push({
    columns: [
      { width: 16, table: { widths: [4], body: [[checkreg]] } }
      , { width: 300, text: 'ที่อยู่ปัจจุบันเป็นที่อยู่เดียวกับที่อยู่ตามทะเบียนบ้าน', bold: true }
    ], margin: [0, 1, 0, 1]
  });
  _content.push({
    columns: [
      { width: 240, text: '(กรณีเป็นที่อยู่เดียวกับที่อยู่ตามทะเบียนบ้าน ขอให้ทําเครื่องหมาย X ใน', fontSize: 12, bold: true }
      , { width: 16, table: { widths: [4], body: [[' ']] } }
      , { width: 230, text: 'และข้ามไปกรอกข้อมูลติดต่อผ่านชื่อ และเบอร์โทรศัพท์)', fontSize: 12, bold: true }
    ], margin: [0, 1, 0, 1]
  });
  //
 // ที่เดียวกับทะเบียนบ้าน 
   _content.push({
     columns: [
       { width: 70, text: 'ชื่อสถานที่' }
       , {
         stack: [{ width: 20, text: ' ' }
           , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 150, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 70, text: 'รหัสประจำบ้าน' }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
       , { width: 16, table: { widths: [4], body: [[' ']] } }
     ], margin: [0, 1, 0, 1]
   });
   //
   _content.push({
     columns: [
       { width: 50, text: 'บ้านเลขที่' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 70, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 30, text: 'หมู่ที่' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 70, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 30, text: 'ตรอก' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 70, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 30, text: 'ซอย' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 70, y2: 0, lineWidth: 0.75 }] }
         ]
       }
     ], margin: [0, 0, 0, 1]
   });
   //
   _content.push({
     columns: [
       { width: 30, text: 'ถนน' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 50, text: 'ตำบล/แขวง' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 50, text: 'อำเภอ/เขต' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
     ], margin: [0, 0, 0, 1]
   });
   //
   _content.push({
     columns: [
       { width: 50, text: 'จังหวัด' }
       , {
         stack: [{ width: 100, text: ' ' }
           , { canvas: [{ type: 'line', x1: -1, y1: 0, x2: 150, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 50, text: 'รหัสไปรษณีย์' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
     ], margin: [0, 1, 0, 1]
   });
   //
   _content.push({
     columns: [
       { width: 60, text: 'เบอร์โทรศัพท์' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 40, text: 'เบอร์ต่อ' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 40, text: 'โทรสาร' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
     ], margin: [0, 1, 0, 1]
   });
   //
   _content.push({
     columns: [
       { width: 50, text: 'ติดต่อผ่านชื่อ' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 60, text: 'เบอร์โทรศัพท์' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
       , { width: 50, text: 'เบอร์ต่อ' }
       , {
         stack: [{ width: 70, text: ' ' }
           , { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 0.75 }] }
         ]
       }
     ], margin: [0, 0, 0, 1]
   });
   docDefinition['content'].push({ table: { widths: [500], body: [[_content]] }, margin: [0, 1, 0, 5] });
//end 
//endoflegion


  //ระดับการศึกษา
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{
        text: 'ระดับการศึกษา',
        fontSize: 14,
        alignment: 'left',
        bold: true
      }], [{
        text: '',
        fontSize: 1,
        alignment: 'left'
      }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, -5, 0, 0]
  });
  //ระดับการศึกษาบรรทัด1
  var maxclass = formInfo.section1[9].data.selected[0].text;
  if (formInfo.section1[9].data.selected.length > 0) {
    maxclass = formInfo.section1[9].data.selected[0].text;
  }
  //console.log('maxclass ',maxclass);
  let check1 = ' ';
  let check2 = ' ';
  let check3 = ' ';
  let check4 = ' ';
  let check5 = ' ';
  if (maxclass == 'ยังไม่เคยไปโรงเรียน' || maxclass == 'เตรียมอนุบาล' || maxclass == 'อ.1' || maxclass == 'อ.2' || maxclass == 'อ.3') {
    check1 = 'X';
  }
  else if (maxclass == 'ป.1' || maxclass == 'ป.2' || maxclass == 'ป.3') {
    check2 = 'X';
  }
  else if (maxclass == 'ป.4' || maxclass == 'ป.5' || maxclass == 'ป.6') {
    check3 = 'X';
  }
  else if (maxclass == 'ม.1' || maxclass == 'ม.2' || maxclass == 'ม.3') {
    check4 = 'X';
  }
  else if (maxclass == 'ม.4' || maxclass == 'ม.5' || maxclass == 'ม.6') {
    check5 = 'X';
  }

  _content = [];
  _content.push({ width: 16, table: { widths: [4], body: [[check1]] } });
  _content.push({ width: 200, text: 'ไม่ได้รับการศึกษา/ไม่จบชั้นประถมศึกษาตอนต้น' });
  _content.push({ width: 16, table: { widths: [4], body: [[check2]] } });
  _content.push({ width: 150, text: 'ประถมศึกษาตอนต้น' });
  _content.push({ width: 16, table: { widths: [4], body: [[check3]] } });
  _content.push({ width: 100, text: 'ประถมศึกษาตอนปลาย' });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });
  //ระดับการศึกษาบรรทัด2
  _content = [];
  _content.push({ width: 16, table: { widths: [4], body: [[check4]] } });
  _content.push({ width: 200, text: 'มัธยมศึกษาตอนต้น' });
  _content.push({ width: 16, table: { widths: [4], body: [[check5]] } });
  _content.push({ width: 150, text: 'มัธยมศึกษาตอนปลาย' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 100, text: 'ปวช.' });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });
  //ระดับการศึกษาบรรทัด2
  _content = [];
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 200, text: 'ปวส./อนุปริญญา' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 150, text: 'ปริญญาตรี' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 100, text: 'สูงกว่าปริญญาตรี' });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });

  //อาชีพ
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'อาชีพ', fontSize: 14, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });
  //อาชีพบรรทัดที่1
  _content = [];
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 70, text: 'ไม่มีอาชีพ/ว่างงาน' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 70, text: 'นักเรียน/นักศึกษา' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'ค้าขาย/ธุรกิจส่วนตัว' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'ภิกษุ/สามเณร/แม่ชี' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 200, text: 'เกษตรกร(ทำไร/นา/สวน/เลี้ยงสัตว์/ประมง)' });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });
  //อาชีพบรรทัดที่2
  _content = [];
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 70, text: 'รับจ้าง' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 100, text: 'ข้าราชการ/พนักงานของรัฐ' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'พนักงานรัฐวิสาหกิจ' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'พนักงานบริษัท' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 200, text: 'อื่นๆระบุ...........................' });
  docDefinition['content'].push({ columns: _content, margin: [0, 0, 0, 1] });
  //รายได้เฉลี่ย
  _content = [];
  _content.push({ width: 80, text: 'รายได้เฉลี่ยต่อเดือน' });
  _content.push({ width: 80, text: '..............................' });
  _content.push({ width: 60, text: 'บาท' });
  _content.push({ width: 80, text: 'ที่มาของรายได้' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'ด้วยตนเอง' });
  _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  _content.push({ width: 80, text: 'ผู้อื่นให้' });
  docDefinition['content'].push({ columns: _content, margin: [0, 10, 0, 2], pageBreak: 'after' });


  //หน้า 2 สภาพปัญหา

  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'สภาพปัญหา', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });

  _content = [];
  for (var i = 0; i < formInfo.section2.length; i++) {
    if (formInfo.section2[i].id === "0009") {
      generate_page_2_section_1(docDefinition['content'],
        formInfo.section2[i],problem_options());
    }
  }

  docDefinition['content'].push(
    {
      text: 'ความช่วยเหลือที่ต้องการ',
      fontSize: 16,
      bold: true,
      margin: [0, 5, 0, 2]
    });
  // _content = [];
  // _content.push({ width: 130, text: 'สำหรับทุกประเภทผู้ขอรับบริการ' });
  // _content.push({ width: 150, text: '(เลือกได้ 3 รายการโดยใส่ตัวเลข 1,2,3 ใน )', fontSize: 12 });
  // _content.push({ width: 16, table: { widths: [4], body: [[' ']] } });
  // _content.push({ width: 130, text: '(ตามลำดับสี่งที่ต้องการจากมากไปน้อย)', fontSize: 12 });
  // docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 2] });
  //ความช่วเหลือด้านเงิน
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'เงิน', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, -5, 0, 0]
  });
  generate_page_2_section_1(docDefinition['content'],
    formInfo.section3[3],
    moneyForHelp_option());
  //generate_help_list(docDefinition['content'],moneyForHelp_option());

  //ความช่วยเหลือด้านสิ่งของ
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'สิ่งของ', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, 3, 0, 0]
  });
  generate_help_list(docDefinition['content'], objectForHep_option());
  //ความช่วยเหลืออื่นๆ 
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'ความช่วยเหลืออื่นๆ', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, 0, 0, 0]
  });
  generate_help_list_v2(docDefinition['content'],
    formInfo,
    otherForHep_option());

  //generate_help_list(docDefinition['content'],otherForHep_option());

  docDefinition['content'].push({
    text: '', pageBreak: 'after'
  });


  docDefinition['content'].push(
    {
      text: 'ผลการให้ความช่วยเหลือ',
      fontSize: 16,
      bold: true,
      margin: [0, 5, 0, 2]
    });
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'เงิน', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, -5, 0, 0]
  });
  // generate_page_2_section_1(docDefinition['content'],
  //   formInfo.section3[3],
  //   moneyForHelp_option());
  generate_help_list(docDefinition['content'],moneyForHelp_option());

  //ความช่วยเหลือด้านสิ่งของ
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'สิ่งของ', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, 3, 0, 0]
  });
  generate_help_list(docDefinition['content'], objectForHep_option());
  //ความช่วยเหลืออื่นๆ 
  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'ความช่วยเหลืออื่นๆ', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }, margin: [0, 0, 0, 0]
  });

  // generate_help_list(docDefinition['content'],
  //   formInfo,
  //   otherForHep_option());

  generate_help_list(docDefinition['content'],otherForHep_option());

  // docDefinition['content'].push({
  //   text: '', pageBreak: 'after'
  // });

  //#endregion
  //การตรวจเยี่ยมบ้าน


  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'ข้อมูลผู้ยื่นคำร้องแทน', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });

  _content = [];
  _content.push({ width: 'auto', text: 'ชื่อ' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 150, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  _content.push({ width: 'auto', text: 'นามสกุล' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 150, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  _content.push({ width: 'auto', text: 'เกี่ยวข้องเป็น' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 130, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });

  _content = [];
  _content.push({ width: 'auto', text: 'ที่อยู่' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 300, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  _content.push({ width: 'auto', text: 'เบอร์โทรศัพท์' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 150, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });

  _content = [];
  _content.push({ width: 'auto', text: 'ลงชื่อ..............................................................................' });
  _content.push({ width: 'auto', text: 'ผู้ขอรับความช่วยเหลือ/ผู้ยื่นคำร้องแทน' });
  docDefinition['content'].push({ columns: _content, margin: [230 , 5, 0, 5] });


  docDefinition['content'].push({
    table: {
      widths: ['*'],
      body: [[{ text: 'การตรวจเยี่ยมบ้าน', fontSize: 16, alignment: 'left', bold: true }],
      [{ text: '', fontSize: 1, alignment: 'left' }]]
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
    }
  });
  //การตรวจเยี่ยมบ้านบรรทัด1
  _content = [];
  _content.push({ width: 'auto', text: 'ตรวจเยี่ยมบ้านวันที่' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 100, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  _content.push({ width: 'auto', text: 'ชื่อ-นามสกุลเจ้าหน้าที่' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 100, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  _content.push({ width: 'auto', text: 'ตําแหน่ง' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 100, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });
  //การตรวจเยี่ยมบ้านบรรทัด2
  _content = [];
  _content.push({ width: 40, text: 'หน่วยงาน' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 460, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });
  //การตรวจเยี่ยมบ้านบรรทัด3
  _content = [];
  _content.push({ width: 65, text: 'สถานที่พักอาศัย' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 440, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });
  //การตรวจเยี่ยมบ้านบรรทัด4
  _content = [];
  _content.push({ width: 110, text: 'สภาพปัญหาความเดือดร้อน' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 390, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });
  //การตรวจเยี่ยมบ้านบรรทัด5
  _content = [];
  _content.push({ width: 135, text: 'ความคิดเห็นของนักสังคมสงเคราะห์' });
  _content.push({
    stack: [{ width: 70, text: '', alignment: 'center' }
      , { canvas: [{ type: 'line', x1: 0, y1: 13, x2: 370, y2: 13, lineWidth: 0.75, dash: { length: 1 } }] }]
  });
  docDefinition['content'].push({ columns: _content, margin: [0, 1, 0, 5] });
  //ลงชื่อ
  //เจ้าหน้าที่ผู้ตรวจเยี่ยมบ้าน
  //ผู้วินิจฉัยในการช่วยเหลือ

  _content = [];
  _content.push({ width: 350, text: 'ลงชื่อ...............................................................ผู้วินิจฉัยในการช่วยเหลือ ' });
  docDefinition['content'].push({ columns: _content, margin: [240, 5, 0, 5] })
  _content = [];
  _content.push({ width: 350, text: '(..............................................................)' });
  docDefinition['content'].push({ columns: _content, margin: [260, 1, 0, 5] })

  var name = studentInfo.title + studentInfo.firstname + "  " + studentInfo.lastname;
  pdfMake.fonts = font;
  pdfMake.createPdf(docDefinition).download('แบบฟอร์ม  ' + name + '.pdf');
  //pdfMake.createPdf(docDefinition).open();
}

withContent();
