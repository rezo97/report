import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCo2anHoZzMoHscVO4lfr9laru0f8HokCw",
  authDomain: "report-8ef5e.firebaseapp.com",
  projectId: "report-8ef5e",
  storageBucket: "report-8ef5e.firebasestorage.app",
  messagingSenderId: "468300071114",
  appId: "1:468300071114:web:a010c0392ddea6a5733433",
  measurementId: "G-T27CMMEG3F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let actualData = [];
let requestedData = [];

function readExcel(fileElement, callback) {
    const file = document.getElementById(fileElement).files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        callback(json);
    };
    reader.readAsArrayBuffer(file);
}

document.getElementById('actualFile').onchange = () => readExcel('actualFile', (d) => actualData = d);
document.getElementById('requestedFile').onchange = () => readExcel('requestedFile', (d) => requestedData = d);

document.getElementById('processBtn').onclick = async () => {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    for (const req of requestedData) {
        const actual = actualData.find(a => String(a.order_id) === String(req.order_id));
        if (actual) {
            const status = calculateStatus(req.requested_date, req.requested_time, actual.date, actual.time);
            await renderRow(req.order_id, actual.courier, `${req.requested_date} ${req.requested_time}`, `${actual.date} ${actual.time}`, status);
        }
    }
    document.getElementById('resultsTable').style.display = 'table';
};

function calculateStatus(reqD, reqT, actD, actT) {
    if (String(reqD) !== String(actD)) return "გვიან";
    try {
        let [s, e] = String(reqT).split('-');
        let a = parseInt(String(actT).replace(':', ''));
        if (a >= parseInt(s.trim().replace(':', '')) && a <= parseInt(e.trim().replace(':', ''))) return "დროული";
        return a < parseInt(s.trim().replace(':', '')) ? "ადრე" : "გვიან";
    } catch { return "შეცდომა"; }
}

async function renderRow(id, cour, rInf, aInf, stat) {
    let comm = "";
    // დაცვის მექანიზმი: თუ Firebase არ მუშაობს, ცხრილი მაინც გამოიტანოს
    try {
        const snap = await getDoc(doc(db, "order_comments", String(id)));
        if (snap.exists()) comm = snap.data().text;
    } catch (error) {
        console.log("ბაზა არ არის შექმნილი, მაგრამ ცხრილი აიტვირთება.");
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${id}</td><td>${cour}</td><td>${rInf}</td><td>${aInf}</td>
        <td class="status-${stat}">${stat}</td>
        <td><input id="c-${id}" class="comment-input" value="${comm}"><button class="save-btn" onclick="saveComment('${id}')">OK</button></td>
    `;
    document.getElementById('tableBody').appendChild(tr);
}

window.saveComment = async (id) => {
    const txt = document.getElementById(`c-${id}`).value;
    try {
        await setDoc(doc(db, "order_comments", String(id)), { text: txt });
        alert("შენახულია!");
    } catch (error) {
        alert("კომენტარი ვერ შეინახა. Firebase-ში შექმენი Firestore Database.");
    }
};
