
var loadImgFile = function (event) {
    var formData = new FormData();
    formData.append('image', event.target.files[0]);
    $.ajax({
        method: 'POST',
        url: 'https://api.api-ninjas.com/v1/imagetotext',
        headers: { 'X-Api-Key': '+h3s5SVmtltxcFN3iL1P/w==ZoPjD93MdmCkTcN9' },
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (result) {
            console.log(result);
            let fin_text = "";
            for (let i = 0; i < result.length; i++) {
                fin_text = fin_text + result[i].text;
                fin_text = fin_text + " ";
            }
            fin_text.trim();
            console.log(fin_text);
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });

};

var loadPdfFile = function (event) {
    console.log(event.target.files[0]);
    var formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append("page", "1");
    $.ajax({
        method: 'POST',
        url: 'https://pdf-to-text-converter.p.rapidapi.com/api/pdf-to-text/convert',
        headers: {
            'X-RapidAPI-Key': '4473b90c1cmsh0df827682b7996cp1b0523jsn1a8cf51f0c37',
            'X-RapidAPI-Host': 'pdf-to-text-converter.p.rapidapi.com',
        },
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (result) {
            console.log(result);
        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });

}