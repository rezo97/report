<!DOCTYPE html>
<html lang="ka">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>კურიერების მონიტორინგი</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>
</head>
<body>
    <div class="container">
        <h2>📦 შეკვეთების კონტროლი</h2>

        <div class="upload-section">
            <div class="card">
                <h3>1. ფაქტიური ჩაბარება</h3>
                <p>სვეტები: order_id, time, date, courier</p>
                <input type="file" id="actualFile" accept=".xlsx, .xls">
            </div>

            <div class="card">
                <h3>2. მომხმარებლის მოთხოვნა</h3>
                <p>სვეტები: order_id, requested_time, requested_date</p>
                <input type="file" id="requestedFile" accept=".xlsx, .xls">
            </div>
        </div>

        <button id="processBtn" class="primary-btn">მონაცემების შედარება</button>

        <div class="table-container">
            <table id="resultsTable" style="display:none;">
                <thead>
                    <tr>
                        <th>შეკვეთის #</th>
                        <th>კურიერი</th>
                        <th>მოთხოვნილი დრო</th>
                        <th>ფაქტიური დრო</th>
                        <th>სტატუსი</th>
                        <th>კომენტარი</th>
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>
    </div>

    <script type="module" src="app.js"></script>
</body>
</html>
2. style.css (დიზაინი)
მარტივი და სუფთა დიზაინი, რომელიც სამუშაო პროცესს სასიამოვნოს ხდის.

CSS
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f7f6;
    color: #333;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.upload-section {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.card {
    flex: 1;
    padding: 20px;
    border: 2px dashed #bdc3c7;
    border-radius: 8px;
    background-color: #fafafa;
}

.card h3 { margin-top: 0; font-size: 16px; }
.card p { font-size: 12px; color: #7f8c8d; }

.primary-btn {
    display: block;
    width: 100%;
    padding: 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.primary-btn:hover { background-color: #2980b9; }

.table-container { margin-top: 30px; overflow-x: auto; }

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th { background-color: #f8f9fa; }

.status-დროული { color: #27ae60; font-weight: bold; }
.status-ადრე { color: #f39c12; font-weight: bold; }
.status-გვიან { color: #e74c3c; font-weight: bold; }

.comment-input {
    width: 70%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.save-btn {
    padding: 5px 10px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}
