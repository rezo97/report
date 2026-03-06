document.getElementById('actualFile').addEventListener('change', () => {
    readExcel('actualFile', (data) => { actualData = data; console.log("ფაქტიური ჩაიტვირთა", data); });
});

document.getElementById('requestedFile').addEventListener('change', () => {
    readExcel('requestedFile', (data) => { requestedData = data; console.log("მოთხოვნები ჩაიტვირთა", data); });
});

// მონაცემების დამუშავება
document.getElementById('processBtn').addEventListener('click', async () => {
    if (actualData.length === 0 || requestedData.length === 0) {
        alert("გთხოვთ ატვირთოთ ორივე ფაილი!");
        return;
    }

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // ცხრილის გასუფთავება ძველი მონაცემებისგან

    // მოთხოვნების ფაილზე გადავლა და ფაქტიურთან შედარება
    for (const req of requestedData) {
        const orderId = req.order_id;
        const actual = actualData.find(a => a.order_id === orderId);

        if (actual) {
            const status = calculateStatus(req.requested_date, req.requested_time, actual.date, actual.time);
            await renderRow(orderId, actual.courier, req.requested_date + " " + req.requested_time, actual.date + " " + actual.time, status);
        }
    }
    
    document.getElementById('resultsTable').style.display = 'table';
});

// სტატუსის გამომთვლელი ლოგიკა
function calculateStatus(reqDate, reqTimeRange, actDate, actTime) {
    // თუ თარიღები არ ემთხვევა
    if (reqDate !== actDate) return "გვიან";

    // დროების შედარება (მაგ: "14:00-16:00" vs "15:30")
    try {
        let [start, end] = String(reqTimeRange).split('-');
        let actInt = parseInt(String(actTime).replace(':', ''));
        let startInt = parseInt(start.replace(':', ''));
        let endInt = parseInt(end.replace(':', ''));

        if (actInt >= startInt && actInt <= endInt) return "დროული";
        if (actInt < startInt) return "ადრე";
        if (actInt > endInt) return "გვიან";
    } catch (e) {
        return "შეცდომა ფორმატში";
    }
    return "უცნობი";
}

// ცხრილში რიგის დამატება და Firebase-დან კომენტარის წამოღება
async function renderRow(orderId, courier, reqInfo, actInfo, status) {
    const tbody = document.getElementById('tableBody');
    const tr = document.createElement('tr');
    
    // ვამოწმებთ, ხომ არ გვაქვს უკვე შენახული კომენტარი ბაზაში
    let savedComment = "";
    if (status === "ადრე" || status === "გვიან") {
        const docRef = doc(db, "order_comments", String(orderId));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            savedComment = docSnap.data().text;
        }
    }

    let commentHtml = "";
    if (status !== "დროული") {
        commentHtml = `
            <input type="text" class="comment-input" id="comment-${orderId}" value="${savedComment}" placeholder="მიზეზი...">
            <button class="save-btn" onclick="saveComment('${orderId}')">შენახვა</button>
        `;
    }

    tr.innerHTML = `
        <td>${orderId}</td>
        <td>${courier}</td>
        <td>${reqInfo}</td>
        <td>${actInfo}</td>
        <td class="status-${status}">${status}</td>
        <td>${commentHtml}</td>
    `;
    tbody.appendChild(tr);
}

// კომენტარის შენახვა Firebase-ში
window.saveComment = async function(orderId) {
    const commentText = document.getElementById(`comment-${orderId}`).value;
    try {
        await setDoc(doc(db, "order_comments", String(orderId)), {
            text: commentText,
            updatedAt: new Date()
        });
        alert(`კომენტარი შეკვეთისთვის ${orderId} შენახულია!`);
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("შეცდომა შენახვისას");
    }
};
