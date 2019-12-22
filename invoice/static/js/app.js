

function getApiData(url, callback) {
    $.ajax({
        url: '/invoice/api/' + url,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        success: function (response) {
            callback(response)

        },
        error(error) {
            alert("getApiData error " + error);
        }

    })


}

function callAjaxApi(url, data, methodType, callback) {
    $.ajax({
        url: '/invoice/api/' + url + '/',
        type: methodType,
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader("X-CSRFTOKEN", data.csrfmiddlewaretoken);
        },
        success: function (response) {
            callback(response)
        },
        error(error) {
            alert(error.responseText);
        }

    })


}

function onDocumentReady() {
    // to be implemented by child pages
}
$(document).ready(function () {

    onDocumentReady();

});


var rowCounter = 0;
function parse(val) {
    var parsedValue = parseFloat(val);
    if (isNaN(parsedValue)) {
        return 0;
    }
    return parsedValue;
}

function round(val, places) {
    places = Math.pow(10, places);
    return Math.round(val * places) / places;
}
function handleGridItemChange(rowIndex) {
    if (rowIndex >= 0) {
        var unitCost = $("#unitcost_" + rowIndex).val();
        var qty = $("#qty_" + rowIndex).val();
        var total = unitCost * qty;

        $("#total_" + rowIndex).val(round(total, 2));

        calculateInvoice(true);
    }
    else {
        calculateInvoice(false);
    }

}

var subTotal = 0;
var grandTotal = 0;
function calculateInvoice(reCalculateSubTotal) {

    if (reCalculateSubTotal) {
        subTotal = 0;

        for (index = 0; index <= rowCounter; index++) {
            subTotal = subTotal + parse($("#total_" + index).val());
        }
    }
    var tax = parse($("#tax").val());
    subTotal = round(subTotal, 2);
    tax = round(tax, 2);
    grandTotal = round(subTotal + tax, 2);

    $("#grandTotal").text(grandTotal);
    $("#subtotal").text(subTotal);




}


function getInvoiceObject() {
    var currentDateTime = new Date();
    var curentDate = currentDateTime.getFullYear() + "-" + (currentDateTime.getMonth() + 1) + "-" + currentDateTime.getDate();
    var involiceObject = {
        "items": [],
        "invoice_number": "XXX",
        "issue_date": curentDate,
        "created_date": currentDateTime,
        "tax": round(parse($("#tax").val()), 2),
        "subtotal": subTotal,
        "grandtotal": grandTotal,
        "invoice_terms": $('#invoice_terms').val(),
        "client_id": $('#clientList').val(),
        "created_by": userid,
        csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val(),
    }

    console.log(involiceObject);

    for (index = 0; index <= rowCounter; index++) {

        if (parse($("#total_" + index).val()) > 0) {
            var item = {
                "item_name": $("#item_" + index).val(),
                "item_description": $("#description_" + index).val(),
                "unit_cost": $("#unitcost_" + index).val(),
                "quantity": $("#qty_" + index).val(),
                "amount": $("#total_" + index).val(),
            }

            involiceObject.items.push(item);
        }

    }

    return involiceObject;
}

function deleteInvoice(id) {
    if (confirm("Are you sure you want to delete this Invoice ?") == false) {
        return;
    }

    var involiceObject = getInvoiceObject();

    involiceObject.is_active = false;
    callAjaxApi('invoice/' + id, involiceObject, 'PUT', function (response) {


        alert("Record Deleted Sucessfully");
        location.href = '/invoice/';

    }
    );

}
function isValidInvoiceObject(involiceObject) {
    if (involiceObject.items.length == 0) {
        alert("Please add items to save invoice");
        return false;
    }

    return true;

}
function saveInvoice(id) {

    var involiceObject = getInvoiceObject();
    if (!isValidInvoiceObject(involiceObject)) {
        return;
    }

    involiceObject.is_active = true;
    involiceObject.id = id;
    var url = 'invoice';
    var callType = 'POST';
    if (involiceObject.id > 0) {
        url = url + '/' + involiceObject.id;
        callType = 'PUT';
    }


    callAjaxApi(url, involiceObject, callType, function (response) {

        console.log(response);
        if (response.version == 1) {
            alert(`Invoice : ${response.invoice_number} has been created sucessfully`);
        }
        else {
            alert(`Invoice : ${response.invoice_number} has been updated sucessfully`);
        }

        location.href = '/invoice/';

        //  loadInvoiceData(response.id)
        //alert ( `Invoice number  ${response.invoice_number} has been generated  sucessfully` ) ;  


    });


}
function addRow() {
    var markup = `<tr><td><input type='checkbox' name='record'></td>` +
        `<td> <input type='text' required class='form-control' id='item_${rowCounter}' placeholder='Item' ></input><div class='invalid-feedback'> Please enter item </div>  </td>` +
        `<td> <input type='text' required  class='form-control' id='description_${rowCounter}' placeholder='Description' ></input><div class='invalid-feedback'> Please enter description </div>  </td>` +
        `<td> <input type='number' required onChange='handleGridItemChange(${rowCounter})' class='form-control' step='0.01' id='unitcost_${rowCounter}'  placeholder='Unit Cost'></input> <div class='invalid-feedback'> Please enter Unit cost (up to 2 decimal places) </div></td>` +
        `<td> <input type='number' required onChange='handleGridItemChange(${rowCounter})' class='form-control' id='qty_${rowCounter}'  placeholder='Qty/Hr Rate '></input> <div class='invalid-feedback'> Please enter Qty/Hr </div></td>` +
        `<td> <input type='number' readonly class='form-control' id='total_${rowCounter}' ></input></td>` +
        `</tr>`;

    $("table tbody").append(markup);
    rowCounter++;

}
function deleteRow() {
    $("table tbody").find('input[name="record"]').each(function () {
        if ($(this).is(":checked")) {
            $(this).parents("tr").remove();
        }
    });
    calculateInvoice(true);

}

function populateInvoice(invoiceObject) {

    $('#clientList').val(invoiceObject.client_id);
    $("#tax").val(invoiceObject.tax);
    $("#grandTotal").text(invoiceObject.grandtotal);
    $("#subtotal").text(invoiceObject.subtotal);
    $('#invoice_terms').val(invoiceObject.invoice_terms);
    $('#invoice_number').text(invoiceObject.invoice_number);
    $('#version').text(invoiceObject.version);

    grandTotal = invoiceObject.grandtotal;
    subTotal = invoiceObject.subtotal;
    totalItems = invoiceObject.items.length;


    for (index = 0; index < totalItems; index++) {

        var item = invoiceObject.items[index];

        addRow();

        $("#item_" + index).val(item.item_name);

        $("#description_" + index).val(item.item_description);

        $("#unitcost_" + index).val(item.unit_cost);
        $("#qty_" + index).val(item.quantity);
        $("#total_" + index).val(item.amount);

    }



}
function loadInvoiceData(id) {

    invoiceID = id;
    //$("#mytable > tbody").html("");
    $("table tbody").html("");
    if (id > 0) {

        getApiData('invoice/' + id, function (response) {

            populateInvoice(response);
            $("#submitButton").html("Update Invoice");
            $("#actionType").html("Update Invoice")
        }
        );
        $("#deleteButton").attr("disabled", false);
    }
    else {
        addRow();


        $("#submitButton").html("Create Invoice");
        $('#invoice_terms').val('');
        $("#deleteButton").attr("disabled", true);
    }

}

function loadClientData() {

    getApiData('client', function (response) {

        if (response.length == 0) {

            var addClient='<div class=row> <p class="text-primary"  style="font-size:x-large;"> You have not created any client . Please click  <a class="text-secondary"  href="/admin/invoice/client/add/"> here</a> to create new Client  </p></div>';
            //var addClient = 'Please <a class="nav-link" href="/admin/invoice/client/add/">Add Client</a> to create invoice.';
            var clientDiv = $('#clientList');
            clientDiv.replaceWith(addClient);
            $("#submitButton").attr("disabled", true);
        }
        else {
            var optionsValues = '<select id="clientList">';
            $.each(response, function (index, value) {
                optionsValues += '<option value="' + value.id + '">' + value.name + '</option>';
            });
            optionsValues += '</select>';
            var options = $('#clientList');
            options.replaceWith(optionsValues);
        }
        loadInvoiceData(invoiceID);
    }
    );

}