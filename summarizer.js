function showuploadPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("summary").style.display = "none";
    document.getElementById("uploadPage").style.display = "block";
}
console.log(config);
function showLoader() {
    document.getElementById("uploadPage").style.display = "none";
    document.getElementById("loader").style.display = "flex";
    document.getElementById("summary").style.display = "none";
}

function showSummary() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("summary").style.display = "block";
    document.getElementById("uploadPage").style.display = "none";

}
function getPoints(text) {

    let sentences = text.split(".");

    console.log(sentences);

    let points = [];

    let i = 0;


    while (i < sentences.length) {

        let sz = 0;

        let temp = "";

        while (i < sentences.length && sz <= 3900) {

            temp = temp + (sentences[i] + ".");

            sz += (sentences[i].length + 1);

            i++;

        }

        temp = "summarise the below into points with each point containing atmost 15 words " + temp;

        let body = '{"model":"text-davinci-003","prompt": "' + temp + '","temperature":0,"max_tokens":100}';
        //'{"model":"text-davinci-003","prompt":"Say this is a test","temperature":0,"max_tokens":7}'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.OPENAI_API_TOKEN
            },
            body: body
        };

        fetch('https://api.openai.com/v1/completions', options)
            .then(async (response) => {
                // console.log(response);
                let k = await response.json();
                console.log(k);
                let res = k["choices"][0]["text"];
                let p = res.split("-");

                for (let j = 0; j < p.length - 1; j++) {

                    if (j == (p.length - 2))
                        p[j] = p[j + 1];
                    else
                        p[j] = p[j + 1].slice(0, p[j + 1].length - 2);

                }

                p.pop();

                for (let j = 0; j < p.length; j++) {

                    points.push(p[j]);

                }

                console.log(response);

            })
            .catch(err => { console.error(err) });

    }

    console.log(points);
    console.log(points.length);
    return points;
}
var loadImgFile = function (event) {
    showLoader();
    var formData = new FormData();
    formData.append('image', event.target.files[0]);
    $.ajax({
        method: 'POST',
        url: 'https://api.api-ninjas.com/v1/imagetotext',
        headers: { 'X-Api-Key': config.IMAGE_API_TOKEN, },
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
            let arr = getPoints(fin_text);
            console.log(arr);
            makeFlashCards(arr);
            showSummary();



        },
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
            alert("Error in getting information, Upload Again ...");
            showuploadPage();
        }
    });

};

var loadPdfFile = function (event) {
    let c = 0;
    let pages_count = 1;
    console.log(event.target.files[0]);
    var input = event.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(input);
    reader.onloadend = function () {
        var count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
        console.log('Number of Pages:', count);
        pages_count = count;

        let arr = [];
        for (let i = 1; i <= pages_count; i++) {
            var formData = new FormData();
            formData.append('file', event.target.files[0]);
            formData.append("page", i + "");
            $.ajax({
                method: 'POST',
                url: 'https://pdf-to-text-converter.p.rapidapi.com/api/pdf-to-text/convert',
                headers: {
                    'X-RapidAPI-Key': config.PDF_API_TOKEN,
                    'X-RapidAPI-Host': 'pdf-to-text-converter.p.rapidapi.com',
                },
                data: formData,
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function (result) {
                    console.log(result);
                    //document.getElementById("headingThree").innerText = result;
                    let a = getPoints(fin_text);
                    console.log(a);
                    arr = arr.concat(a);
                },
                error: function ajaxError(jqXHR, textStatus, errorThrown) {
                    alert("Error in getting information, Upload Again ...");
                    c = 1;
                    showuploadPage();
                }
            });
        }
        if (c === 0) {
            console.log(arr);
            makeFlashCards(arr);
            showSummary();
        }

    }


}

function makeFlashCards(arr) {
    console.log("here");
    console.log(arr);
    var contentArray = [];
    contentArray = contentArray.concat(arr);
    console.log("statements");
    console.log(arr.length);
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
    let synth = speechSynthesis;
    isSpeaking = true;

    // voices();

    // function voices() {
    //     for (let voice of synth.getVoices()) {
    //         let selected = voice.name === "Google US English" ? "selected" : "";
    //         let option = `<option value = "${voice.name}" ${selected}>${voice.name} (${voice.lang}) </option>`;
    //         voiceList.insertAdjacentHTML("beforeend", option);
    //     }
    // }

    //synth.addEventListener("voiceschanged", voices);
    flashcardMaker = (text, index) => {
        console.log(index, text);
        const flashcard = document.createElement("div");
        const point = document.createElement('h2');
        const vol = document.createElement('i');

        flashcard.className = 'flashcard';

        point.setAttribute("style", "border-top:1.5px solid #4CAF50; padding: 15px; margin-top:30px ");
        point.textContent = text;


        vol.className = "fas fa-volume-up";
        vol.addEventListener("click", () => {
            let utterance = new SpeechSynthesisUtterance(text);
            for (let voice of speechSynthesis.getVoices()) {
                console.log(voice.name);
                if (voice.name = "Google UK English Female") {
                    utterance.voice = voice;
                }
            }
            speechSynthesis.speak(utterance);
        })


        flashcard.appendChild(point);
        flashcard.appendChild(vol);




        document.querySelector("#flashcards").appendChild(flashcard);
    }


    contentArray.forEach((text, index) => { flashcardMaker(text, index) });

}

$(document).ready(function () {
    $(document).on('submit', '#upload-form', function () {
        showLoader();
        var data = $('#upload-form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        console.log(data);
        makeFlashCards(data["uploadText"]);
        showSummary();
        return false;
    });
});


showuploadPage();

