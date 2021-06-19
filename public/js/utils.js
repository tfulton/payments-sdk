$("#home, #cancel, #cancel2, #cancel3").click(function () {
    /* function goes in here */
    location.reload()
});
$('.ui.accordion')
    .accordion()
    ;

$('.ui.dropdown')
    .dropdown(this)
    // console.log("Dropdown: ", JSON.stringify(this));
    ;

$('.message .close')
    .on('click', function () {
        $("#errorMessage").hide();
    })
    ;

const uuidv4 = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}