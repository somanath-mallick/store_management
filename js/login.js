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
                tableRow += '<td>' + row.start_date + '</td>';
                tableRow += '<td>' + row.end_date + '</td>';
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
                    tableRow += '<td>' + row.start_date + '</td>';
                    tableRow += '<td>' + row.end_date + '</td>';
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


