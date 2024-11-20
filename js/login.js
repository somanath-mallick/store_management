function insertData(event) {
    event.preventDefault(); // Prevent form submission

    const requestData = {
        items: $('#item').val(),  // Corrected id
        amount: parseFloat($('#price').val())  // Corrected id and changed to parseFloat
    };

    $.ajax({
        url: 'http://127.0.0.1:5000/insert',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(response) {
            if (response.error) {
                alert(`Error: ${response.error}`);
            } else {
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred while inserting data.');
        }
    });
}

function LoginSubmit() {
    var phoneNo = $('#phone_no').val();
    var password = $('#password').val();

    if (!phoneNo || !password) {
        alert('Please enter both mobile number and password.');
        return;
    }

    var loginData = {
        "phone_no": phoneNo,
        "password": password
    };

    $.ajax({
        
        url: 'http://127.0.0.1:5000/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),
        success: function(response) 
        {
            if (response.message === "Login successful") {
                window.location.href = 'show.html'; 
            } else {
                alert("Login failed: " + response.message); 
            }
        },
        error: function(xhr, status, error) {
            if (xhr.status === 400) {
                alert("Bad Request: " + xhr.responseJSON.error);  
            } else if (xhr.status === 401) {
                alert("Login failed: " + xhr.responseJSON.message); 
            } else {
                console.error("Login error:", status, error);
                alert("An error occurred during the login process.");
            }
        }
    });
    
    
}

$(document).ready(function() {
    $('#loginButton').on('click', LoginSubmit); 
});


// Function to format date
function formatDate(dateString) {
    if (!dateString) return ''; // Handle empty or undefined dates
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' }; // e.g., 20 Nov 2024
    return date.toLocaleDateString('en-GB', options);
}

function showdata() {
    $.ajax({
        url: 'http://127.0.0.1:5000/show', 
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),  
        success: function(response) {
            $('#dataTableBody').empty(); 

            response.forEach(function(row) {
                var tableRow = '<tr>';
                tableRow += '<td>' + row.items + '</td>';
                tableRow += '<td>' + formatDate(row.start_date) + '</td>'; // Format start date
                tableRow += '<td>' + formatDate(row.end_date) + '</td>';   // Format end date
                tableRow += '<td>' + row.amount + '</td>';
                tableRow += '</tr>';
                $('#dataTableBody').append(tableRow);  
            });
        },
        error: function(xhr, status, error) {
            console.error("Error fetching data: ", status, error);
            alert("An error occurred while fetching data.");
        }
    });
}

$(document).ready(function() {
    showdata();

    $('#filterForm').on('submit', function(e) {
        e.preventDefault();

        var item = $('#item').val();
        var startDate = $('#startdate').val();
        var endDate = $('#enddate').val();

        console.log("Item: ", item);
        console.log("Start Date: ", startDate);
        console.log("End Date: ", endDate);

        var filterData = {
            "items": item,  
            "start_date": startDate,
            "end_date": endDate
        };

        console.log("Sending filter data:", filterData);

        $.ajax({
            url: 'http://127.0.0.1:5000/show',  
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(filterData), 
            success: function(response) {
                $('#dataTableBody').empty();

                response.forEach(function(row) {
                    var tableRow = '<tr>';
                    tableRow += '<td>' + row.items + '</td>';
                    tableRow += '<td>' + formatDate(row.start_date) + '</td>'; 
                    tableRow += '<td>' + formatDate(row.end_date) + '</td>';   
                    tableRow += '<td>' + row.amount + '</td>';
                    tableRow += '</tr>';
                    $('#dataTableBody').append(tableRow);
                });
            },
            error: function(xhr, status, error) {
                console.error("Error fetching data: ", status, error);
                alert("An error occurred while fetching data.");
            }
        });
    });
});

$(document).ready(function () {
    $('#downloadButton').on('click', function () {
        const csv = convertTableToCSV();
        if (csv.trim()) {
            downloadCSV(csv, 'data_export.csv');
        } else {
            alert('No data available to download!');
        }
    });
});

function convertTableToCSV() {
    let csv = 'Item,Start Date,End Date,Price\n'; 

    $('#dataTableBody tr').each(function () {
        const row = $(this)
            .find('td') 
            .map(function () {
                return $(this).text().trim(); 
            })
            .get()
            .join(','); 
        csv += row + '\n'; 
    });

    return csv;
}

// Trigger the Download of the CSV File
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


function sign_up(event) {
    event.preventDefault(); 

    const mobile = document.querySelector('input[name="mobile"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!mobile || !password) {
        alert('Please fill in all fields');
        return;
    }

    $.ajax({
        url: 'http://127.0.0.1:5000/sign_up', 
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            phone_no: mobile,
            password: password
        }),
        beforeSend: function () {
            console.log('Sending data...');
        },
        success: function (response) {
            alert(response.message || 'Sign up successful!');
            document.querySelector('form').reset();
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.error || 'An error occurred. Please try again.';
            alert(errorMessage);
        }
    });
}
