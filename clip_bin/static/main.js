function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function copyClip(clipId) {
    $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    setTimeout(function() {
        $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    }, 1000);
}
