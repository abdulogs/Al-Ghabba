const purpose = (val = "") => {
    console.log(val)
    let template = "";
    template += `<option value="">Select</option>`;
    template += `<option value="Sale" ${(val == "Sale") ? "selected" : ""}>Sale</option>`;
    template += `<option value="Rent" ${(val == "Rent") ? "selected" : ""}>Rent</option>`;
    $("#purpose").html(template);
}

